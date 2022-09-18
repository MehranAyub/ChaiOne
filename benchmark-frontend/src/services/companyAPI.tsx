const baseUrl = `${process.env.REACT_APP_API_URL}/api/Companies`;

/**
 * Description: Get Companies
 * Method: GET
 */
export const getCompanies = async () => {
    return await fetch(baseUrl)
        .then(res => res.json());
};

/**
 * Description: Get Company
 * Method: GET
 */
export const getCompany = async (companyId: string) => {
    return await fetch(`${baseUrl}/${companyId}`)
        .then(res => res.json());
};

/**
 * Description: Get Projects associated with specified Company
 * Method: GET
 */
 export const getCompanyProjects = async (companyId: string) => {
    return await fetch(`${baseUrl}/${companyId}/projects`)
        .then(res => res.json());
};

/**
 * Description: Create a Company
 * Method: POST
 */
export const postCompanies = async (CompanyName:string) => {
    const bodyData = { CompanyName };
    return await fetch(baseUrl,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
 * Description: Delete a Company
 * Method: DELETE
 */
export const deleteCompanies = async (id: string) => {
 
    return await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());
};

/**
 * Description: assign a project to a company
 * Method: PUT
 */
export const putAssignProject = async (companyId: string, projectId: string) => {
    const bodyData = { companyId, projectId };

    return await fetch(`${baseUrl}/assignProject`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};
