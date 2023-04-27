const broker = 'http://localhost:8088/'
const frontend = 'http://localhost:8484/'

class MyClaimAPI {

  // fetch connected user information
  async getUserInformation(connectedID, connectedEmail) {
    const url = broker + 'route/employee/get/leave';
    const payload = {
      id : connectedID,
      email : connectedEmail
    }

    const body = {
      method: 'POST',
      body: JSON.stringify(payload),
    }
    const response = await fetch(url, body)
    const result = await response.json();
    return result;
  }

  // fetch all employees
  async getAllEmployees() {
    const url = broker + 'route/employee/get/all'
    const response = await fetch(url);
    const result = await response.json();
    return result;
  }

  // fetch all my claim
  async getAllMyClaim(connectedID, connectedEmail) {
    const url = broker + 'route/myclaim/get/all';
    const payload = {
      id : connectedID,
      email : connectedEmail
    }

    const body = {
      method: 'POST',
      body: JSON.stringify(payload),
    }
    const response = await fetch(url, body)
    const result = await response.json();
    return result;
  }

  // fetch all claim definition
  async getAllClaimDefinition() {
    const url = broker + 'route/claim/definition/get/all';
    const response = await fetch(url);
    const result = await response.json();
    return result;
  }
  
  // fetch all config tables
  async getClaimCT() {
    const url = broker + 'route/claim/configTables/get'
    const response = await fetch(url);
    const result = await response.json();
    return result;
  }

  // create new claim definition   
  async createClaim(stringifiedJSON) {
    const url = broker + 'route/myclaim/create'
    const body = {
      method: 'POST',
      body: stringifiedJSON,
    }
    const response = await fetch(url, body)
    const result = await response.json()
    return result
  }

  // update claim definition   
  async updateClaim(stringifiedJSON) {
    const url = broker + 'route/myclaim/update'
    const body = {
      method: 'POST',
      body: stringifiedJSON,
    }
    const response = await fetch(url, body)
    const result = await response.json()
    return result
  }

  // soft delete all claim definition
  async softDeleteClaim(claimList, connectedUser) {
    const url = broker + 'route/myclaim/softDelete'

    const payload = {
      list : claimList,
      connectedUser : connectedUser
    }
    const body = {
      method: 'POST',
      body: JSON.stringify(payload),
    }

    const response = await fetch(url, body)
    const result = await response.json()
    return result
  }
    // upload attachment
    async uploadClaimAttachment(formData) {
      const url = frontend + 'api/v1/claim/upload/'
      const body = {
        method: 'POST',
        body: formData,
      }
  
      const response = await fetch(url,body);
      const result = await response.json();
      return result;
    }
    //move to the right folder
    async moveClaimAttachment(formData, applicationId) {
      const url = frontend + 'api/v1/claim/move/'+applicationId.toString()  
      const body = {
        method: 'POST',
        body: formData,
      }
      const response = await fetch(url,body);
      const result = await response.json();
      return result;
    }

    
      // fetch connected employee's claims information (total)
      async getEmployeeClaimByID(eid) {
        const url = broker + 'route/myclaim/get/thisYear'

        const payload = {
            id: eid
        }

        const body = {
        method: 'POST',
        body: JSON.stringify(payload),
        }

        const response = await fetch(url, body)
        const result = await response.json()
        return result
    }
}
