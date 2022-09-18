import { useEffect, useState, useContext } from 'react';
import { useParams,Link  } from 'react-router-dom';
import moment from 'moment';
import { Breadcrumb, Card, Tab, Nav, Button, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import * as helpers from '../../utils/helpers';
import Responses from './Responses';
import { ScaleContext } from '../../contexts/ScaleContext';
import { FactorContext } from '../../contexts/FactorContext';
import { ResponseAnswersContext } from '../../contexts/ResponseAnswersContext';

import { ReactComponent as ArrowForward } from '../../assets/arrow-forward.svg';
import { ReactComponent as ArrowBackward } from '../../assets/arrow-backward.svg';
import './validate-responses.scss';
import { ReactComponent as CheckIcon } from '../../assets/check-icon.svg';
 import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validateResponseAnswers } from '../../services/responseAnswersAPI';
import React from 'react';
const statusLabels = ['New', 'Open', 'Closed'];

const setResponseLetterIds = (data: any) => {
  return data.map((response: any, index: number) => {
    const responseLetterId = `R${index + 1}`;
    const responseDataCollection = response.responseDataCollection.map((collectionItem: any, cIndex: number) => {
      if (response.responseDataCollection.length > 1) {
        return {
          ...collectionItem,
          letterId: `${responseLetterId}${helpers.getSubquestionsLetterId(cIndex)}.`
        }
      } else {
        return {
          ...collectionItem,
          letterId: `${responseLetterId}.`
        }
      }
    });
    return {
      ...response,
      responseDataCollection
    }
  });
};

const ValidateResponseScreen = () => {
  const [tab, setTab] = useState<any>('pending');

  const params = useParams<{ surveyId: string,responseId:string }>();
  const { scales } = useContext<any>(ScaleContext);
  const { factors } = useContext<any>(FactorContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    questions,
    overview,
    loading,
    selectedQuestion,
    getQuestions,
    setQuestion,
    selectedResponses,
    setSelectedResponse,
    fetchServeyDetail,
    resetData
  } = useContext<any>(ResponseAnswersContext);
  const surveyData = overview;

  useEffect(() => {
    fetchServeyDetail(params.surveyId,(params?.responseId || 0))
    getQuestions(params.surveyId,(params?.responseId || 0));

    return () => {
      resetData();
    }
  }, [params.surveyId]);

  const onQuestionSelect = (index: number, question: any) => {
    setSelectedResponse(new Set());
    setTab('pending');
    setQuestion({ ...question, questionIndex: index });
  };

  const handleNext = () => {
    const nextQuestionIndex = selectedQuestion.questionIndex + 1;
    if (nextQuestionIndex >= questions.length) return;
    setTab('pending');
    setSelectedResponse(new Set());
    setQuestion({
      ...questions[nextQuestionIndex],
      questionIndex: nextQuestionIndex
    });
  };

  const handlePrevious = () => {
    const previousQuestionIndex = selectedQuestion.questionIndex - 1;
    setTab('pending');
    setSelectedResponse(new Set());
    setQuestion({
      ...questions[previousQuestionIndex],
      questionIndex: previousQuestionIndex
    });
  };

  const getQuestionText = (question: any) => {
    if (!question) return '';

    let displayQuestion = `${question.questionHeading}`;

    if (question.questionRow) {
      displayQuestion += `- ${question.questionRow.text}`;
    }

    return displayQuestion;
  };


const onValidateResponseAnswers = (surveyId:any,responseId:any=0) => {
  try{
  setIsLoading(true);
  let responseAnswerIds:any=[];
  Array.from(selectedResponses).forEach((res:any)=>{
    responseAnswerIds.push(res.responseAnswerId);
  });
  console.log("selectedResponses file",responseAnswerIds);
  validateResponseAnswers(Array.from(responseAnswerIds)).then(() => {
    fetchServeyDetail(surveyId,responseId);
    getQuestions(surveyId,responseId); 
    setIsLoading(false);
  });
}catch(ex){
  setIsLoading(false);
}
};

  const handleValidate = () => {
    console.log("selectedResponses",selectedResponses);
    if (selectedResponses.size === 0) return;
    onValidateResponseAnswers(params.surveyId,(params?.responseId || 0));
  };

  if (!overview || !questions || !selectedQuestion) return null; 

  const title = overview.title.split('-');
  let factor;
  let scale;

  const lastResponse = overview.responses && ((overview.responses[overview.responses?.length - 1] && overview.responses[overview.responses?.length - 1]['dateModified'])
    || (overview.responses[overview.responses.length - 1] && overview.responses[overview.responses.length - 1]['dateCreated']));

  const questionResponse = setResponseLetterIds(selectedQuestion.responses);

  const filterDeletedResponse = questionResponse.map((response: any) => {
    const filteredAnswers = response.responseDataCollection.filter((collectionItem: any) => !collectionItem.isDeleted && collectionItem.needsValidation);
    return {
      ...response,
      responseDataCollection: filteredAnswers
    };
  });

  const pendingResponses: object[] = [];
  const validatedResponses: object[] = [];
  const allResponses: object[] = [];
  let validatedQuestions = 0;

  const responsesNeedsValidate = filterDeletedResponse.filter((response: any) => response.needsValidation && response.responseDataCollection.length > 0);
  responsesNeedsValidate.forEach((response: any) => {
    if (response.needsValidation && response.responseDataCollection.length > 0) {
      response.responseDataCollection.forEach((collectionItem: any) => {
        if (collectionItem.needsValidation && !collectionItem.isValidated) {
          pendingResponses.push({
            responseId: response.responseId,
            ...collectionItem
          });
        } else if (collectionItem.isValidated) {
          validatedResponses.push({
            responseId: response.responseId,
            ...collectionItem
          });
        }
        allResponses.push({
          responseId: response.responseId,
          ...collectionItem
        })
      });
    }
  });

  if (selectedQuestion.factorId && factors?.length > 0) {
    factor = factors.find((factor: any) => factor.id === selectedQuestion?.factorId);
  }

  if (selectedQuestion?.ratingScale) {
    const preScales = [`${selectedQuestion?.ratingScale?.split('-')[1] + ' is Positive'}`, `${selectedQuestion.ratingScale.split('-')[1] + " is Negative"}`];
    scale = preScales[selectedQuestion.predefinedScaleType];
  } else if (selectedQuestion?.scaleId && scales?.length > 0) {
    scale = scales.find((scale: any) => scale.id === selectedQuestion.scaleId);
  }

  const isValidText = (textVal) => { 
    const re = /^[a-zA-Z0-9.\-\s\b\&\@]+$/
    if (textVal=== '' ||  re.test(textVal)) { 
      return true;
    }else{
      return false;
    } 
  };

  const afterUpdateInputData=(responseId, responseAnswerId)=>{ 
    // console.log(item);
    console.log(responseId+'/'+responseAnswerId); 
    try{ 
      getQuestions(params.surveyId,(params?.responseId || 0)); 
    }catch{ 
    }
  }
  const isInvalidSelectedBoxes=  Array.from(selectedResponses).filter((x:any)=>isValidText(x.text)==false).length>0?true:false;
 
  return (
  
  <main className={`validate_response`}>
       {isLoading && <div className="loading-wrapper">
                <Spinner className="loading" animation="border" />
        </div>}

   <div id="validate_response"> 
    <div className="questions-section">
      <div className="top-section">
        <div className="navigation-link">
          <Link
          to={{pathname: `/overview/${params.surveyId}/${params?.responseId}`}} 
          >   <FontAwesomeIcon icon={faAngleLeft} />  BACK TO OVERVIEW
          </Link>
        </div>
        <div className="title">
          <h2>{title[0]}</h2>
          <h3>{title[1]}</h3>
          <p>Last sync {moment(overview.dateModified).format('D/mm/YY, h:mm a')}</p>
        </div>
        <div className="info">
          <p className="status">Status: {statusLabels[overview.status]}</p>
          <p className="status">Responses: {overview.responseCount} Respondents</p>
          <p className="status">Last Responses: {moment(lastResponse).isSame(moment(), 'day') ? <span>Today,  {moment(lastResponse).format('h:mma')} <span className="green-circle"></span></span> : moment(lastResponse).format('D MMM')}</p>
        </div>

      </div>
      <div className="questions">
        <ul>
          {questions.map((question: any, index: number) => {
            let pendingCount = 0;
            if(question.isValidated) {
              validatedQuestions +=1;
            }
            question.responses.forEach((response: any) => {
              response.responseDataCollection.forEach((collectionItem: any) => {
                if (!collectionItem.isDeleted && !collectionItem.isValidated && collectionItem.needsValidation) {
                  pendingCount += 1;
                }
              })
            });
            return <li
              key={index}
              onClick={() => onQuestionSelect(index, question)}
              className={`${selectedQuestion?.questionIndex === index ? 'active' : ''}${question.isValidated ? ' validated' : ''}`}
            >
              <OverlayTrigger
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip id={`tooltip-${index}`}>
                    <span dangerouslySetInnerHTML={{ __html: getQuestionText(question) }} />
                  </Tooltip>
                }
              >
                <span dangerouslySetInnerHTML={{ __html: helpers.truncateString(`${question.letterId}. ${getQuestionText(question)}`) }} />
              </OverlayTrigger>

              <span className="bubble">{question.isValidated && <CheckIcon />}</span>
              <span className="pending-responses-count">{pendingCount} Pending</span>
            </li>
          })}
        </ul>
      </div>
    </div>
    <div className="question-responses">

      {/* <Breadcrumb>
        <Breadcrumb.Item href="#">Validate</Breadcrumb.Item>
        <Breadcrumb.Item active>Internal Process Survey</Breadcrumb.Item>
      </Breadcrumb> */}
      
      {selectedQuestion &&
        <div>

          <Card>
            <Card.Body>
              <div className="questionInfo">
                <h2>{selectedQuestion.letterId}</h2>
                {factor && <div className="factor">{factor.name}</div>}
                {scale && <div className="factor scale">{scale.name}</div>}
              </div>
              <div className="question-title">
                <h3 dangerouslySetInnerHTML={{ __html: getQuestionText(selectedQuestion) }} />
              </div>
            </Card.Body>
            <Card.Footer className={selectedQuestion.questionIndex === 0 ? 'onlyNext' : ''}>
              {selectedQuestion.questionIndex > 0 && <button onClick={handlePrevious}><ArrowBackward /> Previous Question</button>}
              {selectedQuestion.questionIndex < (questions.length - 1) && <button onClick={handleNext}>Next Question <ArrowForward /></button>}
            </Card.Footer>
          </Card>

          <div className="responses">
            <Tab.Container id="response-tabs" activeKey={tab} onSelect={(k) => setTab(k)}>
              <div className="tabs-container">
                <Nav>
                  <Nav.Item>
                    <Nav.Link eventKey="pending">Pending ({pendingResponses.length})</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="validated">Validated ({validatedResponses.length})</Nav.Link>
                  </Nav.Item>
                  {/* <Nav.Item>
                    <Nav.Link eventKey="all">All ({allResponses.length})</Nav.Link>
                  </Nav.Item> */}
                </Nav>
                <div>
                  <Button 
                    onClick={handleValidate} 
                    disabled={loading || (selectedResponses.size === 0 || isInvalidSelectedBoxes)}
                    className="btn-validate"
                  >
                    Validate Data {(selectedResponses.size > 0 && `(${selectedResponses.size})`)}
                  </Button>
                  {selectedResponses.size > 0 && <Button variant="outline-primary" onClick={() => setSelectedResponse(new Set())}>Cancel</Button>}
                </div>
              </div>

              <Tab.Content>
                <Tab.Pane eventKey="pending">
                  <Responses 
                    responses={pendingResponses} 
                    isFinalize={validatedQuestions === questions.length}  
                    surveyId={params.surveyId} 
                    responseId={params?.responseId || 0}
                    surveyData={surveyData}
                    isPendingTab />
                </Tab.Pane>
                <Tab.Pane eventKey="validated">
                  <Responses responses={validatedResponses} surveyData={surveyData} responseId={params?.responseId || 0}  afterUpdateIndex={afterUpdateInputData} />
                </Tab.Pane>
                <Tab.Pane eventKey="all">
                  <Responses responses={allResponses} surveyData={surveyData} responseId={params?.responseId || 0} />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>

          </div>
        </div>
      }
    </div>
  </div>
  </main>
  )
}

export default ValidateResponseScreen;