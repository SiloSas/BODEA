package actors

import java.util.UUID

import actors.UserActor.{AuthenticationRequest, AuthenticationResponse, SaveUserRequest, User}
import akka.actor._
import anorm.SqlParser._
import anorm.{RowParser, _}
import org.mindrot.jbcrypt.BCrypt
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import play.api.mvc._
import services.Utilities._

import scala.concurrent.Future
import scala.language.postfixOps
import scala.util.{Failure, Success, Try}
import actors.UserActor.userParser

class AuthenticatedRequest[A](val username: Option[String], val role: Option[Int], request: Request[A])
  extends WrappedRequest[A](request)

object Authenticated extends ActionBuilder[AuthenticatedRequest] {
  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[SimpleResult]) = {
    request.session.get("connected") match {
      case Some(username) =>
        block(new AuthenticatedRequest(Some(username), Some(request.session.get("role").getOrElse("0").toInt), request))
      case None =>
        block(new AuthenticatedRequest(None, None, request))
    }
  }
}

object UserActor {
  def props = Props[UserActor]
  case class SaveUserRequest(uuid: String, login: String, password: String, role: Int, objectString: Option[String])
  case class User(uuid: UUID, login: String, password: String, role: Int, objectString: Option[String])
  case class AuthenticationRequest[A](login: String, password: String)
  case class AuthenticationResponse(authorized: Boolean, maybeUser: Option[User])

  val userParser: RowParser[User] = {
    get[UUID]("uuid") ~
      get[String]("login") ~
      get[String]("password") ~
      get[Int]("role") ~
      get[Option[String]]("object") map {
      case uuid ~ login ~ password ~ role ~ objectString => User(uuid, login, password, role, objectString)
    }
  }
}

class UserActor extends Actor {
  def receive = {
    case SaveUserRequest(uuid, login, password, role, objectString) =>
      try {
        val uuidTyped = UUID.fromString(uuid)
        save(User(uuidTyped, login, password, role, objectString)) match {
          case Success(Some(index)) => sender ! "success"
          case Success(None) => sender ! "failure: user has not been created"
          case Failure(failure) => sender ! "failure: " + failure
        }
      } catch {
        case e: Exception => sender ! "wrong uuid"
      }

    case AuthenticationRequest(login: String, password: String) =>
      sender ! verifyIdentity(login, password)

    case _ =>
      Logger error "UserActor.receive: unknown request"
  }

  def formApply(uuid: String, login: String, password: String, role: Int, objectString: Option[String]): User =
    User(UUID.fromString(uuid), login, password, role, objectString)
  def formUnapply(user: User) = Option((user.uuid, user.login, user.password, user.role))

  def verifyIdentity(login: String, password: String): Try[AuthenticationResponse] = Try {
    DB.withConnection { implicit connection =>
      SQL("SELECT * FROM users WHERE login = {login}")
        .on('login -> login)
        .as(userParser.singleOpt) match {
        case Some(userFound: User) =>
          AuthenticationResponse(BCrypt.checkpw(password, userFound.password), Option(userFound))
        case None => AuthenticationResponse(authorized = false, None)
      }
    }
  }

  def save(user: User): Try[Option[Long]] = Try {
    DB.withConnection { implicit connection =>
      SQL(
        """INSERT INTO users(uuid, login, password, role, object)
          |  VALUES ({uuid}, {login}, {password}, {role}, {objectString})""".stripMargin)
        .on(
          'uuid -> user.uuid,
          'login -> user.login,
          'password -> BCrypt.hashpw(user.password, BCrypt.gensalt()),
          'role -> user.role,
          'objectString -> user.objectString)
        .executeInsert()
    }
  }
}