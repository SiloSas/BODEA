package actors

import java.util.UUID

import actors.ModelActor._
import actors.UserActor.{User, UserTable}
import akka.actor._
import anorm.SqlParser._
import anorm._
import play.api.Play.current
import play.api.db.DB
import services.Utilities._

import scala.language.postfixOps
import scala.slick.driver.PostgresDriver.simple._
import scala.util.{Failure, Try}


sealed trait ModelReturnType

object ModelActor {
  case class PostgresTable(name: String)
  case class ObjectToSaveRequest(table: PostgresTable, uuid: UUID, objectString: String)
  case class RelationBetweenTwoTables(relationTable: String, uuidA: String, uuidB: String)
  case class SaveRelationsRequest(relationsBetweenTwoTables: List[RelationBetweenTwoTables])
  case class ObjectToGetRequest(table: PostgresTable, uuid: UUID)
  case class FindObjectsRequest(table: PostgresTable, userId: Option[Int])
  case class ObjectToDeleteRequest(table: PostgresTable, uuid: UUID)
  case class ObjectToAmendRequest(table: PostgresTable, uuid: UUID, newObject: String)

  case class GeneralObject(uuid: UUID, objectString: String)  extends ModelReturnType
  case class Relation(relationName: String, relationObject: GeneralObject)
//  case class Relations(relations: List[Relation])

  case class MaybeRelation(relationName: String, maybeGeneralObject: MaybeGeneralObject)

  case class GeneralObjectWithRelations(generalObject: GeneralObject, relations: Seq[MaybeRelation])
    extends ModelReturnType

  class StandardTable(tag: Tag)(implicit table: String) extends Table[GeneralObject](tag, table) {
    def id = column[Int](table.dropRight(1) + "id", O.PrimaryKey)
    def uuid = column[UUID]("uuid", O.DBType("UUID"))
    def objectString = column[String]("object")
    def * = (uuid, objectString) <> (GeneralObject.tupled, GeneralObject.unapply)
  }

  class StoreTable(tag: Tag) extends Table[GeneralObject](tag, "stores") {
    def id = column[Int]("storeid", O.PrimaryKey)
    def uuid = column[UUID]("uuid", O.DBType("UUID"))
    def objectString = column[String]("object")

    def * = (uuid, objectString) <> (GeneralObject.tupled, GeneralObject.unapply)
  }  
  
  class BrandTable(tag: Tag) extends Table[GeneralObject](tag, "brands") {
    def id = column[Int]("brandid", O.PrimaryKey)
    def uuid = column[UUID]("uuid", O.DBType("UUID"))
    def objectString = column[String]("object")

    def * = (uuid, objectString) <> (GeneralObject.tupled, GeneralObject.unapply)
  }
  
  class ImageTable(tag: Tag) extends Table[GeneralObject](tag, "images") {
    def id = column[Int]("imageid", O.PrimaryKey)
    def uuid = column[UUID]("uuid", O.DBType("UUID"))
    def objectString = column[String]("object")

    def * = (uuid, objectString) <> (GeneralObject.tupled, GeneralObject.unapply)
  }

  class OrderTable(tag: Tag) extends Table[GeneralObject](tag, "orders") {
    def id = column[Int]("orderid", O.PrimaryKey)
    def uuid = column[UUID]("uuid", O.DBType("UUID"))
    def objectString = column[String]("object")

    def * = (uuid, objectString) <> (GeneralObject.tupled, GeneralObject.unapply)
  }

   class StoreBrandTable(tag: Tag) extends Table[(Int, Int)](tag, "storebrand") {
    def storeId = column[Int]("storeid")
    def brandId = column[Int]("brandid")

    def * = (storeId, brandId)

    def aFK = foreignKey("storeid", storeId, stores)(a => a.id)
    def bFK = foreignKey("brandid", brandId, brands)(b => b.id)
  }

  class OrderBrandTable(tag: Tag) extends Table[(Int, Int)](tag, "orderbrand") {
    def orderId = column[Int]("orderid")
    def brandId = column[Int]("brandid")

    def * = (orderId, brandId)

    def aFK = foreignKey("orderid", orderId, orders)(a => a.id)
    def bFK = foreignKey("brandid", brandId, brands)(b => b.id)
  }

  class StoreOrderTable(tag: Tag) extends Table[(Int, Int)](tag, "storeorder") {
    def storeId = column[Int]("storeid")
    def orderId = column[Int]("orderid")

    def * = (storeId, orderId)

    def aFK = foreignKey("storeid", storeId, stores)(a => a.id)
    def bFK = foreignKey("orderid", orderId, orders)(b => b.id)
  }

  class StoreUserTable(tag: Tag) extends Table[(Int, Int)](tag, "storeuser") {
    def storeId = column[Int]("storeid")
    def userId = column[Int]("userid")

    def * = (storeId, userId)

    def aFK = foreignKey("storeid", storeId, stores)(a => a.id)
    def bFK = foreignKey("userid", userId, users)(b => b.id)
  }

  class OrderImageTable(tag: Tag) extends Table[(Int, Int)](tag, "orderimage") {
    def orderId = column[Int]("orderid")
    def imageId = column[Int]("imageid")

    def * = (orderId, imageId)

    def aFK = foreignKey("orderid", orderId, orders)(a => a.id)
    def bFK = foreignKey("imageid", imageId, images)(b => b.id)
  }

  class UserImageTable(tag: Tag) extends Table[(Int, Int)](tag, "userimage") {
    def userId = column[Int]("userid")
    def imageId = column[Int]("imageid")

    def * = (userId, imageId)

    def aFK = foreignKey("userid", userId, users)(a => a.id)
    def bFK = foreignKey("imageid", imageId, images)(b => b.id)
  }

  class UserBrandTable(tag: Tag) extends Table[(Int, Int)](tag, "userbrand") {
    def userId = column[Int]("userid")
    def brandId = column[Int]("brandid")

    def * = (userId, brandId)

    def aFK = foreignKey("userid", userId, users)(a => a.id)
    def bFK = foreignKey("brandid", brandId, brands)(b => b.id)
  }

  val stores = TableQuery[StoreTable]
  val orders = TableQuery[OrderTable]
  val brands = TableQuery[BrandTable]
  val images = TableQuery[ImageTable]
  val users = TableQuery[UserTable]
  val storeOrder = TableQuery[StoreOrderTable]
  val storeBrand = TableQuery[StoreBrandTable] 
  val storeUser = TableQuery[StoreUserTable]
  val orderBrand = TableQuery[OrderBrandTable]
  val userImage = TableQuery[UserImageTable]
  val userBrand = TableQuery[UserBrandTable]
  val orderImage = TableQuery[OrderImageTable]

  case class MaybeGeneralObject(uuid: Option[UUID], objectString: Option[String]) extends ModelReturnType
  case class UserWithRelations(user: User, relations: Seq[MaybeRelation])
  def props = Props[ModelActor]
}

class ModelActor extends Actor {
  implicit val session = play.api.db.slick.DB.createSession()

  def receive = {
    case ObjectToSaveRequest(table, uuid, objectString) =>
      sender ! save(ObjectToSaveRequest(table, uuid, objectString))

    case FindObjectsRequest(table, None) =>
      sender ! getAllObjects(FindObjectsRequest(table, None))

    case "users" =>
      sender ! findUsers

    case ObjectToGetRequest(table, uuid) =>
      sender ! getObject(ObjectToGetRequest(table, uuid))

    case ObjectToDeleteRequest(table, uuid) =>
      sender ! deleteObject(ObjectToDeleteRequest(table, uuid))

    case ObjectToAmendRequest(table, uuid, newObjectString) =>
      sender ! amendObject(ObjectToAmendRequest(table, uuid, newObjectString))

    case saveRelationsRequest: SaveRelationsRequest =>
      sender ! saveRelation(saveRelationsRequest)

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
    (standardTableQuery returning standardTableQuery.map(_.id)) +=
      GeneralObject(objectToSave.uuid, objectToSave.objectString)
  }

  def getAllObjects(objectsToGetRequest: FindObjectsRequest): Try[Seq[GeneralObjectWithRelations]] = Try {
    val tableName = objectsToGetRequest.table.name
    DB.withConnection { implicit connection =>
      tableName match {
        case "orders" =>
          findOrders
        case otherTable =>
          implicit val table = otherTable
          val standardTableQuery = TableQuery[StandardTable]
          standardTableQuery.list map { x => GeneralObjectWithRelations(x, List.empty) }
      }
    }
  }

  def saveRelation(saveRelationsRequest: SaveRelationsRequest): Try[Int] = Try {
//    saveRelationsRequest.collect( case )
//    saveRelationRequest map { relation =>
//      if
//    }

    0
  }

  def findOrders: Seq[GeneralObjectWithRelations] = {
    val query = for {
      ((((order, _), brand), _), image) <- orders outerJoin
        orderBrand on (_.id === _.brandId) leftJoin
        brands on (_._2.brandId === _.id) outerJoin
        orderImage on (_._1._1.id === _.imageId) leftJoin
        images on (_._2.imageId === _.id)
//      WHERE orders.orderid IN (SELECT orderid FROM storeorder WHERE storeid = 1);
//        if order.id in (usersOrders.filter(_.login === "client").map(_);
    } yield (order, brand.uuid.?, brand.objectString.?, image.uuid.?, image.objectString.?)

    query.list.groupBy(_._1).map { generalObjectsWithRelations =>
      (generalObjectsWithRelations._1,
        generalObjectsWithRelations._2.foldLeft(Seq.empty[MaybeRelation]) { (res, generalObjectWithRelation) =>
          res :+
            MaybeRelation("brands", MaybeGeneralObject(generalObjectWithRelation._2, generalObjectWithRelation._3)) :+
            MaybeRelation("images", MaybeGeneralObject(generalObjectWithRelation._4, generalObjectWithRelation._5))
        }.distinct.filterNot(_.maybeGeneralObject.objectString == None))
    }
      .toSeq
      .map { generalObjectWithRelation =>
      GeneralObjectWithRelations(generalObjectWithRelation._1, generalObjectWithRelation._2)
    }
  }

  def findUsers: Try[Seq[UserWithRelations]] = Try {
    val query = for {
      ((((user, _), brand), _), store) <- users outerJoin
        userBrand on (_.id === _.brandId) leftJoin
        brands on (_._2.brandId === _.id) outerJoin
        storeUser on (_._1._1.id === _.storeId) leftJoin
        stores on (_._2.storeId === _.id)
    } yield (user, brand.uuid.?, brand.objectString.?, store.uuid.?, store.objectString.?)

    query.list.groupBy(_._1).map { generalObjectsWithRelations =>
      (generalObjectsWithRelations._1,
        generalObjectsWithRelations._2.foldLeft(Seq.empty[MaybeRelation]) { (res, generalObjectWithRelation) =>
          res :+
            MaybeRelation("brands", MaybeGeneralObject(generalObjectWithRelation._2, generalObjectWithRelation._3)) :+
            MaybeRelation("images", MaybeGeneralObject(generalObjectWithRelation._4, generalObjectWithRelation._5))
        }.distinct.filterNot(_.maybeGeneralObject.objectString == None))
    }
      .toSeq
      .map { userWithRelation =>
      UserWithRelations(userWithRelation._1, userWithRelation._2)
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
        .on('UUID -> objectToAmend.uuid,
            'object -> objectToAmend.newObject)
        .executeUpdate()
    }
  }
}

//  val userWithRelationsParser: RowParser[UserWithRelations] = {
//    get[UUID]("uuid") ~
//      get[String]("login") ~
//      get[String]("password") ~
//      get[Int]("role") ~
//      get[Option[String]]("object") ~
//      get[Option[UUID]]("uuid") ~
//      get[Option[String]]("object") ~
//      get[Option[UUID]]("uuid") ~
//      get[Option[String]]("object") ~
//      get[Option[UUID]]("uuid") ~
//      get[Option[String]]("object") map {
//      case uuid ~ login ~ password ~ role ~ userObject ~ storeUUID ~ storeObject ~ brandUUID ~ brandObject ~
//        imageUUID ~ imageObject =>
//        println(login)
//        println((uuid, login, password , role , userObject , storeUUID , storeObject , brandUUID , brandObject ,
//          imageUUID , imageObject))
//        UserWithRelations(User(uuid, login, password, role, userObject),
//          MaybeGeneralObject(storeUUID, storeObject), MaybeGeneralObject(brandUUID, brandObject),
//          MaybeGeneralObject(imageUUID, imageObject))
//    }
//  }