import { resolve } from "url";

/**
 * 
 *  Description: Get SurveyMonkey's survey list
 *  Method: Post
 */
export const postSurveyMonkeyList = (p: number, numberItemsPerPage: number) => {
    var awaitingData:any=JSON.parse(sessionStorage.getItem('surveyAwaitingData') || '[]');
    if(!!awaitingData && awaitingData?.length>0){
        const dataPage = awaitingData.slice((p - 1) * numberItemsPerPage, ((p - 1) * numberItemsPerPage) + numberItemsPerPage);
        return new Promise((resolve, reject) => {
            const response = {
                data: dataPage,
                total: awaitingData.length
            }
            return resolve(response);
        })
    }else{
    return fetch(`${process.env.REACT_APP_API_URL}/api/SurveyMonkey/list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ 
        //     Page : p,
        //     PerPage : numberItemsPerPage,
        // }),
    })
    .then(res => res.json())
    .then(data => {
        sessionStorage.setItem('surveyAwaitingData',JSON.stringify(data) || '[]');
        const dataPage = data.slice((p - 1) * numberItemsPerPage, ((p - 1) * numberItemsPerPage) + numberItemsPerPage);
        return new Promise((resolve, reject) => {
            const response = {
                data: dataPage,
                total: data.length
            }
            return resolve(response);
        })
    })
}
   
}