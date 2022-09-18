const baseUrl = `${process.env.REACT_APP_API_URL}/api/scales`;

/**
 * Description: Get Scales
 * Method: GET
 */
export const getScales = async () => {
    return await fetch(baseUrl)
        .then(res => res.json());
};

/**
 * Description: Create a Scale
 * Method: POST
 */
export const postScale = async (scaleName: string) => {
    const bodyData = { scaleName };

    return await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
 * Description: Delete a Scale
 * Method: DELETE
 */
export const deleteScale = async (id: string) => {
 
    return await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());
};
