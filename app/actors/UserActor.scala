package actors

import java.util.UUID
import org.mindrot.jbcrypt.BCrypt
import play.api.Play.current
import actors.ModelActor.users
import actors.UserActor._
import akka.actor._
import play.api.Logger
import play.api.mvc._
import scala.concurrent.Future
import scala.language.{implicitConversions, postfixOps}
import scala.slick.driver.PostgresDriver.simple._
import scala.util.Try

class AuthenticatedRequest[A](val uuid: Option[UUID], val role: Option[Int], request: Request[A])
  extends WrappedRequest[A](request)

object Authenticated extends ActionBuilder[AuthenticatedRequest] {
  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[SimpleResult]) = {
    request.session.get("connected") match {
      case Some(uuid) =>
        try {
          block(new AuthenticatedRequest(
            Some(UUID.fromString(uuid)), Some(request.session.get("role").getOrElse("0").toInt), request))
        } catch {
          case e:Exception =>
            Logger error "UserActor.invokeBlock" + e.getMessage
            block(new AuthenticatedRequest(None, None, request))
        }
      case None =>
        block(new AuthenticatedRequest(None, None, request))
    }
  }
}

object UserActor {
  def props = Props[UserActor]
  case class UserWithId(id: Int, uuid: UUID, login: String, role: Int, objectString: Option[String],
                        isActive: Boolean = true)
  case class User(uuid: UUID, login: String, role: Int, objectString: Option[String], isActive: Boolean = true)
  case class SaveUserRequest(uuid: String, login: String, password: String, role: Int, objectString: Option[String],
                             isActive: Boolean = true)
  case class UpdateUserRequest(uuid: String, login: String, password: String, role: Int,
                               objectString: Option[String], isActive: Boolean)
  case class AuthenticationRequest[A](login: String, password: String)
  case class AuthenticationResponse(authorized: Boolean, role: Int, uuid: Option[UUID])

  class UserTable(tag: Tag) extends Table[User](tag, "users") {
    def id = column[Int]("userid", O.PrimaryKey)
    def uuid = column[UUID]("uuid", O.DBType("UUID"))
    def login = column[String]("login")
    def password = column[String]("password")
    def role = column[Int]("role")
    def objectString = column[Option[String]]("object")
    def isActive = column[Boolean]("isactive")

    def * = (uuid, login, role, objectString, isActive) <> (User.tupled, User.unapply)
  }
}

class UserActor extends Actor {
  implicit val session = play.api.db.slick.DB.createSession()

  def receive = {

    case SaveUserRequest(uuid, login, password, role, objectString, isActive) =>
      save(SaveUserRequest(uuid, login, password, role, objectString, isActive))

    case UpdateUserRequest(uuid, login, password, role, objectString, isActive) =>
      sender ! update(UpdateUserRequest(uuid, login, password, role, objectString, isActive))

    case AuthenticationRequest(login: String, password: String) =>
      sender ! verifyIdentity(login, password)

    case _ =>
      Logger error "UserActor.receive: unknown request"
  }

  def update(updateUserRequest: UpdateUserRequest): Try[Int] = Try {
    val query = for { user <- users if user.uuid ===  UUID.fromString(updateUserRequest.uuid) }
      yield (user.uuid, user.login, user.password, user.role, user.objectString, user.isActive)

    query.update((UUID.fromString(updateUserRequest.uuid), updateUserRequest.login, updateUserRequest.password,
    updateUserRequest.role, updateUserRequest.objectString, updateUserRequest.isActive))
  }
//  (standardTableQuery returning standardTableQuery.map(_.id)) +=
//    GeneralObject(objectToSave.uuid, objectToSave.objectString)
  def save(saveUserRequest: SaveUserRequest): Try[Int] = Try {
    println("User creation begins")
    val res = users
      .map(user => (user.uuid, user.login, user.password, user.role, user.objectString, user.isActive))
      .insert(
        (UUID.fromString(saveUserRequest.uuid), saveUserRequest.login,
          BCrypt.hashpw(saveUserRequest.password, BCrypt.gensalt()), saveUserRequest.role,
          saveUserRequest.objectString, saveUserRequest.isActive))

    println("User creation ends with res:\n" + res)
    0
  }

  def verifyIdentity(login: String, password: String): Try[AuthenticationResponse] = Try {
    case class Credentials(login: String, password: String)

    users
      .filter(_.login === login)
      .map(user => (user.uuid, user.password, user.role, user.isActive))
      .list
      .headOption match {
        case None =>
          AuthenticationResponse(authorized = false, 0, None)
        case Some(user) =>
          val authorized = BCrypt.checkpw(password, user._2)
          AuthenticationResponse(authorized = authorized && user._4, user._3, Some(user._1))
    }
  }
}