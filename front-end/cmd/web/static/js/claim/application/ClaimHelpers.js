class ClaimHelpers {
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

    // convert birthdate (remove timestamp)
    formatDate(t) {
        let b
        // get only the 10 first characters of the string
        const d = t.substring(0, 10)
        // the zero value of a date is 0001-01-01
        return (d == '0001-01-01') ? b = '' : b = d
    }


    // insert to datatable one row per element of data
    insertRows(data, action = true) {
        $('#myClaimTable').DataTable().destroy()
        const target = document.querySelector('#myClaimBody')
        target.innerHTML = ''
        if (data != null) {
            data.forEach(element => {
                let opt = document.createElement('tr')
                opt.id = 'myClaim' + element.rowid
                //Not very elegent way but added data-value to both td and button
                if (action) {
                    Common.showDivByID('approveBtn')
                    Common.showDivByID('rejectBtn')
                    opt.innerHTML = `<td class="row-data">${allEmployees.get(Number(element.employeeid))}</td>
                                <td class="row-data" data-id="${element.claimDefinitionID}">${element.claimDefinition}</td>
                                <td class="row-data" data-id="${element.categoryID}">${element.category}</td>
                                <td class="row-data">${element.description}</td>
                                <td class="row-data">${element.amount}</td>
                                <td class="row-data" data-id="${element.statusID}">${element.status}</td>
                                <td class="row-data">${this.formatDate(element.approvedAt)}</td>
                                <td class="row-data">${allEmployees.get(Number(element.approvedBy))}</td>
                                <td class="row-data">${element.approvedAmount}</td>`
                    opt.innerHTML += (element.claimDefinitionDocRequired) ?
                        `<td class="row-data claimAttachGet" data-value="${allEmpEmails.get(Number(element.employeeid))}/${element.rowid}">
                                    <span data-bs-toggle="modal" data-bs-target="#uploadedClaimAttachment">
                                        <i class="bi-folder-check largeIcon pointer" data-bs-toggle="tooltip" data-bs-placement="top" title="Latest files"
                                        data-value="${allEmpEmails.get(Number(element.employeeid))}/${element.rowid}">
                                        </i>
                                    </span>
                                </td>`:
                        `<td class="row-data"></td>`

                    opt.innerHTML += `<td class="row-data">${element.rejectedReason}</td>
                                <td>
                                    <div class="d-flex justify-content-between">
                                        <div class="form-check">
                                            <label class="form-check-label" for="claims"><i class="bi-person-check-fill largeIcon"></i></label>
                                            <input class="form-check-input claimsCheckboxes"  type="checkbox" value="${element.rowid}" name="claims">
                                        </div>
                                    </div>                                                            
                                </td>`
                } else {
                    Common.hideDivByID('approveBtn')
                    Common.hideDivByID('rejectBtn')
                    opt.innerHTML = `<td class="row-data">${allEmployees.get(Number(element.employeeid))}</td>
                                <td class="row-data" data-id="${element.claimDefinitionID}">${element.claimDefinition}</td>
                                <td class="row-data" data-id="${element.categoryID}">${element.category}</td>
                                <td class="row-data">${element.description}</td>
                                <td class="row-data">${element.amount}</td>
                                <td class="row-data" data-id="${element.statusID}">${element.status}</td>
                                <td class="row-data">${this.formatDate(element.approvedAt)}</td>
                                <td class="row-data">${allEmployees.get(Number(element.approvedBy))}</td>
                                <td class="row-data">${element.approvedAmount}</td>`
                    opt.innerHTML += (element.claimDefinitionDocRequired) ?
                        `<td class="row-data claimAttachGet" data-value="${allEmpEmails.get(Number(element.employeeid))}/${element.rowid}">
                                    <span data-bs-toggle="modal" data-bs-target="#uploadedClaimAttachment">
                                        <i class="bi-folder-check largeIcon pointer claimAttachGet" data-bs-toggle="tooltip" data-bs-placement="top" title="Latest files"
                                        data-value="${allEmpEmails.get(Number(element.employeeid))}/${element.rowid}">
                                        </i>
                                    </span>
                                </td>`:
                        `<td class="row-data"></td>`

                    opt.innerHTML += `<td class="row-data">${element.rejectedReason}</td>
                                <td><i class="bi-lock"></i></td>`
                }
                target.appendChild(opt)
            })
            $('#myClaimTable').DataTable()
        } else {
            $('#myClaimTable').DataTable()
            $('#myClaimTable').DataTable().clear().draw()
        }
        document.querySelectorAll('.claimAttachGet').forEach(element => {
            element.addEventListener('click', (e) => {
                window.currentUploadInfo = e.target.dataset.value;
            })
        })
    }

    // populate uploaded files
    populateUploadedFiles(data, emailAndClaimID) {
        let email = emailAndClaimID.split('/')[0]
        let claimID = emailAndClaimID.split('/')[1]
        if (data.Files.claimDoc != null && data.Files.claimDoc.length > 0) {
            this.insertAttachments(data.Files.claimDoc, email, 'uploadedClaimAttachmentBody', 'claimDoc', claimID)
        }
        // if (data.Archive.ic != null && Object.keys(data.Archive.ic).length > 0) {
        //     this.insertArchiveAttachments(data.Archive.ic, email, 'uploadedClaimAttachmentBody', 'archive/ic', data.ClaimID)
        // }
    }

    // create attachment download link
    insertAttachments(data, email, id, category, claimID) {
        const target = document.querySelector('#' + id)
        target.innerHTML = ''

        data.forEach(element => {
            let row = document.createElement('div')
            row.classList = 'd-flex justify-content-center mb-3'
            row.innerHTML = `<div>
                                    <div><img class="myPicture" src="/upload/${email}/${category}/claims/${element}" /></div>
                                    <div class="text-end"><a href="/upload/${email}/${category}/claims/${element}" class="myLink" download="${element}"><i class="bi-download pointer"></i> download</a></div>
                                 </div>`
            target.appendChild(row)
        })

    }


    // returns list of selected claim id to be deleted
    selectedClaim() {
        const checked = document.querySelectorAll('input[name=claims]:checked')
        if (checked.length == 0) document.querySelector('#modalWarningMessageDiv').style.display = 'block'
        if (checked.length > 0) {
            let allChecked = []
            checked.forEach(element => {
                allChecked.push(element.value)
            })
            return allChecked
        }
    }
    // populate confirm detele message
    populateSelectedClaimsNumber(nb, id, action, verb) {
        let msg

        (nb == 1) ? msg = `You're about to ${action} one claim with this ${verb}:` : msg = `You're about to ${action} ${nb} claims with this ${verb}:`

        const myBody = document.querySelector('#' + id)
        myBody.innerHTML = msg
    }
}