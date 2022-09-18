const baseUrl = `${process.env.REACT_APP_API_URL}/api/Questions`;

/**
 * Description: Assign Scale to a Question
 * Method: PUT
 */
export const putAssignScale = async (
  QuestionId: string,
  ScaleId: string,
  PredefinedScaleType: string
) => {
  const bodyData =
    ScaleId === "" && PredefinedScaleType === ""
      ? { QuestionId }
      : ScaleId !== "" && PredefinedScaleType === ""
      ? { QuestionId, ScaleId }
      : { QuestionId, PredefinedScaleType };

  return await fetch(`${baseUrl}/scale`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  }).then((res) => res.json());
};

/**
 * Description: Assign Factor to a Question or Sub-Question
 * Method: PUT
 */
export const updateFactor = async (
  questionId: string,
  factorId: string,
  rowId: number
) => {
  let bodyData = {};
  let url = "";
  //const bodyData = { QuestionId, FactorId };

  if (!rowId || rowId === 0) {
    bodyData = { questionId, factorId };
    url = `${baseUrl}/factor`;
  } else {
    bodyData = { factorId };
    url = `${baseUrl}/${questionId}/factor/subQuestion/${rowId}`;
  }

  return await fetch(`${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  }).then((res) => res.json());
};

/**
 * Description: Assign/Unassign Process Step for a Question or Sub-Question
 * Method: PUT
 */
export const updateProcessStep = async (
  questionId: number,
  processStepId: string,
  rowId: number | null
) => {
  let bodyData = {};
  let url = "";

  if (!rowId || rowId==null || rowId === 0) {
    bodyData = { questionId, processStepId };
    url = `${baseUrl}/processStep`;
  } else {
    bodyData = { questionId, rowId, processStepId };
    url = `${baseUrl}/${questionId}/processStep/subQuestion`;
  }

  return await fetch(`${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  }).then((res) => res.json());
};
