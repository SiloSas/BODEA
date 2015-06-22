package controllers

import play.api.Logger

case class DAOException(message: String) extends Exception(message) {
  Logger.error("DAOException: " + message)
}




















