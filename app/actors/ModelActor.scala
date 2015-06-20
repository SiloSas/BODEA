package actors

import java.util.UUID
import akka.actor._
import services.{ModelsUtilities, ObjectRequest}

import scala.language.postfixOps
import scala.util.{Failure, Success}

object ModelActor {
  def props = Props[ModelActor]
}

class ModelActor extends Actor {
  def receive = {
    case ObjectRequest(table, uuid, objectString) =>
      ModelsUtilities.save(ObjectRequest(table, uuid, objectString)) match {
        case Success(Some(index)) => sender ! "success"
        case Success(None) => sender ! "failure: user has not been created"
        case Failure(failure) => sender ! "failure: " + failure
      }
    case _ => sender ! "unknown request"
  }
}