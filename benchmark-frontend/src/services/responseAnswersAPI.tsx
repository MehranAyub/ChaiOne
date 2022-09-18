const baseUrl = `${process.env.REACT_APP_API_URL}/api/ResponseAnswers`;

/**
* Description: Update response answer
* Method: PUT
*/
export const updateResponseAnswer = async (responseId: number, text: string) => {
  const bodyData = { text };

  return await fetch(`${baseUrl}/${responseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  }).then(res => res.json());
};

/**
* Description: Delete response answer
* Method: DELETE
*/
export const deleteResponseAnswer = async (responseId: number) => {
  return await fetch(`${baseUrl}/${responseId}`, {
    method: 'DELETE'
  });
};

/**
* Description: Validate response answer
* Method: PUT
*/
export const validateResponseAnswers = async (responseIds: any[]) => {
  return await fetch(`${baseUrl}/validate`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ responseAnswerIds: responseIds }),
  }).then(res => res.json());;
};