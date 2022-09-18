import { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { Table, Button, Modal, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Popover from 'react-bootstrap/Popover';
// Libraries
import {
  useParams,
  useHistory,
  Link
} from "react-router-dom";

// Services
import { getCompanies } from '../../services/companyAPI';
import { getSurveyDetail, getSurveyQuestions, refetchSurveys, validateSurvey } from '../../services/surveysAPI';
import OverviewScreen from '../OverviewScreen';
import QuestionsScreen from '../QuestionsScreen'; 
import Tabs from '../../components/Tabs';
import Check from '../../assets/check.svg';
import { StatusType } from '../../enums/statusType';
import { SurveySource } from '../../enums/surveySource';

// Images
import Sync from '../../assets/sync.svg';
import SyncDisabled from '../../assets/sync-disabled.svg';
import formatDateTime from '../../utils/FormatDateTime';
import ResponsesScreen from '../ResponsesScreen';
import styles from './overview.module.scss';
import * as surveysAPI from '../../services/surveysAPI';
import { validateResponseAnswers } from '../../services/responseAnswersAPI';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import React from 'react';
const initialState = {
  questionsData: [],
  surveyData: null,
  isLoading: true,
  surveyId: '',
  questionId: '',
  tabIndex: 0
};

const Style = {
  modalBody: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  modalContent: {
      display: 'flex',
      alignItems: 'center'
  },
  sync: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 32
  },
  header: {
      display: 'flex',
      justifyContent: 'space-between'
  }
};
function reducer(state: any, action: any) {
  switch (action.type) {
    case 'setQuestionsData':
      return {
        ...state,
        questionsData: action.data.tableData,
        questionId: action.data.questionId,
        isLoading: false,
      };

    case 'setOverviewData':
      return {
        ...state,
        surveyData: action.data.tableData,
        surveyId: action.data.surveyId
      };
    case 'isLoading':
      return {
        ...state,
        isLoading: action.data.isLoading,
        surveyId: action.data.surveyId,
        questionId: action.data.questionId
      };
    case 'setTabIndex':
      return {
        ...state,
        tabIndex: action.data.tabIndex
      };
    case 'setOverviewDataCompanyId':
      const newSurveyData = { ...state.surveyData, companyId: action.data.companyId };
      return {
        ...state,
        surveyData: newSurveyData
      };
    case 'setOverviewDataProjectId':
      {
        const newSurveyData = { ...state.surveyData, projectId: action.data.projectId };
        return {
          ...state,
          surveyData: newSurveyData
        };
      }
    case 'setOverviewDataIndustryId':
      {
        const newSurveyData = { ...state.surveyData, industryIds: action.data.industryIds };
        return {
          ...state,
          surveyData: newSurveyData
        };
      }
    case 'setOverviewDataProcessId':
      {
        const newSurveyData = { ...state.surveyData, processIds: action.data.processIds };
        return {
          ...state,
          surveyData: newSurveyData
        };
      }
    default:
      throw new Error();
  }
}

function ReviewDataScreen(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [lastSyncTime, setLastSyncTime] = useState(formatDateTime(new Date().toString()));
  const [tabIndex, setTabIndex] = useState(0);
  const [show, toggleModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [checked, toggleTerms] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validatedAllQuestions, setValidatedAllQuestions] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [modalShow, setModalShow] = React.useState(false);  
  const [modalMessage, setModalMessage] = React.useState('');  
  const [questionValidationProgress, setquestionValidationProgress] = React.useState(0);  
  const [isLoadingSpinner, setIsLoadingSpinner] = React.useState(false);
  const history = useHistory();

  const params = useParams<{ surveyId: string,responseId:string}>();
  let { surveyData, questionsData } = state;

  let shouldChildRender = useRef(false);

  const updateOverviewCompanyId = useCallback((companyId) => {
    dispatch({
      type: 'setOverviewDataCompanyId', data: {
        companyId,
      }
    });
    setCompanyId(companyId);
  }, []);
  const updateOverviewProjectId = useCallback((projectId) => {
    dispatch({
      type: 'setOverviewDataProjectId', data: {
        projectId,
      }
    });
    setProjectId(projectId);
  }, []);
  const updateOverviewIndustryIds = useCallback((industryIds) => {
    dispatch({
      type: 'setOverviewDataIndustryId', data: {
        industryIds,
      }
    });

  }, []);
  const updateOverviewprocessIds = useCallback((processIds) => {
    dispatch({
      type: 'setOverviewDataProcessId', data: {
        processIds,
      }
    });
  }, []);




  useEffect(() => {
    getSurveyDetail(params.surveyId,Number(params?.responseId || 0)).then(async detailedSurvey => { 
      setCompanyId(detailedSurvey.companyId);
      setProjectId(detailedSurvey.projectId);

      await dispatch({
        type: 'setOverviewData', data: {
          tableData: { ...detailedSurvey },
          surveyId: params.surveyId
        }
      });
    });

    fetchSurveyQuestions();
    getCompanies().then((_) => { }); 
  }, []);

  const setShouldChildRender = (value: boolean) => shouldChildRender.current = value;

  const setQuestions = (questions: any) => {
    dispatch({
      type: 'setQuestionsData', data: {
        tableData: [...questions]
      }
    });
    console.log("questionsData",questionsData);
    console.log("updateQuestions",questions);
  };

  const fetchSurveyQuestions = () => {
    getSurveyQuestions(params.surveyId,params.responseId).then(survey => {
      setQuestions(survey.questions);

       surveysAPI.getSurveyQuestionsAndResponses(params.surveyId,false,params.responseId).then(response => {
        dispatch({
          type: 'isLoading', data: {
            isLoading: false
          }
        }); 
        if (!response || (response && response?.status === 500) || (response && response?.questions?.length === 0)) return;
          
        const needsValidationQuestions:any =Array.from(response?.questions).filter((x:any)=>x.needsValidation==true);
        const needsValidationAndValidateQuestions:any =Array.from(response?.questions).filter((x:any)=>x.needsValidation==true && x.isValidated==true);
    
        if(needsValidationAndValidateQuestions?.length==needsValidationQuestions?.length){
          setValidatedAllQuestions(true);
          setquestionValidationProgress(100);
        }else{
          let progress=((Number(needsValidationAndValidateQuestions.length)/Number(needsValidationQuestions.length))*100)?.toFixed(0)
          setquestionValidationProgress(Number(progress));
          setValidatedAllQuestions(false);
        } 
      });

    });
  };

  const syncSurvey = async (surveyId: any) => {
    // dispatch({
    //   type: 'isLoading', data: {
    //     isLoading: true,
    //     surveyId: surveyId
    //   }
    // });
    try{
      setIsLoadingSpinner(true);
      const result=  await refetchSurveys(surveyId);

      getSurveyDetail(surveyId,Number(params?.responseId || 0)).then(async detailedSurvey => {
        setCompanyId(detailedSurvey.companyId);
        setProjectId(detailedSurvey.projectId);
    
        await dispatch({
          type: 'setOverviewData', data: {
            tableData: { ...detailedSurvey },
            surveyId: surveyId
          }
        });
      });
    
        getSurveyQuestions(surveyId,params.responseId).then(survey => {
          dispatch({
            type: 'setQuestionsData', data: {
              tableData: [...survey.questions]
            }
          });
          setQuestions(survey.questions);
          setLastSyncTime(formatDateTime(survey.updatedDate || survey.createdDate));
        });

      setIsLoadingSpinner(false);
    }catch(ex){
      setIsLoadingSpinner(false);
      console.error(ex.toString());
    } 
  };

  const setUpdateQuestions=(response:any)=>{
  }

  const onConfirmFinalize = () => {
    setValidating(true);
    validateSurvey(params.surveyId,params?.responseId).then((resp) => {
      fetchSurveyQuestions();
      setValidating(false);
      toggleModal(false);
      setTabIndex(0);
      if (resp && resp.status && resp.status === 500) return;
      history.push(`/pending-validations?validatedSurveyId=${params.surveyId}`);
    });
  };


  if (!surveyData) return null;

  let isDisabledFinalize = false;
  //let validatedQuestions = 0;
  questionsData = questionsData.filter((a: any) => a?.numberOfResponses > 0);
  for (let i = 0; i < questionsData.length; i++) {
    if ((questionsData[i]?.questionRows?.length==0) && (questionsData[i]?.ratingScale  && questionsData[i]?.ratingScale?.length>0 )
      && (questionsData[i]?.predefinedScaleType === null || questionsData[i]?.predefinedScaleType === undefined)) {
         
          isDisabledFinalize = true; 
      break;
    }

    for (let y = 0; y < questionsData[i]?.questionRows?.length; y++) {
      if ((questionsData[i]?.questionRows[y]?.ratingScale  && questionsData[i]?.questionRows[y]?.ratingScale?.length>0 )
        && (questionsData[i]?.questionRows[y]?.predefinedScaleType === null || questionsData[i]?.questionRows[y]?.predefinedScaleType === undefined)) {
           
            isDisabledFinalize = true; 
        break;
      }
    }
  }

  //Getting total validated questions
//   let totalQuestions=0;
//   let totalValidatedQuestions=0;
//   for (let i = 0; i < questionsData?.length; i++) {
//     totalQuestions+=1;
//     if ((questionsData[i]?.isValidated==true)) {
//       totalValidatedQuestions+=1;
//     }

//     for (let y = 0; y < questionsData[i]?.questionRows?.length; y++) {
//       totalQuestions+=1;
//       if ((questionsData[i]?.questionRows[y]?.isValidated==true)) {
//         totalValidatedQuestions+=1;
//       }
//     }
//   }
//  console.log("totalQuestions"+totalQuestions);
//  console.log("totalValidatedQuestions"+totalValidatedQuestions);
//  let questionValidationProgress=((Number(totalValidatedQuestions)/Number(totalQuestions))*100)?.toFixed(0)
  // for (let i = 0; i < questionsData.length; i++) {
  //   if (questionsData[i].isValidated) {
  //     validatedQuestions++;
  //   }
  // }



  const hasNoQuestions = questionsData.length === 0;

  const getValidateToolTipText = () => {
    let tooltipText = '';
    if(hasNoQuestions){
      tooltipText='There are no data to validate in this survey.'
    }
  return tooltipText;
  }
  const handleFinalize = () => {
    if (isDisabledFinalize) {
      setShowErrorModal(true);
    } else {
      toggleModal(true);
    }
  };



const getSurveyQuestionsAndResponses = async () => {  
  dispatch({
    type: 'isLoading', data: {
      isLoading: true
    }
  }); 
    await surveysAPI.getSurveyQuestionsAndResponses(params.surveyId,false,params.responseId).then(response => {
      dispatch({
        type: 'isLoading', data: {
          isLoading: false
        }
      }); 
      if (!response || (response && response?.status === 500) || (response && response?.questions?.length === 0)) return;
        filterResponses(response);
    });
};

const filterResponses = (response: any) => {
  let responseAnswerIds:any=[];
  if(response?.questions?.length>0){
  const filterQuestions:any =Array.from(response?.questions).filter((x:any)=>x.needsValidation==true && x?.isValidated==false && (!(x?.predefinedScaleType==null || x?.predefinedScaleType==undefined) || (x?.scaleId?.length>0)));
  for(let i=0;i<filterQuestions?.length;i++){
    console.log('filterQuestions'+i,filterQuestions);
    const filterResponses:any=Array.from(filterQuestions[i]?.responses).filter((x:any)=>x.needsValidation==true && x?.isValidated==false);
    filterResponses.forEach((responseItem,index)=>{
      Array.from(responseItem?.responseDataCollection)?.filter((x:any)=>x?.needsValidation==true && x?.isValidated==false).forEach((responseDataCollectionItem:any)=>{
        responseAnswerIds.push(responseDataCollectionItem?.responseAnswerId);
      });
    });
  } 
  if(responseAnswerIds?.length>0){
  onValidateResponseAnswers(responseAnswerIds);
  }else{
    const needsValidationQuestions:any =Array.from(response?.questions).filter((x:any)=>x.needsValidation==true);

    if(needsValidationQuestions?.length>0){
      let responseId=0;
      if(!!params.responseId && Number(params.responseId)>0){   
        responseId=Number(params.responseId);
      }
      window.location.href=`/validate/${params.surveyId}/${responseId}`;
    }else{
      setModalMessage(`There are no data to validate in this survey`); 
      setModalShow(true);
    }
  }
}
};

const onValidateResponseAnswers = (responseAnswerIds) => {
  dispatch({
    type: 'isLoading', data: {
      isLoading: true
    }
  });  
  validateResponseAnswers(responseAnswerIds).then(() => {
    dispatch({
      type: 'isLoading', data: {
        isLoading: false
      }
    }); 
    let responseId=0;
    if(!!params.responseId && Number(params.responseId)>0){   
      responseId=Number(params.responseId);
    }  
    window.location.href=`/validate/${params.surveyId}/${responseId}`;
  });
};


  const getToolTipText = () => {
    let tooltipText = '';
    if (!(projectId?.length>0 && companyId?.length>0) && (isDisabledFinalize)) {
      tooltipText = 'Before you can finalize the validation, you must complete all the required fields in <strong> Overview </strong> and <strong> Questions</strong>.';
    }
    else if (isDisabledFinalize) {
      tooltipText = 'Before you can finalize the validation, you must complete all the required fields in <strong> Questions</strong>.';
    }
    else if (!(projectId && companyId)) {
      tooltipText = 'Before you can finalize the validation, you must complete all the required fields in <strong> Overview</strong>.';
    }
    else if(!(validatedAllQuestions)){
      tooltipText = 'Before you can finalize the validation, you must validate all the <strong> Questions</strong>.';
    }
    else if(!(surveyData?.status === StatusType.Closed)){
      tooltipText = 'Before you can finalize validation, your survey should be <strong>Closed</strong>.';
    }
    else if(!(surveyData?.source === SurveySource.ChaiOne)){
      tooltipText = 'Before you can finalize validation, your survey should be <strong>ChaiOne</strong>.';
    }

    return tooltipText;
  };
  const canFinalizeValidation = (): boolean => {
    const isClosed = surveyData?.status === StatusType.Closed;
    const isChaiOne = surveyData?.source === SurveySource.ChaiOne;
    const hasCompany = !!companyId;
    const hasProject = !!projectId;
    const hasValidatedAllQuestions=!!validatedAllQuestions;
    const canFinalizeValidation =  (isClosed || isChaiOne)
      && hasCompany
      && hasProject
      && hasValidatedAllQuestions;
    return canFinalizeValidation;
  };   
  return state.surveyData && <main className="validate-screen">
    <div className="top-panel"></div>
    <div className="table-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between' ,flexWrap:'wrap',padding:'0 32px'}} >
        <header style={{ maxWidth: '50%'}} >
          <h2 style={{paddingLeft:'0px'}}>{surveyData.title}</h2>
        </header>

        {!state.isLoading &&
          <div style={{ display: 'flex', alignItems: 'center' }}  >
            <div className="sync-label">
              {`Last sync `}{lastSyncTime}
            </div>
            
            {surveyData.status !== StatusType.Closed
              ? <div className="logo-div"><img src={Sync} alt="Sync"     className={` ${isLoadingSpinner ? "image-spin" : "sync-logo"}`}  onClick={() =>isLoadingSpinner==false? syncSurvey(surveyData.id):''} /></div>
              : <img src={SyncDisabled} alt="Sync" className="sync-disabled-logo" />
            }
            
            {/* {((validatedQuestions == questionsData.length) || (hasNoQuestions)) ?
              <OverlayTrigger
                placement="bottom-start"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Popover id="popover-contained" placement="bottom-start" style={{ padding: 12, fontSize: 12 }} >
                    <span dangerouslySetInnerHTML={{ __html: getValidateToolTipText() }} />
                  </Popover>
                }>
                <span className="d-inline-block" style={{ marginLeft: 16 }}>
                  <Button
                    as={Link}
                    onClick={getSurveyQuestionsAndResponses}
                    className={`btn-review ${(validatedQuestions == questionsData.length) || (hasNoQuestions) ? 'disabled' : ''}`}
                    disabled={(validatedQuestions == questionsData.length) || (hasNoQuestions)}
                    style={{ height: 48, marginRight: 0, display: 'flex', alignItems: 'center' }}
                  >
                    Validate Data
                  </Button>
                </span>
              </OverlayTrigger>*/}
              <Button 
              as={Link}
              onClick={getSurveyQuestionsAndResponses}
                className={`btn-review`}
                style={{ height: 48, marginLeft: 16, display: 'flex', alignItems: 'center' }}
              >
                Validate Data
              </Button>


            {(!canFinalizeValidation() || isDisabledFinalize) ?
            <OverlayTrigger
              placement="bottom-start"
              delay={{ show: 250, hide: 400 }} 
              overlay={ 
                <Popover id="popover-contained" placement="bottom-start" style={{ padding: 12, fontSize: 12 }} >
                 {getToolTipText()?.length>0 && <span dangerouslySetInnerHTML={{ __html: getToolTipText() }} />}
                </Popover>
              }>
            

              <span className="d-inline-block">
                <Button
                  className={styles.finalizeBtn}
                  style={{ marginLeft: 16, pointerEvents: (canFinalizeValidation() && !isDisabledFinalize) ? 'auto' : 'none' }}
                  onClick={handleFinalize}
                  disabled={!canFinalizeValidation() ||  isDisabledFinalize}
                >
                  Finalize Validation
                </Button>
              </span>

            </OverlayTrigger>
            :<Button
            className={styles.finalizeBtn}
            style={{ marginLeft: 16 }}
            onClick={handleFinalize}
          >
            Finalize Validation
          </Button>
            }
          </div>
        }
      </div>

      <Tabs
        tabs={['Overview', 'Questions', 'Responses']}
        setTabIndex={setTabIndex}
        tabIndex={tabIndex}
        overviewValidation={!(companyId && projectId)}
        questionsValidation={(isDisabledFinalize)} />

      {tabIndex === 0 && <OverviewScreen
        overviewData={surveyData}
        setCompanyId={setCompanyId}
        setProjectId={setProjectId}
        surveyId={surveyData.id}
        responseId={params.responseId}        
        questionValidationProgress={questionValidationProgress}
        updateOverviewCompanyId={updateOverviewCompanyId}
        updateOverviewProjectId={updateOverviewProjectId}
        updateOverviewIndustryIds={updateOverviewIndustryIds}
        updateOverviewprocessIds={updateOverviewprocessIds}
      />}

      {
        state.isLoading &&
        <div className="loading-wrapper">
          <Spinner className="loading" animation="border" />
        </div>
      }

      {tabIndex === 1 && <QuestionsScreen 
      questionsData={questionsData} 
      setUpdateQuestions={setUpdateQuestions}
      setQuestions={setQuestions}
      surveyId={surveyData.id} />}

      {
        tabIndex === 2 && surveyData &&
        <ResponsesScreen
          surveyId={surveyData.id}
          responseId={params.responseId}
          shouldChildRender={shouldChildRender.current}
          setShouldChildRender={setShouldChildRender} />
      }

    </div>

    <Modal
      show={show}
      onHide={() => toggleModal(false)}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop
      className={styles.customModal}
    >
      <Modal.Header className={styles.modalHeader}>
        <Modal.Title className={styles.title}>Validation Confirmation</Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        Make sure you have carefully reviewed all survey data before finalizing validation. Once validated, the survey will be archived and will no longer accept changes of any kind.
        <div className={styles.term}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleTerms(!checked)}
            />
            <span />
            I have reviewed the survey and agree to final submision
          </label>
        </div>
      </Modal.Body>

      <Modal.Footer className={styles.modalFooter}>
        <button className={styles.confirmBtn} disabled={!checked || validating} onClick={onConfirmFinalize}>Confirm Final Validation</button>
        <button className={styles.cancelBtn} onClick={() => toggleModal(false)}>Cancel</button>
      </Modal.Footer>
    </Modal>

    <Modal
      show={showErrorModal}
      onHide={() => setShowErrorModal(false)}
      animation={false}
      style={styles.modal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="true"
      backdropClassName="modal-backdrop.show modal-backdrop.dark"
    >
      <Modal.Header className={styles.modalHeader}>
        <Modal.Title>Question Scales are required.</Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>Please assign Scale to questions.</Modal.Body>

      <Modal.Footer className={styles.modalFooter}>
        <Button variant="secondary" onClick={() => setShowErrorModal(false)} style={{ backgroundColor: '#0073a0' }}>Ok</Button>
      </Modal.Footer>
    </Modal>

    <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Body>
          <div style={Style.modalBody}>
              <div style={Style.modalContent}>
                  <img src={Check} alt="Check" className="check-logo" />
                  <div className="modal-note">{modalMessage}</div>
              </div> 
          </div>
      </Modal.Body>
  </Modal>

  </main>
}

export default ReviewDataScreen;
