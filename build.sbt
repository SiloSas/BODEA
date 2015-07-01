name := "Bodea"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  "postgresql" % "postgresql" % "9.1-901-1.jdbc4",
  "org.scalatestplus" %% "play" % "1.0.0" % "test",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "com.typesafe.slick" %% "slick" % "2.0.0",
  "org.slf4j" % "slf4j-nop" % "1.6.4",
  "com.typesafe.play" %% "play-slick" % "0.6.1",
  "com.typesafe" %% "play-plugins-mailer" % "2.1-RC2"
)

scalacOptions ++= Seq("-feature", "-unchecked", "Xfatal-warnings", "-Xlint", "-Yno-adapted-args")

play.Project.playScalaSettings
