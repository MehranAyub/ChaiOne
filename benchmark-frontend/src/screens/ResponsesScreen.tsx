import { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

// Components
import UserRoleDropBox from '../components/UserRoleDropBox';

// Services
import * as surveysAPI from '../services/surveysAPI';
import * as userRolesAPI from '../services/userRolesAPI';
import * as responsesAPI from '../services/responsesAPI';

// Helpers
import * as helpers from '../utils/helpers';
import React from 'react';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


function truncateString(str: string, num: number = 30) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}


function ResponsesScreen(props: any) {
    const [isLoading, setIsLoading] = useState(true);
    const [responsesData, setResponsesData] = useState<any>([]);
    const [userRoles, setUserRoles] = useState<any>([]);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState<any>(false);
    const [responseGroups, setResponseGroups] = useState<any>([]);

    const handleClose = () => setShow(false);

    useEffect(() => {
        if (props.surveyId) {
            init();
        }
    }, [props.surveyId]);

    useEffect(() => {
        if (props.shouldChildRender) {
            init();
        }
    }, [props.shouldChildRender]);

    const init = () => {
        setIsLoading(true);
        Promise.all([getUserRoles(), getResponsesTabData(props?.surveyId,props?.responseId)]).then(_ => {
            setIsLoading(false);
            props.setShouldChildRender(false);
        });
    };

    const getResponsesTabData = async (surveyId: string,responseId:string) => {
        await surveysAPI.getSurveyQuestionsAndResponses(surveyId,false,responseId).then(response => {
            reverseQuestionResponsesOrder(response);
            setQuestionsAndAdjacentSubquestionsLetterIds(response);
            setResponsesData(response);
            createResponseGroupsForDataDisplay(response);
        });
    };

    const getUserRoles = async () => {
        await userRolesAPI.getUserRoles().then(response => {
            setUserRoles(response);
        });
    };

    const setQuestionsAndAdjacentSubquestionsLetterIds = (data: any) => {
        if (!data || data.length === 0 || data?.questions.length === 0) return;

        const questionsCount = data.questions.length;
        let subquestionsGroup:any = [];

        let questionLetterIndex = 1;
        for (let i = 0; i < questionsCount; i++) {
            let question:any = data.questions[i];

            if (!question.isSubQuestion) {

                if (subquestionsGroup.length > 0) {
                    for (let j = 0; j < subquestionsGroup.length; j++) {
                        let subquestion:any = subquestionsGroup[j];
                        subquestion.letterId = `Q${questionLetterIndex}${helpers.getSubquestionsLetterId(j)}`;
                    }

                    subquestionsGroup = [];
                    questionLetterIndex++;
                }

                question.letterId = `Q${questionLetterIndex++}`;
            } else {
                const lastItem:any = subquestionsGroup[subquestionsGroup.length - 1];

                if (!lastItem) {
                } else if (lastItem.questionId !== question.questionId) {

                    for (let j = 0; j < subquestionsGroup.length; j++) {
                        let subquestion:any = subquestionsGroup[j];
                        subquestion.letterId = `Q${questionLetterIndex}${helpers.getSubquestionsLetterId(j)}`;
                    }

                    subquestionsGroup = [];
                    questionLetterIndex++;
                } else if (lastItem.questionId === question.questionId) {

                    for (let j = 0; j < subquestionsGroup.length; j++) {
                        let subquestion:any = subquestionsGroup[j];
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

    const reverseQuestionResponsesOrder = (data: any) => {
        if (!data || (data && data?.length === 0) || data?.questions?.length === 0) return;

        data?.questions?.forEach((question: any) => question?.responses?.reverse());
    };

    const createResponseGroupsForDataDisplay = (response: any) => {
        const responseGroups = response.questions.map((question: any) => question.responses);
        setResponseGroups(responseGroups);
    };

    const getQuestionText = (question: any) => {
        if (!question) return '';

        let displayQuestion = `${question.letterId}. ${question.questionHeading}`;

        if (question.questionRow) {
            displayQuestion += question.questionRow.text;
        }

        return displayQuestion;
    };

    const getAnswerText = (responseDataCollection: []) => {
        if (responseDataCollection.length === 0) return '';

        let displayAnswer = '';
        responseDataCollection.forEach((answer: any, index: number) => {
            if (index > 0) {
                displayAnswer += ', ';
            }

            displayAnswer += answer?.weight ?? answer?.text;
        });

        return displayAnswer;
    };

    const removeResponse = async () => {
        const defaultResponseGroups = responseGroups;
        const filteredResponseGroups = responseGroups.map((g: any) => g.filter((gItem: any) => gItem.responseId !== showDelete));
        setShowDelete(false);
        
        await responsesAPI.deleteResponse(showDelete).catch((error: any) => {
            console.error('error', error);
            setResponseGroups(defaultResponseGroups);
        });

        setResponseGroups(filteredResponseGroups);
    };

    const handleClick = (e: any, data: any, target: any) => {
        const responseId = Number(target.getAttribute('itemID'));
        setShowDelete(responseId);
    }


    // if (isLoading) return <>
    //     <div className="loading-wrapper">
    //         <Spinner className="loading" animation="border" />
    //     </div>
    // </>

    return <div className="table-view">
        <div className="table-wrapper-custom">
            <Table hover={isLoading?false:true} variant="light">
                <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    animation={false}
                    style={Style.modal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop="true"
                    backdropClassName="modal-backdrop.show modal-backdrop.dark"
                >
                    <Modal.Header style={Style.modalHeader}>
                        <Modal.Title>Delete User Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={Style.modalBody}>This User Role is used on another Response and cannot be deleted.</Modal.Body>
                    <Modal.Footer style={Style.modalFooter}>
                        <Button variant="secondary" onClick={handleClose} style={{ backgroundColor: '#0073a0' }}>Ok</Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={showDelete}
                    onHide={() => setShowDelete(false)}
                    animation={false}
                    style={Style.modal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop="true"
                    backdropClassName="modal-backdrop.show modal-backdrop.dark"
                >
                    <Modal.Header style={Style.modalHeader}>
                        <Modal.Title>Delete Submission Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={Style.modalBody}>Deleteing this respondent’s submission will delete all responses they have provided for the survey. This action can not be undone.</Modal.Body>
                    <Modal.Footer style={Style.modalFooter}>
                        <Button variant="secondary" onClick={removeResponse} style={{ backgroundColor: '#0073a0' }}>Delete</Button>
                        <Button variant="outline-secondary" onClick={() => setShowDelete(false)} style={{ borderColor: '#0073a0' }}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                <thead>
                    <tr key={'responses-table-header'}>
                        <th className="table-sticky-head table-first-col">#</th>
                        <th className="table-sticky-head table-second-col">User Role</th>
                        {
                            responsesData?.questions?.map((question: any, index: number) => <th key={index} className="table-sticky-head responses-table-th">
                                <OverlayTrigger
                                    delay={{ show: 250, hide: 400 }}
                                    placement='bottom'
                                    overlay={
                                        <Tooltip id={`tooltip-${index}`}>
                                            <span dangerouslySetInnerHTML={{ __html: getQuestionText(question) }} />
                                        </Tooltip>
                                    }
                                >
                                    <span>{truncateString(getQuestionText(question))}</span>
                                </OverlayTrigger>

                            </th>)
                        }
                    </tr>
                </thead>

                <tbody style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
                    {
                      !isLoading &&  responseGroups[0]?.map((res: any, rIndex: number, resArr: []) =>
                            <ContextMenuTrigger
                                id='context-trigger'
                                attributes={{ itemID: res.responseId }}
                                key={rIndex}
                                renderTag="tr"
                            >
                                <td style={Style.td} className="table-sticky-col table-first-col">R{resArr.length - rIndex}</td>
                                <td style={{ ...Style.td }} className="table-sticky-col table-second-col" id={`th-${rIndex}`}>
                                    <UserRoleDropBox
                                        selectedItemID={res.userRoleId}
                                        addAction={userRolesAPI.createUserRole}
                                        assignAction={responsesAPI.assignUserRoleToResponse}
                                        removeAction={userRolesAPI.deleteUserRole}
                                        responseId={res.responseId}
                                        setShow={setShow}
                                        userRolesArr={userRoles}
                                        setUserRolesArr={setUserRoles}
                                        id={`th-${rIndex}`}
                                    />
                                </td>
                                {responseGroups.map((group: any, key: number) => <>
                                    <td
                                        key={key}
                                        style={Style.td}
                                        className="responses-table-td"
                                    >
                                        {
                                            <>
                                                <OverlayTrigger
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-${rIndex}`}>
                                                            <span dangerouslySetInnerHTML={{ __html: getAnswerText(group[rIndex].responseDataCollection) }} />
                                                        </Tooltip>
                                                    }
                                                >
                                                    <span>{truncateString(getAnswerText(group[rIndex].responseDataCollection))}</span>
                                                </OverlayTrigger>

                                            </>
                                        }
                                    </td>
                                </>)}

                            </ContextMenuTrigger>)
                    }
                    {!!isLoading &&
                    <tr><td colSpan={5}>
                     <Skeleton height={63} style={{ marginBottom: '10px' }} count={5} />                        
                        </td></tr>
                    }
                </tbody>

            </Table>

            <ContextMenu id="context-trigger">
                <MenuItem onClick={handleClick}>
                    Delete Submission
                </MenuItem>

            </ContextMenu>
        </div>
    </div>
}

const Style = {
    td: {
        verticalAlign: 'top'
    },
    modal: {
        bottom: '-36vh',
        position: 'absolute',
        maxWidth: '650px',
        marginLeft: '361px',
        marginRight: '83px'
    },
    modalHeader: {
        display: "flex",
        borderBottom: 'none',
        justifyContent: "center",
        alignItems: "center",
    },
    modalBody: {
        borderBottom: 'none',
        display: "flex",
        justifyContent: "center"
    },
    modalFooter: {
        display: "flex",
        borderTop: 'none',
        justifyContent: "center"
    },
    icon: {
        height: 16,
        width: 16,
        cursor: 'pointer'
    }
};

export default ResponsesScreen;
