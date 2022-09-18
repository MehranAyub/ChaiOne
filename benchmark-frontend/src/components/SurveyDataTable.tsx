
import { Table, Button, } from "react-bootstrap";
import StatusCell from "./StatusCell";
import DateCell from "./DateCell";
import ArrowDown from "./../assets/arrow-down.svg";
import "./DataTable.css";
import React from "react";



function SurveyDataTable(props: any) {
  const {
    name,
    headers,
    sorting,
    formatCells,
    data,
    buttons,
    labels,
  } = props;

  return (
    <Table hover variant="light">
 
      <tbody>
        <tr key={`${name}-table-header`}>
          {headers.map((header: any, i: number) => sorting.includes(i) ? (
            <th key={`key-${header}-${i}`}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>{header}</span>{" "}
                <img src={ArrowDown} alt="ArrowDown" className="sorting-arrow" />
              </div>
            </th>
          ) : (
            <th key={`key-${header}-${i}`}>{header}</th>
          )
          )}
        </tr>



        {data &&
          data.map((row: any, ri: number) => (
            <>
              <tr key={`${props.name}-table-row-${ri}`}>
                {labels.map((label: any, li: number) => {
                  return (
                    <React.Fragment key={`${props.label}-label-row-${li}`}>
                      {buttons.includes(li) && (
                        <td style={{ width: 220 }}>
                          <div style={{ display: "flex" }}>
                            <Button
                              className="btn-import"
                              onClick={() =>
                                props.buttonAction(row.id, false, row.title)
                              }
                            >
                              Import
                            </Button>


                            <Button
                              className="btn-ignore"
                              onClick={() =>
                                props.buttonAction(row.id, true, row.title)
                              }
                            >
                              Ignore
                            </Button>

                          </div>
                        </td>
                      )}
                      {!buttons.includes(li) && (
                        <td>
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
            </>
          ))}
      </tbody>
    </Table>
  );
}

const ScreenStyle = {
  dropbox: {
    position: "relative",
    marginRight: 32,
    border: "none",
  },
  subQuestionropbox: {
    position: "relative",
  },
  modal: {},
  modalHeader: {
    display: "flex",
    borderBottom: "none",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    borderBottom: "none",
    display: "flex",
    justifyContent: "center",
  },
  modalFooter: {
    display: "flex",
    borderTop: "none",
    justifyContent: "center",
  },
};

export default SurveyDataTable;
