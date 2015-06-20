package services

import java.sql.Connection
import java.text.Normalizer
import java.util.{Date, UUID}

import anorm.SqlParser._
import anorm._
import controllers.DAOException
import play.api.Play.current
import play.api.db.DB

import scala.collection.mutable.ListBuffer
import scala.util.Try

object ModelsUtilities {
 def save(table: String, UUID: UUID, text: String): Try[Option[Long]] = Try {
   DB.withConnection { implicit connection =>
     SQL(s"""INSERT INTO $table VALUES ({UUID}, {text})""")
       .on(
         'UUID -> UUID,
         'text -> text)
       .executeInsert()
   }
 }
}
