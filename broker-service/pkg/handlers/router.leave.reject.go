package handlers

import (
	"encoding/json"
	"net/http"
)

// forward the post request from the front-end to leave-service to reject a leave application
func RejectLeave(w http.ResponseWriter, r *http.Request) {
	// send post request to leave-service and collect the response
	url := leaveService + "api/v1/leave/reject"
	resp, err := http.Post(url, "application/json", r.Body)
	if err != nil {
		errorJSON(w, err)
		return
	}
	defer resp.Body.Close()

	// decode leave-service response
	var answer jsonResponse
	dec := json.NewDecoder(resp.Body)
	err = dec.Decode(&answer)
	if err != nil || answer.Error {
		errorJSON(w, err)
		return
	}

	// log to leave-service collection
	l := rpcPayload{
		Collection: "leave",
		Name:       "rejection",
		// Data:       fmt.Sprintf("new entry successfully created for table %s with id %d", ct.Table, ct.RowID),
		Data:      "leave successfully reject",
		CreatedAt: answer.CreatedAt,
		CreatedBy: answer.CreatedBy,
	}
	LogItemViaRPC(l)

	// send response to front-end
	writeJSON(w, http.StatusAccepted, answer)
}
