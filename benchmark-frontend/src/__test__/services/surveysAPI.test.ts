import React from 'react';
import '@testing-library/jest-dom'
import {getSurveyDetail, postAssignCompany} from '../../services/surveysAPI';

describe('Test Surveys APIs', () => {

    beforeEach(() => {
        // @ts-ignore
        fetch.resetMocks();
    });

    it('test getSurveyDetail()', async () => {
        // Arrange
        const data = {
            "id": 48944290,
            "title": "SUS ESpeedBuy",
            "nickname": "",
            "category": "",
            "status": 1,
            "source": 0,
            "companyId": "bf3687e0-12ed-44f8-9c05-89b9e59b5193",
            "language": "en",
            "isOwner": true,
            "pageCount": 3,
            "questionCount": 13,
            "responseCount": 8,
            "dateCreated": "2014-02-13T12:35:00",
            "dateModified": "2014-03-03T22:03:00",
            "showInPortal": true,
            "buttonsText": null,
            "href": "https://api.surveymonkey.net/v3/surveys/48944290",
            "folderId": 1196573,
            "preview": "https://www.surveymonkey.com/r/Preview/?sm=PalOcNQHB2SWS793vKC6iS8zoBEYU4pTHd4WOAgyBXT8hP_2FYUrw_2BJsoQHhah32K3",
            "editUrl": "https://www.surveymonkey.com/create/?sm=ZHiNb04BxMZcL6eSfZMSCUxapUB3ZAvwtBZWlT1buQQ_3D",
            "collectUrl": "https://www.surveymonkey.com/collect/list?sm=ZHiNb04BxMZcL6eSfZMSCUxapUB3ZAvwtBZWlT1buQQ_3D",
            "analyzeUrl": "https://www.surveymonkey.com/analyze/ZHiNb04BxMZcL6eSfZMSCUxapUB3ZAvwtBZWlT1buQQ_3D",
            "summaryUrl": "https://www.surveymonkey.com/summary/ZHiNb04BxMZcL6eSfZMSCUxapUB3ZAvwtBZWlT1buQQ_3D",
            "footer": null,
            "customVariables": null,
            "pages": [],
            "collectors": [],
            "responses": [],
            "questions": [],
            "createdById" : null,
            "updatedById" : null,
            "createdDate" : "2021-03-05T07:58:04.2774732-06:00",
            "updatedDate" : "2021-03-05T08:32:07.0502292-06:00"
        };

         // @ts-ignore
        fetch.mockResponseOnce(JSON.stringify(data));

        // Act
        // @ts-ignore
        const result = await getSurveyDetail(data.id);

        // Assert
        expect(result).toEqual(data)
    });

    it('test postAssignCompany()', async () => {
        // Arrange
        const data:any = {};

         // @ts-ignore
        fetch.mockResponseOnce(JSON.stringify(data));

        // Act
        const result = await postAssignCompany('SurveyId', 'CompanyId');

        // Assert
        expect(result).toEqual(data)

    });
      
})

