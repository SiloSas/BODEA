package controllers

import java.io.{ByteArrayOutputStream, File}
import java.util.UUID
import javax.imageio.ImageIO
import com.typesafe.plugin._
import actors.ModelActor._
import actors.UserActor._
import actors._
import akka.pattern.ask
import akka.util.Timeout
import com.typesafe.plugin.MailerPlugin
import json.JsonHelper._
import play.Play
import play.api.Logger
import play.api.Play.current
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.EventSource
import play.api.libs.concurrent.Akka
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.iteratee.Concurrent
import play.api.libs.json.{JsValue, Json}
import play.api.mvc._
import scala.slick.driver.PostgresDriver.simple._
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

      case Success(authenticationResponse) =>
        if (authenticationResponse.authorized == authorizedStatus)
          Ok(Json.toJson(authenticationResponse.role))
            .withSession(
              "connected" -> authenticationResponse.uuid.get.toString,
              "role" -> authenticationResponse.role.toString)
        else if (authenticationResponse.authorized == wrongCredentialStatus)
          Unauthorized("Login ou mot de passe incorrect")
        else if (authenticationResponse.authorized == inactiveAccountStatus)
          Unauthorized("Ce compte a été desactivé, veuillez-contacter l'administrateur")
        else
          Unauthorized("Désolé, une erreur s'est produite sur le serveur")

      case Failure(failure) =>
        Logger error "Application.authenticate: " + failure.getMessage
        InternalServerError

      case _ =>
        Unauthorized("Dommage")
    }
  }

  def logout = Action { Ok("Correctly logged out").withNewSession }

  val (chatOut, chatChannel) = Concurrent.broadcast[JsValue]

  def notifySubscribers(notification: String, brandUUIDString: String, notificationUUIDString: String) = Authenticated.async { request =>
    request.uuid match {
      case None =>
        Future { Unauthorized }
      case _ =>
        Try { UUID.fromString(brandUUIDString) } match {
          case Success(brandUUID) =>
            Try { UUID.fromString(notificationUUIDString) } match {
              case Success(notificationUUID) =>
                (modelActor ? ObjectToSaveRequest(PostgresTable("notifications"), notificationUUID, notification))
                  .mapTo[Try[Int]] map {
                  case Success(_) =>
                    chatChannel.push(Json.parse(notification))
                    sendNotificationMail(notification, notificationUUID, isRequestedByClient(request))
                    Ok
                  case Failure(failure) =>
                    Logger error "notifySubscribers" + failure
                    InternalServerError
                }
          case Failure(failure) =>
            Logger error "notifySubscribers" + failure
            Future { BadRequest("Wrong brand UUID or notification UUID") }
          }
          case Failure(failure) =>
            Logger error "notifySubscribers" + failure
            Future { BadRequest("Wrong brand UUID or notification UUID") }
        }
    }
  }


  def subscribeToSSENotifications = Authenticated { request =>
    request.uuid match {
      case None =>
        Unauthorized
      case _ =>
        Ok.feed(chatOut &> EventSource()).as("text/event-stream")
    }
  }

  def sendNotificationMail(content: String, brandUUID: UUID, isClient: Boolean): Unit = {
    val mail = use[MailerPlugin].email
    mail.setSubject("BO DEA notification")
    mail.addFrom("ticketappfrance@gmail.com")
    play.api.db.slick.DB.withSession { implicit session =>
      isClient match {
        case true =>
          val loginList = users.filter(_.role === 1).map(_.login).list
          Logger info "mails will be send to " + loginList
          loginList.foreach { login =>
            mail.addRecipient(login)
            mail.send(content)
          }

        case false =>
          val userLoginList = userBrand
            .filter(_.brandId === brandUUID) rightJoin
            users.map(_.login)

          userLoginList.map { login =>
            val loginList = users.filter(_.role === 2).map(_.login).list
            Logger info "mails will be send to " + loginList
            loginList.foreach { login =>
              mail.addRecipient(login)
              mail.send(content)
            }
          }
      }
    }
  }

  def sendNewPasswordByEMailAndUpdateDatabase(login: String) = Action.async {
    val newPassword = UUID.randomUUID().toString
    (userActor ? UpdateUserPasswordRequest(login, newPassword)).mapTo[Try[Int]] map {
      case Success(_) =>
        play.api.db.slick.DB.withSession { implicit session =>
//          val login = users.filter(_.login === login).map(_.login).list.head
          val mail = use[MailerPlugin].email
          mail.setSubject("BO DEA Demande de changement de mot de passe")
          mail.addRecipient(login)
          mail.addFrom("BODEA@gmail.com")
          mail.send(
            s"Voici votre nouveau mot de passe : $newPassword" +
               "\nVous pouvez le modifier à tout moment ici: http://www.bodea.com/#/settings".stripMargin)
          Ok
        }

      case Failure(failure) =>
        InternalServerError("Application.sendNewPasswordByEMailAndUpdateDatabase: " + failure)
    }
  }

  def uploadImage = Authenticated(parse.multipartFormData) { request =>
    request.uuid match {
      case None =>
        Unauthorized("Unauthorized")
      case _ =>
        request.body.file("picture").map { image =>
          println(image)
          image.contentType match {
            case Some(fileExtension) if fileExtension == "image/tiff" || fileExtension == "image/jpg" ||
              fileExtension == "image/jpeg" || fileExtension == "image/png" || fileExtension == "image/svg" ||
              fileExtension == "application/pdf" =>

              val filename = UUID.randomUUID().toString + image.filename
              image.ref.moveTo(new File("public/pictures/" + filename), replace = true)

              Ok("images/" + filename)

            case _ =>
              Unauthorized("Wrong content type")
          }
        }.getOrElse { BadRequest }
    }
  }

  def getImage(fileName: String) = Action {
    val imageFile = new File(Play.application().path().getPath + "/public/pictures/" + fileName)
    val image = ImageIO.read(imageFile)
    if (imageFile.length > 0) {

      val resourceType = fileName.substring(fileName.length()-3)
      val baos = new ByteArrayOutputStream()
      ImageIO.write(image, resourceType, baos)

      Ok(baos.toByteArray).as("image/" + resourceType)
      //resource type such as image+png, image+jpg
    } else {
      NotFound(fileName)
    }
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

  def updateUser(uuid: String, login: String, role: Int, objectString: Option[String], isActive: Boolean)
  = Authenticated.async { request =>
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

  def updateUserPassword(login: String, newPassword: String) = Authenticated.async { request =>
    request.uuid match {
      case None =>
        Future { Unauthorized("Unauthorized") }
      case uuid =>
        (userActor ? UpdateUserPasswordRequest(login, newPassword)).mapTo[Try[Int]] map {
          case Success(_) => Ok
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
            if (tableName == "images")
              askActorToSaveModel(tableName, objectString, uuid)
            else
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
      saveRelationsRequest => {
        println(saveRelationsRequest)
        askActorToSaveRelations(SaveRelationsRequest(saveRelationsRequest))})
  }

  def askActorToSaveRelations(saveRelationsRequest: SaveRelationsRequest): Future[SimpleResult] = {
    (modelActor ? saveRelationsRequest).mapTo[Try[Int]] map {
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
          case "areas" => askActorAllModelsInTable(FindObjectsRequest(table, isClient = false, uuid))
          case "brands" => askActorAllModelsInTable(FindObjectsRequest(table, isClient = false, uuid))
          case "stores" => askActorAllModelsInTable(FindObjectsRequest(table, isClient = false, uuid))
          case "notifications" => askActorAllModelsInTable(FindObjectsRequest(table, isClient = false, uuid))
          case "users" => askActorAllModelsInUsersTable(isRequestedByClient(request), uuid)
          case "images" => askActorAllModelsInTable(FindObjectsRequest(table, isRequestedByClient(request), uuid))
          case "orders" => askActorAllModelsInTable(FindObjectsRequest(table, isRequestedByClient(request), uuid))
          case _ => Future { NotFound }
        }
    }
  }

  def askActorAllModelsInTable(findObjectsRequest: FindObjectsRequest): Future[SimpleResult] = {
    (modelActor ? findObjectsRequest).mapTo[Try[Seq[GeneralObjectWithRelations]]] map {
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
