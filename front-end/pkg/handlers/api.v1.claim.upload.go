package handlers

import (
	"errors"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// API which upload to file server all posted files for one employee
// if files already exists, it archives them to file server
func (rep *Repository) UploadFilesClaim(w http.ResponseWriter, r *http.Request) {
	// Get my context from middleware request

	log.Println("I am here before", r)
	myc := r.Context().Value(httpContext).(httpContextStruct)

	if myc.Auth {
		log.Println("I am here")
		// collect information from payload
		a, err := extractClaimAttachmentsInfo(r)
		if err != nil {
			log.Println("error", err)
			rep.errorJSON(w, err)
			return
		}

		// create email/category directory
		fullpath := filepath.Join(path, a.Email, a.Filename)
		log.Println("fullpath: ", fullpath)
		err = createNewFolder(fullpath)
		if err != nil {
			log.Println("error", err)
			rep.errorJSON(w, err)
			return
		}

		// check if directory already got uploaded files
		empty, err := isEmpty(fullpath)
		if err != nil {
			log.Println("error", err)
			rep.errorJSON(w, err)
			return
		}

		// archive files when directory is not empty
		if !empty {
			err = archiveClaimFiles(a.Email, a.Filename)
			if err != nil {
				log.Println("error", err)
				rep.errorJSON(w, err)
				return
			}
		}

		// upload files to directory
		err = claimFilesUploader(a.Files, a.Email, a.Filename)
		if err != nil {
			log.Println("error", err)
			rep.errorJSON(w, err)
			return
		}

		// redirect (TODO write response as API)
		// http.Redirect(w, r, frontEnd+"myclaim/"+a.ID, http.StatusSeeOther)
		var resp = jsonResponse{
			Error:   false,
			Message: "Attachment uploaded",
		}

		//response to be send back
		rep.writeJSON(w, http.StatusAccepted, resp)
	}
}

// move create a dir with appId under upload/{email}/ClaimDoc/ claimAppId and move all files from upload/{email}/ClaimDoc/ to upload/{email}/ClaimDoc/claimAppId
func (rep *Repository) MoveFilesClaim(w http.ResponseWriter, r *http.Request) {
	// Get my context from middleware request
	myc := r.Context().Value(httpContext).(httpContextStruct)
	if myc.Auth {
		// collect information from payload
		a, err := extractClaimAttachmentsInfo(r)
		if err != nil {
			rep.errorJSON(w, err)
			return
		}

		//get URL and last part of URL // filePath base as quick hack
		claimAppId := filepath.Base(r.URL.String())
		log.Println("claimAppId is : ", claimAppId)

		// Get fullPath with claimAppId and create the dir
		fullpath := filepath.Join(path, a.Email, a.Filename, claimAppId)
		log.Println("fullpath: ", fullpath)
		err = createNewFolder(fullpath)
		if err != nil {
			rep.errorJSON(w, err)
			return
		}

		//remove claimAppId from fullPath
		docPath := filepath.Join(path, a.Email, a.Filename)
		//get all files starting with bmp, jpg, png, pdf using glob
		files, err := filepath.Glob(docPath + "/*.{bmp,jpg,png,pdf}")
		if err != nil {
			log.Println("Error while getting files from dir: ", err)
			rep.errorJSON(w, err)
			return
		}
		// move all files to fullpath
		for _, file := range files {
			err = os.Rename(file, fullpath+"/"+filepath.Base(file))
			if err != nil {
				log.Println("Error while moving files: ", err)
				rep.errorJSON(w, err)
				return
			}
		}

	}
}

// extract form data from payload
func extractClaimAttachmentsInfo(r *http.Request) (*attachments, error) {
	var files []*multipart.FileHeader
	// check if request is multipart if not it's for moving files to the right dir
	if strings.Contains(r.Header.Get("Content-Type"), "multipart/form-data") {
		// Parse our multipart form, 10 << 20 specifies a maximum upload of 10 MB files.
		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			return nil, err
		}
		// read the Form data
		formdata := r.MultipartForm
		files = formdata.File["attachments[]"]
	}

	filename := r.FormValue("uploadedFilename")
	email := r.FormValue("employeeEmail")
	ID := r.FormValue("employeeID")

	// populate attachment's members
	a := attachments{
		Files:    files,
		Filename: filename,
		Email:    email,
		ID:       ID,
	}

	log.Println("attachment info", a)

	return &a, nil
}

// archive files
func archiveClaimFiles(email, filename string) error {
	// create archive folder (upload/email/archive/category/timestamp)
	now := myTimestamp()
	archive := filepath.Join(path, email, "archive", filename, now)
	err := createNewFolder(archive)
	if err != nil {
		return err
	}

	// select all files from actual directory
	actual := filepath.Join(path, email, filename)
	entries, err := os.ReadDir(actual)
	if err != nil {
		return err
	}

	// move all files to archive folder
	for _, e := range entries {
		err = os.Rename(filepath.Join(actual, e.Name()), filepath.Join(archive, e.Name()))
		if err != nil {
			return err
		}
	}

	return nil
}

// upload files to server
func claimFilesUploader(files []*multipart.FileHeader, email, filename string) error {
	// loop through the files one by one
	for i, f := range files {
		// store file number
		number := strconv.Itoa(i)

		// store uploaded file
		file, err := files[i].Open()
		if err != nil {
			return err
		}
		defer file.Close()

		// store authorized uploaded file extension
		ext := getClaimExtension(f.Header.Values("Content-Type")[0])
		if ext == "lock" {
			return errors.New("unauthorized file extension")
		}

		// rename filename (must give full path with file extension)
		myFile := filename + number + "." + ext
		fullpath := filepath.Join(path, email, "claims", myFile)

		// create new empty file
		out, err := os.Create(fullpath)
		if err != nil {
			return err
		}
		defer out.Close()

		// copy stored uploaded file to new empty file
		_, err = io.Copy(out, file) // file not files[i] !
		if err != nil {
			return err
		}

	}

	return nil
}

// get extension of file content type header
// We accept only "jpg", "gif", "png", "bmp", "pdf"
func getClaimExtension(ct string) (fileext string) {
	switch ct {
	case "image/jpeg", "image/jpg":
		fileext = "jpg"

	case "image/gif":
		fileext = "gif"

	case "image/bmp":
		fileext = "bmp"

	case "image/png":
		fileext = "png"

	case "application/pdf":
		fileext = "pdf"

	default:
		fileext = "lock"
	}

	return
}
