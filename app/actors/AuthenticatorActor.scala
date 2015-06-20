package actors

import actors.AuthenticatorActor.AuthenticateRequest
import akka.actor._
import models.User
import play.api.Logger
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import scala.concurrent.duration._
import akka.pattern.ask
import play.api.libs.functional.syntax._
import scala.language.postfixOps
import play.api.mvc._

import scala.util.{Success, Failure}

object AuthenticatorActor {
  def props = Props[AuthenticatorActor]
  case class AuthenticateRequest(login: String, password: String)
}

class AuthenticatorActor extends Actor {
  def receive = {
    case AuthenticateRequest(login: String, password: String) =>
      User.verifyIdentity(User(login, password)) match {
        case Success(true) => sender ! "You are correctly authenticated " + login
        case Success(false) => sender ! "Wrong credentials"
        case Failure(failure) =>
          Logger error "authenticator actor failure while verifying identity: " + failure
          sender ! "failure"
      }
  }
}