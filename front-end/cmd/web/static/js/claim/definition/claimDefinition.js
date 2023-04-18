const Common = new MainHelpers(),
    Helpers = new ClaimDefinitionHelpers(),
    API = new ClaimDefinitionAPI()

// set form's parameters (Required Input Fields...)
const myRIF = ['name', 'description', 'category', 'limitation0', 'seniority0']

let rowDetailsNumber = 0

// when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {

    // fetch all claim's definition & update DOM 
    API.getAllClaimDefinition().then(resp => {
        // display active claim definition
        Helpers.insertRows(resp.data.Active)
        Helpers.makeEditable()
    })

    // fetch claim category & update DOM (form dropdown)
    API.getClaimCT().then(resp => {
        Helpers.insertOptions('category', resp.data.Category)
    })

    // when open form (add button) is clicked (clear warning message & field's values)
    document.querySelector('#openCreateClaimDefinition').addEventListener('click', () => {
        Common.clearForm('createClaimDefinitionForm', myRIF)
        Common.insertInputValue('create', 'formAction')
    })

    // when confirmation required is clicked
    document.querySelector('#confirmation1').addEventListener('click', (e) => {
        Common.showDivByID('seniorityDiv')
        Common.showDivByID('seniorityError')
        myRIF.push('seniority')
    })

    // when confirmation is not required is clicked
    document.querySelector('#confirmation2').addEventListener('click', (e) => {
        Common.hideDivByID('seniorityDiv')
        Common.hideDivByID('seniorityError')
        Common.insertInputValue('0', 'seniority')
        Helpers.removeElementFromRIF('seniority')
    })

    // when form is submitted (save button)
    document.querySelector('#createClaimDefinitionSubmit').addEventListener('click', () => {
        const error = Common.validateRequiredFields(myRIF),
            formAction = document.querySelector('#formAction').value

        // create form   
        if (error == '0' && formAction == 'create') {
            myData = Common.getForm('createClaimDefinitionForm', connectedID)
            console.log(myData);
            API.createClaimDefinition(myData).then(resp => {
                if (!resp.error) location.reload()
            })
        }

        // edit form
        if (error == '0' && formAction == 'edit') {
            const toggleCheckboxes = document.querySelectorAll(".toggle-checkbox");



            // API.updateClaimDefinition(myData).then(resp => {
            //     if (!resp.error) location.reload()
            // })
        }
    })

    // close warning message
    document.querySelector('#hideWarningMessage').addEventListener('click', () => {
        Common.hideDivByID('warningMessageDiv')
    })

    // initiate delete confirm modal
    const myConfirm = new bootstrap.Modal(document.getElementById('confirmDelete'), {
        keyboard: false
    })

    // cleaned checked checkboxes when modal is close
    document.getElementById('confirmDelete').addEventListener('hidden.bs.modal', function (event) {
        const myDeleteCheckboxes = document.querySelectorAll('.deleteCheckboxes')

        myDeleteCheckboxes.forEach(element => {
            element.checked = false
        })

    })

    // when delete all is clicked
    const myDeleteAll = document.querySelector('#deleteAllClaimDefinition')

    myDeleteAll.addEventListener('click', () => {
        const checked = Helpers.selectedClaimDefinition()

        if (typeof checked != 'undefined' && checked.length > 0) {
            Helpers.populateConfirmDelete(checked.length)
            myConfirm.show()
        }

    })

    // when confirm delete all is clicked
    const confirmedDelete = document.querySelector('#confirmDeleteSubmit')

    confirmedDelete.addEventListener('click', () => {
        const checked = Helpers.selectedClaimDefinition()

        API.softDeleteClaimDefinition(checked, connectedEmail).then(resp => {
            if (!resp.error) {
                myConfirm.hide()
                location.reload()
            }
        })

    })
    // when add details row is clicked
    document.querySelector('#addDetails').addEventListener('click', () => {
        Helpers.insertDetailsRow()
    })

    document.addEventListener("DOMContentLoaded", function () {
        const row = checkbox.closest(".col-sm-4");
        const inputBoxes = row.querySelectorAll(".form-control");
        const existingSeniorityInput = row.querySelector(".existingSeniority");
        const existingLimitationInput = row.querySelector(".existingLimitation");
        const sendToApiButton = document.getElementById("createClaimDefinitionSubmit");

        toggleCheckboxes.forEach(function (checkbox) {
            checkbox.addEventListener("change", function () {
                const row = checkbox.closest(".row");
                const inputBoxes = row.querySelectorAll(".input-row");
                if (checkbox.checked) {
                    row.classList.add("disabled");
                    existingSeniorityInput.disabled = true;
                    existingLimitationInput.disabled = true;
                  } else {
                    row.classList.remove("disabled");
                    existingSeniorityInput.disabled = false;
                    existingLimitationInput.disabled = false;
                  }
            });
        });

        sendToApiButton.addEventListener("click", function () {
            const allRows = document.querySelectorAll(".row");
            const checkedArray = [];
            const uncheckedArray = [];

            allRows.forEach(function (row) {
                const rowId = row.id;
                const senValue = row.querySelector(".existingSeniority").value;
                const limValue = row.querySelector(".existingLimitation").value;
                const rowData = {
                    id: rowId,
                    seninority: senValue,
                    limitation: limValue
                };

                const checkbox = row.querySelector(".toggle-checkbox");
                if (checkbox.checked) {
                    checkedArray.push(rowData);
                } else {
                    uncheckedArray.push(rowData);
                }
            });

            console.log("Checked Rows:", checkedArray);
            console.log("Unchecked Rows:", uncheckedArray);
        });
    });

})
