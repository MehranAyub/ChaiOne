import * as React from 'react';
import { getSurveyQuestionsAndResponses } from '../services/surveysAPI';
import { getSurveyDetail } from '../services/surveysAPI';
import { validateResponseAnswers } from '../services/responseAnswersAPI';
import * as helpers from '../utils/helpers';

const ResponseAnswersContext = React.createContext([]);

const setQuestionsAndAdjacentSubquestionsLetterIds = (data) => {
  if (!data || data.length === 0 || data?.questions?.length === 0) return;

  const questionsCount = data?.questions?.length;
  let subquestionsGroup = [];

  let questionLetterIndex = 1;
  for (let i = 0; i < questionsCount; i++) {
    let question = data.questions[i];

    if (!question.isSubQuestion) {

      if (subquestionsGroup.length > 0) {
        for (let j = 0; j < subquestionsGroup.length; j++) {
          let subquestion = subquestionsGroup[j];
          subquestion.letterId = `Q${questionLetterIndex}${helpers.getSubquestionsLetterId(j)}`;
        }

        subquestionsGroup = [];
        questionLetterIndex++;
      }

      question.letterId = `Q${questionLetterIndex++}`;
    } else {
      const lastItem = subquestionsGroup[subquestionsGroup.length - 1];
      if (!lastItem) {
      } else if (lastItem.questionId !== question.questionId) {
        for (let j = 0; j < subquestionsGroup.length; j++) {
          let subquestion = subquestionsGroup[j];
          subquestion.letterId = `Q${questionLetterIndex}${helpers.getSubquestionsLetterId(j)}`;
        }

        subquestionsGroup = [];
        questionLetterIndex++;
      } else if (lastItem.questionId === question.questionId) {
        for (let j = 0; j < subquestionsGroup.length; j++) {
          let subquestion = subquestionsGroup[j];
          subquestion.letterId = `Q${questionLetterIndex}${helpers.getSubquestionsLetterId(j)}`;
        }

        if (i === (questionsCount - 1)) {
         question.letterId = `Q${questionLetterIndex}${helpers.getSubquestionsLetterId(subquestionsGroup.length)}`;
        }

      }

      subquestionsGroup.push(question);
    }
  }
};

function responseAnswersReducer(state, action) {
  switch (action.type) {
    case 'SET_QUESTIONS': {
      return { ...state, questions: action.payload };
    }
    case 'SET_OVERVIEW': {
      return { ...state, overview: action.payload };
    }
    case 'SET_QUESTION': {
      return { ...state, selectedQuestion: action.payload };
    }
    case 'SET_SELECTED_RESPONSES': {
      return { ...state, selectedResponses: action.payload };
    }
    case 'RESET_DATA': {
      return { questions: null, selectedQuestion: null, selectedResponses: new Set(), overview: null, loading: false };
    }
    default: {
      return state;
    }
  }
};

function ResponseAnswersProvider({children}) {
  const [state, dispatch] = React.useReducer(responseAnswersReducer, { questions: null, selectedQuestion: null, selectedResponses: new Set(), overview: null });
	const [loading, setLoading] = React.useState(false);
  
  const { selectedQuestion, questions, selectedResponses, overview } = state;

  const getSurveyQuestionsAndResponsesAPI = (surveyId,responseId) => {
    getSurveyQuestionsAndResponses(surveyId,false,responseId).then(survey => {
      setQuestionsAndAdjacentSubquestionsLetterIds(survey);
      if (survey.questions.length > 0) {
        const filteredQuestions = survey.questions.filter((question) => question.needsValidation);
        if (!filteredQuestions || filteredQuestions.length === 0) return;
        dispatch({ type: 'SET_QUESTIONS', payload: filteredQuestions });
        setSelectedResponse(new Set());
        if (selectedQuestion) {
          const activeQuestion = filteredQuestions.find((question) => {
            if (question.isSubQuestion) {
              return question.questionId === selectedQuestion.questionId && question.questionRow.id === selectedQuestion.questionRow.id;
            } else {
              return question.questionId === selectedQuestion.questionId;
            }
            
          });
          setQuestion({ ...activeQuestion, questionIndex: selectedQuestion.questionIndex });
        } else {
           setQuestion({ ...filteredQuestions[0], questionIndex: 0 });
        }
      }
    });
  };

  const fetchServeyDetail = (surveyId,responseId=0) => {
    getSurveyDetail(surveyId,responseId).then(detailedSurvey => {
      dispatch({ type: 'SET_OVERVIEW', payload: detailedSurvey });
    });
  };

  const getQuestions = (surveyId,responseId) => {
    getSurveyQuestionsAndResponsesAPI(surveyId,responseId);
  };

  const setQuestion = (question) => {
    dispatch({ type: 'SET_QUESTION', payload: question });
  };

  const onDeleteResponseAnswer = (responseId, responseAnswerId) => {
    const responses = selectedQuestion.responses.map((response) => {
      if (response.responseId === responseId) {
        const responseDataCollection = response.responseDataCollection.map((collectionItem) => {
          if (collectionItem.responseAnswerId === responseAnswerId) {
            collectionItem.isDeleted = true;
          }
          return collectionItem;
        });

        response.responseDataCollection = responseDataCollection;
      }
      return response;
    });

    setQuestion({
      ...selectedQuestion,
      responses
    });
  };

  const onUpdateResponseAnswer = (responseId, responseAnswerId, newText) => {
    const responses = selectedQuestion.responses.map((response) => {
      if (response.responseId === responseId) {
        const responseDataCollection = response.responseDataCollection.map((responseData) => {
          if (responseData.responseAnswerId === responseAnswerId) {
            responseData.text = newText;
            console.log('responseData', responseData);
          }
          return responseData;
        });

        response.responseDataCollection = responseDataCollection;
      }
      return response;
    });

    setQuestion({
      ...selectedQuestion,
      responses
    });
  };

  const setSelectedResponse = (responses) => {
    dispatch({ type: 'SET_SELECTED_RESPONSES', payload: responses });
  };

  const onValidateResponseAnswers = (surveyId,responseId=0) => {
		setLoading(true);
    let responseAnswerIds=[];
    Array.from(selectedResponses).forEach((res)=>{
      responseAnswerIds.push(res.responseAnswerId);
    });
    console.log("selectedResponses file",responseAnswerIds);
    validateResponseAnswers(Array.from(responseAnswerIds)).then(() => {
      fetchServeyDetail(surveyId,responseId);
      getSurveyQuestionsAndResponsesAPI(surveyId,responseId);
      setLoading(false);
    });
  };

  const resetData = () => {
    dispatch({ type: 'RESET_DATA' });
  };

  const value = {
    selectedQuestion,
    questions,
    selectedResponses,
    overview,
		loading,
    setSelectedResponse,
    getQuestions,
    setQuestion,
    onDeleteResponseAnswer,
    onUpdateResponseAnswer,
    onValidateResponseAnswers,
    fetchServeyDetail,
    resetData
  };

  return <ResponseAnswersContext.Provider value={value}>{children}</ResponseAnswersContext.Provider>;
};

export { ResponseAnswersProvider, ResponseAnswersContext };