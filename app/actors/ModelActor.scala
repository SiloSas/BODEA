package actors

import java.util.UUID

import actors.ModelActor._
import akka.actor._
import anorm.SqlParser._
import anorm._
import play.api.Play.current
import play.api.db.DB
import services.Utilities._

import scala.language.postfixOps
import scala.util.Try

object ModelActor {
  case class Table(name: String)
  case class ObjectToSaveRequest(table: Table, uuid: UUID, objectString: String)
  case class ObjectToGetRequest(table: Table, uuid: UUID)
  case class ObjectsToGetRequest(table: Table)
  case class ObjectToDeleteRequest(table: Table, uuid: UUID)
  case class ObjectToAmendRequest(table: Table, uuid: UUID, newObject: String)
  case class GeneralObject(uuid: UUID, objectString: String)
  def props = Props[ModelActor]
}

class ModelActor extends Actor {
  def receive = {
    case ObjectToSaveRequest(table, uuid, objectString) =>
      sender ! save(ObjectToSaveRequest(table, uuid, objectString))

    case ObjectsToGetRequest(table) =>
      sender ! getAllObjects(ObjectsToGetRequest(table))

    case ObjectToGetRequest(table, uuid) =>
      sender ! getObject(ObjectToGetRequest(table, uuid))

    case _ => sender ! "unknown request"
  }

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
          'UUID -> objectToSave.uuid,
          'objectString -> objectToSave.objectString)
        .executeInsert()
    }
  }

  def getAllObjects(objectsToGetRequest: ObjectsToGetRequest): Try[Seq[GeneralObject]] = Try {
    val table = objectsToGetRequest.table.name
    DB.withConnection { implicit connection =>
      SQL(s"""SELECT * FROM $table""")
        .as(objectParser *)
    }
  }

  def getObject(objectToGet: ObjectToGetRequest): Try[Option[GeneralObject]] = Try {
    val table = objectToGet.table.name
    DB.withConnection { implicit connection =>
      SQL(s"""SELECT * FROM $table WHERE UUID = {UUID}""")
        .on('UUID -> objectToGet.uuid)
        .as(objectParser.singleOpt)
    }
  }

  def deleteObject(objectToDelete: ObjectToDeleteRequest): Try[Int] = Try {
    val table = objectToDelete.table.name
    DB.withConnection { implicit connection =>
      SQL(s"""DELETE * FROM $table WHERE UUID = {UUID}""")
        .on('UUID -> objectToDelete.uuid)
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
        .on('UUID -> objectToAmend.uuid)
        .executeUpdate()
    }
  }
}