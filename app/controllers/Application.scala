package controllers

import java.util.UUID

import actors.ModelActor._
import actors.UserActor.{AuthenticationRequest, AuthenticationResponse, SaveUserRequest}
import actors._
import akka.pattern.ask
import akka.util.Timeout
import json.JsonHelper._
import play.api.Logger
import play.api.Play.current
import play.api.libs.concurrent.Akka
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.postfixOps
import scala.util.{Failure, Success, Try}

object Application extends Controller {
  implicit val timeout = Timeout(1 seconds)

  val userActor = Akka.system.actorOf(UserActor.props, "UserActor")
  val modelActor = Akka.system.actorOf(ModelActor.props, "ModelActor")

  def index = Authenticated { request =>
    request.username match {
      case Some(username) => Ok(views.html.index(true))
      case None => Unauthorized(views.html.index(false))
    }
  }

  def authenticate(login: String, password: String) = Action.async {
    (userActor ? AuthenticationRequest(login, password)).mapTo[Try[AuthenticationResponse]] map {
      case Success(authenticationResponse) if authenticationResponse.authorized =>
        Ok(Json.toJson(authenticationResponse.maybeUser.get))
          .withSession(
            "connected" -> authenticationResponse.maybeUser.get.login,
            "role" -> authenticationResponse.maybeUser.get.role.toString)

      case Failure(failure) =>
        Logger error "Application.authenticate: " + failure.getMessage
        InternalServerError

      case _ =>
        Unauthorized("Dommage")
    }
  }

  def logout = Authenticated { request =>
    request.username match {
      case None =>
        NotModified
      case username =>
        Ok("Correctly logged out").withNewSession
    }
  }

  def saveUser(uuid: String, login: String, password: String, role: Int, objectString: Option[String]) = Authenticated.async { request =>
    request.username match {
      case None =>
        Future { Unauthorized("Unauthorized") }
      case username =>
        (userActor ? SaveUserRequest(uuid: String, login, password, role, objectString)).mapTo[String] map {
          case failure if failure.contains("failure") => InternalServerError("saveUser: " + failure)
          case successfulMessage => Ok(successfulMessage)
        }
    }
  }

  def saveModel(tableName: String, stringUUID: String, objectString: String) = Authenticated.async { request =>
    val table = Table(tableName)
    try {
      val uuid = UUID.fromString(stringUUID)
      tableName match {
        case "orders" => askActorToSaveModel(tableName, objectString, uuid)
        case otherTable =>
          if (isRequestedByClient(request))
            Future { Unauthorized("Vous devez être administrateur pour accèder à cette ressource.") }
          else
            otherTable match {
              case "areas" => askActorAllModelsInTable(table)
              case "brands" => askActorAllModelsInTable(table)
              case "stores" => askActorAllModelsInTable(table)
              case "users" => askActorAllModelsInTable(table)
              case "images" => askActorAllModelsInTable(table)
              case _ => Future { NotFound }
            }
      }

    } catch {
      case e: Exception =>
        Logger error e.getMessage
        Future { BadRequest("Wrong string UUID") }
    }
  }

  def askActorToSaveModel(tableName: String, objectString: String, uuid: UUID): Future[SimpleResult] = {
    (modelActor ? ObjectToSaveRequest(Table(tableName), uuid, objectString)).mapTo[String] map {
      case failure if failure.contains("failure") => InternalServerError("saveModel: " + failure)
      case successfulMessage => Ok(successfulMessage)
    }
  }

  def getAllModelsFromTable(tableName: String) = Authenticated.async { request =>
    val table = Table(tableName)
    tableName match {
      case "areas" => askActorAllModelsInTable(table)
      case "brands" => askActorAllModelsInTable(table)
      case "stores" => askActorAllModelsInTable(table)
      case otherTable =>
        if (isRequestedByClient(request))
          Future { Unauthorized("Vous devez être administrateur pour accèder à cette ressource.") }
        else 
          otherTable match {
            case "users" => askActorAllModelsInTable(table)
            case "images" => askActorAllModelsInTable(table)
            case "orders" => askActorAllModelsInTable(table)
            case _ => Future { NotFound }
          }
    }
  }

  def askActorAllModelsInTable(table: Table): Future[SimpleResult] = {
    (modelActor ? ObjectsToGetRequest(table)).mapTo[Try[Seq[GeneralObject]]].map {
      case Success(objects) => Ok(Json.toJson(objects))
      case Failure(failure) => InternalServerError("callGetModelsActor: " + failure)
    }
  }

  def getModel(tableName: String, uuidString: String) = Authenticated.async { request =>
    val table = Table(tableName)
    try {
      val uuid = UUID.fromString(uuidString)
      tableName match {
        case "areas" => askActorModelInTable(table, uuid)
        case "brands" => askActorModelInTable(table, uuid)
        case "stores" => askActorModelInTable(table, uuid)
        case otherTable =>
          if (isRequestedByClient(request))
            Future {
              Unauthorized("Vous devez être administrateur pour accèder à cette ressource.")
            }
          else
            otherTable match {
              case "users" => askActorModelInTable(table, uuid)
              case "images" => askActorModelInTable(table, uuid)
              case "orders" => askActorModelInTable(table, uuid)
              case _ => Future { NotFound("No table with this name") }
            }
      }
    } catch {
      case e: Exception =>
        Logger error e.getMessage
        Future { BadRequest("Wrong string UUID") }
    }
  }

  def askActorModelInTable(table: Table, uuid: UUID): Future[SimpleResult] =
    (modelActor ? ObjectToGetRequest(table, uuid)).mapTo[Try[Option[GeneralObject]]] map {
      case Success(Some(objectFound)) => Ok(Json.toJson(objectFound))
      case Success(None) => NoContent
      case Failure(failure) => InternalServerError("askActorModelInTable: " + failure)
    }

  def deleteModel(tableName: String, uuidString: String) = Authenticated.async { request =>
    val table = Table(tableName)
    try {
      val uuid = UUID.fromString(uuidString)
      tableName match {
        case "images" => askActorToDeleteModelInTable(table, uuid)
        case otherTable =>
          if (isRequestedByClient(request))
            Future {
              Unauthorized("Vous devez être administrateur pour accèder à cette ressource.")
            }
          else
            otherTable match {
              case "users" => askActorToDeleteModelInTable(table, uuid)
              case "stores" => askActorToDeleteModelInTable(table, uuid)
              case "orders" => askActorToDeleteModelInTable(table, uuid)
              case _ => Future { NotFound("No table with this name deletable") }
            }
      }

    } catch {
      case e: Exception =>
        Logger error e.getMessage
        Future { BadRequest("Wrong string UUID") }
    }
  }

  def askActorToDeleteModelInTable(table: Table, uuid: UUID): Future[SimpleResult] = {
    (modelActor ? ObjectToDeleteRequest(table, uuid)).mapTo[Try[Int]] map {
      case Success(1) => Ok
      case Success(_) => NotModified
      case Failure(failure) => InternalServerError("deleteModel: " + failure)
    }
  }

  def amendModel(tableName: String, uuidString: String, objectString: String) = Action.async {
    val table = Table(tableName)
    try {
      val uuid = UUID.fromString(uuidString)
      (modelActor ? ObjectToAmendRequest(table, uuid, objectString)).mapTo[Try[Int]].map {
        case Success(1) => Ok
        case Success(_) => NotModified
        case Failure(failure) => InternalServerError("amendModel: " + failure)
      }
    } catch {
      case e: Exception =>
        Logger error e.getMessage
        Future {
          BadRequest("Wrong string UUID")
        }
    }
  }

  def isRequestedByAdmin(request: AuthenticatedRequest[AnyContent]): Boolean = {
    request.role.getOrElse(0) == 1
  }

  def isRequestedByClient(request: AuthenticatedRequest[AnyContent]): Boolean = {
    request.role.getOrElse(0) == 2
  }
}
