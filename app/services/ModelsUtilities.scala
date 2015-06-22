package services

import java.util.UUID

import anorm._
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import scala.util.Try
import services.Utilities._


case class ObjectToSaveRequest(table: String, uuid: String, objectString: String)
case class ObjectToGetRequest(table: String, uuid: String)
case class ObjectToDeleteRequest(table: String, uuid: String)
case class ObjectToAmendRequest(table: String, uuid: String, newObject: String)
case class GeneralObject(uuid: UUID, objectString: String)

object ModelsUtilities {
  private val objectParser: RowParser[GeneralObject] = {
    get[UUID]("uuid") ~
    get[String]("object") map {
      case uuid ~ objectString => GeneralObject(uuid, objectString)
    }
  }

  def save(objectToSave: ObjectToSaveRequest): Try[Option[Long]] = Try {
    val table = objectToSave.table

    DB.withConnection { implicit connection =>
      SQL(s"""INSERT INTO $table(uuid, object) VALUES ({UUID}, {objectString})""")
      .on(
      'UUID -> UUID.fromString(objectToSave.uuid),
      'objectString -> objectToSave.objectString)
      .executeInsert()
    }
  }

  def getObject(objectToGet: ObjectToGetRequest): Try[Seq[GeneralObject]] = Try {
    val table = objectToGet.table
    DB.withConnection { implicit connection =>
      SQL(s"""SELECT * FROM $table WHERE UUID = {UUID}""")
      .on('UUID -> UUID.fromString(objectToGet.uuid))
      .as(objectParser *)
    }
  }

  def deleteObject(objectToDelete: ObjectToDeleteRequest): Try[Int] = Try {
    val table = objectToDelete.table
    DB.withConnection { implicit connection =>
      SQL(s"""DELETE * FROM $table WHERE UUID = {UUID}""")
      .on('UUID -> UUID.fromString(objectToDelete.uuid))
      .executeUpdate()
    }
  }

  def amendObject(objectToAmend: ObjectToAmendRequest): Try[Int] = Try {
    val table = objectToAmend.table
    DB.withConnection { implicit connection =>
      SQL(
        s"""UPDATE $table
           |  SET object = {object}
           |  WHERE UUID = {UUID}""".stripMargin)
      .on('UUID -> UUID.fromString(objectToAmend.uuid))
      .executeUpdate()
    }
  }
}