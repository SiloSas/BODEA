package actors

import java.util.UUID

import actors.ModelActor._
import actors.UserActor.{User, UserTable}
import akka.actor._
import anorm.SqlParser._
import anorm._
import play.api.Logger
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
  case class FindObjectsRequest(table: PostgresTable, isClient: Boolean, clientUUID: UUID)
  case class ObjectToDeleteRequest(table: PostgresTable, uuid: UUID)
  case class ObjectToAmendRequest(table: PostgresTable, uuid: UUID, newObject: String)
  case class GeneralObject(uuid: UUID, objectString: String)  extends ModelReturnType
  case class Relation(relationName: String, relationObject: GeneralObject)
  case class MaybeRelation(relationName: String, maybeGeneralObject: MaybeGeneralObject)
  case class GeneralObjectWithRelations(generalObject: GeneralObject, relations: Seq[MaybeRelation])
    extends ModelReturnType
  case class FindUsersRequest(isClient: Boolean, uuid: UUID)

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

   class StoreBrandTable(tag: Tag) extends Table[(UUID, UUID)](tag, "storebrand") {
    def storeId = column[UUID]("storeid")
    def brandId = column[UUID]("brandid")

    def * = (storeId, brandId)

    //def aFK = foreignKey("storeid", storeId, stores)(a => a.id)
    //def bFK = foreignKey("brandid", brandId, brands)(b => b.id)
  }

  class OrderBrandTable(tag: Tag) extends Table[(UUID, UUID)](tag, "orderbrand") {
    def orderId = column[UUID]("orderid")
    def brandId = column[UUID]("brandid")
    def * = (orderId, brandId)
  }

  class StoreOrderTable(tag: Tag) extends Table[(UUID, UUID)](tag, "storeorder") {
    def storeId = column[UUID]("storeid")
    def orderId = column[UUID]("orderid")
    def * = (storeId, orderId)
  }

  class StoreUserTable(tag: Tag) extends Table[(UUID, UUID)](tag, "storeuser") {
    def storeId = column[UUID]("storeid")
    def userId = column[UUID]("userid")

    def * = (storeId, userId)
  }

  class OrderImageTable(tag: Tag) extends Table[(UUID, UUID)](tag, "orderimage") {
    def orderId = column[UUID]("orderid")
    def imageId = column[UUID]("imageid")

    def * = (orderId, imageId)
  }

  class UserImageTable(tag: Tag) extends Table[(UUID, UUID)](tag, "userimage") {
    def userId = column[UUID]("userid")
    def imageId = column[UUID]("imageid")
    def * = (userId, imageId)
  }

  class UserBrandTable(tag: Tag) extends Table[(UUID, UUID)](tag, "userbrand") {
    def userId = column[UUID]("userid")
    def brandId = column[UUID]("brandid")
    def * = (userId, brandId)
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

    case findObjectsRequest: FindObjectsRequest =>
      sender ! getAllObjects(findObjectsRequest)

    case findUsersRequest: FindUsersRequest =>
      sender ! findUsers(findUsersRequest)

    case ObjectToGetRequest(table, uuid) =>
      sender ! getObject(ObjectToGetRequest(table, uuid))

    case ObjectToDeleteRequest(table, uuid) =>
      sender ! deleteObject(ObjectToDeleteRequest(table, uuid))

    case ObjectToAmendRequest(table, uuid, newObjectString) =>
      sender ! amendObject(ObjectToAmendRequest(table, uuid, newObjectString))

    case saveRelationsRequest: SaveRelationsRequest =>
      sender ! saveRelations(saveRelationsRequest)

    case _ => sender ! Failure(throw new Exception("unknown request"))
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
          findOrders(objectsToGetRequest.isClient, objectsToGetRequest.clientUUID)
        case otherTable =>
          implicit val table = otherTable
          val standardTableQuery = TableQuery[StandardTable]
          standardTableQuery.list map { x => GeneralObjectWithRelations(x, List.empty) }
      }
    }
  }

  def saveRelations(saveRelationsRequest: SaveRelationsRequest): Try[Int] = Try {
     saveRelationsRequest.relationsBetweenTwoTables.collect {
       case relation: RelationBetweenTwoTables if relation.relationTable == "storebrand" =>
         (UUID.fromString(relation.uuidA), UUID.fromString(relation.uuidB))
     } map {
       storeBrand
         .map(storeBrand => (storeBrand.storeId, storeBrand.brandId))
         .insert
     }

    saveRelationsRequest.relationsBetweenTwoTables.collect {
       case relation: RelationBetweenTwoTables if relation.relationTable == "userbrand" =>
         (UUID.fromString(relation.uuidA), UUID.fromString(relation.uuidB))
    } map {
      userBrand
       .map(userIdBrandId => (userIdBrandId.userId, userIdBrandId.brandId))
       .insert
    }

    saveRelationsRequest.relationsBetweenTwoTables.collect {
       case relation: RelationBetweenTwoTables if relation.relationTable == "storeuser" =>
         (UUID.fromString(relation.uuidA), UUID.fromString(relation.uuidB))
    } map {
      storeUser
       .map(storeUser => (storeUser.storeId, storeUser.userId))
       .insert
    }

    saveRelationsRequest.relationsBetweenTwoTables.collect {
       case relation: RelationBetweenTwoTables if relation.relationTable == "orderbrand" =>
         (UUID.fromString(relation.uuidA), UUID.fromString(relation.uuidB))
    } map {
      orderBrand
        .map(orderbrand => (orderbrand.orderId, orderbrand.brandId))
        .insert
    }

    saveRelationsRequest.relationsBetweenTwoTables.collect {
       case relation: RelationBetweenTwoTables if relation.relationTable == "orderimage" =>
         (UUID.fromString(relation.uuidA), UUID.fromString(relation.uuidB))
    } map {
      orderImage
        .map(orderimage => (orderimage.orderId, orderimage.imageId))
        .insert
    }

    0
  }

  def findOrders(isClient: Boolean, userUUID: UUID): Seq[GeneralObjectWithRelations] = isClient match {
    case false =>
      val query = for {
        ((((order, _), brand), _), image) <- orders outerJoin
          orderBrand on (_.uuid === _.brandId) leftJoin
          brands on (_._2.brandId === _.uuid) outerJoin
          orderImage on (_._1._1.uuid === _.imageId) leftJoin
          images on (_._2.imageId === _.uuid)
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

    case true =>
      val brandIdsOfUser = userBrand
        .filter(_.userId === UUID.fromString("2bcfb180-c24c-420f-af62-0ca26a2f85bd"))
        .map(identity)

      val orderIds = orderBrand outerJoin
        brandIdsOfUser on (_.brandId === _.brandId)

      val query = for {
        ((((order, _), brand), _), image) <- orders outerJoin
          orderBrand on (_.uuid === _.brandId) leftJoin
          brands on (_._2.brandId === _.uuid) outerJoin
          orderImage on (_._1._1.uuid === _.imageId) leftJoin
          images on (_._2.imageId === _.uuid)
        if order.uuid in orderIds.map(_._1.orderId)
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

  def findUsers(findUsersRequest: FindUsersRequest): Try[Seq[UserWithRelations]] = Try {
    findUsersRequest.isClient match {
      case false =>
        val query = for {
          ((((user, _), brand), _), store) <- users outerJoin
            userBrand on (_.uuid === _.userId) leftJoin
            brands on (_._2.brandId === _.uuid) outerJoin
            storeUser on (_._1._1.uuid === _.storeId) leftJoin
            stores on (_._2.storeId === _.uuid)
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

      case true =>
        val query = for {
          ((((user, _), brand), _), store) <- users.filter(_.uuid === findUsersRequest.uuid) outerJoin
            userBrand on (_.uuid === _.userId ) leftJoin
            brands on (_._2.brandId === _.uuid) outerJoin
            storeUser on (_._1._1.uuid === _.storeId) leftJoin
            stores on (_._2.storeId === _.uuid)
            if user.uuid === findUsersRequest.uuid
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