package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

// forward the get request from the front-end to employee-service to fetch all config tables
func AllClaimDefinition(w http.ResponseWriter, r *http.Request) {

	// send get request to employee-service and collect the response
	url := claimService + "api/v1/claim/definition/get/all"
	log.Println("the err in all claim definition Before")

	resp, err := http.Get(url)
	if err != nil {
		log.Println("the err in all claim definition", err)
		errorJSON(w, err)
		return
	}
	defer resp.Body.Close()

	// decode employee-service response
	var answer jsonResponse
	log.Println("Before decoding response")
	dec := json.NewDecoder(resp.Body)
	log.Println("Initialize decoding response")

	err = dec.Decode(&answer)
	log.Println("After decoding response")
	if err != nil {
		log.Println("the err in all claim definition decoding response", err)
		errorJSON(w, err)
		return
	}

	log.Println("Send response")
	// send response to front-end
	writeJSON(w, http.StatusAccepted, answer)
}
