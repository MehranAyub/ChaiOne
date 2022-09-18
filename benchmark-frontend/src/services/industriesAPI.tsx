const baseUrl = `${process.env.REACT_APP_API_URL}/api/industries`;

/**
 * Description: Get Industries
 * Method: GET
 */
export const getIndustries = async () => {
    return await fetch(baseUrl)
        .then(res => res.json());
};

/**
 * Description: Create an Industry
 * Method: POST
 */
export const postIndustries = async (industryName: string) => {
    const bodyData = { industryName };

    return await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
 * Description: Delete an Industry
 * Method: DELETE
 */
export const deleteIndustries = async (id: string) => {
 
    return await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });
};
