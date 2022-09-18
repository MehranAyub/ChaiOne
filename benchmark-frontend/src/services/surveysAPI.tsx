const baseUrl = `${process.env.REACT_APP_API_URL}/api/surveys`;

/**
 * Description: Adding a Company to Survey
 * Method: PUT
 */
export const postAssignCompany = async (surveyId: string, companyId: string,responseId:number=0) => {
    const bodyData = !companyId ? { surveyId,responseId } : { surveyId,responseId, companyId };

    return await fetch(`${baseUrl}/company`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
 * Description: Assigns/unassigns a Project to a Survey
 * Method: PUT
 */
export const updateProjectForSurvey = async (surveyId: string, projectId: string,responseId:number=0) => {
    const bodyData = !projectId ? { surveyId,responseId } : { surveyId,responseId, projectId };

    return await fetch(`${baseUrl}/project`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
* Description: Get details of a survey
* Method: GET
*/
export const getSurveyDetail = async (surveyId: string,responseId:number=0) => {
    return await fetch(`${baseUrl}/${surveyId}/${responseId}`)
        .then(res => res.json());
};

/**
 * Description: Get Ignored Surveys List
 * Method: GET
 */
export const getIgnored = () => {
    return fetch(`${baseUrl}/ignored`)
        .then(res => res.json())
};

/**
 * Description: Get Pending Validation Surveys List
 * Method: GET
 */
export const getPendingSurveys = async (activePage: number, numberItemsPerPage: number) => {
    const pendingSurveys = await fetch(`${baseUrl}/${activePage}/${numberItemsPerPage}/getSurveyList`)
        .then(res => res.json());

  return new Promise((resolve, reject) => {
       //const dataPage = pendingSurveys.slice((activePage - 1) * numberItemsPerPage, ((activePage - 1) * numberItemsPerPage) + numberItemsPerPage);
        const response = {
            data: pendingSurveys?.data,
            totalPages:pendingSurveys?.totalPages
        };
        return resolve(response);
    });
};

/**
 * Description: Assign an Industry to Survey
 * Method: PUT
 */
export const putAssignIndustries = async (surveyId: string, industryIds: string[],responseId:number=0) => {
    const bodyData = { surveyId,responseId, industryIds };

    return await fetch(`${baseUrl}/assignIndustries`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
 * Description: Unassign the Industry from Survey
 * Method: PUT
 */
export const putRemoveIndustries = async (surveyId: string, industryId: string,responseId:number=0) => {
    const bodyData = { surveyId,responseId, industryId };

    return await fetch(`${baseUrl}/removeIndustry`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
 * Description: Assign an Process to Survey
 * Method: PUT
 */
export const putAssignProcesses = async (surveyId: string, processIds: string[],responseId:number=0) => {
    const bodyData = { surveyId,responseId, processIds };

    return await fetch(`${baseUrl}/assignProcesses`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }
    ).then(res => res.json());
};

/**
 * Description: Unassign the Process from Survey
 * Method: PUT
 */
export const putRemoveProcesses = async (surveyId: string, processId: string,responseId:number=0) => {
    const bodyData = { surveyId,responseId, processId };

    return await fetch(`${baseUrl}/removeProcess`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(res => res.json());
};

/**
* Description: Get survey questions
* Method: GET
*/
export const getSurveyQuestions = async (surveyId: string,responseId:string) => {
    return await fetch(`${baseUrl}/${surveyId}/${responseId}/questions`)
        .then(res => res.json());
};

/**
* Description: Get survey questions and responses
* Method: GET
*/
export const getSurveyQuestionsAndResponses = async (surveyId: string, needsValidation: boolean = false,responseId:any) => {
    if(responseId==undefined){
        responseId=0;
    }
    return await fetch(`${baseUrl}/${surveyId}/questionsAndResponses/${needsValidation}/${responseId}`)
        .then(res => res.json());
};


/**
* Description: Refetch surveys
* Method: GET
*/
export const refetchSurveys = async (surveyId: string) => {
    return await fetch(`${baseUrl}/${surveyId}/refetch`)
        .then(res => res.json());
};

/**
* Description: Import survey from the list of ignored surveys
* Method: GET
*/
export const importIgnoredSurvey = async (surveyId: number) => {
    return await fetch(`${baseUrl}/importIgnored/${surveyId}`)
        .then(response => response.json());
};

/**
* Description: retrieves the list of validated surveys grouped by company/project pairs
* Method: GET
*/
export const getSurveyListGroupByCompanyAndProjects = async () => {
    return await fetch(`${baseUrl}/surveyListGroupedByCompanyAndProject`)
        .then(response => response.json());
};

/**
 * Description: Validate survey
 * Method: PUT
 */
export const validateSurvey = async (surveyId: string,responseId: any=0) => { 
    return await fetch(`${baseUrl}/${surveyId}/${responseId}/validate`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());
};
