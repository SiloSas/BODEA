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
//import scala.slick.direct.AnnotationMapper.column
//import slick.lifted.Tag
//import slick.model.Table
//import play.api.db.slick.Config.driver.simple._
import scala.language.postfixOps
import scala.slick.driver.PostgresDriver.simple._
import scala.util.{Failure, Try}


sealed trait ModelReturnType

object ModelActor {
  case class PostgresTable(name: String)
  case class ObjectToSaveRequest(table: PostgresTable, uuid: UUID, objectString: String)
  case class ObjectToGetRequest(table: PostgresTable, uuid: UUID)
  case class ObjectsToGetRequest(table: PostgresTable)
  case class ObjectToDeleteRequest(table: PostgresTable, uuid: UUID)
  case class ObjectToAmendRequest(table: PostgresTable, uuid: UUID, newObject: String)

  case class GeneralObject(uuid: UUID, objectString: String)  extends ModelReturnType

  class StandardTable(tag: Tag)(implicit table: String) extends Table[GeneralObject](tag, table) {
    def id = column[Int](table.dropRight(1) + "id", O.PrimaryKey)
    def uuid = column[UUID]("uuid", O.DBType("UUID"))
    def objectString = column[String]("object")
    def * = (uuid, objectString) <> (GeneralObject.tupled, GeneralObject.unapply)
  }

//  class relationTable(tag: Tag)(implicit tables: (String, String)) extends
//  Table[(Int, Int)](tag, tables._1 + tables._2) {
//    val tableA = table.split("To")(0)
//    val tableB = table.split("To")(1)
//    def aId = column[Int](tableA + "id")
//    def bId = column[Int](tableB + "id")
//    def * = (aId, bId)
//    def aFK = foreignKey("a_fk", aId, tableA)(a => a.id)
//    def bFK = foreignKey("b_fk", bId, tableB)(b => b.id)
//  }

  case class MaybeGeneralObject(uuid: Option[UUID], objectString: Option[String]) extends ModelReturnType
  case class UserWithRelations (user: User, stores: MaybeGeneralObject, brands: MaybeGeneralObject,
                                images: MaybeGeneralObject) extends ModelReturnType
  def props = Props[ModelActor]
}

class ModelActor extends Actor {
  implicit val session = play.api.db.slick.DB.createSession()

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

  def save(objectToSave: ObjectToSaveRequest): Try[Int] = Try {
    implicit val table = objectToSave.table.name
    val standardTableQuery = TableQuery[StandardTable]
//    val tableName = objectToSave.table.name
//    DB.withConnection { implicit connection =>
//      SQL(s"""INSERT INTO $tableName(uuid, object) VALUES ({UUID}, {objectString})""")
//        .on(
//          'UUID -> objectToSave.uuid,
//          'objectString -> objectToSave.objectString)
//        .executeInsert()
//    }
    (standardTableQuery returning standardTableQuery.map(_.id)) += GeneralObject(objectToSave.uuid, objectToSave.objectString)


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



          implicit var table = "stores"
          val stores = TableQuery[StandardTable]
          table = "orders"
          val orders = TableQuery[StandardTable]


//          println(storesTable.list)
//          for {
//            (orders, stores) <- users innerJoin
//          }


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
            a.as(userWithRelationsParser *)
        case otherTable =>
          implicit var table = "klj"
          val standardTableQuery1 = TableQuery[StandardTable]
          table = otherTable
          val standardTableQuery = TableQuery[StandardTable]
          standardTableQuery.list
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