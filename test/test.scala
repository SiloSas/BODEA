import java.util.UUID

import actors.UserActor.SaveUserRequest

//import actors.ModelActor.{GeneralObject, storeBrand, brands}
import actors.ModelActor.{brands, images, orderBrand, orderImage, orders, userBrand}
import org.scalatestplus.play._

import scala.slick.driver.PostgresDriver.simple._


class test extends PlaySpec with OneAppPerSuite {
  "Test" must {

    "work" in {

      implicit val session = play.api.db.slick.DB.createSession()

//      stores.filter(store => store.storeId > 1).delete

      val saveUserRequest = SaveUserRequest("2bcfb184-c24c-420f-af62-0ca26a2f85bd", "client", "pwd",
        2, Some("new yeah!!!"), isActive = true)
//      users
//        .filter(_.uuid === UUID.fromString("2bcfb184-c24c-420f-af62-0ca26a2f85bd"))
//        .update(newUser)


//      if user.uuid === findUsersRequest.uuid
//      userBrand


//      SELECT orders.orderid, brands.object FROM orders orders
//        FULL OUTER JOIN orderbrand orderbrand on (orders.uuid = orderbrand.orderid)
//      LEFT OUTER JOIN brands brands on (orderbrand.brandid = brands.uuid)
//      WHERE orders.uuid IN
//      (SELECT orderbrand.orderId FROM orderbrand orderbrand
//        FULL OUTER JOIN userbrand userbrand on (orderbrand.brandid = userbrand.brandid)
//      WHERE userbrand.userid = '2bcfb180-c24c-420f-af62-0ca26a2f85bd');

      val brandIdsOfUser = userBrand
        .filter(_.userId === UUID.fromString("2bcfb180-c24c-420f-af62-0ca26a2f85bd"))
        .map(identity)

      val orderIds = orderBrand outerJoin
        brandIdsOfUser on (_.brandId === _.brandId)


      println(orderIds.map(_._1.orderId).list)

//        if (userBrand.userId = UUID.fromString("2bcfb180-c24c-420f-af62-0ca26a2f85bd"))

      val query = for {
        ((((order, _), brand), _), image) <- orders outerJoin
          orderBrand on (_.uuid === _.orderId) leftJoin
          brands on (_._2.brandId === _.uuid) outerJoin
          orderImage on (_._1._1.uuid === _.imageId) leftJoin
          images on (_._2.imageId === _.uuid)
          if order.uuid in orderIds.map(_._1.orderId)
      } yield (order, brand.uuid.?, brand.objectString.?, image.uuid.?, image.objectString.?)

      println(query.list)



//      SELECT orders.orderid, brands.object FROM orders orders
//        FULL OUTER JOIN orderbrand orderbrand on (orders.uuid = orderbrand.orderid)
//      LEFT OUTER JOIN brands brands on (orderbrand.brandid = brands.uuid)
//      FULL OUTER JOIN orderimage orderimage on (orders.uuid = orderimage.orderid)
//      LEFT OUTER JOIN images images on (orderimage.imageid = images.uuid)
//      WHERE orders.uuid
//      IN (SELECT orderbrand.orderId FROM orderbrand orderbrand
//        FULL OUTER JOIN userbrand userbrand on (orderbrand.brandid = userbrand.brandid)
//      WHERE userbrand.userid = '2bcfb180-c24c-420f-af62-0ca26a2f85bd');


      val query2 = for {
        ((((order, _), brand), _), image) <- orders outerJoin
          orderBrand on (_.uuid === _.orderId) leftJoin
          brands on (_._2.brandId === _.uuid) outerJoin
          orderImage on (_._1._1.uuid === _.imageId) leftJoin
          images on (_._2.imageId === _.uuid)
      } yield (order, brand.uuid.?, brand.objectString.?, image.uuid.?, image.objectString.?)


      println(query2.list)

//      val mail = use[MailerPlugin].email
//      mail.setSubject("Email sent using Scala")
//      mail.addRecipient("simongarnier07@hotmail.fr")
//      mail.addFrom("simongarnier07@hotmail.fr")
//      mail.send("Hello World")
    }
  }
}