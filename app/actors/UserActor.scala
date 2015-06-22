package actors

import java.util.UUID

import actors.AuthenticatorActor.AuthenticationRequest
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
  case class SaveUserRequest(uuid: String, login: String, password: String, role: Int)
}

class UserActor extends Actor {
  def receive = {
    case SaveUserRequest(uuid, login, password, role) =>
      try {
        val uuidTyped = UUID.fromString(uuid)
        User.save(User(uuidTyped, login, password, role)) match {
          case Success(Some(index)) => sender ! "success"
          case Success(None) => sender ! "failure: user has not been created"
          case Failure(failure) => sender ! "failure: " + failure
        }
      } catch {
        case e: Exception => sender ! "wrong uuid"
      }
    case _ => sender ! "unknown request"
  }
}