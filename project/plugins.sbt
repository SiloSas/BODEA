logLevel := Level.Warn

resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

resolvers += "sonatype-releases" at "https://oss.sonatype.org/content/repositories/releases/"

resolvers += Classpaths.sbtPluginReleases

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2.6")

addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.1.0")

addSbtPlugin("org.scoverage" % "sbt-coveralls" % "1.0.0")

addSbtPlugin("org.brianmckenna" % "sbt-wartremover" % "0.11")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "0.6.0")

addSbtPlugin("com.timushev.sbt" % "sbt-updates" % "0.1.8")