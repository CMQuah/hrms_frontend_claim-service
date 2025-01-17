package handlers

import (
	"log"
	"net/http"
)

// receives a get request from broker to fetch all employee info
func (rep *Repository) GetByEmail(w http.ResponseWriter, r *http.Request) {
	// extract employee id from request
	var email string
	err := rep.readJSON(w, r, &email)
	if err != nil {
		log.Println("err json")
		log.Println(err)
		rep.errorJSON(w, err)
		return
	}

	all, err := rep.App.Models.Employee.GetEmployeeInfoByEmail(email)
	if err != nil {
		log.Println("err all")
		log.Println(err)
		rep.errorJSON(w, err)
		return
	}

	log.Println("all")
	log.Println(all)

	// response to be sent
	answer := jsonResponse{
		Error:   false,
		Message: "employee summary successfully fetched",
		Data:    all,
	}

	rep.writeJSON(w, http.StatusAccepted, answer)

}
