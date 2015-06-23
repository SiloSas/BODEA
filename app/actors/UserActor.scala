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
  case class SaveUserRequest(uuid: String, login: String, password: String, role: Int)
  case class User(uuid: UUID, login: String, password: String, role: Int)
  case class AuthenticationRequest[A](login: String, password: String)
  case class AuthenticationResponse(authorized: Boolean, login: String, role: Option[Int])
}

class UserActor extends Actor {
  def receive = {
    case SaveUserRequest(uuid, login, password, role) =>
      try {
        val uuidTyped = UUID.fromString(uuid)
        save(User(uuidTyped, login, password, role)) match {
          case Success(Some(index)) => sender ! "success"
          case Success(None) => sender ! "failure: user has not been created"
          case Failure(failure) => sender ! "failure: " + failure
        }
      } catch {
        case e: Exception => sender ! "wrong uuid"
      }

    case AuthenticationRequest(login: String, password: String) =>
      verifyIdentity(login, password) match {
        case Success(true) =>
          sender ! AuthenticationResponse(authorized = true, login, Some(1))
        case Success(false) =>
          sender ! AuthenticationResponse(authorized = false, login, None)
        case failure =>
          Logger error "User actor failure while verifying identity: " + failure
      }

    case _ =>
      Logger error "UserActor.receive: unknown request"
  }

  private val userParser: RowParser[User] = {
    get[UUID]("uuid") ~
      get[String]("login") ~
      get[String]("password") ~
      get[Int]("role") map {
      case uuid ~ login ~ password ~ role => User(uuid, login, password, role)
    }
  }

  def formApply(uuid: String, login: String, password: String, role: Int): User =
    User(UUID.fromString(uuid), login, password, role)
  def formUnapply(user: User) = Option((user.uuid, user.login, user.password, user.role))

  def verifyIdentity(login: String, password: String): Try[Boolean] = Try {
    DB.withConnection { implicit connection =>
      SQL("SELECT * FROM users WHERE login = {login}")
        .on('login -> login)
        .as(userParser.singleOpt) match {
        case Some(userFound: User) =>
          BCrypt.checkpw(password, userFound.password)
        case None => false
      }
    }
  }

  def save(user: User): Try[Option[Long]] = Try {
    DB.withConnection { implicit connection =>
      SQL(
        """INSERT INTO users(uuid, login, password, role)
          |  VALUES ({uuid}, {login}, {password}, {role})""".stripMargin)
        .on(
          'uuid -> user.uuid,
          'login -> user.login,
          'password -> BCrypt.hashpw(user.password, BCrypt.gensalt()),
          'role -> user.role)
        .executeInsert()
    }
  }
}