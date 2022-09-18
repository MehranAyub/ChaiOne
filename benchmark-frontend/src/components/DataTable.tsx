import React, { useState } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import formatDateTime from "../utils/FormatDateTime";
import CircularProgress from "./CircularProgress";
import StatusCell from "../components/StatusCell";
import DateCell from "../components/DateCell";
import Sync from "./../assets/sync.svg";
import SyncDisabled from "./../assets/sync-disabled.svg";
import ArrowDown from "./../assets/arrow-down.svg";
import { deleteScale, getScales, postScale } from "../services/scalesAPI";
import {
  updateFactor,
  putAssignScale,
  updateProcessStep,
} from "../services/questionsAPI";
import {
  getProcessSteps,
  addProcessStep,
  deleteProcessStep,
} from "../services/processStepsAPI";
import { StatusType } from "../enums/statusType";
import Dropdown from "./Dropdown/Dropdown";
import DropdownItem from "./Dropdown/DropdownItem";
import { getFactors } from "../services/factorsAPI";
import "./DataTable.css";
import SubDataTable from "./SubDataTable/SubQuestDataTable";

const DateTimeCell = (props: any) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div>{props.dateModified && formatDateTime(props.dateModified)}</div>
  </div>
);

function DataTable(props: any) {
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
  const [showProcess, setShowProcess] = useState(false);
  const [processSteps, setProcessSteps] = useState<any[]>([]);
  const [scales, setScales] = useState<any[]>([]);
  const [factors, setFactors] = useState<any[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<{
    [key: string]: {
      id: string | null;
      text: string | null;
      isUsed: boolean | null;
    };
  }>();
  const [selectedRscale, setSelectedrScale] = useState<{
    id: string | null;
    text: string | null;
  }>({ id: null, text: null });
  const [selectedScale, setSelectedscale] = useState<{
    [key: string]: {
      id: string | null;
      name: string | null;
      isUsed: boolean | null;
    };
  }>();
  const [selectedFactor, setSelectedFactor] = useState<{
    [key: string]: { id: string | null; name: string | null };
  }>({ id: null, name: null });

  React.useEffect(() => {
    if (surveyId) {
      const fetch = async () => {
        setScales(await getScales());
        props.setScalesArr(scales);
      };
      fetch();
    }
  }, [surveyId]);
  const ratingScaleArr = [
    {
      id: "0",
      text: " is Positive",
    },
    {
      id: "1",
      text: " is Negative",
    },
  ];
  React.useEffect(() => {
    if (surveyId) {
      const fetch = async () => {
        setFactors(await getFactors());
      };
      fetch();
    }
  }, [surveyId]);

  React.useEffect(() => {
    setSelectedProcess(() =>
      data.reduce((prev, { questionId, processStepId }) => {
        return {
          ...prev,
          [questionId]: {
            id: processStepId,
            text: processSteps?.find(({ id }) => processStepId === id)?.text,
          },
        };
      }, {})
    );
  }, [data, processSteps]);
  React.useEffect(() => {
    // setUpdateQuestions(data);
    setSelectedrScale(() =>
      data.reduce((prev, { questionId, predefinedScaleType }) => {
        return {
          ...prev,
          [questionId]: {
            id: predefinedScaleType,
            text: ratingScaleArr?.find(({ id }) => predefinedScaleType === id)
              ?.text,
          },
        };
      }, {})
    );
  }, [data]);
  React.useEffect(() => {
    // setUpdateQuestions(data);
    setSelectedscale(() =>
      data.reduce((prev, { questionId, scaleId }) => {
        return {
          ...prev,
          [questionId]: {
            id: scaleId,
            name: scales?.find(({ id }) => scaleId === id)?.name,
          },
        };
      }, {})
    );
  }, [data, scales]);
  React.useEffect(() => {
    setSelectedFactor(() =>
      data.reduce((prev, { questionId, factorId }) => {
        return {
          ...prev,
          [questionId]: {
            id: factorId,
            name: factors?.find(({ id }) => factorId === id)?.name,
          },
        };
      }, {})
    );
  }, [data, factors]);

  const handleClose = () => setShow(false);
  const AssignProcessStep = async (
    processStepId: number,
    questionId: string,
    rowId: number | null
  ) => {
    await updateProcessStep(processStepId, questionId, rowId);
    // setProcessSteps(await getProcessSteps());
    props.setProcessStepArr(await getProcessSteps());
  };
  const AssignScale = async (
    QuestionId: string,
    ScaleId: string,
    PredefinedScaleType: string
  ) => {
    await putAssignScale(QuestionId, ScaleId, PredefinedScaleType);
    // setScales(await getScales());
    props.setScalesArr(await getScales());
  };
  const AssignFactors = async (
    QuestionId: string,
    FactorId: string,
    RowId: number
  ) => {
    await updateFactor(QuestionId, FactorId, RowId);
  };
  const handleNewProcess = async (processStepText, questionId, rowId) => {
    if(processStepText?.trim()?.length>0){
    const data = await addProcessStep(processStepText);
    props.setProcessStepArr(await getProcessSteps());
    setProcessSteps(await getProcessSteps());
    AssignProcessStep(questionId, data.id, rowId);
    props.setProcessStepId(questionId, data.id);
    }
  };
  const handleNewScale = async (scale, questionId, rowId) => {
if(scale?.trim()?.length>0){
    const data = await postScale(scale);
    setScales(await getScales());
    props.setScalesArr(scales);
    AssignScale(questionId, data.id, rowId);
    props.setScaleId(questionId, data.id);
}
  };
  const DeleteProcess = async (id) => {
    try {
      await deleteProcessStep(id);
    } catch (err) {}
    setProcessSteps(await getProcessSteps());
    props.setProcessStepArr(await getProcessSteps());
  };
  const DeleteScale = async (id) => {
    try {
      await deleteScale(id);
    } catch (e) {} 
    props.setScalesArr(await getScales());
  };
  React.useEffect(() => {
    if (surveyId) {
      const fetch = async () => {
        setProcessSteps(await getProcessSteps());
      };
      fetch();
    }
    console.log("Datatable", props.processStepArr);
  }, [surveyId]);


 

  return (
    <Table hover variant="light">
      <Modal
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="true"
        backdropClassName="modal-backdrop.show modal-backdrop.dark"
        centered
      >
        <Modal.Header className="DataTable_modalHeader">
          <Modal.Title>Delete Scale</Modal.Title>
        </Modal.Header>
        <Modal.Body className="DataTable_modalbody">
          This scale is used on another question and cannot be deleted.
        </Modal.Body>
        <Modal.Footer className="DataTable_modalFooter">
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ backgroundColor: "#0073a0" }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showProcess}
        onHide={() => setShowProcess(false)}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="true"
        backdropClassName="modal-backdrop.show modal-backdrop.dark"
        centered
      >
        <Modal.Header className="DataTable_modalHeader">
          <Modal.Title>Delete Process Step</Modal.Title>
        </Modal.Header>
        <Modal.Body className="DataTable_modalbody">
          This process step is used on another question or sub-question and
          cannot be deleted.
        </Modal.Body>
        <Modal.Footer className="DataTable_modalFooter">
          <Button
            variant="secondary"
            onClick={() => setShowProcess(false)}
            style={{ backgroundColor: "#0073a0" }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <tbody>
        {props.name !== "subquestions" && (
          <tr key={`${name}-table-header`}>
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
              ) : header == "Question" ? (
                <>
                  <th key={`key-${header}-${i}`}>{header}</th>
                </>
              ) : (
                <th key={`key-${header}-${i}`}>{header}</th>
              )
            )}
          </tr>
        )}

        {props.name == "subquestions" && (
          <tr key={`${name}-table-header`}>
            {headers.map((header: any, i: number) =>
              header == "Subquestion" ? (
                <>
                  <th key={`key-${header}-${i}`}>{header}</th>
                </>
              ) : (
                <th key={`key-${header}-${i}`}>{header}</th>
              )
            )}
          </tr>
        )}

        {data &&
          data.map((row: any, ri: number) => (
            <>
              <tr key={`${props.name}-table-row-${ri}`}>
                {labels.map((label: any, li: number) => {
                  const showValidationBtn =
                    row["status"] === StatusType.Closed &&
                    row["progress"] === 100;
                  return (
                    <React.Fragment key={`${props.label}-label-row-${li}`}>
                      {buttons.includes(li) && (
                        <td style={{ width: 220 }}>
                          <div style={{ display: "flex" }}>
                            {row["status"] !== StatusType.Closed &&
                              buttonLabels.includes("Sync") && (
                                <img
                                  src={Sync}
                                  alt="Sync"
                                  className="sync-button"
                                  onClick={() => {
                                    props.buttonAction[0](row.id);
                                  }}
                                />
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

                            {buttonLabels.includes("Import") && (
                              <Button
                                className="btn-import"
                                onClick={() =>
                                  props.buttonAction(row.id, false, row.title)
                                }
                              >
                                Import
                              </Button>
                            )}
                            {buttonLabels.includes("Ignore") && (
                              <Button
                                className="btn-ignore"
                                onClick={() =>
                                  props.buttonAction(row.id, true, row.title)
                                }
                              >
                                Ignore
                              </Button>
                            )}
                            {buttonLabels.includes("Review") && (
                              <Button
                                className={`btn-import ${
                                  showValidationBtn ? "btn-validate" : ""
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
                        <td style={{ padding: "20px" }}>
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

                          {formatCells.Question?.includes(li) && (
                            <div>
                              <span
                                dangerouslySetInnerHTML={{ __html: row[label] }}
                              ></span>{" "}
                            </div>
                          )}

                          {formatCells.SubQuestion?.includes(li) && (
                            <div>
                              <span
                                dangerouslySetInnerHTML={{ __html: row[label] }}
                              ></span>{" "}
                            </div>
                          )}

                          {!props.parent && (!row["questionRows"] ||
                              row["questionRows"].length <= 0) && 
                            formatCells.ResponseCount?.includes(li) && (
                            <div className="ResponseCount">
                              <span> {row[label]}</span>{" "}
                            </div>
                          )}

                          {!props.parent &&
                            (!row["questionRows"] ||
                              row["questionRows"].length <= 0) &&
                            formatCells.ProcessStep?.includes(li) && (
                              <Dropdown
                                deleteable
                                creatable
                                id="process step"
                                placeholder="Assign Process Step"
                                onSelect={(id, text) => {
                                  row?.processStepId == id
                                    ? props.setProcessStepId(
                                        row["questionId"],
                                        ""
                                      )
                                    : props.setProcessStepId(
                                        row["questionId"],
                                        id
                                      );
                                  setSelectedProcess((prev) => ({
                                    ...prev,
                                    [row.questionId]: { id, text },
                                  }));
                                  row?.processStepId == id
                                    ? AssignProcessStep(
                                        row.questionId,
                                        id,
                                        null
                                      )
                                    : AssignProcessStep(
                                        row.questionId,
                                        "",
                                        null
                                      );
                                }}
                                selectedName={
                                  selectedProcess?.[row.questionId]?.text
                                }
                                onCreateItem={(processtep) => {
                                  handleNewProcess(
                                    processtep,
                                    row.questionId,
                                    null
                                  );
                                }}
                              >
                                {props.processStepArr?.map(
                                  ({ id, text, isUsed }, idx) => {
                                    return (
                                      <DropdownItem
                                        className="Datatable_scroll"
                                        id={"Process Step"}
                                        key={`${row.questionId}-${row.processStepId}-${idx}`}
                                        name={text}
                                        value={id}
                                        isSelected={id === row.processStepId}
                                        isDisabled={isUsed ? true : false}
                                        onDelete={() => {
                                          DeleteProcess(id);
                                        }}
                                      />
                                    );
                                  }
                                )}
                              </Dropdown>
                            )}

                          {/** Main Question Scale */}
                          {!props.parent &&
                            (!row["questionRows"] ||
                              row["questionRows"].length <= 0) &&
                            formatCells.Scale?.includes(li) &&
                            (!row["ratingScale"] ||
                              row["ratingScale"].length === 0) && (
                              <Dropdown
                                deleteable
                                creatable
                                // required={row["ratingScale"]?.length>0?true:false}
                                id={"Scale"}
                                placeholder="Assign Scale"
                                onSelect={(id, name) => {

                                  row?.scaleId == id
                                  ? props.setScaleId(
                                      row["questionId"],
                                      ""
                                    )
                                  : props.setScaleId(
                                      row["questionId"],
                                      id
                                    );
                                  setSelectedscale((prev) => ({
                                    ...prev,
                                    [row.questionId]: { id, name },
                                  }));

                                  row?.scaleId == id
                                    ? AssignScale(
                                        row.questionId,
                                        id,
                                        ""
                                      )
                                    : AssignScale(
                                        row.questionId,
                                        "",
                                        ""
                                      );
                                }}
                                selectedName={
                                  selectedScale?.[row.questionId]?.name
                                }
                                onCreateItem={(scale) => {
                                  handleNewScale(scale, row["questionId"], "");
                                }}
                              >
                                {props.scalesArr?.map(
                                  ({ id, name, isUsed }, idx) => (
                                    <DropdownItem
                                      key={`${row.questionId}-${row.scaleId}-${idx}`}
                                      value={id}
                                      id={"Scale"}
                                      isSelected={id === row.scaleId}
                                      isDisabled={isUsed ? true : false}
                                      name={name}
                                      onDelete={() => {
                                        DeleteScale(id);
                                      }}
                                    />
                                  )
                                )}
                              </Dropdown>
                            )}

                          {/** Main Question RatingScale */}
                          {!props.parent &&
                            (!row["questionRows"] ||
                              row["questionRows"].length <= 0) &&
                            formatCells.Scale?.includes(li) &&
                            (row["ratingScale"] ||
                              row["ratingScale"].length != 0) && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <label
                                  style={{ width: "48px", marginTop: "1rem" }}
                                >
                                  {row["ratingScale"]}
                                </label>

                                <Dropdown
                                  required={
                                    row["ratingScale"].length > 0 ? true : false
                                  }
                                  id="Scale"
                                  placeholder="Assign Scale"
                                  onSelect={(id, text) => {
                                    selectedRscale?.[row.questionId]?.id == id
                                      ? props.setRating(row["questionId"], null)
                                      : props.setRating(row["questionId"], id);

                                    props.setScaleId(0, 0);
                                    setSelectedrScale((prev) => ({
                                      ...prev,
                                      [row.questionId]: { id, text },
                                    }));
                                    selectedRscale?.[row.questionId]?.id == id
                                      ? AssignScale(row["questionId"], "", null)
                                      : AssignScale(row["questionId"], "", id);
                                  }}
                                  selectedName={
                                    selectedRscale?.[row.questionId]?.id == 0
                                      ? row["ratingScale"].split("-")[1] +
                                        " is Positive "
                                      : selectedRscale?.[row.questionId]?.id ==
                                        1
                                      ? row["ratingScale"].split("-")[1] +
                                        " is Negative "
                                      : ""
                                  }
                                >
                                  {ratingScaleArr?.map(({ id, text }, idx) => (
                                    <DropdownItem
                                      key={`${row.questionId}-${row.predefinedScaleType}-${idx}`}
                                      name={
                                        row["ratingScale"].split("-")[1] + text
                                      }
                                      value={id}
                                      isSelected={
                                        id === row.predefinedScaleType
                                      }
                                    />
                                  ))}
                                </Dropdown>
                              </div>
                            )}

                          {!props.parent &&
                            (!row["questionRows"] ||
                              row["questionRows"].length <= 0) &&
                            formatCells.Factor?.includes(li) && (
                              <Dropdown
                                id="Factor"
                                placeholder="Unassigned"
                                onSelect={(id, name) => {
                                  props.setFactorsId(row["questionId"], id);
                                  setSelectedFactor((prev) => ({
                                    ...prev,
                                    [row.questionId]: { id, name },
                                  }));
                                  AssignFactors(row["questionId"], id, null);
                                }}
                                selectedName={
                                  selectedFactor?.[row.questionId]?.name
                                }
                                className="DataTable_Dropdown-Factor"
                              >
                                {factors?.map(({ id, name }, idx) => (
                                  <DropdownItem
                                    key={`${row.questionId}-${row.factorId}-${idx}`}
                                    name={name}
                                    value={id}
                                    isSelected={id === row.factorId}
                                  />
                                ))}
                              </Dropdown>
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
                                {row[label]}%
                              </div>
                              <CircularProgress
                                value={row[label]}
                                width={20}
                                stroke={10}
                              />
                            </div>
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
                })}
              </tr>

              <tr>
                {row["questionRows"] && row["questionRows"].length >= 1 && (
                  <td className="subquestions-table" colSpan={7}>
                    <SubDataTable
                      name="subquestions"
                      data={row["questionRows"]}
                      headers={[
                        "#",
                        "Subquestion",
                        "Process Step",
                        "Scale",
                        "Factor",
                      ]}
                      sorting={[]}
                      labels={["letterId", "text", "", "", "", ""]}
                      buttons={[]}
                      buttonLabels={[]}
                      buttonAction={() => null}
                      formatCells={{
                        SubQuestion: [0, 1],
                        ProcessStep: [2],
                        Scale: [3],
                        Factor: [4],
                      }}
                      processStepArr={props.processStepArr}
                      setProcessStepArr={props.setProcessStepArr}
                      factorsArr={props.factorsArr}
                      scalesArr={props.scalesArr}
                      setScalesArr={props.setScalesArr}
                      setScaleDataHasChanged={props.setScaleDataHasChanged}
                      parent={row}
                      setProcessStepId={props.setProcessStepId}
                      setSubQuestScaleId={props.setSubQuestScaleId}
                      surveyId={surveyId}
                      setSubQuestProcessStepId={props.setSubQuestProcessStepId}
                      setSubQuestFactorId={props.setSubQuestFactorId}
                      setFactorsId={props.setFactorsId}
                      setSubRating={props.setSubRating}
                    />
                  </td>
                )}
              </tr>
            </>
          ))}
      </tbody>
    </Table>
  );
}
export default DataTable;
