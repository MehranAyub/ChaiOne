/**
 * Description: Get Projects
 * Method: GET
 */
export const getProjects = async () => {
    return await fetch(`${process.env.REACT_APP_API_URL}/api/Projects`)
        .then(res => res.json());
};

/**
 * Description: Get Project
 * Method: GET
 */
export const getProject = async (projectId: string) => {
    return await fetch(`${process.env.REACT_APP_API_URL}/api/Projects/${projectId}`)
        .then(res => res.json());
};

/**
 * Description: Create a Project
 * Method: POST
 */
export const postCreateForCompany = async ( ProjectName: string, CompanyId: string) => {
    const bodyData = { CompanyId, ProjectName};
    return await fetch(`${process.env.REACT_APP_API_URL}/api/Projects/createForCompany`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
 * Description: Delete a project
 * Method: DELETE
 */
export const deleteProjects = async (id: string) => {
 
    return await fetch(`${process.env.REACT_APP_API_URL}/api/Projects/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());
};
