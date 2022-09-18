import React, { useCallback, useReducer, useState } from "react";
import DataTable from "../components/DataTable";
import { getFactors } from "../services/factorsAPI";
import { getScales } from "../services/scalesAPI";
import * as processStepsAPI from "../services/processStepsAPI";
import * as helpers from "../utils/helpers";

function QuestionsScreen(props: any) {
  const [processStepArr, setProcessStepArr] = useState([]);
  const [scalesArr, setScalesArr] = useState([]);
  const [factorsArr, setFactorsArr] = useState([]);
  const [scaleDataHasChanged, setScaleDataHasChanged] = useState({
    questionId: 0,
    scaleId: "",
    predefinedScaleType: 0,
    rowId: 0,
  });
  const [data, setData] = useState([]);
  const [subdata, setSubData] = useState([]);

  React.useEffect(() => {
    processStepsAPI.getProcessSteps().then((processSteps: any) => {
      setProcessStepArr(processSteps);
    });

    // getScales().then((items: any) => {
    //   setScalesArr(items);
    // });
    getFactors().then((items: any) => {
      setFactorsArr(items);
    });
    console.log("QuestionScreen", processStepArr);

    setQuestionsAndSubquestionsLetterIdsAndScales();
    setData(props.questionData);
  }, []);
  React.useEffect(() => {
    const fetch = async () => {
      setScalesArr(await getScales());
    };
    fetch();
  }, []);
  React.useEffect(() => {
    setSubquestionScales();
    const updatedQData = [...props.questionsData];
    const newQData: any = updatedQData.map((question: any) => {
      // if (question.questionId === scaleDataHasChanged.questionId) {
      //    console.log(question);
      //   // question.scaleId = scaleDataHasChanged.scaleId;
      // }
      return question;
    });

    var tableData = newQData.filter((a: any) => a.numberOfResponses > 0);
    setData(tableData);
  }, [scaleDataHasChanged, setScaleDataHasChanged]);

  const setQuestionsAndSubquestionsLetterIdsAndScales = () => {
    props.questionsData &&
      props.questionsData.forEach((question: any, i: number) => {
        question.letterId = `Q${i + 1}`;
        let rows = question.questionRows;

        if (rows && rows.length > 1) {
          rows.forEach((row: any, i: number) => {
            row.letterId =
              question.letterId + helpers.getSubquestionsLetterId(i);
            if (question.ratingScale && question.ratingScale.length) {
              row.scale = `${question.ratingScale} ${getRatingScaleType(
                question.predefinedScaleType
              )}`;
            } else {
              row.scale = row.scale = helpers.getScaleNameById(
                question.scaleId,
                scalesArr
              );
            }
          });
        }
      });
  };

  const setProcessStepId = (questionId: any, rowId: any) => {
    let question: any = data.filter((x: any) => x.questionId === questionId)[0];
    let dataWithoutQuestion: any = data.filter(
      (x: any) => x.questionId !== questionId
    );
    if (question) {
      question.processStepId = rowId;
    }
    let k: any = [...dataWithoutQuestion, question];
    k = k.sort((a: any, b: any) => a.questionId - b.questionId);
    setData(k);
  };
  const setRating = (questionId: any, rowId: any) => {
    let question: any = data.filter((x: any) => x.questionId === questionId)[0];
    let dataWithoutQuestion: any = data.filter(
      (x: any) => x.questionId !== questionId
    );
    if (question) {
      question.predefinedScaleType = rowId;
    }
    let k: any = [...dataWithoutQuestion, question];
    k = k.sort((a: any, b: any) => a.questionId - b.questionId);
    setData(k);
  };

  const setScaleId = (questionId: any, rowId: any) => {
    if (questionId > 0) {
      let question: any = data.filter(
        (x: any) => x.questionId === questionId
      )[0];
      let dataWithoutQuestion: any = data.filter(
        (x: any) => x.questionId !== questionId
      );
      if (question) {
        question.scaleId = rowId;
      }
      let k: any = [...dataWithoutQuestion, question];
      k = k.sort((a: any, b: any) => a.questionId - b.questionId);
      setData(k);
      props.setQuestions(k);
    } else {
      props.setQuestions(data);
    }
  };

  const setSubQuestProcessStepId = (
    questionId: any,
    rowId: any,
    itemId: any
  ) => {
    let question: any = data.filter((x: any) => x.questionId === questionId)[0];
    setSubData(question);
    let questionRow: any = question.questionRows?.filter(
      (x: any) => x?.id === itemId
    )[0];
    let dataWithoutQuestion: any = question.questionRows?.filter(
      (x: any) => x?.id !== itemId
    );
    if (questionRow) {
      questionRow.processStepId = rowId;
    }
    let k: any = [...dataWithoutQuestion, questionRow];
    k = k.sort((a: any, b: any) => a.id - b.id);
    setSubData(k);
  };
  const setSubRating = (questionId: any, rowId: any, itemId: any) => {
    let question: any = data.filter((x: any) => x.questionId === questionId)[0];
    setSubData(question);
    let questionRow: any = question.questionRows?.filter(
      (x: any) => x?.id === itemId
    )[0];
    let dataWithoutQuestion: any = question.questionRows?.filter(
      (x: any) => x?.id !== itemId
    );
    if (questionRow) {
      questionRow.predefinedScaleType = rowId;
    }
    let k: any = [...dataWithoutQuestion, questionRow];
    k = k.sort((a: any, b: any) => a.id - b.id);
    setSubData(k);
  };

  const setSubQuestScaleId = (questionId: any, rowId: any, itemId: any) => {
    if (questionId > 0) {
      let question: any = data.filter(
        (x: any) => x.questionId === questionId
      )[0];
      setSubData(question);
      let questionRow: any = question.questionRows?.filter(
        (x: any) => x?.id === itemId
      )[0];
      let dataWithoutQuestion: any = question.questionRows?.filter(
        (x: any) => x?.id !== itemId
      );
      if (questionRow) {
        questionRow.scaleId = rowId;
      }
      let k: any = [...dataWithoutQuestion, questionRow];
      k = k.sort((a: any, b: any) => a.id - b.id);
      setSubData(k);
    }
    props.setQuestions(data);
  };

  const setSubQuestFactorId = (questionId: any, rowId: any, itemId: any) => {
    let question: any = data.filter((x: any) => x.questionId === questionId)[0];
    setSubData(question);
    console.log(question);
    let questionRow: any = question.questionRows?.filter(
      (x: any) => x?.id === itemId
    )[0];
    let dataWithoutQuestion: any = question.questionRows?.filter(
      (x: any) => x?.id !== itemId
    );
    if (questionRow) {
      questionRow.factorId = rowId;
    }
    let k: any = [...dataWithoutQuestion, questionRow];
    k = k.sort((a: any, b: any) => a.id - b.id);
    setSubData(k);
  };

  const setFactorsId = (questionId: any, rowId: any) => {
    let question: any = data.filter((x: any) => x.questionId === questionId)[0];
    let dataWithoutQuestion: any = data.filter(
      (x: any) => x.questionId !== questionId
    );
    if (question) {
      question.factorId = rowId;
    }
    let k: any = [...dataWithoutQuestion, question];
    k = k.sort((a: any, b: any) => a.questionId - b.questionId);
    setData(k);
  };

  const setSubquestionScales = () => {
    const questions = props.questionsData.map((question: any) => {
      if (question.questionId === scaleDataHasChanged.questionId) {
        if (!scaleDataHasChanged.rowId) {
          question.predefinedScaleType =
            scaleDataHasChanged.predefinedScaleType;
        }
        if (question.questionRows && question.questionRows.length >= 1) {
          const questionRows = question.questionRows.map((row: any) => {
            if (row.id == scaleDataHasChanged.rowId) {
              if (question.ratingScale && question.ratingScale.length) {
                row.predefinedScaleType =
                  scaleDataHasChanged.predefinedScaleType;
              } else {
                row.scaleId = scaleDataHasChanged.scaleId;
              }
            }

            return row;
          });
          question.questionRows = questionRows;
        }
      }

      return question;
    });

    props.setQuestions(questions);
  };

  const getRatingScaleType = (predefinedScaleType: number) => {
    if (predefinedScaleType === 0) {
      return "is Positive";
    } else if (predefinedScaleType === 1) {
      return "is Negative";
    } else {
      return "";
    }
  };

  return (
    <article className="questions">
      <DataTable
        name="questions"
        class="questions"
        data={data}
        headers={["#", "Question","Responses", "Process Step", "Scale", "Factor"]}
        sorting={[]}
        labels={["letterId", "questionHeading", "numberOfResponses", "", "", ""]}
        buttons={[]}
        buttonLabels={[]}
        buttonAction={() => null}
        formatCells={{ Question: [1], ProcessStep: [3], Scale: [4], Factor: [5] }}
        processStepArr={processStepArr}
        setProcessStepArr={setProcessStepArr}
        scalesArr={scalesArr}
        setScalesArr={setScalesArr}
        factorsArr={factorsArr}
        setFactorsArr={setFactorsArr}
        setScaleDataHasChanged={(e) => {
          console.log("setScaleDataHasChanged");
          setScaleDataHasChanged(e);
        }}
        surveyId={props.surveyId}
        setProcessStepId={setProcessStepId}
        setData={(e) => {
          console.log("setData");
          setData(e);
        }}
        setFactorsId={setFactorsId}
        setSubQuestFactorId={setSubQuestFactorId}
        setScaleId={(e, a) => {
          console.log("setScaleId");
          setScaleId(e, a);
        }}
        setSubQuestProcessStepId={setSubQuestProcessStepId}
        setSubQuestScaleId={setSubQuestScaleId}
        setRating={setRating}
        setSubRating={setSubRating}
        setUpdateQuestions={props.setUpdateQuestions(data)}
      />
    </article>
  );
}

export default QuestionsScreen;
