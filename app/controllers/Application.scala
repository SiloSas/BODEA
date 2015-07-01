package controllers

import java.io.File
import java.util.UUID

import actors.ModelActor._
import actors.UserActor.{UpdateUserRequest, AuthenticationRequest, AuthenticationResponse, SaveUserRequest}
import actors._
import akka.pattern.ask
import akka.util.Timeout
import json.JsonHelper._
import play.api.Logger
import play.api.Play.current
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.concurrent.Akka
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.postfixOps
import scala.util.{Failure, Success, Try}

object Application extends Controller {
  implicit val timeout = Timeout(5 seconds)

  val userActor = Akka.system.actorOf(UserActor.props, "UserActor")
  val modelActor = Akka.system.actorOf(ModelActor.props, "ModelActor")

  def index = Authenticated { request =>
    request.uuid match {
      case Some(uuid) => Ok(views.html.index(true))
      case None => Unauthorized(views.html.index(false))
    }
  }

  def authenticate(login: String, password: String) = Action.async {
    (userActor ? AuthenticationRequest(login, password)).mapTo[Try[AuthenticationResponse]] map {

      case Success(authenticationResponse) if authenticationResponse.authorized =>
        Ok(Json.toJson(authenticationResponse.role))
          .withSession(
            "connected" -> authenticationResponse.uuid.get.toString,
            "role" -> authenticationResponse.role.toString)

      case Failure(failure) =>
        Logger error "Application.authenticate: " + failure.getMessage
        InternalServerError

      case _ =>
        Unauthorized("Dommage")
    }
  }

  def logout = Action { Ok("Correctly logged out").withNewSession }

  def uploadImage = Action(parse.multipartFormData) { request =>
    println(request)
    request.body.file("picture").map { image =>
      println("image " + image)
      println(image.contentType)


      image.contentType match {
        case Some(fileExtension) if fileExtension == "image/tiff" || fileExtension == "image/jpg" ||
          fileExtension == "image/jpeg" || fileExtension == "image/png" || fileExtension == "image/svg" ||
          fileExtension == "application/pdf" =>

          val filename = image.filename + UUID.randomUUID().toString
          image.ref.moveTo(new File("/home/simon/dev/bodea/app/public/pictures/" + filename), replace = true)
          Ok("File uploaded")

        case _ =>
          Unauthorized("Wrong content type")
      }
    }.getOrElse { BadRequest }
  }

  def saveUser(uuid: String, login: String, password: String, role: Int, objectString: Option[String],
               isActive: Boolean) = Authenticated.async { request =>
    request.uuid match {
      case None =>
        Future { Unauthorized("Unauthorized") }
      case _ =>
        (userActor ? SaveUserRequest(uuid: String, login, password, role, objectString)).mapTo[Try[Int]] map {
          case Success(newUUID) => Created(Json.toJson(newUUID))
          case Failure(failure) => InternalServerError("saveUser: " + failure)
        }
    }
  }

  def updateUser(uuid: String, login: String, password: String, role: Int, objectString: Option[String],
                 isActive: Boolean) = Authenticated.async { request =>
    request.uuid match {
      case None =>
        Future { Unauthorized("Unauthorized") }
      case _ =>
        (userActor ? UpdateUserRequest(uuid: String, login, role, objectString, isActive)).mapTo[Try[Int]] map {
          case Success(_) => Created
          case Failure(failure) => InternalServerError("saveUser: " + failure)
        }
    }
  }

  def saveModel(tableName: String, stringUUID: String, objectString: String) = Authenticated.async { request =>
    try {
      val uuid = UUID.fromString(stringUUID)
      tableName match {
        case "orders" => askActorToSaveModel(tableName, objectString, uuid)
        case _ =>
          if (isRequestedByClient(request))
            Future { Unauthorized("Vous devez être administrateur pour accèder à cette ressource.") }
          else
            tableName match {
              case "areas" => askActorToSaveModel(tableName, objectString, uuid)
              case "brands" => askActorToSaveModel(tableName, objectString, uuid)
              case "stores" => askActorToSaveModel(tableName, objectString, uuid)
              case "users" => askActorToSaveModel(tableName, objectString, uuid)
              case "images" => askActorToSaveModel(tableName, objectString, uuid)
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
    (modelActor ? ObjectToSaveRequest(PostgresTable(tableName), uuid, objectString)).mapTo[Try[Int]] map {
      case Success(_) => Created
      case Failure(failure) => InternalServerError("saveModel: " + failure)
    }
  }

  def relationFormApply(relationTable: String, uuidA: String, uuidB: String): RelationBetweenTwoTables =
    RelationBetweenTwoTables(relationTable, uuidA, uuidB)

  def relationFormUnapply(relationBetweenTwoTables: RelationBetweenTwoTables) =
    Some((relationBetweenTwoTables.relationTable, relationBetweenTwoTables.uuidA, relationBetweenTwoTables.uuidB))

  val saveRelationsRequestBindingForm = Form(
      "relations" -> list(mapping(
        "relationTable" -> nonEmptyText,
        "uuidA" -> nonEmptyText,
        "uuidB" -> nonEmptyText
    )(relationFormApply)(relationFormUnapply)))

  def saveRelations = Authenticated.async { implicit request =>
    saveRelationsRequestBindingForm.bindFromRequest().fold(
      formWithErrors => {
        Logger.error("Application.saveRelation: " + formWithErrors.errorsAsJson)
        Future { BadRequest(formWithErrors.errorsAsJson) }
      },
      saveRelationsRequest => askActorToSaveRelations(SaveRelationsRequest(saveRelationsRequest)))
  }

  def askActorToSaveRelations(saveRelationsRequest: SaveRelationsRequest): Future[SimpleResult] = {
    (modelActor ? saveRelationsRequest).mapTo[Try[Unit]] map {
      case Success(_) => Created
      case Failure(failure) => InternalServerError("askActorToSaveRelations: " + failure)
    }
  }

  def getAllModelsFromTable(tableName: String) = Authenticated.async { request =>
    request.uuid match {
      case None => 
        Future { Unauthorized }
      case Some(uuid) =>
        val table = PostgresTable(tableName)
        tableName match {
          case "areas" => askActorAllModelsInTable(table, isClient = false, uuid)
          case "brands" => askActorAllModelsInTable(table, isClient = false, uuid)
          case "stores" => askActorAllModelsInTable(table, isClient = false, uuid)
          case "users" => askActorAllModelsInUsersTable(isRequestedByClient(request), uuid)
          case "images" => askActorAllModelsInTable(table, isRequestedByClient(request), uuid)
          case "orders" => askActorAllModelsInTable(table, isRequestedByClient(request), uuid)
          case _ => Future { NotFound }
        }
    }
  }

  def askActorAllModelsInTable(table: PostgresTable, isClient: Boolean, clientUUID: UUID): Future[SimpleResult] = {
    (modelActor ? FindObjectsRequest(table, None, isClient, clientUUID)).mapTo[Try[Seq[GeneralObjectWithRelations]]] map {
      case Success(objects) => Ok(Json.toJson(objects))
      case Failure(failure) => InternalServerError("callGetModelsActor: " + failure)
    }
  }

  def askActorAllModelsInUsersTable(isClient: Boolean, uuid: UUID): Future[SimpleResult] = {
    (modelActor ? FindUsersRequest(isClient, uuid)).mapTo[Try[Seq[UserWithRelations]]] map {
      case Success(usersFound) =>
        Ok(Json.toJson(usersFound))
      case Failure(failure) =>
        Logger error ("failure" + failure)
        InternalServerError("askActorAllModelsInUsersTable: " + failure)
    }
  }

  def getModel(tableName: String, uuidString: String) = Authenticated.async { request =>
    val table = PostgresTable(tableName)
    try {
      val uuid = UUID.fromString(uuidString)
      tableName match {
        case "areas" => askActorModelInTable(table, uuid)
        case "brands" => askActorModelInTable(table, uuid)
        case "stores" => askActorModelInTable(table, uuid)
        case otherTable =>
          if (isRequestedByClient(request))
            Future { Unauthorized("Vous devez être administrateur pour accèder à cette ressource.") }
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

  def askActorModelInTable(table: PostgresTable, uuid: UUID): Future[SimpleResult] =
    (modelActor ? ObjectToGetRequest(table, uuid)).mapTo[Try[Option[MaybeGeneralObject]]] map {
      case Success(Some(objectFound)) => Ok(Json.toJson(objectFound))
      case Success(None) => NoContent
      case Failure(failure) => InternalServerError("askActorModelInTable: " + failure)
    }

  def deleteModel(tableName: String, uuidString: String) = Authenticated.async { request =>
    val table = PostgresTable(tableName)
    try {
      val uuid = UUID.fromString(uuidString)
      tableName match {
        case "images" => askActorToDeleteModelInTable(table, uuid)
        case otherTable =>
          if (isRequestedByClient(request))
            Future { Unauthorized("Vous devez être administrateur pour supprimer cette ressource.") }
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

  def askActorToDeleteModelInTable(table: PostgresTable, uuid: UUID): Future[SimpleResult] = {
    (modelActor ? ObjectToDeleteRequest(table, uuid)).mapTo[Try[Int]] map {
      case Success(1) => Ok
      case Success(_) => NotModified
      case Failure(failure) => InternalServerError("deleteModel: " + failure)
    }
  }

  def amendModel(tableName: String, uuidString: String, objectString: String) = Action.async {
    val table = PostgresTable(tableName)
    try {
      val uuid = UUID.fromString(uuidString)
      (modelActor ? ObjectToAmendRequest(table, uuid, objectString)).mapTo[Try[Int]] map {
        case Success(1) => Ok
        case Success(_) => NotModified
        case Failure(failure) => InternalServerError("amendModel: " + failure)
      }
    } catch {
      case e: Exception =>
        Logger error e.getMessage
        Future { BadRequest("Wrong string UUID") }
    }
  }

  def isRequestedByAdmin(request: AuthenticatedRequest[AnyContent]): Boolean = {
    request.role.getOrElse(0) == 1
  }

  def isRequestedByClient(request: AuthenticatedRequest[AnyContent]): Boolean = {
    request.role.getOrElse(0) == 2
  }
}
