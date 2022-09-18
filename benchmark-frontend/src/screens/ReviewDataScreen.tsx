import { useState, useEffect, useRef, useReducer } from 'react';

// Utils
import formatDate from '../utils/FormatDate';

// Services
import { getPendingSurveys, refetchSurveys, getSurveyDetail } from '../services/surveysAPI';

// Libraries
import { useHistory, Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';

// Components
import DataTable from '../components/DataTable';
import Pager from '../components/Pager';

// Images
import Check from '../assets/check.svg';
import BootstrapTable from '../components/Table/Table';
import SurveysDataTable from './PendingValidation/SurveysDataTable';
import React from 'react';


const initialState = {
    responsesData: [],
    overviewData: [],
    isLoading: false,
    surveyId: '',
    tabIndex: 0
};

function reducer(state: any, action: any) {
    switch (action.type) {
        case 'setResponsesData':
            return {
                ...state,
                responsesData: action.data.responsesData
            };
        case 'setOverviewData':
            return {
                ...state,
                overviewData: action.data.tableData,
                surveyId: action.data.surveyId
            };
        case 'isLoading':
            return {
                ...state,
                isLoading: action.data.isLoading,
                surveyId: action.data.surveyId
            };
        case 'setTabIndex':
            return {
                ...state,
                tabIndex: action.data.tabIndex
            };
        default:
            throw new Error();
    }
}

function ReviewDataScreen(props: any) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [totalPage, setTotalPage] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [tableData, setTableData] = useState<any>([]);
    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);
    const [currentSurveyId, setCurrentSurveyId] = useState(0);

    let history = useHistory();
    const todayDateObj = useRef(formatDate(new Date().toDateString()));
    const numberItemsPerPage = 10;

    let shouldChildRender = useRef(false);

    useEffect(() => {
        const queryString = new URLSearchParams(props.location.search);
        const validatedSurveyId = queryString.get('validatedSurveyId');
        if (validatedSurveyId) {
            getSurveyDetail(validatedSurveyId).then((survey: any) => {
                setModalMessage(`“${survey?.title}” has been succesfully validated`);
                setModalShow(true);
            });
        }
    }, []);

    useEffect(() => {
        try {
            dispatch({
                type: 'isLoading', data: {
                    isLoading: true
                }
            });
            getPendingSurveys(activePage, numberItemsPerPage).then((surveys: any) => {
                setTotalPage(surveys.totalPages);
                if (surveys.data) {
                    setTableData([...surveys.data]);
                }else{
                    setTableData([]);
                }
                dispatch({
                    type: 'isLoading', data: {
                        isLoading: false
                    }
                });

            });
        } catch {
            dispatch({
                type: 'isLoading', data: {
                    isLoading: false
                }
            });
        }
    }, [activePage]);

    const syncSurvey = async (surveyId: any) => {
        // dispatch({
        //     type: 'isLoading', data: {
        //         isLoading: true,
        //         surveyId: surveyId
        //     }
        // });
        try {
            setIsLoadingSpinner(true);
            setCurrentSurveyId(surveyId)
            await refetchSurveys(surveyId);
            shouldChildRender.current = true;

            const surveys: any = await getPendingSurveys(activePage, numberItemsPerPage);
            setTableData([...surveys.data]);

            // dispatch({
            //     type: 'isLoading', data: {
            //         isLoading: false,
            //         surveyId: ''
            //     }
            // });

            setIsLoadingSpinner(false);
            setCurrentSurveyId(0)
        } catch (ex) {
            setIsLoadingSpinner(false);
            setCurrentSurveyId(0)
            console.error(ex.toString());
        }
    };



    const reviewAction = (surveyId: any, responseId: number = 0) => {
        history.push(`/overview/${surveyId}/${responseId}`);
    };

    return <main className="validate-screen">
        <div className="top-panel"></div>

        <div className="table-wrapper" >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Pending Validation</h2>
            </div>

            <SurveysDataTable
                name="pending-validation"
                data={tableData}
                todayDateObj={todayDateObj.current}
                headers={['Form Name', 'Company', 'Project', 'Responses', 'Last Response', 'Status', 'Progress', 'Last Sync', '']}
                sorting={[4]}
                labels={['title', 'companyId', 'projectId', 'responseCount', '', 'status', '', '', 'updatedDate']}
                buttons={[8]}
                buttonLabels={['Sync', 'Review']}
                buttonAction={[syncSurvey, reviewAction]}
                progress={6}
                setUpdateQuestions={[]}
                formatCells={{
                    'companyId': [1],
                    'projectId': [2],
                    'lastresponse': [4],
                    'status': [5],
                    'progress': [6],
                    'datetimesync': [7]
                }}
                isLoading={state.isLoading}
                isLoadingSpinner={isLoadingSpinner}
                currentSurveyId={currentSurveyId}
            />

            <Pager totalPage={totalPage}
                activePage={activePage}
                setActivePage={setActivePage}
            />

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

                        <Link
                            className="btn btn-primary btn-review-data"
                            to="/compute-score/0/0"
                            onClick={_ => { }}>
                            Compute Score
                        </Link>
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    </main>
}

const Style = {
    modalBody: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    modalContent: {
        display: 'flex',
        alignItems: 'center'
    }
};

export default ReviewDataScreen;
