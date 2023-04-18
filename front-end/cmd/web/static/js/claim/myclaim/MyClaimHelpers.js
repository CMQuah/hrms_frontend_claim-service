class MyClaimHelpers {

    populateWarningMessage(notValid){
        let msg
        (notValid.length == 1) ? msg = `Sorry there is an error with this field <ul>` : 
                                 msg = `Sorry there is still few errors with those fields <ul>`

        notValid.forEach(field => {
            msg += `<li>${Common.replaceCamelCase(field)}</li>`
        })

        msg += `</ul>`

        return msg
    }

    // display main warning message
    displayWarningMessage(notValid){
        const myWarningDivID  = 'warningMessageDiv',
              myWarningBodyID = 'warningMessageBody'

        if (!notValid?.length) {
            Common.hideDivByID(myWarningDivID)
        }else{
            Common.showDivByID(myWarningDivID)
            Common.insertHTML(this.populateWarningMessage(notValid), myWarningBodyID)
        }
      
    }

    // populate form to edit entry
    populateFormEdit(data, active, rowID) {
        Common.insertHTML('Edit claim', 'createClaimDefinitionTitle')
        Common.insertInputValue('edit', 'formAction')
        Common.insertInputValue(rowID, 'rowid')
        Common.insertInputValue(data[0].innerHTML, 'name')
        Common.insertInputValue(data[1].innerHTML, 'description')
        Common.selectBoxOptionSelected(data[2].innerHTML, 'category')
        Common.checkRadio(data[3].innerHTML, 'confirmation')
        Common.insertInputValue(data[4].innerHTML, 'seniority')
        Common.checkRadio(active, 'active')
        Common.checkRadio(data[5].innerHTML, 'docRequired')
    }
    // populate and launch edit modal form
    makeEditable() {
        document.querySelectorAll('.editClaim').forEach(element => {
            element.addEventListener('click', (e) => {
                console.log(e.target);
                const rowID = e.target.dataset.id,
                    rowData = document.getElementById('CD' + rowID).querySelectorAll('.row-data'),
                    viewData = document.querySelector('#dataView').value
                Helpers.populateFormEdit(rowData, viewData, rowID)
                const myModalForm = new bootstrap.Modal(document.getElementById('createClaimDefinition'), {
                    keyboard: false
                })
                myModalForm.show()
            })
        })
    }

    // insert options into select tag
    insertOptions(id, data) {
        // remove first element (id=0; name='not defined')
        data.shift()
        const target = document.querySelector('#' + id)
        target.innerHTML = '<option selected hidden value=""></option>'
        data.forEach(element => {
            let opt = document.createElement('option')
            opt.value = element.ID
            opt.innerHTML = element.Name
            target.appendChild(opt)
        })
    }

    // insert Claim Definition options into select tag
    insertOptionsCD(id, data) {
        const target = document.querySelector('#' + id)
        target.innerHTML = '<option selected hidden value=""></option>'
        data.forEach(element => {
            let myID
            (typeof element.rowid == 'undefined') ? myID = 0 : myID = element.rowid
            let opt = document.createElement('option')
            opt.classList = 'myclaimDefinition'
            opt.id = 'myclaimDefinition' + myID
            opt.value = myID
            opt.innerHTML = element.name
            opt.dataset.details = JSON.stringify(element.details); //requires stringify else get object Object
            opt.dataset.docRequired = element.docRequired
            opt.dataset.limitation = element.limitation
            target.appendChild(opt)
        })
    }

    // populate upload files
    populateUploadFiles(wanted) {
        switch (wanted) {
            case 'docs':
                Common.insertHTML('Documentation', 'uploadedFilesTitle')
                Common.insertInputValue('Documentation', 'uploadedFilename')
                break;
            default:
                break;
        }
    }

    // add user information to connectedUser
    updateUserInformation(data) {
        connectedUser.code = data.Code
        connectedUser.fullname = data.Fullname
        connectedUser.nickname = data.Nickname
        connectedUser.joinDate = data.JoinDate
        connectedUser.confirmDate = data.ConfirmDate
    }

    // remove element from my required input fields array
    removeElementFromRIF(name) {
        const index = myRIF.indexOf(name);
        if (index > -1) { // splice array only when item is found
            myRIF.splice(index, 1); // 2nd parameter means remove one item only
        }
    }

    // show | hide category, name and upload doc from form
    // add | remove category, name from required list
    switchFormFieldsView() {
        //Upload documentation required or not
        if (document.getElementById('docRequired').value == 1) {
            Common.showDivByID('uploadDocDiv')
        } else {
            Common.hideDivByID('uploadDocDiv')
        }
    }
    // populate hidden field (form: confirmation | seniority | docRequired | limitation)
    populateHiddenFields(data) {
        Common.insertInputValue(data.details, 'details')
        Common.insertInputValue(data.docRequired, 'docRequired')

    }

    // convert birthdate (remove timestamp)
    formatDate(t) {
        let b
        // get only the 10 first characters of the string
        const d = t.substring(0, 10)
        // the zero value of a date is 0001-01-01
        return (d == '0001-01-01') ? b = '' : b = d
    }
    // insert to datatable one row per element of data
    insertRows(data) {
        const target = document.querySelector('#myClaimBody')
        target.innerHTML = ''
        data.forEach(element => {
            let opt = document.createElement('tr')
            opt.id = 'myClaim' + element.rowid
            opt.innerHTML = `<td class="row-data" data-id="${element.claimDefinitionID}">${element.claimDefinition}</td>
                             <td class="row-data">${element.description}</td>
                             <td class="row-data">${element.amount}</td>
                             <td class="row-data" data-id="${element.statusID}">${element.status}</td>
                             <td class="row-data">${this.formatDate(element.approvedAt)}</td>
                             <td class="row-data">${allEmployees.get(Number(element.approvedBy))}</td>
                             <td class="row-data">${element.approvedAmount}</td>
                             <td class="row-data">${element.approvedReason}</td>
                             <td>
                                <div class="d-flex justify-content-center">
                                    <div class="form-check">
                                        <input class="form-check-input deleteCheckboxes"  type="checkbox" value="${element.rowid}" name="softDelete">
                                        <label class="form-check-label fw-lighter fst-italic smaller" for="softDelete"><i class="bi-trash2-fill largeIcon pointer deleteClaim"></i></label>
                                    </div>
                                    <div class="form-check">
                                        <label class="form-check-label fw-lighter fst-italic smaller"><i class="bi-pencil-fill largeIcon pointer editClaim" data-id=${element.rowid}></i></label>
                                    </div>
                                </div>                                                            
                            </td>`
            target.appendChild(opt)
        })
        $('#myClaimTable').DataTable()
    }

    // returns list of selected claim id to be deleted
    selectedClaim() {
        const checked = document.querySelectorAll('input[name=softDelete]:checked')
        if (checked.length == 0) document.querySelector('#deleteWarningMessageDiv').style.display = 'block'
        if (checked.length > 0) {
            let allChecked = []
            checked.forEach(element => {
                allChecked.push(element.value)
            })
            console.log('allChecked: ' + allChecked);
            return allChecked
        }
    }
    // populate confirm detele message
    populateConfirmDelete(nb) {
        let msg
        (nb == 1) ? msg = 'Do you really want to delete this claim?' : msg = `Do you really want to delete ${nb} claims?`

        const myBody = document.querySelector('#confirmDeleteBody')
        myBody.innerHTML = msg
    }
    validateApplication(myData) {
        connectedUser.joinDate = new Date(connectedUser.joinDate)
        let details = document.querySelector('#details').value
        // let docRequired = document.querySelector('#docRequired').value //TODO: Need help on this
        let limitationToCheck
        let detailObj = JSON.parse(details)
        let myDataObj = JSON.parse(myData)
        //iterate through the details array object and get the limitation and seniority
        for (let i = 0; i < detailObj.length; i++) {
            // get the seniority and check whether it's within the seniority or not
            if (this.getYearDifference(connectedUser.joinDate) >= detailObj[i].seniority) {
                limitationToCheck = detailObj[i].limitation
                break //beware of gotcha where it only breaks inner loop.... Lookout if in the future it's a nested for loop 
            }
        }
        let errAmount = myDataObj.amount> limitationToCheck ? 1:0
        return {'errAmount':errAmount, errDocRequired:0} //need help with doc uploaded

    }

    //Calculate the difference in months
    getMonthDifference(date) {
        var currentDate = new Date(Date.now());
        var yearDiff = currentDate.getFullYear() - date.getFullYear();
        var monthDiff = currentDate.getMonth() - date.getMonth();
        var dayDiff = currentDate.getDate() - date.getDate();

        // Check for cases where dayDiff may result in a negative value
        if (dayDiff < 0) {
            monthDiff--;
        }

        // Add the year difference to the month difference
        monthDiff += yearDiff * 12;

        return monthDiff;
    }
    //Calculate the difference in years
    getYearDifference(date) {
        var monthDiff = this.getMonthDifference(date);
        var yearDiff = Math.floor(monthDiff / 12);
        return yearDiff;
    }

}