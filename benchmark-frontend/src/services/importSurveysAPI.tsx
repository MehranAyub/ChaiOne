const baseUrl = process.env.REACT_APP_API_URL;

/**
 * Description: Import or Ignore a survey
 * Method: POST
 */
export const postImportSurveys = (SurveyId: number, Ignore: boolean) => {

    const bodyData = { SurveyId, Ignore };

    return fetch(`${baseUrl}/api/ImportSurveys`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    })
};
