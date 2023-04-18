package handlers

import (
	"log"
	"net/http"
)

// GetAllClaimDefinition is the handler which returns all claim definition
func (rep *Repository) GetAllClaimDefinition(w http.ResponseWriter, r *http.Request) {
	// get claim definition (active, inactive, deleted)
	all, err := rep.App.Models.ClaimDefinition.GetClaimDefinition()

	if err != nil {
		log.Println("the err in api all claim definition", err)
		rep.errorJSON(w, err)
		return
	}

	// response to be sent
	answer := jsonResponse{
		Error:   false,
		Message: "claim definition successfully fetched",
		Data:    all,
	}

	log.Println("data", all.Active[0].Name)
	rep.writeJSON(w, http.StatusAccepted, answer)

}
