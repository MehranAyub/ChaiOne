const baseUrl = `${process.env.REACT_APP_API_URL}/api/userRoles`;

/**
* Description: Get User Roles
* Method: GET
*/
export const getUserRoles = async () => {
    return await fetch(baseUrl)
        .then(res => res.json());
};

/**
* Description: Creates a User Role
* Method: POST
*/
export const createUserRole = async (userRoleName: string) => {
    const bodyData = { userRoleName };

    return await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
 * Description: Deletes a User Role
 * Method: DELETE
 */
 export const deleteUserRole = async (id: string) => {
 
    return await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());
};
