package controllers

import java.util.UUID

import actors.AuthenticatorActor.AuthenticateRequest
import actors.UserActor.SaveUserRequest
import akka.util.Timeout
import play.api.http.Status
import play.api.libs.concurrent.Akka
import play.api.libs.ws.WS
import play.api.mvc._
import play.api.libs.json.{JsObject, Json}
import json.JsonHelper._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import akka.actor._
import play.api.Play.current
import play.api.mvc._
import akka.actor._
import play.api.libs.functional.syntax._
import services.ObjectRequest
import scala.concurrent.Future
import scala.language.postfixOps
import play.api.mvc._
import scala.concurrent.duration._
import akka.pattern.ask

import actors.{ModelActor, UserActor, AuthenticatorActor}

object Application extends Controller {
  implicit val timeout = Timeout(5 seconds)

  val authenticatorActor = Akka.system.actorOf(AuthenticatorActor.props, "AuthenticatorActor")
  val userActor = Akka.system.actorOf(UserActor.props, "UserActor")
  val modelActor = Akka.system.actorOf(ModelActor.props, "ModelActor")

  def authenticate(login: String, password: String) = Action.async {
    (authenticatorActor ? AuthenticateRequest(login, password)).mapTo[String].map { message =>
      Ok(message)
    }
  }

  def saveUser(login: String, password: String) = Action.async {
    (userActor ? SaveUserRequest(login, password)).mapTo[String].map {
      case failure if failure.contains("failure") => InternalServerError("saveUser: " + failure)
      case successfulMessage => Ok(successfulMessage)
    }
  }

  def saveModel(table: String, uuid: String, store: String) = Action.async {
    (modelActor ? ObjectRequest(table, uuid, store)).mapTo[String].map {
      case failure if failure.contains("failure") => InternalServerError("saveModel: " + failure)
      case successfulMessage => Ok(successfulMessage)
    }
  }
}


