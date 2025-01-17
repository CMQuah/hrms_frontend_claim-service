package main

import (
	"claim/pkg/config"
	"claim/pkg/handlers"
	"claim/pkg/pg"
	"claim/pkg/web"
	"log"
	"time"

	_ "time/tzdata"
)

const webPort = "8883"

func main() {
	// Customize log display
	setLog()

	// Set time zone
	tz, err := time.LoadLocation("Asia/Kuala_Lumpur")
	if err != nil {
		log.Println("error while setting the time zone: ", err)
	}
	// this is setting the global timezone
	time.Local = tz

	// connect to DB
	conn := pg.ConnectToDB()
	if conn == nil {
		log.Fatalf("can't connect to Postgres!")
	}

	// app holds our application configuration
	app := config.AppConfig{
		DB:     conn,
		Models: pg.New(conn),
	}

	// set the config for the handlers package
	repo := handlers.NewRepo(&app)
	handlers.NewHandlers(repo)

	// Start web server
	if err := web.Run(multiplexer(), webPort); err != nil {
		log.Fatalf(err.Error())
	}
}
