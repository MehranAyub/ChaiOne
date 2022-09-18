
import { useState, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { updateResponseAnswer, deleteResponseAnswer } from '../../services/responseAnswersAPI';
import * as helpers from '../../utils/helpers';
import { ResponseAnswersContext } from '../../contexts/ResponseAnswersContext';
import { ReactComponent as TrashIcon } from '../../assets/trash.svg';
import './validate-responses.scss';
import React from 'react';

const getAnswerText = (collectionItem: any) => {
  return collectionItem?.weight ?? collectionItem?.text;
};

const Response = (props: any) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [text, setText] = useState<string>(props.collectionItem.text);
  var required = props.required;
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const { onDeleteResponseAnswer, onUpdateResponseAnswer } = useContext<any>(ResponseAnswersContext);
  const { collectionItem, cIndex, onCheckResponse, selectedResponses, isPendingTab, responseId,onUpdateResponse,afterUpdateInput } = props;
  const responseAnswerId = collectionItem.responseAnswerId;

  const handleClick = (e: any) => {
    const isChecked = e.target.checked;
    onCheckResponse(collectionItem, isChecked);
  };

  const handleFocus = () => {
    setEditMode(true);
    setText(getAnswerText(collectionItem));
  };

  const isValidText = (resAnswerId,textVal) => { 
    if((resAnswerId!=responseAnswerId)){
      return;
    }
    const re = /^[a-zA-Z0-9.\-\s\b\&\@]+$/
    if ((textVal==='' || re.test(textVal))) {  
      return true;
    } else { 
      return false;
    } 
  };

  const handleBlur = () => {
    // if (getAnswerText(collectionItem).trim() === text.trim()) {
    //   setEditMode(false);
    //   // setText(getAnswerText(''));
    //   return;
    // };
    // if ((!required || isValidText(text))) { 
      collectionItem.text=text;
      updateResponseAnswer(responseAnswerId, text)
        .then(res => {
          if (!res.errors || res.errors.length === 0) {
            collectionItem.text = text;
            afterUpdateInput(responseId, responseAnswerId);
          }
          setEditMode(false);
          // setText('');
          onUpdateResponseAnswer(responseId, responseAnswerId, text);
        })
        .catch(() => {
          setEditMode(false);
          // setText('');
        });
    // }
  };

  const onDelete = () => {
    deleteResponseAnswer(responseAnswerId)
      .then(() => {
        onDeleteResponseAnswer(responseId, responseAnswerId);
        setShowConfirmModal(false);
      }).catch(() => {
        setShowConfirmModal(false);
      });
  }; 
  const checked = Array.from(selectedResponses).find((elem:any,index)=>elem.responseAnswerId==collectionItem?.responseAnswerId)?true:false;
  return (
    <div className={`response-container row`}>
      {isPendingTab &&
        <label className="response-check col-1">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleClick} />
          <span className="checkmark"></span>
        </label>
      }

      <div className={`col-11 response${checked ? ' checked' : ''} ${!isValidText(collectionItem?.responseAnswerId,collectionItem?.text)? 'error':''}`} onClick={handleFocus}>
        <span className="index-number">{collectionItem.letterId}</span>
        {editMode ? <input
          id={`R${cIndex + 1}`}
          autoFocus
          type="text"
          name="responseText"
          value={text}
          onBlur={handleBlur}
          onChange={(e) => {    
            setText(e.target.value);
            onUpdateResponse(responseAnswerId,e.target.value)
            onUpdateResponseAnswer(responseId, responseAnswerId, e.target.value)
            // const re = /^[a-zA-Z0-9.\-\s\b\&]+$/
            // if (e.target.value === '' || re.test(e.target.value)) { 
            // required=false;
            // }
          }}
        /> :
          <span
            className="response-text"
            dangerouslySetInnerHTML={{
              __html: helpers.truncateString(getAnswerText(collectionItem))
            }}
          />
        }
        <button className='delete-btn' onClick={() => setShowConfirmModal(true)}><TrashIcon /></button>
      </div>
      {(!isValidText(collectionItem?.responseAnswerId,collectionItem?.text)) && 
        <div className='errorText col-12' style={{ paddingLeft: '3rem', paddingTop: '8px' }}>
          <label style={{ fontSize: 14, color: '#F74F10' }}>Special characters are not allowed (e.g. \ / * ^ #) </label> 
        </div>
      }

      {showConfirmModal &&
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          animation={false}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="true"
          backdropClassName="modal-backdrop.show modal-backdrop.dark"
        >
          <Modal.Header>
            <Modal.Title>Delete Response Answer</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this response answer?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onDelete} style={{ backgroundColor: '#0073a0' }}>Delete</Button>
            <Button variant="outline-secondary" onClick={() => setShowConfirmModal(false)} style={{ borderColor: '#0073a0' }}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      }
    </div>
  );
};

export default Response;