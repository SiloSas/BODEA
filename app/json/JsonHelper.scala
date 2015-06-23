package json

import java.util.UUID

import actors.ModelActor.GeneralObject
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
    def writes(UUID: UUID): JsString = JsString(UUID.toString)
  }

  implicit val objectWrites = Json.writes[GeneralObject]
}
