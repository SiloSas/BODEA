package json

import java.util.UUID

import actors.ModelActor._
import actors.UserActor.User
import play.api.libs.json.{JsNumber, _}

object JsonHelper {
  implicit object JavaBigDecimalWrites extends AnyRef with Writes[java.math.BigDecimal] {
    def writes(bigDecimal: java.math.BigDecimal): JsNumber = JsNumber(BigDecimal(bigDecimal))
  }

  implicit object FloatWrites extends AnyRef with Writes[Float] {
    def writes(float: Float): JsNumber = JsNumber(BigDecimal(float))
  }

  implicit object CharWrites extends AnyRef with Writes[Char] {
    def writes(char: Char): JsString = JsString(char.toString)
  }

  implicit object UUIDWrites extends AnyRef with Writes[UUID] {
    def writes(uuid: UUID): JsString = JsString(uuid.toString)
  }

//  implicit object UUIDReads extends AnyRef with Reads[UUID] {
//    def reads(uuid: JsString): UUID = UUID.fromString(uuid.toString())
//  }

//  implicit object UUIDFormatter extends Format[UUID] {
//    def reads(s: JsString): UUID = java.util.UUID.fromString(s.toString())
//  }
  implicit val objectWrites = Json.writes[GeneralObject]
//  implicit val objectReads = Json.reads[GeneralObject]
  implicit val maybeObjectWrites = Json.writes[MaybeGeneralObject]
  implicit val userWrites = Json.writes[User]

  implicit val relationWrites = Json.writes[Relation]
  implicit val maybeRelationWrites = Json.writes[MaybeRelation]
//  implicit val relationReads = Json.reads[Relation]
//  implicit val relationsWrites = Json.writes[Relations]

  implicit val objectWithRelationsWrites = Json.writes[GeneralObjectWithRelations]
//  implicit val objectWithRelationsReads = Json.reads[GeneralObjectWithRelations]

//  object ModelReturnType {
//    def unapply(foo: ModelReturnType): Option[(String, JsValue)] = {
//      val (prod: Product, sub) = foo match {
//        case b: GeneralObject => (b, Json.toJson(b)(Json.writes[GeneralObject]))
//        case b: GeneralObjectWithRelations => (b, Json.toJson(b)(Json.writes[GeneralObjectWithRelations]))
//      }
//      Some(prod.productPrefix -> sub)
//    }
//
//    def apply(`class`: String, data: JsValue): ModelReturnType = {
//      (`class` match {
//        case "GeneralObjectWithRelations" => Json.fromJson[GeneralObjectWithRelations](data)(Json.reads[GeneralObjectWithRelations])
//      }).get
//    }
//  }
//
//
//  implicit val modelReturnTypeWrites: Writes[ModelReturnType] = Json.writes[ModelReturnType]
}
