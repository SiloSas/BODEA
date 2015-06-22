package controllers

import java.util.UUID

import actors.AuthenticatorActor.{AuthenticationResponse, AuthenticationRequest}
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
import services.{ObjectToAmendRequest, GeneralObject, ObjectToGetRequest, ObjectToSaveRequest}
import scala.concurrent.Future
import scala.language.postfixOps
import play.api.mvc._
import scala.concurrent.duration._
import akka.pattern.ask

import actors.{Authenticated, ModelActor, UserActor, AuthenticatorActor}

import scala.util.{Try, Failure, Success}

object Application extends Controller {
  implicit val timeout = Timeout(5 seconds)

  val authenticatorActor = Akka.system.actorOf(AuthenticatorActor.props, "AuthenticatorActor")
  val userActor = Akka.system.actorOf(UserActor.props, "UserActor")
  val modelActor = Akka.system.actorOf(ModelActor.props, "ModelActor")

  def index = Authenticated { request =>
    request.username match {
      case Some(username) => Ok("Bienvenue " + request.username)
      case None => Unauthorized("Vous devez vous connecter")
    }
  }

  def authenticate(login: String, password: String) = Action.async {
    (authenticatorActor ? AuthenticationRequest(login, password)).mapTo[AuthenticationResponse].map {
      case authenticationResponse if authenticationResponse.authorized =>
        Ok("connected")
          .withSession(
            "connected" -> authenticationResponse.login,
            "role" -> authenticationResponse.role.toString)
      case _ =>
        Unauthorized("Dommage")
    }
  }

  def saveUser(uuid: String, login: String, password: String, role: Int) = Authenticated.async { request =>
    request.username match {
      case None =>
        Future { Unauthorized("Unauthorized") }
      case username =>
        (userActor ? SaveUserRequest(uuid: String, login, password, role)).mapTo[String].map {
          case failure if failure.contains("failure") => InternalServerError("saveUser: " + failure)
          case successfulMessage => Ok(successfulMessage)
        }
    }
  }

  def saveModel(table: String, uuid: String, objectString: String) = Action.async {
    (modelActor ? ObjectToSaveRequest(table, uuid, objectString)).mapTo[String].map {
      case failure if failure.contains("failure") => InternalServerError("saveModel: " + failure)
      case successfulMessage => Ok(successfulMessage)
    }
  }

  def getModel(table: String, uuid: String) = Action.async {
    (modelActor ? ObjectToGetRequest(table, uuid)).mapTo[Try[Seq[GeneralObject]]].map {
      case Success(objects) => Ok(Json.toJson(objects))
      case Failure(failure) => InternalServerError("getModel: " + failure)
    }
  }

  def deleteModel(table: String, uuid: String) = Action.async {
    (modelActor ? ObjectToGetRequest(table, uuid)).mapTo[Try[Int]].map {
      case Success(1) => Ok
      case Success(_) => NotModified
      case Failure(failure) => InternalServerError("deleteModel: " + failure)
    }
  }

  def amendModel(table: String, uuid: String, objectString: String) = Action.async {
    (modelActor ? ObjectToAmendRequest(table, uuid, objectString)).mapTo[Try[Int]].map {
      case Success(1) => Ok
      case Success(_) => NotModified
      case Failure(failure) => InternalServerError("amendModel: " + failure)
    }
  }
}


