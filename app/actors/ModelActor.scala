package actors

import java.util.UUID

import actors.ModelActor._
import actors.UserActor.User
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
  sealed trait ModelReturnType
  case class GeneralObject(uuid: UUID, objectString: String)  extends ModelReturnType
  case class UserWithRelations (user: User, stores: GeneralObject, brands: GeneralObject, images: GeneralObject) extends ModelReturnType
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

    case ObjectToDeleteRequest(table, uuid) =>
      sender ! deleteObject(ObjectToDeleteRequest(table, uuid))

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

  def getAllObjects(objectsToGetRequest: ObjectsToGetRequest): Try[Seq[ModelReturnType]] = Try {
    val tableName = objectsToGetRequest.table.name
    DB.withConnection { implicit connection =>
      val objects: List[GeneralObject] = SQL(s"""SELECT * FROM $tableName""").as(objectParser *)
      tableName match {
//        case "orders" =>
//          "1 brand"
//          "orders" -> "1 store chacun"
//
//        case "brand" =>
//          ~"stores"
//
//        case "stores" =>
//          "users"
//          "1 brand"
//          "orders"
//          "1 area"
//
        case "users" =>


          SQL(
            s"""SELECT users.*, stores.*, brands.*, images.* FROM users users
               |  FULL JOIN storeUser storeUser
               |    ON users.userid = storeUser.storeId
               |  FULL JOIN stores stores
               |    ON stores.storeid = storeUser.storeId
               |  FULL JOIN userBrand userBrand
               |    ON users.userid = userBrand.brandId
               |  FULL JOIN brands brands
               |    ON brands.brandId = userBrand.brandId
               |  FULL JOIN userImage userImage
               |    ON users.userid = userImage.imageId
               |  FULL JOIN images images
               |    ON images.imageId = userImage.imageId""".stripMargin)
            .as(userWithRelationsParser *)
//
//        case "areas" => None
      }
      objects
    }
  }

  val userWithRelationsParser: RowParser[UserWithRelations] = {
    get[UUID]("uuid") ~
      get[String]("login") ~
      get[String]("password") ~
      get[Int]("role") ~
      get[Option[String]]("object") ~
      get[UUID]("uuid") ~
      get[String]("object") ~
      get[UUID]("uuid") ~
      get[String]("object") ~
      get[UUID]("uuid") ~
      get[String]("object") map {
      case uuid ~ login ~ password ~ role ~ objectString ~ storeUUID ~ storeObject ~ brandUUID ~ brandObject ~
        imageUUID ~ imageObject =>
        UserWithRelations(User(uuid, login, password, role, objectString),
          GeneralObject(storeUUID, storeObject), GeneralObject(brandUUID, brandObject),
          GeneralObject(imageUUID, imageObject))
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
      SQL(s"""DELETE FROM $table WHERE UUID = {UUID}""")
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