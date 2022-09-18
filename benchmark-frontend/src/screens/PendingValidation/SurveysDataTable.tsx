import React, { useState } from "react";
import { Table, Accordion, Button, Modal, Spinner } from "react-bootstrap";
import formatDateTime from "../../utils/FormatDateTime";
import StatusCell from "../../components/StatusCell";
import DateCell from "../../components/DateCell";
import Sync from "../../assets/sync.svg";
import SyncDisabled from "../../assets/sync-disabled.svg";
import ArrowDown from "../../assets/arrow-down.svg";
import { StatusType } from "../../enums/statusType";
import { SurveySource } from '../../enums/surveySource';
import "./SurveysDataTable.scss";
import CircularProgress from "../../components/CircularProgress";
import { ReactComponent as ArrowIcon } from '../../assets/arrow-collapse-icon.svg';
import { getCompanies, getCompanyProjects } from "../../services/companyAPI";
import { getProjects } from "../../services/projectAPI";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const DateTimeCell = (props: any) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div>{props.dateModified && formatDateTime(props.dateModified)}</div>
  </div>
);

function SurveysDataTable(props: any) {
  const {
    name,
    headers,
    sorting,
    formatCells,
    data,
    buttons,
    labels,
    buttonLabels,
    surveyId,
  } = props;
  const [show, setShow] = useState(false);
  const [collapse, setCollapse] = useState<string>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const getNewCompanies = async () => {
    setCompanies(await getCompanies());
  };

  const getNewProjects = async () => {
    setProjects(await getProjects());
  };

  React.useEffect(() => {
    getNewCompanies();
    getNewProjects();
  }, []);

  const getCompany = (companyId) => {
    let company = companies?.find((comp) => comp.id === companyId);
    return (company?.name || "-");
  }

  const getProject = (projectId) => {
    let project = projects?.find((x) => x.id === projectId);
    return (project?.name || "-");
  }
  console.log("Data :", data);
  console.log("companies", companies);
  const NullFunction = () => {

  }
  console.log("props?.isLoadingSpinner", props?.isLoadingSpinner)
  return (
    <main>

      <Accordion activeKey={collapse} onSelect={(key: string) => setCollapse(key)}>
        <Table variant="light" hover={!!props.isLoading ? false : true} className={props.name + ' parent'}>


            <tbody>
              {props.name !== "subquestions" && (
                <tr key={`${name}-table-header`}>
                  <th></th>
                  {headers.map((header: any, i: number) =>
                    sorting.includes(i) ? (
                      <th key={`key-${header}-${i}`}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>{header}</span>{" "}
                          <img
                            src={ArrowDown}
                            alt="ArrowDown"
                            className="sorting-arrow"
                          />
                        </div>
                      </th>
                    ) : (
                      <th key={`key-${header}-${i}`}> {header}</th>
                    )
                  )}
                </tr>
              )}


            {data && !props.isLoading &&
              data.map((row: any, ri: number) => (
                <>
                  <Accordion.Toggle className={` ${collapse === `company-${ri}` ? 'active' : ''}`} as="tr" key={`${props.name}-table-row-${ri}`} eventKey={row?.source === SurveySource.ChaiOne ? `company-${ri}` : ''}>
                    <td> {row?.source === SurveySource.ChaiOne && <ArrowIcon />} </td>
                    {/* <tr > */}
                    {labels.map((label: any, li: number) => {
                      const showValidationBtn =
                        row["status"] === StatusType.Closed &&
                        row["progress"] === 100;
                      const acordionKey = `company-${ri}`;

                      return (

                        <React.Fragment key={`${props.label}-label-row-${li}`}>
                          {buttons.includes(li) && (
                            <td style={{ width: 220 }}>
                              <div style={{ display: "flex" }}>
                                {row["status"] !== StatusType.Closed && row["source"] !== SurveySource.ChaiOne &&
                                  buttonLabels.includes("Sync") && (
                                    <div className="sync-button-div">
                                      <img
                                        src={Sync}
                                        alt="Sync"
                                        className={`${props?.isLoadingSpinner && props.currentSurveyId === row.id ? "sync-button-spin" : "sync-button"
                                          }`}
                                        onClick={() => {
                                          props?.isLoadingSpinner == false ? props.buttonAction[0](row.id) : NullFunction()
                                        }}
                                      />
                                    </div>
                                  )}
                                {row["status"] !== StatusType.Closed && row["source"] === SurveySource.ChaiOne &&
                                  buttonLabels.includes("Sync") && (
                                    <span className="sync-button-chaione" onClick={() => {
                                      (props?.isLoadingSpinner == false) ? props.buttonAction[0](row.id) : NullFunction();
                                    }}>
                                      <img
                                        src={Sync}
                                        alt="Sync"
                                        className={`${(props?.isLoadingSpinner && props.currentSurveyId === row.id) ? "sync-button-spin" : ""
                                          }`}
                                      />
                                      <label > Sync Data</label>
                                    </span>

                                  )}

                                {row["status"] === StatusType.Closed && row["source"] === SurveySource.ChaiOne &&
                                  buttonLabels.includes("Sync") && (
                                    <span className="sync-button-chaione disabled">
                                      <img
                                        src={SyncDisabled}
                                        alt="Sync"
                                        className="img"
                                      />
                                      <label > Sync Data</label>
                                    </span>

                                  )}

                                {row["status"] === StatusType.Closed &&
                                  buttonLabels.includes("Sync") && (
                                    <img
                                      src={SyncDisabled}
                                      alt="Sync"
                                      className="sync-disabled-button"
                                    />
                                  )}
                                {props.isLoading &&
                                  buttonLabels.includes("Sync") &&
                                  props.currentSurveyId === row.id && (
                                    <div className="loading-wrapper">
                                      <Spinner
                                        className="loading"
                                        animation="border"
                                      />
                                    </div>
                                  )}

                                {buttonLabels.includes("Review") && row["source"] !== SurveySource.ChaiOne && (

                                  <Button
                                    className={`btn-import ${showValidationBtn ? "btn-validate" : ""
                                      }`}
                                    onClick={() => props.buttonAction[1](row.id)}
                                  >
                                    {showValidationBtn ? "Validate" : "Review"}
                                  </Button>
                                )}
                              </div>
                            </td>
                          )}
                          {!buttons.includes(li) && (
                            <td className={label}>
                              {formatCells.date?.includes(li) && (
                                <DateCell dateModified={row[label]} />
                              )}
                              {formatCells.datesync?.includes(li) && (
                                <DateCell
                                  dateModified={
                                    row["updatedDate"] || row["createdDate"]
                                  }
                                />
                              )}
                              {formatCells.lastresponse?.includes(li) && (
                                <DateCell
                                  dateModified={
                                    row.responses.length > 0
                                      ? row.responses[row.responses.length - 1][
                                      "dateModified"
                                      ] ||
                                      row.responses[row.responses.length - 1][
                                      "dateCreated"
                                      ]
                                      : null
                                  }
                                />
                              )}




                              {formatCells.datetime?.includes(li) && (
                                <DateTimeCell
                                  dateModified={row[label]}
                                  todayDateObj={props.todayDateObj}
                                />
                              )}
                              {formatCells.datetimesync?.includes(li) && (
                                <DateTimeCell
                                  dateModified={
                                    row["updatedDate"] || row["createdDate"]
                                  }
                                  todayDateObj={props.todayDateObj}
                                />
                              )}
                              {formatCells.progress?.includes(li) && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div style={{ width: 26, marginRight: 13 }}>
                                    {row[label] || 0}%
                                  </div>
                                  <CircularProgress
                                    value={row[label]}
                                    width={20}
                                    stroke={10}
                                  />
                                </div>
                              )}
                              {formatCells.companyId?.includes(li) && row["source"] != SurveySource.ChaiOne && (

                                <span> {getCompany(row["companyId"])}</span>
                              )}
                              {formatCells.companyId?.includes(li) && row["source"] === SurveySource.ChaiOne && (

                                <span> -</span>
                              )}
                              {formatCells.projectId?.includes(li) && row["source"] != SurveySource.ChaiOne && (
                                <span> {getProject(row["projectId"])}</span>
                              )}
                              {formatCells.projectId?.includes(li) && row["source"] === SurveySource.ChaiOne && (

                                <span> -</span>
                              )}
                              {formatCells.status?.includes(li) && (
                                <StatusCell status={row[label]} />
                              )}
                              {!Object.values(formatCells)
                                .flatMap((e) => e)
                                .includes(li) && row[label]}
                            </td>
                          )}
                        </React.Fragment>

                      );


                    }
                    )}
                    {/* </tr>               */}
                  </Accordion.Toggle>


                  <tr className="child-survey-tr" style={{ borderBottom: '0' }}>
                    <td style={{ padding: '0' }} colSpan={10}>
                      <Accordion.Collapse eventKey={`company-${ri}`}>
                        <Table className={props.name + ' child'} responsive>
                          <thead>
                            <tr>
                              <th ></th>
                              <th ></th>
                              <th style={{ width: '181px' }}>Company</th>
                              <th colSpan={2}>Respondent</th>
                              <th colSpan={2} style={{ width: '130px' }}>Response Date</th>
                              <th colSpan={2}>Progress</th>
                              <th style={{ float: "right" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {row["responses"] && row["responses"]?.length > 0 &&
                              row["responses"].map((subRow: any, r2: number) => (
                                <tr>
                                  <td ></td>
                                  <td ></td>
                                  <td style={{ width: '181px' }}>{getCompany(subRow?.recipientId)}</td>
                                  <td colSpan={2}>
                                    <span> {getProject(subRow?.respondentId)}</span>
                                  </td>
                                  <td colSpan={2}>
                                    <DateCell
                                      dateModified={
                                        subRow["dateModified"] || subRow["dateCreated"]
                                      }
                                    />
                                  </td>
                                  <td colSpan={2}>
                                    <div style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}>
                                      <div style={{ width: 26, marginRight: 13 }}>
                                        0%
                                      </div>
                                      <CircularProgress
                                        value={10}
                                        width={20}
                                        stroke={10}
                                      />
                                    </div>
                                  </td>
                                  <td style={{ float: "right", display: 'flex', width: 160 }}>
                                    <Button
                                      onClick={() => props.buttonAction[1](row?.id, subRow?.id)}
                                      className={"btn-import"}>
                                      Review
                                    </Button>
                                  </td>
                                </tr>
                              ))}

                          </tbody>
                        </Table>

                      </Accordion.Collapse>
                    </td>
                  </tr>
                </>
              ))}

            {!!props.isLoading &&
              <tr>
                <td></td>
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
      </Accordion>
    </main>
  );
}
export default SurveysDataTable;
