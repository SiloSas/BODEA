package services

import java.sql.Connection
import java.text.Normalizer
import java.util.{UUID, Date}
import anorm.SqlParser._
import anorm._
import controllers.DAOException
import models._
import play.api.db.DB
import play.api.libs.json.JsNumber
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.Play.current

import scala.collection.mutable.ListBuffer
import scala.util.matching.Regex

object Utilities {
  val linkPattern = """((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-z@A-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)""".r

  val geographicPointPattern = """(\(-?\d+\.?\d*,-?\d+\.?\d*\))""".r

  val UNIQUE_VIOLATION = "23505"
  val FOREIGN_KEY_VIOLATION = "23503"

  case class GeographicPoint(geoPoint: String) {
    require(geographicPointPattern.pattern.matcher(geoPoint).matches, "Invalid geographicPoint")
    override def toString() = geoPoint
  }

  implicit def geographicPointToString: Column[String] = Column.nonNull { (value, meta) =>
    val MetaDataItem(qualified, nullable, clazz) = meta
    value match {
      case d: Any => Right(d.toString)
      case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" + value.asInstanceOf[AnyRef].getClass +
        " to String for column " + qualified) )
    }
  }

  implicit def rowToUUID: Column[UUID] = {
    Column.nonNull[UUID] { (value, meta) =>
      value match {
        case v: UUID => Right(v)
        case _ => Left(TypeDoesNotMatch(s"Cannot convert $value:${value.asInstanceOf[AnyRef].getClass} to UUID for column ${meta.column}"))
      }
    }
  }

  implicit def columnToChar: Column[Char] = Column[Char](transformer = { (value, meta) =>
    val MetaDataItem(qualified, nullable, clazz) = meta
    value match {
      case ch: String => Right(ch.head)
      case _ => Left(TypeDoesNotMatch("Cannot convert " + value + " to Char for column " + qualified))
    }
  })

  def normalizeString(string: String): String = string //Should be replace accentued letters for example?

  def replaceAccentuatedLetters(string: String): String =
    Normalizer.normalize(string, Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "")

  def stripChars(s:String, ch:String)= s filterNot (ch contains _)

  def normalizeUrl(website: String): String =
    """(https?:\/\/(www\.)?)|(www\.)""".r.replaceAllIn(website.toLowerCase, p => "").stripSuffix("/")

  def removeSpecialCharacters(string: String): String = string.replaceAll("""[*ù$-+/*_\.\\,#'~´&]""", "")

  def testIfExist(table: String, fieldName: String, valueAnyType: Any)(implicit connection: Connection): Boolean = {
    val value = valueAnyType match {
      case Some(v: Int) => v
      case Some(v: String) => v
      case v: Int => v
      case v: String => v
      case _ => None
    }
    try {
      DB.withConnection { implicit connection =>
        SQL(s"""SELECT exists(SELECT 1 FROM $table where $fieldName = {value} LIMIT 1)""")
          .on("value" -> value)
          .as(scalar[Boolean].single)
      }
    } catch {
      case e: Exception => throw new DAOException("Utilities.testIfExistById: " + e.getMessage)
    }
  }

  def getNormalizedWebsitesInText(maybeDescription: Option[String]): Set[String] = maybeDescription match {
    case None =>
      Set.empty
    case Some(description) =>
      linkPattern.findAllIn(description).toSet.map { normalizeUrl }
  }

  def phoneNumbersStringToSet(phoneNumbers: Option[String]): Set[String] = phoneNumbers match {
    case None => Set.empty
    case Some(phoneNumbersValue: String) =>
      def normalizePhoneNumberPrefix(phoneNumber: String): String = phoneNumber match {
        case phoneNumberStartsWith0033 if phoneNumberStartsWith0033.startsWith("0033") =>
          "0" + phoneNumber.drop(4)
        case phoneNumberStartsWith0033 if phoneNumberStartsWith0033.startsWith("+0033") =>
          "0" + phoneNumber.drop(5)
        case phoneNumberStartsWith33 if phoneNumberStartsWith33.startsWith("33") =>
          "0" + phoneNumber.drop(2)
        case phoneNumberStartsWithPlus33 if phoneNumberStartsWithPlus33.startsWith("+33") =>
          "0" + phoneNumber.drop(3)
        case alreadyNormalized: String => alreadyNormalized
      }

      var numberWithoutLetters = phoneNumbersValue.replaceAll("[^0-9+]", "")
      var normalizedNumbers = ListBuffer.empty[String]

      while (numberWithoutLetters.length >= 10) {
        val withNormalizedPrefix = normalizePhoneNumberPrefix(numberWithoutLetters)
        normalizedNumbers += withNormalizedPrefix.take(10)
        numberWithoutLetters = withNormalizedPrefix.drop(10)
      }
      normalizedNumbers.toSet
  }

  def phoneNumbersSetToOptionString(phoneNumbers: Set[String]): Option[String] = phoneNumbers match {
    case emptySet: Set[String] if emptySet.isEmpty => None
    case phoneNumbersFound => Option(phoneNumbersFound.mkString(","))
  }

  def formatDate(date: Option[String]): Option[Date] = date match {
    case Some(dateFound: String) => val date = dateFound.replace("T", " ")
      date.length match {
        case i if i <= 10 => Option(new java.text.SimpleDateFormat("yyyy-MM-dd").parse(date))
        case i if i <= 13 => Option(new java.text.SimpleDateFormat("yyyy-MM-dd HH").parse(date))
        case _ => Option(new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm").parse(date))
      }
    case _ => None
  }

  def refactorEventOrPlaceName(eventName: String): String = {
    eventName.indexOf(" @") match {
      case -1 => eventName
      case index => eventName.take(index).trim
    }
  }

  def setToOptionString(set: Set[String]): Option[String] =
    if (set.isEmpty) None else Option(set.mkString(","))

  def optionStringToSet(maybeString: Option[String]): Set[String] =
    if (maybeString.isEmpty) Set.empty else maybeString.get.split(",").toSet
}
