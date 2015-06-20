package actors

import java.util.UUID

import actors.StoreActor.SaveStoreRequest
import actors.UserActor.SaveUserRequest
import akka.actor._
import models.{Store, User}

import scala.language.postfixOps
import scala.util.{Failure, Success}

object StoreActor {
  def props = Props[StoreActor]
  case class SaveStoreRequest(UUID: String, store: String)
}

class StoreActor extends Actor {
  def receive = {
    case SaveStoreRequest(uuid, store) =>
      try {
        Store.save(Store(UUID.fromString(uuid), store)) match {
          case Success(Some(index)) => sender ! "success"
          case Success(None) => sender ! "failure: user has not been created"
          case Failure(failure) => sender ! "failure: " + failure
        }
      } catch {
        case wrongUUID: Exception => sender ! "failure " + wrongUUID.getMessage
      }
    case _ => sender ! "unknown request"
  }
}