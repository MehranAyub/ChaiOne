const baseUrl = `${process.env.REACT_APP_API_URL}/api/processSteps`;

/**
 * Description: Retrieves all process steps
 * Method: GET
 */
export const getProcessSteps = async () => {
  return await fetch(baseUrl).then((response) => response.json());
};

/**
 * Description: Creates Process Step
 * Method: POST
 */
export const addProcessStep = async (processStepText: string) => {
  let bodyData = { processStepText: processStepText };

  return await fetch(`${baseUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  }).then((res) => res.json());
};

/**
 * Description: Delete a Process Step
 * Method: DELETE
 */
export const deleteProcessStep = async (id: string) => {
  return await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};
