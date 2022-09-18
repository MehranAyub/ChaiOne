import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import ArrowDown from "./../../assets/arrow-down.svg";
import { getScales, postScale } from "../../services/scalesAPI";
import { putAssignScale, updateFactor, updateProcessStep } from "../../services/questionsAPI";
import {
  getProcessSteps,
  addProcessStep,
  deleteProcessStep,
} from "../../services/processStepsAPI";
import { updateSubScale } from "../../services/subquestionsAPI";
import { StatusType } from "../../enums/statusType";
import Dropdown from "./../Dropdown/Dropdown";
import DropdownItem from "./../Dropdown/DropdownItem";
import { getFactors } from "../../services/factorsAPI";
import "../DataTable.css";

function SubDataTable(props: any) {
  const {
    name,
    headers,
    sorting,
    formatCells,
    data,
    buttons,
    labels,
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
    };
  }>({});
  const [selectedRscale, setSelectedrScale] = useState<{
    id: string | null;
    text: string | null;
  }>({ id: null, text: null });
  const [selectedScale, setSelectedscale] = useState<{
    [key: string]: { id: string | null; name: string | null };
  }>({ id: null, name: null });
  const [selectedFactor, setSelectedFactor] = useState<{
    [key: string]: { id: string | null; name: string | null };
  }>({ id: null, name: null });
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
    setSelectedProcess(() =>
      data.reduce((prev, { id, processStepId }) => {
        return {
          ...prev,
          [id]: {
            id: processStepId,
            text: processSteps?.find(({ id }) => processStepId === id)?.text,
          },
        };
      }, {})
    );
  }, [data, processSteps]);
  React.useEffect(() => {
    setSelectedrScale(() =>
      data.reduce((prev, { id, predefinedScaleType }) => {
        return {
          ...prev,
          [id]: {
            id: predefinedScaleType,
            text: ratingScaleArr?.find(({ id }) => predefinedScaleType === id)
              ?.text,
          },
        };
      }, {})
    );
  }, [data]);
  React.useEffect(() => {
    setSelectedscale(() =>
      data.reduce((prev, { id, scaleId }) => {
        return {
          ...prev,
          [id]: {
            id: scaleId,
            name: scales?.find(({ id }) => scaleId === id)?.name,
          },
        };
      }, {})
    );
  }, [data, scales]);
  React.useEffect(() => {
    setSelectedFactor(() =>
      data.reduce((prev, { id, factorId }) => {
        return {
          ...prev,
          [id]: {
            id: factorId,
            name: factors?.find(({ id }) => factorId === id)?.name,
          },
        };
      }, {})
    );
  }, [data, factors]);
  React.useEffect(() => {
    if (surveyId) {
      const fetch = async () => {
        setProcessSteps(await getProcessSteps());
      };
      fetch();
    }
  }, [surveyId]);
  React.useEffect(() => {
    if (surveyId) {
      const fetch = async () => {
        setScales(await getScales());
        props.setScalesArr(await getScales());
      };
      fetch();
    }
  }, [surveyId]);
  React.useEffect(() => {
    if (surveyId) {
      const fetch = async () => {
        setFactors(await getFactors());
      };
      fetch();
    }
  }, [surveyId]);

  const handleClose = () => setShow(false);
  const AssignProcessStep = async (
    processStepId: number,
    questionId: string,
    rowId: number
  ) => {
    await updateProcessStep(processStepId, questionId, rowId);
    setProcessSteps(await getProcessSteps());
  };
  const AssignSubquestionScale = async (
    QuestionId: string,
    RowId: string,
    ScaleId: string,
    SurveyId: string,
    PredefinedScaleType: string
  ) => {
    await updateSubScale(
      SurveyId,
      QuestionId,
      RowId,
      ScaleId,
      PredefinedScaleType
    );
    setScales(await getScales());
  };
  const AssignFactors = async (
    QuestionId: string,
    FactorId: string,
    RowId: number
  ) => {
    await updateFactor(QuestionId, FactorId, RowId);
  };
  const handleNewProcess = async (processStepText, questionId, rowId) => {
    const data = await addProcessStep(processStepText);
    setProcessSteps(await getProcessSteps());
    props.setProcessStepArr(await getProcessSteps());
    AssignProcessStep(questionId, data.id, rowId);
    props.setSubQuestProcessStepId(questionId, data.id, rowId);
  };
  const DeleteProcess = async (id) => {
    try {
      const data = await deleteProcessStep(id);
      data?.status == 500 && setShowProcess(true);
      setProcessSteps(await getProcessSteps());
      props.setProcessStepArr(await getProcessSteps());
    } catch (err) {
      props.setProcessStepArr(await getProcessSteps());
    }
  };
  const handleNewScale = async (scale, rowId) => { 
    const data = await postScale(scale);
    setScales(await getScales());
    props.setScalesArr(await getScales());



    await updateSubScale(
      surveyId,
      props.parent.questionId,
      rowId,
      data.id,
      ''
    );  
    setSelectedscale((prev) => ({
      ...prev,
      [rowId]: data,
    }));

    props.setSubQuestScaleId(
      props.parent.questionId,
      data.id,
     rowId
    );

    setScales(await getScales());
    props.setScalesArr(await getScales());
  };
 

  // if (data) {
  //   data?.forEach((element) => {
  //     let step: any = props.processStepArr?.find(
  //       (x: any) => x.id == element?.processStepId
  //     );
  //     if (step) {
  //       step.isUsed = true;
  //     }
  //   });
  // }
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
                      {!buttons.includes(li) && (
                        <td>
                          {formatCells.SubQuestion?.includes(li) && (
                            <div>
                              <span
                                dangerouslySetInnerHTML={{ __html: row[label] }}
                              ></span>{" "}
                            </div>
                          )}

                          {props.parent &&
                            props.parent.questionRows &&
                            props.parent.questionRows.length >= 1 &&
                            formatCells.ProcessStep?.includes(li) && (
                              <Dropdown
                                deleteable
                                creatable
                                id="process step"
                                placeholder="Assign Process Step"
                                className="DataTable_Dropdown-SubProcess"
                                onSelect={(id, text) => {
                                  row?.processStepId == id
                                    ? props.setSubQuestProcessStepId(
                                        props.parent.questionId,
                                        "",
                                        row["id"]
                                      )
                                    : props.setSubQuestProcessStepId(
                                        props.parent.questionId,
                                        id,
                                        row["id"]
                                      );
                                  setSelectedProcess((prev) => ({
                                    ...prev,
                                    [row.id]: { id, text },
                                  }));
                                  row?.processStepId == id
                                    ? AssignProcessStep(
                                        props.parent.questionId,
                                        id,
                                        row["id"]
                                      )
                                    : AssignProcessStep(
                                        props.parent.questionId,
                                        "",
                                        row["id"]
                                      );
                                }}
                                selectedName={selectedProcess?.[row.id]?.text}
                                onCreateItem={(processtep) => {
                                  handleNewProcess(
                                    processtep,
                                    props.parent.questionId,
                                    row["id"]
                                  );
                                }}
                              >
                                {props.processStepArr?.map(
                                  ({ id, text, isUsed }, idx) => (
                                    <DropdownItem
                                      key={`${row.id}-${row.processStepId}-${idx}`}
                                      name={text}
                                      id={"Process Step"}
                                      value={id}
                                      isSelected={id === row.processStepId}
                                      isDisabled={isUsed ? true : false}
                                      onDelete={() => {
                                        DeleteProcess(id);
                                      }}
                                    />
                                  )
                                )}
                              </Dropdown>
                            )}

                          {/** Sub Question Scale */}
                          {props.parent &&
                            formatCells.Scale?.includes(li) &&
                            (!row["ratingScale"] ||
                              row["ratingScale"].length === 0) && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Dropdown
                                  id="Scale"
                                  placeholder="Assign Scale"
                                  creatable
                                  onSelect={(id, name) => {
                                    props.setSubQuestScaleId(
                                      props.parent.questionId,
                                      id,
                                      row["id"]
                                    );
                                    setSelectedscale((prev) => ({
                                      ...prev,
                                      [row.id]: { id, name },
                                    }));
                                    AssignSubquestionScale(
                                      props.parent["questionId"],
                                      row["id"],
                                      id,
                                      surveyId,
                                      ""
                                    );
                                    
                                  }}
                                  onCreateItem={(scale) => {
                                    handleNewScale(scale, row["id"]);
                                  }}
                                  selectedName={selectedScale?.[row.id]?.name}
                                  className="DataTable_Dropdown-Scale"
                                >
                                  {props.scalesArr?.map(({ id, name }, idx) => (
                                    <DropdownItem
                                      key={`${row.id}-${row.scaleId}-${idx}`}
                                      name={name}
                                      value={id}
                                      isSelected={id === row.scaleId}
                                    />
                                  ))}
                                </Dropdown>
                              </div>
                            )}

                          {/** Sub Question RatingScale */}
                          {props.parent &&
                            (!row["questionRows"] ||
                              row["questionRows"].length == 0) &&
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
                                    selectedRscale?.[row.id]?.id == id
                                      ? props.setSubRating(
                                          props.parent["questionId"],
                                          null,
                                          row["id"]
                                        )
                                      : props.setSubRating(
                                          props.parent["questionId"],
                                          id,
                                          row["id"]
                                        );
                                    selectedRscale?.[row.id]?.id == id
                                      ? setSelectedrScale((prev) => ({
                                          ...prev,
                                          [row.id]: { id: null, text: null },
                                        }))
                                      : setSelectedrScale((prev) => ({
                                          ...prev,
                                          [row.id]: { id, text },
                                        }));
                                    selectedRscale?.[row.id]?.id == id
                                      ? AssignSubquestionScale(
                                        props.parent["questionId"],
                                        row["id"],
                                        "",
                                        surveyId,                                          
                                        ""
                                        )
                                      : AssignSubquestionScale(
                                        props.parent["questionId"],
                                        row["id"],
                                        "",
                                        surveyId,                                          
                                        id
                                        );
                                    props.setSubQuestScaleId(0, 0, row["id"]);
                                  }}
                                  selectedName={
                                    selectedRscale?.[row.id]?.id == 0
                                      ? row["ratingScale"].split("-")[1] +
                                        " is Positive "
                                      : selectedRscale?.[row.id]?.id == 1
                                      ? row["ratingScale"].split("-")[1] +
                                        " is Negative "
                                      : ""
                                  }
                                  className="DataTable_Dropdown-Scale"
                                >
                                  {ratingScaleArr?.map(({ id, text }, idx) => (
                                    <DropdownItem
                                      key={`${row.id}-${row.predefinedScaleType}-${idx}`}
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

                          {props.parent &&
                            props.parent.questionRows &&
                            props.parent.questionRows.length >= 1 &&
                            formatCells.Factor?.includes(li) && (
                              <Dropdown
                                id="Factor"
                                placeholder="Unassigned"
                                onSelect={(id, name) => {
                                  props.setSubQuestFactorId(
                                    props.parent.questionId,
                                    id,
                                    row["id"]
                                  );
                                  setSelectedFactor((prev) => ({
                                    ...prev,
                                    [row.id]: { id, name },
                                  }));
                                  AssignFactors(
                                    props.parent.questionId,
                                    id,
                                    row["id"]
                                  );
                                }}
                                selectedName={selectedFactor?.[row.id]?.name}
                                className="DataTable_Dropdown-Factor"
                              >
                                {factors?.map(({ id, name }, idx) => (
                                  <DropdownItem
                                    key={`${row.id}-${row.factorId}-${idx}`}
                                    name={name}
                                    value={id}
                                    isSelected={id === row.factorId}
                                  />
                                ))}
                              </Dropdown>
                            )}
                        </td>
                      )}
                    </React.Fragment>
                  );
                })}
              </tr>
            </>
          ))}
      </tbody>
    </Table>
  );
}
export default SubDataTable;
