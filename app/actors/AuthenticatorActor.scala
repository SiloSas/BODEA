package actors

import javax.sound.sampled.UnsupportedAudioFileException
import play.api.Play.current
import actors.AuthenticatorActor.{AuthenticationResponse, AuthenticationRequest}
import akka.actor.{Actor, Props}
import models.User
import play.api.Logger
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import scala.concurrent.Future
import scala.concurrent.duration._
import akka.pattern.ask
import play.api.libs.functional.syntax._
import scala.language.postfixOps
import play.api.mvc._
import play.api.mvc.Results._
import play.api.libs.concurrent.Execution.Implicits._
import scala.util.{Success, Failure}

object AuthenticatorActor {
  def props = Props[AuthenticatorActor]
  case class AuthenticationRequest[A](login: String, password: String)
  case class AuthenticationResponse(authorized: Boolean, login: String, role: Option[String])
}

class AuthenticatorActor extends Actor {
  def receive = {
    case AuthenticationRequest(login: String, password: String) =>
      User.verifyIdentity(login, password) match {
        case Success(true) =>
          sender ! AuthenticationResponse(authorized = true, login, Some("admin"))
        case Success(false) =>
          sender ! AuthenticationResponse(authorized = false, login, None)
        case failure =>
          Logger error "authenticator actor failure while verifying identity: " + failure
      }
  }
}

class AuthenticatedRequest[A](val username: Option[String], request: Request[A]) extends WrappedRequest[A](request)

object Authenticated extends ActionBuilder[AuthenticatedRequest] {
  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[SimpleResult]) = {
    request.session.get("connected").map { username =>
      block(new AuthenticatedRequest(Some(username), request))
    } getOrElse {
      block(new AuthenticatedRequest(None, request))
    }
  }
}