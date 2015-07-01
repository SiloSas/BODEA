import java.util.UUID

import actors.UserActor.SaveUserRequest

//import actors.ModelActor.{GeneralObject, storeBrand, brands}
import actors.ModelActor.{brands, storeUser, stores, userBrand, users}
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



      val a = for {
        ((((user, _), brand), _), store) <- users outerJoin
          userBrand on (_.uuid === _.userId ) leftJoin
          brands on (_._2.brandId === _.uuid) outerJoin
          storeUser on (_._1._1.uuid === _.storeId) leftJoin
          stores on (_._2.storeId === _.uuid)
          if user.uuid === UUID.fromString("2bcfb184-c24c-420f-af62-0ca26a2f85bd")
      } yield (user, brand.uuid.?, brand.objectString.?, store.uuid.?, store.objectString.?)


      println(a.list)

      val query = for {
        ((((user, _), brand), _), store) <- users outerJoin
          userBrand on (_.uuid === _.userId ) leftJoin
          brands on (_._2.brandId === _.uuid) outerJoin
          storeUser on (_._1._1.uuid === _.storeId) leftJoin
          stores on (_._2.storeId === _.uuid)
      } yield (user, brand.uuid.?, brand.objectString.?, store.uuid.?, store.objectString.?)

      println(query.list)
    }
  }
}