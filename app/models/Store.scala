//package models
//
//import java.util.UUID
//
//import services.ModelsUtilities
//
//import scala.util.Try
//
//case class Store(UUID: UUID, store: String)
//
//object Store {
//  def save(store: Store): Try[Option[Long]] = {
//    ModelsUtilities.save("stores", store.UUID, store.store)
//  }
//}
//
//
