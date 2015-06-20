package models

case class Artist (artistId: Option[Long],
                   facebookId: Option[String],
                   name: String,
                   imagePath: Option[String] = None,
                   description: Option[String] = None,
                   facebookUrl: String,
                   websites: Set[String] = Set.empty,
                   likes: Option[Int] = None,
                   country: Option[String] = None)

object Artist {
//  private val ArtistParser: RowParser[Artist] = {
//    get[Long]("artistId") ~
//      get[Option[String]]("facebookId") ~
//      get[String]("name") ~
//      get[Option[String]]("imagePath") ~
//      get[Option[String]]("description") ~
//      get[String]("facebookUrl") ~
//      get[Option[String]]("websites") ~
//      get[Option[Int]]("likes") ~
//      get[Option[String]]("country") map {
//      case artistId ~ facebookId ~ name ~ imagePath ~ description ~ facebookUrl ~ websites ~ likes ~ country =>
//        Artist(Option(artistId), facebookId, name, imagePath, description, facebookUrl,
//          Utilities.optionStringToSet(websites), Seq.empty, Seq.empty, likes, country)
//    }
//  }
//
//  def formApply(facebookId: Option[String], name: String, imagePath: Option[String], description: Option[String],
//                facebookUrl: String, websites: Seq[String], genres: Seq[Genre], tracks: Seq[Track], likes: Option[Int],
//                country: Option[String]): Artist =
//    Artist(None, facebookId, name, imagePath, description, facebookUrl, websites.toSet, genres, tracks, likes, country)
//  def formUnapply(artist: Artist) =
//    Option((artist.facebookId, artist.name, artist.imagePath, artist.description, artist.facebookUrl,
//      artist.websites.toSeq, artist.genres, artist.tracks, artist.likes, artist.country))
//
//  def findAll: Seq[Artist] = try {
//    DB.withConnection { implicit connection =>
//      SQL("SELECT * FROM artists")
//        .as(ArtistParser.*)
//    }
//  } catch {
//    case e: Exception => throw new DAOException("Artist.findAll: " + e.getMessage)
//  }
}
