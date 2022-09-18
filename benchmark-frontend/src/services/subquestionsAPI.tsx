const baseUrl = `${process.env.REACT_APP_API_URL}/api/SubQuestions`;

/**
 * Description: Update Scale of a Sub Question
 * Method: PUT
 */
export const updateSubScale = async (
  SurveyId: string,
  QuestionId: string,
  RowId: string,
  ScaleId: string,
  PredefinedScaleType: string
) => {
  const bodyData =
    ScaleId !== ''
      ? { SurveyId, QuestionId, RowId, ScaleId }
      : { SurveyId, QuestionId, RowId, PredefinedScaleType };

  return await fetch(`${baseUrl}/scale`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  }).then((res) => res.json());
};
