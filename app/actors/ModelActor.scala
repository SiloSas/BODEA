package actors

import java.util.UUID
import akka.actor._
import services.{ObjectToGetRequest, ModelsUtilities, ObjectToSaveRequest}

import scala.language.postfixOps
import scala.util.{Try, Failure, Success}

object ModelActor {
  def props = Props[ModelActor]
}
class ModelActor extends Actor {
  def receive = {
    case ObjectToSaveRequest(table, uuid, objectString) =>
      ModelsUtilities.save(ObjectToSaveRequest(table, uuid, objectString)) match {
        case Success(Some(index)) => sender ! "success"
        case Success(None) => sender ! "failure: user has not been created"
        case Failure(failure) => sender ! "failure: " + failure
      }

    case ObjectToGetRequest(table, uuid) =>
      ModelsUtilities.getObject(ObjectToGetRequest(table, uuid)) match {
        case Success(objects) => sender ! Success(objects)
        case failure => sender ! failure
      }

    case _ => sender ! "unknown request"
  }
}