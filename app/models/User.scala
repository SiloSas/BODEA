package models

import anorm.RowParser
import org.mindrot.jbcrypt.BCrypt
import play.api.db.DB
import anorm.SqlParser._
import anorm._
import scala.util.Try
import play.api.Play.current

case class User(login: String, password: String)

object User {
  private val userParser: RowParser[User] = {
      get[String]("login") ~
      get[String]("password") map {
      case login ~ password =>
        User(login, password)
    }
  }

  def formApply(login: String, password: String): User = User(login, password)
  def formUnapply(user: User) = Option((user.login, user.password))

  def verifyIdentity(user: User): Try[Boolean] = Try {
    DB.withConnection { implicit connection =>
      SQL("SELECT * FROM users WHERE login = {login}")
        .on('login -> user.login)
        .as(userParser.singleOpt) match {
        case Some(userFound: User) => BCrypt.checkpw(user.password, userFound.password)
        case None => false
      }
    }
  }

  def save(user: User): Try[Option[Long]] = Try {
    DB.withConnection { implicit connection =>
      SQL("""INSERT INTO users(login, password) VALUES ({login}, {password})""")
        .on(
          'login -> user.login,
          'password -> BCrypt.hashpw(user.password, BCrypt.gensalt()))
        .executeInsert()
    }
  }
}
