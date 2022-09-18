const baseUrl = `${process.env.REACT_APP_API_URL}/api/scoreComputation`;

/**
 * Description: Compute Score
 * Method: POST
 */
 export const computeScore = async (companyId: string, projectId: string) => {
    const bodyData = { companyId, projectId };

    return await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};