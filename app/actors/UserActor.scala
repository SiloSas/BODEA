package actors

import actors.AuthenticatorActor.AuthenticateRequest
import actors.UserActor.SaveUserRequest
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

object UserActor {
  def props = Props[UserActor]
  case class SaveUserRequest(login: String, password: String)
}

class UserActor extends Actor {
  def receive = {
    case SaveUserRequest(login, password) =>
      User.save(User(login, password)) match {
        case Success(Some(index)) => sender ! "success"
        case Success(None) => sender ! "failure: user has not been created"
        case Failure(failure) => sender ! "failure: " + failure
      }
    case _ => sender ! "unknown request"
  }
}