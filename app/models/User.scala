package models

import actors.AuthenticatorActor.AuthenticationRequest
import anorm.RowParser
import org.mindrot.jbcrypt.BCrypt
import play.api.db.DB
import anorm.SqlParser._
import anorm._
import scala.util.Try
import play.api.Play.current
import java.util.UUID
import services.Utilities._

case class User(uuid: UUID, login: String, password: String)

object User {
  private val userParser: RowParser[User] = {
    get[UUID]("uuid") ~
      get[String]("login") ~
      get[String]("password") map {
      case uuid ~ login ~ password => User(uuid, login, password)
    }
  }

  def formApply(uuid: String, login: String, password: String): User = User(UUID.fromString(uuid), login, password)
  def formUnapply(user: User) = Option((user.uuid, user.login, user.password))

  def verifyIdentity(login: String, password: String): Try[Boolean] = Try {
    DB.withConnection { implicit connection =>
      SQL("SELECT * FROM users WHERE login = {login}")
        .on('login -> login)
        .as(userParser.singleOpt) match {
        case Some(userFound: User) => BCrypt.checkpw(password, userFound.password)
        case None => false
      }
    }
  }

  def save(user: User): Try[Option[Long]] = Try {
    DB.withConnection { implicit connection =>
      SQL("""INSERT INTO users(uuid, login, password) VALUES ({uuid}, {login}, {password})""")
        .on(
          'uuid -> user.uuid,
          'login -> user.login,
          'password -> BCrypt.hashpw(user.password, BCrypt.gensalt()))
        .executeInsert()
    }
  }
}
