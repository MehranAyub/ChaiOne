const baseUrl = `${process.env.REACT_APP_API_URL}/api/responses`;

/**
* Description: Assigns a User Role to a Response
* Method: PUT
*/
export const assignUserRoleToResponse = async (responseId: number, userRoleId: string) => {
    const bodyData = { responseId, userRoleId };

    return await fetch(`${baseUrl}/assignUserRole`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
 * Description: Deletes a Response
 * Method: DELETE
 */
 export const deleteResponse = async (id: number) => {
 
    return await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });
};
