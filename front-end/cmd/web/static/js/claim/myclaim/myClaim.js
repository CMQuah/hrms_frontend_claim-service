const Common = new MainHelpers(),
    Helpers = new MyClaimHelpers(),
    API = new MyClaimAPI()

// set form's parameters (Required Input Fields...)
const myRIF = ['claimDefinition', 'amount', 'description']

// store connected user information
// we update leave relative information with api call
const connectedUser = {
    id: connectedID,
    email: connectedEmail,
    code: '',
    fullname: '',
    nickname: '',
    joinDate: '',
    confirmDate: ''
}
// store all employee by id
let allEmployees = new Map()
allEmployees.set(0, 'not defined')

// when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // fetch all employee information
    API.getAllEmployees().then(resp => {
        allEmployees = Common.updateEmployeeList(resp.data, allEmployees)

        // fetch all 'my claims' & update DOM (data table)
        API.getAllMyClaim(connectedID, connectedEmail).then(resp => {
            Helpers.insertRows(resp.data)
            Helpers.makeEditable()
        })
    })

    // // fetch all claim's config table & update DOM (form)
    // API.getClaimCT().then(resp => {
    //     Helpers.insertOptions('category', resp.data.Category)
    // })

    // fetch all claim's definitions & update DOM (form)
    API.getAllClaimDefinition().then(resp => {
        Helpers.insertOptionsCD('claimDefinition', resp.data.Active)
        // when claim definition change (form)
        document.querySelector('#claimDefinition').addEventListener('change', (e) => {
            const claimDefinitionID = e.target.value
            console.log('selected CD: ' + claimDefinitionID);
            // populate hidden fields (for form validation: confirmation | seniority | docRequired | limitation)
            const myCDValidation = document.querySelector('#myclaimDefinition' + claimDefinitionID).dataset
            Helpers.populateHiddenFields(myCDValidation)
            // switch form fields view
            Helpers.switchFormFieldsView()
        })
    })

    // fetch connected user information and update connectedUser
    API.getUserInformation(connectedID, connectedEmail).then(resp => {
        Helpers.updateUserInformation(resp.data)
    })



    // when form is submitted (save button)
    document.querySelector('#claimFormSubmit').addEventListener('click', () => {
        let error = Common.validateRequiredFields(myRIF)
        myData = Common.getForm('claimForm', connectedID)
        console.log(myData);
        let errorsKeys = []
        let errsForm = Helpers.validateApplication(myData)
        // iterate through errsForm's keys and check any with value with 1
        // if any, display warning message

        for (const [key, value] of Object.entries(errsForm)) {
            if (key == 'errAmount' && value == '1') {
                Common.insertHTML('Amount exceeded limitation', 'amountError')
                error = 1
                errorsKeys.push('amountError')
            }
            if (key == 'errDocRequired' && value == '1') {
                Common.insertHTML('Claim requires documentation', 'documentationError')
                error = 1
                errorsKeys.push('documentationRequired')
            }
            Helpers.displayWarningMessage(errorsKeys);
        }

        if (error == '0') {
            API.createClaim(myData).then(resp => {
                console.log(resp);
                let formData = new FormData();
                formData.append("uploadedFilename", document.getElementById("uploadedFilename").value)
                formData.append("employeeEmail", document.getElementById("employeeEmail").value)
                formData.append("employeeID", document.getElementById("employeeID").value)
                if (!resp.error) {
                    API.moveClaimAttachment(formData, resp.data).then(resp => {
                        location.reload()
                    })
                }
            })
        }
    })
    // close warning message
    const myWarningMessage = document.querySelector('#hideWarningMessage')
    myWarningMessage.addEventListener('click', () => {
        Common.hideDivByID('warningMessageDiv')
    })
    // clear form (when open form is clicked)
    document.querySelector('#openCreateMyClaim').addEventListener('click', () => {
        Common.clearForm('claimForm', myRIF)
    })

    // initiate delete confirm modal
    const myConfirm = new bootstrap.Modal(document.getElementById('confirmDelete'), {
        keyboard: false
    })

    // cleaned checked checkboxes when modal is close
    document.getElementById('confirmDelete').addEventListener('hidden.bs.modal', function () {
        document.querySelectorAll('.deleteCheckboxes').forEach(element => {
            element.checked = false
        })
    })

    // When delete all is clicked
    document.querySelector('#deleteAllMyClaim').addEventListener('click', () => {
        const checked = Helpers.selectedClaim()

        if (typeof checked != 'undefined' && checked.length > 0) {
            Helpers.populateConfirmDelete(checked.length)
            myConfirm.show()
        }

    })

    // When confirm delete all is clicked
    const confirmedDelete = document.querySelector('#confirmDeleteSubmit')

    confirmedDelete.addEventListener('click', () => {
        const checked = Helpers.selectedClaim()

        API.softDeleteClaim(checked, connectedEmail).then(resp => {
            if (!resp.error) {
                myConfirm.hide()
                location.reload()
            }
        })

    })
    // initiate upload modal
    const uploadModal = new bootstrap.Modal(document.getElementById('uploadedFilesModal'), {
        keyboard: false
    })
    // when upload documentation button is clicked
    const myICBtn = document.querySelector('#uploadDocumentationButton')
    myICBtn.addEventListener('click', () => {
        const wanted = 'docs'
        Helpers.populateUploadFiles(wanted)
        uploadModal.toggle()
    })

    // when upload button in modal is clicked
    const uploadBtn = document.querySelector('#claimDocumentSubmitBtn')
    uploadBtn.addEventListener('click', () => {
        let fileInput = document.getElementById("uploadedFiles");
        let files = fileInput.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            formData.append("attachments[]", file);
        }
        formData.append("uploadedFilename", document.getElementById("uploadedFilename").value)
        formData.append("employeeEmail", document.getElementById("employeeEmail").value)
        formData.append("employeeID", document.getElementById("employeeID").value)

        API.uploadClaimAttachment(formData).then(resp => {
            if (!resp.error) {
                document.getElementById("documentation").value = files.length + ' file(s) uploaded'
                uploadModal.toggle()
                console.log(resp.data)
            }
        })
    })


})
