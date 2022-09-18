import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { Button, Modal, Spinner, Table } from 'react-bootstrap';
import { Link } from "react-router-dom";
import formatDateTime from '../utils/FormatDateTime';
import { postImportSurveys } from "../services/importSurveysAPI";
import { postSurveyMonkeyList } from "../services/surveyMonkeyAPI";
import { getIgnored, importIgnoredSurvey } from "../services/surveysAPI";
import Tabs from '../components/Tabs';
import Pager from '../components/Pager';
import Check from '../assets/check.svg';
import Sync from '../assets/sync.svg';
import StatusCell from '../components/StatusCell';
import DateCell from '../components/DateCell';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
export interface DashboardScreenProps {
    awaitingData: Data[],
    awaitingTotalPage: number,
    awaitingActivePage: number,
    awaitingLastSync: string,
    ignoredData: Data[],
    ignoredTotalPage: number,
    ignoredActivePage: number,
    ignoredLastSync: string;
}
export interface Data {

}

const initialState: DashboardScreenProps = {
    awaitingData: [],
    awaitingTotalPage: 1,
    awaitingActivePage: 1,
    awaitingLastSync: '',
    ignoredData: [],
    ignoredTotalPage: 1,
    ignoredActivePage: 1,
    ignoredLastSync: ''
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

function reducer(state: DashboardScreenProps, action: any) {
    switch (action.type) {
        case 'setAwaiting':
            return {
                ...state,
                awaitingTotalPage: action.data.totalPage,
                awaitingData: action.data.tableData
            };
        case 'setIgnored':
            return {
                ...state,
                ignoredTotalPage: action.data.totalPage,
                ignoredData: action.data.tableData
            };
        case 'setAwaitingActivePage':
            return {
                ...state,
                awaitingActivePage: action.data.activePage,
            };
        case 'setIgnoredActivePage':
            return {
                ...state,
                ignoredActivePage: action.data.activePage,
            };
        case 'setAwaitingTableData':
            return {
                ...state,
                awaitingData: action.data.tableData
            };

        case 'setAwaitingLastSync':
            return {
                ...state,
                awaitingLastSync: action.data.awaitingLastSync
            };
        case 'setIgnoredLastSync':
            return {
                ...state,
                ignoredLastSync: action.data.ignoredLastSync
            };
        case 'importIgnored':
            return {
                ...state,
                ignoredData: action.data.ignoredData
            }
        default:
            throw new Error();
    }
};

function DashboardScreen() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [tabIndex, setTabIndex] = useState(0);
    const [modalShow, setModalShow] = React.useState(false);
    const [surveyId, setSurveyId] = React.useState(0);
    const [modalMessage, setModalMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingSpinner, setIsLoadingSpinner] = React.useState(false);
    const numberItemsPerPage = 10;

    const fetchAwaitingSurveys = async () => {
        try {
            setIsLoadingSpinner(true);
            let surveys: any = await postSurveyMonkeyList(state.awaitingActivePage, numberItemsPerPage);
            dispatch({
                type: 'setAwaiting', data: {
                    totalPage: Math.ceil(surveys.total / numberItemsPerPage),
                    tableData: [...surveys.data]
                }
            });
            dispatch({
                type: 'setAwaitingLastSync', data: {
                    awaitingLastSync: formatDateTime(new Date().toString())
                }
            });
            setIsLoadingSpinner(false);
        } catch (ex) {
            setIsLoadingSpinner(false);
            console.error(ex.toString());
        }
    };

    const fetchIgnoredSurveys = async () => {
        try {
            setIsLoadingSpinner(true);
            var surveys: any;
            surveys = JSON.parse(sessionStorage.getItem('surveyIgnoredData') || '[]');
            if (!!surveys && surveys.length > 0) {
                dispatch({
                    type: 'setIgnored', data: {
                        totalPage: Math.ceil(surveys.length / numberItemsPerPage),
                        tableData: [...surveys]
                    }
                })
                dispatch({
                    type: 'setIgnoredLastSync', data: {
                        ignoredLastSync: formatDateTime(new Date().toString())
                    }
                });
                setIsLoadingSpinner(false);
            } else {
                surveys = await getIgnored();
                dispatch({
                    type: 'setIgnored', data: {
                        totalPage: Math.ceil(surveys.length / numberItemsPerPage),
                        tableData: [...surveys]
                    }
                })
                dispatch({
                    type: 'setIgnoredLastSync', data: {
                        ignoredLastSync: formatDateTime(new Date().toString())
                    }
                });
                setIsLoadingSpinner(false);
                sessionStorage.setItem('surveyIgnoredData', JSON.stringify(surveys) || '[]');
            }
        } catch (ex) {
            setIsLoadingSpinner(false);
            sessionStorage.removeItem('surveyIgnoredData');
        }
    };

    useEffect(() => {
        (async function () {
            fetchAwaitingSurveys();
        })();
    }, [state.awaitingActivePage]);


    useEffect(() => {
        (async function () {
            if (tabIndex === 1) {
                fetchIgnoredSurveys();
            }
        })();
    }, [tabIndex]);

    const importSurveysComplete = useCallback((surveyId: any, ignore: boolean, name: string) => {
        if (!ignore) {

            const awaitingImports = state.awaitingData.filter((asurvey: any) => asurvey.id !== surveyId);

            dispatch({
                type: 'setAwaitingTableData', data: {
                    tableData: [...awaitingImports]
                }
            });

            setModalMessage(`“${name}” has been succesfully imported`);
            setIsLoading(false);
            setModalShow(true);
        } else {
            const awaitingImports = state.awaitingData.filter((asurvey: any) => asurvey.id !== surveyId);

            dispatch({
                type: 'setAwaitingTableData', data: {
                    tableData: [...awaitingImports]
                }
            });

            setModalMessage(`“${name}” has been ignored`);
            setIsLoading(false);
            setModalShow(true);
        }
    }, [dispatch, state.awaitingData]);

    const importSurveysAction = (surveyId: any, ignore: boolean, name: string) => {
        setIsLoading(true);

        return postImportSurveys(surveyId, ignore)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then(() => {
                setSurveyId(surveyId);
                importSurveysComplete(surveyId, ignore, name);

            }).catch(() => {
                setIsLoading(false);
            });
    };

    const importIgnoredSurveyAction = async (surveyId: number) => {
        try {
            setIsLoading(true);
            let response = await importIgnoredSurvey(surveyId);
            const ignoredArr = state.ignoredData.filter((survey: any) => survey.id !== surveyId);
            dispatch({
                type: 'importIgnored', data: {
                    ignoredData: [...ignoredArr]
                }
            });
            setIsLoading(false);
        } catch (ex) {
            setIsLoading(false)
        }
    }

    const syncSurveys = async () => {
        if (tabIndex === 0) {
            await fetchAwaitingSurveys();
        } else {
            await fetchIgnoredSurveys();
        }
    }
    return (
        <main className={`validate-screen`}>
            {isLoading && <div className="loading-wrapper">
                <Spinner className="loading" animation="border" />
            </div>}
            <div className="top-panel"></div>
            <div className="table-wrapper" >
                <div style={Style.header}>
                    <h2>Surveys</h2>
                    <div style={Style.sync}>
                        <div className="sync-label"> {`Last sync `} {tabIndex === 0 ? state.awaitingLastSync : state.ignoredLastSync} </div>
                        <div className="logo-div">
                            <img src={Sync} alt="Sync"
                                className={` ${isLoadingSpinner ? "image-spin" : "sync-logo"
                                    }`}
                                onClick={async () => isLoadingSpinner === false ? (await syncSurveys()) : ''} />
                        </div>

                    </div>
                </div>
                <Tabs tabs={['Awaiting Import', 'Ignored']} setTabIndex={setTabIndex} tabIndex={tabIndex} />
                {tabIndex === 0 &&
                    <>
                        <Table hover={!!isLoadingSpinner ? false : true} variant="light">
                            <tbody>
                                <tr key={`awaiting-import-table-header`}>
                                    <th style={{ width: "70%" }} key={`key-Form Name-0`}>Form Name</th>
                                    <th style={{ width: "15%" }} key={`key-Responses-1`}>Responses</th>
                                    <th style={{ width: "15%" }} key={`key-''-2`}></th>
                                </tr>

                                {!isLoadingSpinner && state.awaitingData && state.awaitingData?.length > 0 && state.awaitingData.map((row: any, ri: number) => (
                                    <tr key={`awaiting-import-table-row-${ri}`}>
                                        <td style={{ width: "70%" }} key={`awaiting-import-label-row-0`}> {row['title']} </td>
                                        <td style={{ width: "15%" }} key={`awaiting-import-label-row-1`}> {row['responseCount']} </td>
                                        <td style={{ width: "15%", paddingRight: '32px' }} key={`awaiting-import-label-row-2`}>
                                            <div style={{ display: "flex" }}>
                                                <Button className="btn-import" onClick={() => importSurveysAction(row.id, false, row.title)} > Import </Button>
                                                <Button className="btn-ignore" onClick={() => importSurveysAction(row.id, true, row.title)} > Ignore </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!!isLoadingSpinner && state.awaitingData?.length == 0) &&
                                    <tr style={{ background: "white" }}>
                                        <td>
                                            <Skeleton style={{ marginTop: "30px", marginBottom: "30px" }} count={10} />
                                        </td>
                                        <td>
                                            <Skeleton style={{ marginTop: "30px", marginBottom: "30px" }} count={10} />
                                        </td>
                                        <td>
                                            <Skeleton style={{ marginTop: "30px", marginBottom: "30px" }} count={10} />
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </Table>
                        <Pager
                            totalPage={state.awaitingTotalPage}
                            activePage={state.awaitingActivePage}
                            setActivePage={(activePage: number) => dispatch({ type: 'setAwaitingActivePage', data: { activePage } })}
                        />
                    </>
                }

                {tabIndex === 1 && <>

                    <Table hover={!!isLoadingSpinner ? false : true} variant="light">
                        <tbody>
                            <tr key={`awaiting-import-table-header`}>
                                <th style={{ width: "60%" }} key={`key-form-name-0`}>Form Name</th>
                                <th style={{ width: "10%" }} key={`key-Responses-1`}>Responses</th>
                                <th style={{ width: "10%" }} key={`key-last-response-2`}>Last Response</th>
                                <th style={{ width: "10%" }} key={`key-status-3`}>Status</th>
                                <th style={{ width: "10%" }} key={`key-actions-4`}></th>
                            </tr>
                            {!isLoadingSpinner && !!state.ignoredData && state.ignoredData.length > 0 && state.ignoredData.map((row: any, ri: number) => (
                                <tr key={`awaiting-import-table-row-${ri}`}>
                                    <td style={{ width: "70%" }} key={`awaiting-import-label-row-0`}> {row['title']} </td>
                                    <td style={{ width: "15%" }} key={`awaiting-import-label-row-1`}> {row['responseCount']} </td>
                                    <td style={{ width: "15%" }} key={`awaiting-import-label-row-2`}>
                                        <DateCell dateModified={row['dateModified']} />
                                    </td>
                                    <td style={{ width: "15%" }} key={`awaiting-import-label-row-3`}>
                                        <StatusCell status={row["status"]} />
                                    </td>

                                    <td style={{ width: "15%", paddingRight: '32px' }} key={`awaiting-import-label-row-4`}>
                                        <div style={{ display: "flex" }}>
                                            <Button className="btn-import" onClick={() => importIgnoredSurveyAction(row.id)} > Import </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(isLoadingSpinner && state.ignoredData == 0) &&
                                <tr style={{background: "white"}}>
                                    <td>
                                        <Skeleton style={{ marginTop: "30px", marginBottom: '30px' }} count={10} />
                                    </td>
                                    <td>
                                        <Skeleton style={{ marginTop: "30px", marginBottom: '30px' }} count={10} />
                                    </td>
                                    <td>
                                        <Skeleton style={{ marginTop: "30px", marginBottom: '30px' }} count={10} />
                                    </td>
                                    <td>
                                        <Skeleton style={{ marginTop: "30px", marginBottom: '30px' }} count={10} />
                                    </td>
                                    <td>
                                        <Skeleton style={{ marginTop: "30px", marginBottom: '30px' }} count={10} />
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                    <Pager totalPage={state.ignoredTotalPage}
                        activePage={state.ignoredActivePage}
                        setActivePage={(activePage: number) => dispatch({ type: 'setIgnoredActivePage', data: { activePage } })}
                    />
                </>
                }

                <Modal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    className={`snackbarImportSuccessfully`}
                >
                    <Modal.Body>
                        <div style={Style.modalBody}>
                            <div style={Style.modalContent}>
                                <img src={Check} alt="Check" className="check-logo" />
                                <div className="modal-note">{modalMessage}</div>
                            </div>

                            {modalMessage.includes('succesfully imported') && <Link
                                className="btn btn-primary btn-review-data"
                                to={{ pathname: `/overview/${surveyId}/0` }}>
                                Review Data
                            </Link>}
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </main>
    )
}


export default DashboardScreen;
