/**
 * Description: Get Processes
 * Method: GET
 */
export const getProcesses = async () => {
    return await fetch(`${process.env.REACT_APP_API_URL}/api/Processes`)
        .then(res => res.json());
}

/**
 * Description: Create an Process
 * Method: POST
 */
export const postProcesses = async (ProcessName: string) => {
    const bodyData = { ProcessName };

    return await fetch(`${process.env.REACT_APP_API_URL}/api/Processes`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
        }
    )
        .then(res => res.json());
}

/**
 * Description: Delete an Process
 * Method: DELETE
 */
export const deleteProcesses = async (id: string) => {

    return await fetch(`${process.env.REACT_APP_API_URL}/api/Processes/${id}`,
        {
            method: 'DELETE'
        }
    );
}
