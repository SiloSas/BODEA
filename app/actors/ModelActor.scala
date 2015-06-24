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
import scala.util.{Failure, Try}

sealed trait ModelReturnType

object ModelActor {
  case class Table(name: String)
  case class ObjectToSaveRequest(table: Table, uuid: UUID, objectString: String)
  case class ObjectToGetRequest(table: Table, uuid: UUID)
  case class ObjectsToGetRequest(table: Table)
  case class ObjectToDeleteRequest(table: Table, uuid: UUID)
  case class ObjectToAmendRequest(table: Table, uuid: UUID, newObject: String)
  case class GeneralObject(uuid: UUID, objectString: String)  extends ModelReturnType
  case class MaybeGeneralObject(uuid: Option[UUID], objectString: Option[String])  extends ModelReturnType
  case class UserWithRelations (user: User, stores: MaybeGeneralObject, brands: MaybeGeneralObject,
                                images: MaybeGeneralObject) extends ModelReturnType
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

    case _ => sender ! Failure(throw new Exception("unknown request"))
  }

  private val objectParser: RowParser[GeneralObject] = {
    get[UUID]("uuid") ~
      get[String]("object") map {
      case uuid ~ objectString => GeneralObject(uuid, objectString)
    }
  }

  private val maybeObjectParser: RowParser[MaybeGeneralObject] = {
    get[Option[UUID]]("uuid") ~
      get[Option[String]]("object") map {
      case uuid ~ objectString => MaybeGeneralObject(uuid, objectString)
    }
  }

  def save(objectToSave: ObjectToSaveRequest): Try[Option[Long]] = Try {
    val tableName = objectToSave.table.name
    DB.withConnection { implicit connection =>
      SQL(s"""INSERT INTO $tableName(uuid, object) VALUES ({UUID}, {objectString})""")
        .on(
          'UUID -> objectToSave.uuid,
          'objectString -> objectToSave.objectString)
        .executeInsert()
    }
  }

  def getAllObjects(objectsToGetRequest: ObjectsToGetRequest): Try[Seq[ModelReturnType]] = Try {
    val tableName = objectsToGetRequest.table.name
    DB.withConnection { implicit connection =>
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
//          val a = SQL(
//            s"""SELECT users.* FROM users users""".stripMargin)
//          println(a)
//          a.as(userParser.*)
          val a = SQL(
            s"""SELECT users.*, stores.*, brands.*, images.* FROM users users
               |  LEFT OUTER JOIN storeUser storeUser
               |    ON users.userid = storeUser.storeId
               |  LEFT OUTER JOIN stores stores
               |    ON stores.storeid = storeUser.storeId
               |  LEFT OUTER JOIN userBrand userBrand
               |    ON users.userid = userBrand.brandId
               |  LEFT OUTER JOIN brands brands
               |    ON brands.brandId = userBrand.brandId
               |  LEFT OUTER JOIN userImage userImage
               |    ON users.userid = userImage.imageId
               |  LEFT OUTER JOIN images images
               |    ON images.imageId = userImage.imageId""".stripMargin)
          println(a)
            a.as(userWithRelationsParser *)
        case otherTable =>
          SQL(s"""SELECT * FROM $tableName""")
            .as(objectParser *)
      }
    }
  }

  val userWithRelationsParser: RowParser[UserWithRelations] = {
    get[UUID]("uuid") ~
      get[String]("login") ~
      get[String]("password") ~
      get[Int]("role") ~
      get[Option[String]]("object") ~
      get[Option[UUID]]("uuid") ~
      get[Option[String]]("object") ~
      get[Option[UUID]]("uuid") ~
      get[Option[String]]("object") ~
      get[Option[UUID]]("uuid") ~
      get[Option[String]]("object") map {
      case uuid ~ login ~ password ~ role ~ userObject ~ storeUUID ~ storeObject ~ brandUUID ~ brandObject ~
        imageUUID ~ imageObject =>
        println(login)
        println(uuid, login, password , role , userObject , storeUUID , storeObject , brandUUID , brandObject ,
          imageUUID , imageObject)
        UserWithRelations(User(uuid, login, password, role, userObject),
          MaybeGeneralObject(storeUUID, storeObject), MaybeGeneralObject(brandUUID, brandObject),
          MaybeGeneralObject(imageUUID, imageObject))
    }
  }

  def getObject(objectToGet: ObjectToGetRequest): Try[Option[MaybeGeneralObject]] = Try {
    //un seul get avec un + """WHERE uuid = " dans la requête sql
    val table = objectToGet.table.name
    DB.withConnection { implicit connection =>
      SQL(s"""SELECT * FROM $table WHERE UUID = {UUID}""")
        .on('UUID -> objectToGet.uuid)
        .as(maybeObjectParser.singleOpt)
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
    val table = objectToAmend.table.name
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