import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button, Modal } from 'react-bootstrap';

import Response from './Response';
import { ResponseAnswersContext } from '../../contexts/ResponseAnswersContext';
import { validateSurvey } from '../../services/surveysAPI';
import './validate-responses.scss';

import { StatusType } from '../../enums/statusType';
import { SurveySource } from '../../enums/surveySource';
import { text } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

const Responses = (props: any) => {
  const [show, toggleModal] = useState(false);
  const [checked, toggleTerms] = useState(false);
  const [validating, setValidating] = useState(false);
  const { selectedResponses, setSelectedResponse } = useContext<any>(ResponseAnswersContext);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const { responses, isPendingTab, onDeleteResponseAnswer, isFinalize, surveyId,responseId, surveyData,afterUpdateIndex } = props;
  const history = useHistory();

  const isClosed = surveyData?.status === StatusType.Closed;
  const isChaiOne = surveyData?.source === SurveySource.ChaiOne;
  const hasCompany = !!surveyData?.companyId;
  const hasProject = !!surveyData?.projectId;
  const canFinalizeValidation = (isClosed || isChaiOne) && hasCompany && hasProject;

  useEffect(() => {
    if (selectedResponses.size === responses.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedResponses]);

  const onCheckResponse = (response: any, checked: boolean) => {
    const items = new Set(selectedResponses);

    if (checked) {
      items.add(response);
    } else {
      const foundItem = Array.from(items).find((elem:any,index)=>elem.responseAnswerId==response?.responseAnswerId);

      items.delete(foundItem);
    }

    setSelectedResponse(items);
  };

  const onConfirmFinalize = () => {
    setValidating(true);
    validateSurvey(surveyId,responseId || 0).then((resp) => {
      setValidating(false);
      toggleModal(false);
      if (resp && resp.status && resp.status === 500) return;
      history.push(`/pending-validations?validatedSurveyId=${surveyId}`);
    });
  };

  const isValidText = (textVal) => { 
    const re = /^[a-zA-Z0-9.\-\s\b\&\@]+$/
    if (textVal=== '' ||  re.test(textVal)) { 
      return true;
    }else{
      return false;
    } 
  };
  
  const handleSelectAll = () => {
    let newSelectedItems = new Set();
    if (!selectAll) {
      responses.forEach((collectionItem: any) => {
        newSelectedItems.add(collectionItem);
      });
    }
    setSelectedResponse(newSelectedItems);
  };

  const onUpdateResponse=(responseAnswerId,value)=>{
    const items = new Set(selectedResponses);  
    const foundItem:any = Array.from(items).find((elem:any,index)=>elem.responseAnswerId==responseAnswerId);
    if(foundItem){
      foundItem.text=value;  
     setSelectedResponse(items);
    }  
  }
  const afterUpdateInputData=(responseId, responseAnswerId)=>{ 
    afterUpdateIndex(responseId, responseAnswerId);
  }
  const openModal = () => {
    toggleModal(true);
  };

  if (isPendingTab && isFinalize && canFinalizeValidation) {
    return (
      <div className="finalize-response">
        <h2>Section Complete</h2>
        <p>All responses have been validated, please proceed to the next pending section.</p>
         <Button className="finalizeBtn"
            style={{ marginLeft: 16, marginRight: 32 }}
            onClick={openModal}
          >
            Finalize Validation
          </Button>

          <Modal
            show={show}
            onHide={() => toggleModal(false)}
            animation={false}
            aria-labelledby="contained-modal-title-vcenter"
            backdrop
            className="customModal"
          >
            <Modal.Header className="modalHeader">
              <Modal.Title className="title">Validation Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalBody">
              Make sure you have carefully reviewed all survey data before finalizing validation. Once validated, the survey will be pushed to the database and will no longer accept changes of any kind.
              <div className="term">
                <label className="checkbox">
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
            <Modal.Footer className="modalFooter">
              <button className="confirmBtn" disabled={!checked || validating} onClick={onConfirmFinalize}>Confirm Final Validations</button>
              <button className="cancelBtn" onClick={() => toggleModal(false)}>Cancel</button>
            </Modal.Footer>
          </Modal>
      </div>
    );
  }

  if (isPendingTab && (!responses || responses.length === 0)) {
    if (isPendingTab) {
      return (
        <div className="empty-response">
          <h2>Section Complete</h2>
          <p>All responses have been validated, please proceed to the next pending section.</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      {isPendingTab && <button className="select-all" onClick={handleSelectAll}>{selectAll ? 'Deselect all' : 'Select all'}</button>}
      <div className="response-wrapper">
        {responses.map((response: any, rIndex: number) => {
          return <Response
            key={`response-answer${rIndex}`}
            collectionItem={response}
            cIndex={rIndex}
            required={response?.text?.length>0 && !(isValidText(response?.text))?true:false}
            onCheckResponse={onCheckResponse}
            onUpdateResponse={onUpdateResponse}
            afterUpdateInput={afterUpdateInputData}
            selectedResponses={selectedResponses}
            onDeleteResponseAnswer={onDeleteResponseAnswer}
            isPendingTab={isPendingTab}
            responseId={response.responseId}
          />
        })}
      </div>
    </div>
  );
};

export default Responses;