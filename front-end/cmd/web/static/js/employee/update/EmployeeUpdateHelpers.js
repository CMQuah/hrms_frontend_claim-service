class EmployeeUpdateHelpers{

    // Populate config tables for nationality, residence country, race, religion, country, relationship
    populateConfigTables(ct){
        // employee 
        this.insertNationalityOptions('nationality', ct.Country)
        this.insertOptions('residence', ct.Country)
        this.insertOptions('race', ct.Race)
        this.insertOptions('religion', ct.Religion)
        this.insertOptions('country', ct.Country)
        // emegency contact
        this.insertOptions('relationshipEC', ct.Relationship)
        // spouse
        this.insertOptions('spouseCountry', ct.Country)
        // employment
        this.insertOptions('department', ct.EmploymentDepartment)
        this.insertOptions('employeeType', ct.EmploymentType)
        this.insertOptions('wagesType', ct.EmploymentWages)
        this.insertOptions('payFrequency', ct.EmploymentPayFrequency)
        this.insertOptions('paymentBy', ct.EmploymentPaymentBy)
        this.insertOptions('bankPayout', ct.EmploymentBank)
        this.insertOptions('group', ct.EmploymentGroup)
        this.insertOptions('project', ct.EmploymentProject)
        this.insertOptions('branch', ct.EmploymentBranch)
        this.insertOptions('overtime', ct.EmploymentOT)
        // statutory
        this.insertOptions('epfTable', ct.StatutoryEPF)
        this.insertOptions('socsoCategory', ct.StatutorySOCSOCategory)
        this.insertOptions('socsoStatus', ct.StatutorySOCSOStatus)
        this.insertOptions('taxStatus', ct.StatutoryTaxStatus)
        this.insertOptions('taxBranch', ct.StatutoryTaxBranch)
        this.insertOptions('foreignWorkerLevy', ct.StatutoryForeignLevy)
        
        
        
    }
    // Insert to selectID one option per element of data.Nationality
    insertNationalityOptions(id, data){
        const target = document.querySelector('#'+id)
        target.innerHTML = '<option selected hidden value=""></option>'
        data.forEach(element => {
            let opt = document.createElement('option')
            opt.value = element.ID
            opt.innerHTML = element.Nationality
            target.appendChild(opt)
        })
    }
    // Insert to selectID one option per element of data.Name
    insertOptions(id, data){
        const target = document.querySelector('#'+id)
        target.innerHTML = '<option selected hidden value=""></option>'
        data.forEach(element => {
            let opt = document.createElement('option')
            opt.value = element.ID
            opt.innerHTML = element.Name
            target.appendChild(opt)
        })
    }

    // Insert to superior, supervisor employee list
    insertEmployee(id, data){
        const target = document.querySelector('#'+id)
        target.innerHTML = '<option selected hidden value=""></option>'
        data.forEach(element => {
            let opt = document.createElement('option')
            opt.value = element.ID
            opt.innerHTML = element.Lastname + ' ' + element.Firstname + ' ' + element.Middlename
            target.appendChild(opt)
        })
    }
    // convert gender_id
    gender(id){
        let g
        return (id == 1) ? g = 'male' : g = 'female'
    }
    // convert timestamp string to date yyyy-mm-dd
    convertToDate(t){
        let myDate
        // get only the 10 first characters of the string
        const d = t.substring(0,10)
        // the zero value of a date is 0001-01-01
        return (d == '0001-01-01') ? myDate = '' : myDate = d
    }
    // format a date to yyyy-mm-dd
    formatDate(date){
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
    // calculate numbers of days between date and now (round up)
    daysDifferenceNow(date){
        // To set two dates to two variables
        const now = new Date(),
              myDate = new Date(date);
        
        let timeDiff, daysDiff
        if (now < myDate){
            timeDiff = myDate.getTime() - now.getTime()
            daysDiff = timeDiff / (1000 * 3600 * 24)
        }
        
        return Math.round(daysDiff)
    }
    // Calculate approximated age
    calculateAge(birthdate){
        const today     = new Date(),
              thisYear  = today.getFullYear(),
              birthYear = birthdate.split('-')[0],
              age       = thisYear - birthYear
        return age
    } 

    // Populate form data
    populateFormData(data, eid){
        console.log('data received', data);
        // update title page
        Common.insertHTML('Employee: ' + data.Employee.employeeCode.toUpperCase(), 'pageTitle')
        Common.insertHTML(data.Employee.givenname, 'pageSubtitle')

        // update identity card
        Common.insertInputValue(data.Employee.firstname, 'firstName')
        Common.insertInputValue(data.Employee.middlename, 'middleName')
        Common.insertInputValue(data.Employee.familyname, 'familyName')
        Common.insertInputValue(data.Employee.givenname, 'givenName')
        Common.insertInputValue(data.Employee.employeeCode, 'employeeCode')
        Common.checkRadio(data.Employee.gender, 'gender')
        Common.checkRadio(data.Employee.maritalstatus, 'maritalstatus')
        Common.insertInputValue(data.Employee.icNumber, 'icNumber')
        Common.insertInputValue(data.Employee.passportNumber, 'passportNumber')        
        const passportExpiryDate = this.convertToDate(data.Employee.passportExpiryAt),
              passportExpiryDays = this.daysDifferenceNow(passportExpiryDate)
        Common.insertInputValue(passportExpiryDate, 'passportExpiryAt')
        // insert passport expiry days
        if (passportExpiryDate != '') Common.insertHTML('( in ' + passportExpiryDays + ' days)', 'passportExpiryDays')        
        Common.selectBoxOptionSelected(data.Employee.nationality,'nationality')
        Common.selectBoxOptionSelected(data.Employee.residence,'residence')
        Common.insertInputValue(data.Employee.immigrationNumber, 'immigrationNumber')
        const birthdate = this.convertToDate(data.Employee.birthdate),
              age = this.calculateAge(birthdate)
        Common.insertInputValue(birthdate, 'birthdate')
        // insert approximated age (years)
        if (birthdate != '') Common.insertHTML('(' + age + ' years)', 'age')
        Common.selectBoxOptionSelected(data.Employee.race,'race')
        Common.selectBoxOptionSelected(data.Employee.religion,'religion')
        Common.checkCheckbox(data.Employee.isActive, 'isActive')
        Common.checkCheckbox(data.Employee.isForeigner, 'isForeigner')
        Common.checkCheckbox(data.Employee.isDisabled, 'isDisabled')
        Common.checkRadio(data.Employee.role, 'role')
        Common.insertInputValue(data.Employee.streetaddr1, 'streetAddressLine1')
        Common.insertInputValue(data.Employee.streetaddr2, 'streetAddressLine2')
        Common.insertInputValue(data.Employee.zip, 'zip')
        Common.insertInputValue(data.Employee.city, 'city')
        Common.insertInputValue(data.Employee.state, 'state')
        Common.selectBoxOptionSelected(data.Employee.country, 'country')
        Common.insertInputValue(data.Employee.primaryPhone, 'primaryPhone')
        Common.insertInputValue(data.Employee.secondaryPhone, 'secondaryPhone')
        Common.insertInputValue(data.Employee.primaryEmail, 'primaryEmail')
        Common.insertInputValue(data.Employee.secondaryEmail, 'secondaryEmail')

        // update emergency contact
        Common.insertInputValue(data.EmergencyContact.fullnameEC, 'fullnameEC')
        Common.insertInputValue(data.EmergencyContact.mobileEC, 'mobileEC')
        Common.selectBoxOptionSelected(data.EmergencyContact.relationshipEC, 'relationshipEC')

        // update spouse information
        Common.insertInputValue(data.Spouse.fullname, 'spouseFullname')
        Common.checkCheckbox(data.Spouse.isDisabled, 'spouseIsDisabled')
        Common.insertInputValue(data.Spouse.icNumber, 'spouseIcNumber')
        Common.insertInputValue(data.Spouse.passporNumber, 'spousePassportNumber')
        Common.insertInputValue(data.Spouse.deductibleChildNumber, 'spouseChildNumber')
        Common.insertInputValue(data.Spouse.deductibleChildAmount, 'spouseChildPoint')
        Common.checkCheckbox(data.Spouse.isWorking, 'spouseIsWorking')
        Common.insertInputValue(data.Spouse.taxNumber, 'spouseTaxNumber')
        Common.insertInputValue(data.Spouse.streetaddr1, 'spouseStreetAddr1')
        Common.insertInputValue(data.Spouse.streetaddr2, 'spouseStreetAddr2')
        Common.insertInputValue(data.Spouse.zip, 'spouseZip')
        Common.insertInputValue(data.Spouse.city, 'spouseCity')
        Common.insertInputValue(data.Spouse.state, 'spouseState')
        Common.selectBoxOptionSelected(data.Spouse.country, 'spouseCountry')
        Common.insertInputValue(data.Spouse.primaryPhone, 'spousePrimaryPhone')
        Common.insertInputValue(data.Spouse.secondaryPhone, 'spouseSecondaryPhone')

        // update employment information
        Common.insertInputValue(data.Employment.jobTitle, 'jobTitle')
        Common.selectBoxOptionSelected(data.Employment.department, 'department')
        Common.insertInputValue(data.Employment.supervisor, 'supervisor')
        Common.insertInputValue(data.Employment.superior, 'superior')
        Common.selectBoxOptionSelected(data.Employment.employeeType, 'employeeType')
        Common.selectBoxOptionSelected(data.Employment.wagesType, 'wagesType')
        Common.insertInputValue(data.Employment.basicRate, 'basicRate')
        Common.selectBoxOptionSelected(data.Employment.payFrequency, 'payFrequency')
        Common.selectBoxOptionSelected(data.Employment.paymentBy, 'paymentBy')
        Common.selectBoxOptionSelected(data.Employment.bankPayout, 'bankPayout')
        Common.selectBoxOptionSelected(data.Employment.group, 'group')
        Common.selectBoxOptionSelected(data.Employment.project, 'project')
        Common.selectBoxOptionSelected(data.Employment.branch, 'branch')
        Common.selectBoxOptionSelected(data.Employment.overtime, 'overtime')
        const visaExpiryDate = this.convertToDate(data.Employment.workingPermitExpiry),
              visaExpiryDays = this.daysDifferenceNow(visaExpiryDate)
        Common.insertInputValue(visaExpiryDate, 'visaExpiryAt')
        // insert visa expiry days
        if (visaExpiryDate != '') Common.insertHTML('( in ' + visaExpiryDays + ' days)', 'visaDays')
        Common.insertInputValue(this.convertToDate(data.Employment.joinDate), 'joinDate')
        Common.insertInputValue(this.convertToDate(data.Employment.confirmDate), 'confirmDate')
        Common.insertInputValue(this.convertToDate(data.Employment.resignDate), 'resignDate')

        // update statutory information
        Common.selectBoxOptionSelected(data.Statutory.epfTable, 'epfTable')
        Common.insertInputValue(data.Statutory.epfNumber, 'epfNumber')
        Common.insertInputValue(data.Statutory.epfInitial, 'epfInitial')
        Common.insertInputValue(data.Statutory.nk, 'nk')
        Common.checkCheckbox(data.Statutory.epfBorne, 'epfBorne')
        Common.selectBoxOptionSelected(data.Statutory.socsoCategory, 'socsoCategory')
        Common.insertInputValue(data.Statutory.socsoNumber, 'socsoNumber')
        Common.selectBoxOptionSelected(data.Statutory.socsoStatus, 'socsoStatus')
        Common.checkCheckbox(data.Statutory.socsoBorne, 'socsoBorne')
        Common.checkCheckbox(data.Statutory.contributeEIS, 'contributeEIS')
        Common.checkCheckbox(data.Statutory.eisBorne, 'eisBorne')
        Common.selectBoxOptionSelected(data.Statutory.taxStatus, 'taxStatus')
        Common.insertInputValue(data.Statutory.taxNumber, 'taxNumber')
        Common.selectBoxOptionSelected(data.Statutory.taxBranch, 'taxBranch')
        Common.insertInputValue(data.Statutory.eaSerial, 'eaSerialNumber')
        Common.checkCheckbox(data.Statutory.taxBorne, 'taxBorne')
        Common.selectBoxOptionSelected(data.Statutory.foreignWorkerLevy, 'foreignWorkerLevy')
        Common.insertInputValue(data.Statutory.zakatNumber, 'zakatNumber')
        Common.insertInputValue(data.Statutory.zakatAmount, 'zakatAmount')
        Common.insertInputValue(data.Statutory.tabungHajiNumber, 'tabungHajiNumber')
        Common.insertInputValue(data.Statutory.tabungHajiAmount, 'tabungHajiAmount')
        Common.insertInputValue(data.Statutory.asnNumber, 'asnNumber')
        Common.insertInputValue(data.Statutory.asnAmount, 'asnAmount')
        Common.checkCheckbox(data.Statutory.contributeHRDF, 'contributeHRDF')

        // update bank
        Common.insertInputValue(data.Bank.bankName, 'bankName')
        Common.insertInputValue(data.Bank.accountNumber, 'accountNumber')
        Common.insertInputValue(data.Bank.accountName, 'accountName')

        // update other informations
        Common.insertInputValue(data.OtherInformation.education, 'education')
        Common.insertInputValue(data.OtherInformation.experience, 'experience')
        Common.insertInputValue(data.OtherInformation.notes, 'notes')

        // update upload hidden fields        
        Common.insertInputValue(data.Employee.primaryEmail, 'employeeEmail')
        Common.insertInputValue(eid, 'employeeID')
    }

    // populate upload files
    populateUploadFiles(wanted){
        switch (wanted) {
            case 'ic':
                Common.insertHTML('IC', myModalTitle)
                Common.insertInputValue('ic', uploadedFilename)
                break;
            
            case 'passport':
                Common.insertHTML('Passport', myModalTitle)
                Common.insertInputValue('passport', uploadedFilename)
                break;
            
            default:
                break;
        }
    }

    // populate uploaded files
    populateUploadedFiles(data, email){
        if (data.Files.ic != null && data.Files.ic.length > 0){
            this.insertAttachments(data.Files.ic, email, 'uploadedIC', 'ic')
        }
        if (data.Archive.ic != null && data.Archive.ic.length > 0){
            this.insertArchiveAttachments(data.Archive.ic, email, 'archivedIC', 'archive/ic')
        }
        if (data.Archive.passport != null && data.Archive.passport.length > 0){
            this.insertArchiveAttachments(data.Archive.passport, email, 'archivedPassport', 'archive/passport')
        }
        if (data.Files.passport != null && data.Files.passport.length > 0){
            this.insertAttachments(data.Files.passport, email, 'uploadedPassport', 'passport')
        }
    }
    // create attachment download link
    insertAttachments(data, email, id, category){
        const target = document.querySelector('#'+id)
        target.innerHTML = 'Latest <br />'
        data.forEach(element => {
            let link = document.createElement('a')
            link.href = `/upload/${email}/${category}/${element}`
            link.classList = 'myLink'
            link.download = element
            link.innerHTML = '<i class="bi-download pointer"></i> ' + element + '<br />'
            target.appendChild(link)
        })
    }
    // create archive attachment download link
    insertArchiveAttachments(data, email, id, category){
        const target = document.querySelector('#'+id)
        target.innerHTML = 'Archive'
        for (const key in data) {            
            let row = document.createElement('div')
            row.innerHTML = this.formatTimestamp(key) + ':<br />'
            data[key].forEach(element => {
                row.innerHTML += `<a class="myLink" href="/upload/${email}/${category}/${key}/${element}" download="${element}"><i class="bi-download pointer"></i> ${element}</a><br />`
            })
            target.appendChild(row)
        }
    }
    // format string to yyyy-mm-dd hh:mm:ss
    formatTimestamp(ts){
        const tmp = ts.split('_')
        return tmp[0] + ' ' + tmp[1].replace(/-/g, ':')
    }

    // get all information from the form
    getForm(formID, eid, connectedEmail, connectedID){
        const form = document.querySelector(`#${formID}`),
              data = new FormData(form)
        
        const myjson        = {}, 
              employee      = this.getEmployeeData(data, eid, connectedEmail, connectedID),
              ec            = this.getECData(data),
              oi            = this.getOIData(data),
              spouse        = this.getSpouseData(data),
              employment    = this.getEmploymentData(data),
              statutory     = this.getStatutoryData(data),
              bank          = this.getBankData(data)

        myjson['Employee']          = employee
        myjson['EmergencyContact']  = ec
        myjson['OtherInformation']  = oi
        myjson['Spouse']            = spouse
        myjson['Employment']        = employment
        myjson['Statutory']         = statutory
        myjson['Bank']              = bank
        
        return JSON.stringify(myjson, function replacer(key, value) { return value})
    }

    // get all employee's information from the form
    getEmployeeData(data, eid, connectedEmail, connectedID){
        const employee = {}

        employee['ID']                  = eid
        employee['EmployeeCode']        = data.get('employeeCode')
        employee['Firstname']           = data.get('firstName')
        employee['Middlename']          = data.get('middleName')
        employee['Familyname']          = data.get('familyName')
        employee['Givenname']           = data.get('givenName')
        employee['IcNumber']            = data.get('icNumber')
        employee['PassportNumber']      = data.get('passportNumber')
        employee['PassportExpiryAt']    = (data.get('passportExpiryAt') == '') ? '0001-01-01' : data.get('passportExpiryAt')
        employee['Birthdate']           = (data.get('birthdate') == '') ? '0001-01-01' : data.get('birthdate')
        employee['Nationality']         = data.get('nationality')
        employee['Residence']           = data.get('residence')
        employee['Maritalstatus']       = (data.get('maritalstatus') == '0') ? '0' : '1'
        employee['Gender']              = (data.get('gender') == '0') ? '0' : '1'
        employee['Race']                = data.get('race')
        employee['Religion']            = data.get('religion')
        employee['Streetaddr1']         = data.get('streetAddressLine1')
        employee['Streetaddr2']         = data.get('streetAddressLine2')
        employee['City']                = data.get('city')
        employee['Zip']                 = data.get('zip')
        employee['State']               = data.get('state')
        employee['Country']             = data.get('country')
        employee['PrimaryPhone']        = data.get('primaryPhone')
        employee['SecondaryPhone']      = data.get('secondaryPhone')
        employee['PrimaryEmail']        = data.get('primaryEmail')
        employee['SecondaryEmail']      = data.get('secondaryEmail')
        employee['IsForeigner']         = (data.get('isForeigner') == null) ? '0' : '1'
        employee['ImmigrationNumber']   = data.get('immigrationNumber')
        employee['IsDisabled']          = (data.get('isDisabled') == null) ? '0' : '1'
        employee['IsActive']            = (data.get('isActive') == null) ? '0' : '1'
        employee['Role']                = data.get('role')
        employee['ConnectedUser']       = connectedEmail
        employee['CreatedBy']           = connectedID
        employee['UpdatedBy']           = connectedID

        return employee
    }

    // get all employee's emergency contact from the form
    getECData(data){
        const ec = {}

        ec['FullnameEC']    = data.get('fullnameEC') 
        ec['MobileEC']      = data.get('mobileEC') 
        ec['relationshipEC']   = data.get('relationshipEC')

        return ec
    }

    // get all employee's other information from the form
    getOIData(data){
        const oi = {}

        oi['Education']  = data.get('education') 
        oi['Experience'] = data.get('experience') 
        oi['Notes']      = data.get('notes')

        return oi
    }
    // get all employee's spouse information from the form
    getSpouseData(data){
        const spouse = {}

        spouse['Fullname']              = (data.get('spouseFullname')       == null) ? '' : data.get('spouseFullname') 
        spouse['ICNumber']              = (data.get('spouseIcNumber')       == null) ? '' : data.get('spouseIcNumber') 
        spouse['PassporNumber']         = (data.get('spousePassportNumber') == null) ? '' : data.get('spousePassportNumber')
        spouse['IsDisabled']            = (data.get('spouseIsDisabled')     == null) ? '0' : '1'
        spouse['IsWorking']             = (data.get('spouseIsWorking')      == null) ? '0' : '1'
        spouse['TaxNumber']             = (data.get('spouseTaxNumber')      == null) ? '' : data.get('spouseTaxNumber')
        spouse['DeductibleChildNumber'] = (data.get('spouseChildNumber')    == null) ? '' : data.get('spouseChildNumber')
        spouse['DeductibleChildAmount'] = (data.get('spouseChildPoint')     == null) ? '' : data.get('spouseChildPoint')
        spouse['PrimaryPhone']          = (data.get('spousePrimaryPhone')   == null) ? '' : data.get('spousePrimaryPhone') 
        spouse['SecondaryPhone']        = (data.get('spouseSecondaryPhone') == null) ? '' : data.get('spouseSecondaryPhone')
        spouse['Streetaddr1']           = (data.get('spouseStreetAddr1')    == null) ? '' : data.get('spouseStreetAddr1')
        spouse['Streetaddr2']           = (data.get('spouseStreetAddr2')    == null) ? '' : data.get('spouseStreetAddr2')
        spouse['City']                  = (data.get('spouseCity')           == null) ? '' : data.get('spouseCity')
        spouse['State']                 = (data.get('spouseState')          == null) ? '' : data.get('spouseState')
        spouse['Zip']                   = (data.get('spouseZip')            == null) ? '' : data.get('spouseZip')
        spouse['Country']               = data.get('spouseCountry')

        return spouse
    }

    // get all employee's employment information from the form
    getEmploymentData(data){
        const employment = {}

        employment['JobTitle']              = (data.get('jobTitle')     == null) ? '' : data.get('jobTitle') 
        employment['Department']            = data.get('department') 
        employment['Superior']              = data.get('superior')
        employment['Supervisor']            = data.get('supervisor')
        employment['EmployeeType']          = data.get('employeeType')
        employment['WagesType']             = data.get('wagesType')
        employment['BasicRate']             = (data.get('basicRate')    == null) ? '' : data.get('basicRate')
        employment['PayFrequency']          = data.get('payFrequency')
        employment['PaymentBy']             = data.get('paymentBy') 
        employment['BankPayout']            = data.get('bankPayout')
        employment['DefaultRule']           = data.get('defaultRule')
        employment['Group']                 = data.get('group')
        employment['Branch']                = data.get('branch')
        employment['Project']               = data.get('project')
        employment['Overtime']              = data.get('overtime')
        employment['WorkingPermitExpiry']   = (data.get('visaExpiryAt') == '') ? '0001-01-01' : data.get('visaExpiryAt')
        employment['JoinDate']              = (data.get('joinDate')     == '') ? '0001-01-01' : data.get('joinDate')
        employment['ConfirmDate']           = (data.get('confirmDate')  == '') ? '0001-01-01' : data.get('confirmDate')
        employment['ResignDate']            = (data.get('resignDate')   == '') ? '0001-01-01' : data.get('resignDate')

        return employment
    }

    // get all employee's statutory information from the form
    getStatutoryData(data){
        const statutory = {}

        statutory['EPFTable']           = data.get('epfTable') 
        statutory['EPFNumber']          = data.get('epfNumber') 
        statutory['EPFInitial']         = data.get('epfInitial')
        statutory['NK']                 = data.get('nk')
        statutory['EPFBorne']           = (data.get('epfBorne') == null) ? '0' : '1'
        statutory['SOCSOCategory']      = data.get('socsoCategory')
        statutory['SOCSONumber']        = data.get('socsoNumber')
        statutory['SOCSOStatus']        = data.get('socsoStatus')
        statutory['SOCSOBorne']         = (data.get('socsoBorne') == null) ? '0' : '1'
        statutory['ContributeEIS']      = (data.get('contributeEIS') == null) ? '0' : '1'
        statutory['EISBorne']           = (data.get('eisBorne') == null) ? '0' : '1'
        statutory['TaxStatus']          = data.get('taxStatus')
        statutory['TaxNumber']          = data.get('taxNumber')
        statutory['TaxBranch']          = data.get('taxBranch')
        statutory['EASerial']           = data.get('eaSerialNumber')
        statutory['TaxBorne']           = (data.get('taxBorne') == null) ? '0' : '1'
        statutory['ForeignWorkerLevy']  = data.get('foreignWorkerLevy')
        statutory['ZakatNumber']        = data.get('zakatNumber')
        statutory['ZakatAmount']        = data.get('zakatAmount')
        statutory['TabungHajiNumber']   = data.get('tabungHajiNumber')
        statutory['TabungHajiAmount']   = data.get('tabungHajiAmount')
        statutory['ASNNumber']          = data.get('asnNumber')
        statutory['ASNAmount']          = data.get('asnAmount')
        statutory['ContributeHRDF']     = (data.get('contributeHRDF') == null) ? '0' : '1'

        return statutory
    }
    
    // get all employee's statutory information from the form
     getBankData(data){
        const bank = {}

        bank['BankName']       = data.get('bankName') 
        bank['AccountNumber']  = data.get('accountNumber') 
        bank['AccountName']    = data.get('accountName')

        return bank
    }
}