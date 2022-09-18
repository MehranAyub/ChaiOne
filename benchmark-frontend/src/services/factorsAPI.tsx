

/**
 * Description: Get Factors
 * Method: GET
 */
export const getFactors = async () => {
    return await fetch(`${process.env.REACT_APP_API_URL}/api/Factors`)
        .then(res => res.json());
}