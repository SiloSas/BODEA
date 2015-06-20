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
 def save(objectRequest: ObjectRequest): Try[Option[Long]] = Try {
   val table = objectRequest.table

   DB.withConnection { implicit connection =>
     SQL(s"""INSERT INTO $table(uuid, object) VALUES ({UUID}, {objectString})""")
       .on(
         'UUID -> UUID.fromString(objectRequest.uuid),
         'objectString -> objectRequest.objectString)
       .executeInsert()
   }
 }
}

case class ObjectRequest(table: String, uuid: String, objectString: String)