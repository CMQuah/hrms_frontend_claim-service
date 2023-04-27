package handlers

import (
	"log"
	"net/http"
	"path/filepath"
	"strings"
)

// API which fetchs and returns all uploaded files of one employee
func (rep *Repository) GetUploadedClaimFiles(w http.ResponseWriter, r *http.Request) {

	// Get my context from middleware request
	myc := r.Context().Value(httpContext).(httpContextStruct)

	if myc.Auth {
		// get employee email from url

		emailAndClaimID := strings.TrimPrefix(r.URL.Path, "/api/v1/claim/getUploadedFiles/")
		// split the email and claim id because the path is /upload/email/claims/claimID
		emailAndClaimIDSplit := strings.Split(emailAndClaimID, "/")
		log.Println(r.URL.Path, "data", emailAndClaimID)

		// example: /api/v1/claim/getUploadedFiles/randomPerson@thundersoft.com/47
		email := emailAndClaimIDSplit[0]
		claimID := emailAndClaimIDSplit[1]

		// get all employee's uploaded files
		myFiles, err := myUploadedClaimFiles(email, claimID)
		if err != nil {
			rep.errorJSON(w, err)
			return
		}

		// response to be sent
		answer := jsonResponse{
			Error:   false,
			Message: "employee's uploaded files'",
			Data:    myFiles,
		}
		rep.writeJSON(w, http.StatusAccepted, answer)
	}
}

// collect all employee's uploaded files from one employee (email)
func myUploadedClaimFiles(email string, claimID string) (*uploadedFiles, error) {
	// collect active IC files
	activeClaimDoc, err := filesInDirectory(filepath.Join(path, email, "claims", claimID))
	if err != nil {
		return nil, err
	}

	// collect archive claim doc files (per timestamp directory)
	myArchiveDirClaimDoc, err := filesInDirectory(filepath.Join(path, email, "archive", "claims", claimID))
	if err != nil {
		return nil, err
	}
	myArchiveClaimFiles := map[string][]string{}
	if len(myArchiveDirClaimDoc) > 0 {
		for _, dir := range myArchiveDirClaimDoc {
			myArchiveClaimFiles[dir], err = filesInDirectory(filepath.Join(path, email, "archive", "claims", claimID, dir))
			if err != nil {
				return nil, err
			}
		}
	}

	myFiles := map[string][]string{}
	myFiles["claimDoc"] = activeClaimDoc

	myArchive := map[string]map[string][]string{}
	myArchive["claimDoc"] = myArchiveClaimFiles

	myUploadedFiles := uploadedFiles{
		Files:   myFiles,
		Archive: myArchive,
	}

	return &myUploadedFiles, nil
}
