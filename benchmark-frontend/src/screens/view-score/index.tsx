import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";

import { getCompany } from "../../services/companyAPI";
import { getProject } from "../../services/projectAPI";
import OverallScore from "./OverallScore";
import Widget from "./Widget";
import { ReactComponent as ArrowForward } from "../../assets/arrow-forward.svg";
import { ReactComponent as ArrowBackward } from "../../assets/arrow-backward.svg";
import styles from "./view-score.module.scss";
import moment from "moment";

function ViewScoreScreen() {
  const [company, setCompany] = useState<any | null>(null);
  const [project, setProject] = useState<any | null>(null);
  const { companyId, projectId } = useParams<any>();

  useEffect(() => {
    getCompany(companyId).then((data: any) => {
      setCompany(data);
    });
    getProject(projectId).then((data: any) => {
      setProject(data);
    });
  }, []);
  // const input = document.getElementById("myRange").ariaValueNow;
  if (!project) return null;
  let industries = "";
  let processes = "";
  let sources = "";
  let sourcesCount = 0;
  let dateCalculated = null;
  let totalResponses = 0;
  let totalToolCount = 0;
  let score = 0;
  if (!!project) {
    sourcesCount = project?.surveys?.length;
    totalToolCount =
      project?.companyProjectScoreData?.scoreData?.totalToolCount;
    score = project?.companyProjectScoreData?.scoreData?.score;
    dateCalculated = project?.companyProjectScoreData?.createdDate;
    for (let i = 0; i < project?.surveys?.length; i++) {
      sources += project?.surveys[i]?.title + ", ";
      totalResponses += project?.surveys[i]?.responseCount;

      for (let y = 0; y < project?.surveys[i]?.industries?.length; y++) {
        if (
          project?.surveys[i]?.industries &&
          project?.surveys[i]?.industries?.length > 0
        ) {
          industries += project?.surveys[i]?.industries[y]?.name + ", ";
        }
      }

      for (let y = 0; y < project?.surveys[i]?.processes?.length; y++) {
        if (
          project?.surveys[i]?.processes &&
          project?.surveys[i]?.processes?.length > 0
        ) {
          processes += project?.surveys[i]?.processes[y]?.name + ", ";
        }
      }
    }
  }
  console.log("industries", industries);
  console.log("processes", processes);
  console.log("sources", sources);
  console.log("totalResponses", totalResponses);

  return (
    <main className="validate-screen" id={styles.computeScore}>
      <div className="top-panel"></div>
      <div className={styles.content}>
        <div className={styles.header}>
          {/* <div className={styles.breadcrumb}>
            <Link to="/compute-score">Compute Score</Link>
            <ArrowForward />
            <span>{company?.name}</span>
          </div> */}

          <div className={styles.breadcrumb}>
          <ArrowBackward />
          <Link
          to={{pathname: `/compute-score/${companyId}/${projectId}`}}>
          BACK TO COMPUTED SCORES
          </Link>
        </div>
        
          <h2>
            {company?.name} {project && `- ${project?.name}`}{" "}
          </h2>
        </div>
        <div className={styles.sectionOne}>
          <OverallScore score={score} percent={"60.75deg"} />
          <div className={`${styles.column}`}>
            <div className={styles.responseAndTool}>
              <Widget title="Total Responses">
                <div className={styles.responses}>
                  <h4>{totalResponses}</h4>
                </div>
              </Widget>
              <Widget title="Total Tool Count">
                <div className={styles.responses}>
                  <h4>{totalToolCount}</h4>
                </div>
              </Widget>
            </div>

            <div className={styles.sources}>
              <Widget title="Sources">
                <div className={styles.sourceContent}>
                  <div className={styles.count}>{sourcesCount}</div>
                  <div className={styles.sourceNames}>
                    <p>
                      {sources?.length > 100
                        ? sources?.slice(0, 100) + "..."
                        : sources}
                    </p>
                  </div>
                </div>
              </Widget>
            </div>

            <div className={styles.sources}>
              <Widget title="User Roles">
                <div className={styles.responses}>
                  <h4>NA</h4>
                </div>
              </Widget>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.industry}>
              <Widget title="Industry">
                <p>
                  {industries?.length > 100
                    ? industries?.slice(0, 100) + "..."
                    : industries}
                </p>
              </Widget>
            </div>

            <div className={styles.processTags}>
              <Widget title="Process Tags">
                <p>
                  {processes?.length > 100
                    ? processes?.slice(0, 100) + "..."
                    : processes}
                </p>
              </Widget>
            </div>

            <div className={styles.dateCalculated}>
              <Widget title="Date Calculated">
                <div className={styles.date}>
                  {moment(dateCalculated).format("MMM DD")}
                </div>
              </Widget>
            </div>
          </div>
        </div>
        <div className={styles.sectionTwo}>
          <div className={`${styles.box} ${styles.process}`}>
            <div className={styles.header}>Process</div>
            <div className={styles.score}>
              <h3>9.75</h3>
              <p>Poor</p>
            </div>
            <div className={styles.progressBar}>
              <input
                type="range"
                className={styles.slider}
                value="12"
                min="0"
                max="100"
                id="process"
              />
              {document.getElementById("process")?.defaultValue <= 25 ? (
                <div className={`${styles.progress} ${styles.progress1}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress1} ${styles.overlay}`}
                />
              )}
              {document.getElementById("process")?.defaultValue > 25 &&
              document.getElementById("process")?.defaultValue < 50 ? (
                <div className={`${styles.progress} ${styles.progress2}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress2} ${styles.overlay}`}
                />
              )}
              {document.getElementById("process")?.defaultValue > 50 &&
              document.getElementById("process")?.defaultValue < 75 ? (
                <div className={`${styles.progress} ${styles.progress3}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress3} ${styles.overlay}`}
                />
              )}
              {document.getElementById("process")?.defaultValue > 75 &&
              document.getElementById("process")?.defaultValue < 100 ? (
                <div className={`${styles.progress} ${styles.progress4}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress4} ${styles.overlay}`}
                />
              )}
              {/* <div className={`${styles.progress} ${styles.progress1}`} /> */}
              {/* <div className={`${styles.progress} ${styles.progress2}`} /> */}
              {/* <div className={`${styles.progress} ${styles.progress3}`} /> */}
              {/* <div className={`${styles.progress} ${styles.progress4}`} /> */}
            </div>
            <p className={styles.description}>
              Degree of inefficiences, lack of visibility, sequential steps,
              stalled approvals, etc.
            </p>
            <ol className={styles.list}>
              <li>
                Inaccurate, insufficient inspection/services/material info
              </li>
              <li>Gathering information on current inventory</li>
              <li>Amount of manual work involved</li>
              <li>Delays with inspection/services/receipt of materials</li>
              <li>Inconsistent information across different Chevron systems</li>
              <li>Disparate, multiple shipments of materials</li>
              <li>Gathering information on inventory movements</li>
              <li>Lack of real-time visibility into material shipment</li>
              <li>
                Entering information about current inventory into systems of
                record
              </li>
              <li>Communicating information on changes in current inventory</li>
              <li>Communicating information about inventory movements</li>
              <li>
                Planning/purchasing/tracking/receiving/invoicing materials
              </li>
              <li>Inventory management</li>
              <li>Lack of real-time visibility onshore</li>
              <li>Lack of real-time visibility into inventory</li>
              <li>Delays with invoices</li>
              <li>Gathering information on what happened onshore</li>
              <li>Using Ariba</li>
              <li>
                Communicating information about offshore inventory movements
              </li>
              <li>Manual, ad hoc reports</li>
              <li>
                Matching information from different systems (Ariba, SAP, other
                back-end systems)
              </li>
              <li>Communicating information about offshore inventory needs</li>
              <li>Lack of real-time visibility offshore</li>
              <li>Emails - Chevron materials/inventory management lifecycle</li>
              <li>Solving invoicing issues with vendors</li>
              <li>
                Validating and signing off inspection/services/receipt of
                materials
              </li>
            </ol>
          </div>

          <div className={`${styles.box} ${styles.toolFit}`}>
            <div className={styles.header}>Tool Fit</div>
            <div className={styles.score}>
              <h3>12.5</h3>
              <p>Below Average</p>
            </div>
            <div className={styles.progressBar}>
              <input
                type="range"
                className={styles.slider}
                value="30"
                min="0"
                max="100"
                id="tool"
              />
              {document.getElementById("tool")?.defaultValue <= 25 ? (
                <div className={`${styles.progress} ${styles.progress1}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress1} ${styles.overlay}`}
                />
              )}
              {document.getElementById("tool")?.defaultValue > 25 &&
              document.getElementById("tool")?.defaultValue < 50 ? (
                <div className={`${styles.progress} ${styles.progress2}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress2} ${styles.overlay}`}
                />
              )}
              {document.getElementById("tool")?.defaultValue > 50 &&
              document.getElementById("tool")?.defaultValue < 75 ? (
                <div className={`${styles.progress} ${styles.progress3}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress3} ${styles.overlay}`}
                />
              )}
              {document.getElementById("tool")?.defaultValue > 75 &&
              document.getElementById("tool")?.defaultValue < 100 ? (
                <div className={`${styles.progress} ${styles.progress4}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress4} ${styles.overlay}`}
                />
              )}
              {/* <div className={`${styles.progress} ${styles.progress1}`} />
              <div className={`${styles.progress} ${styles.progress2}`} />
              <div className={`${styles.progress} ${styles.progress3}`} />
              <div className={`${styles.progress} ${styles.progress4}`} /> */}
            </div>
            <p className={styles.description}>
              Degree to which current tools support employees in their work
              tasks
            </p>

            <ol className={styles.list}>
              <li>EB (E-Bentley)</li>
              <li>DMS</li>
              <li>IMS</li>
              <li>OOF (Web form)</li>
              <li>Tubular Confirmation Sheet</li>
              <li>PD-15 (SharePoint)</li>
              <li>EAM</li>
              <li>MMF (SharePoint)</li>
              <li>SmartBox</li>
              <li>DCI</li>
              <li>QAR</li>
              <li>Power BI</li>
              <li>QLS</li>
              <li>SMART</li>
              <li>Supplier Systems</li>
              <li>SharePoint</li>
              <li>SAP</li>
              <li>CMEF</li>
              <li>Ariba</li>
              <li>CIA</li>
              <li>DEEM</li>
              <li>WellView</li>
              <li>PDF</li>
              <li>Word</li>
            </ol>
          </div>

          <div className={`${styles.box} ${styles.usability}`}>
            <div className={styles.header}>Usability</div>
            <div className={styles.score}>
              <h3>18</h3>
              <p>Fair</p>
            </div>
            <div className={styles.progressBar}>
              <input
                type="range"
                className={styles.slider}
                value="60"
                min="1"
                max="100"
                id="usability"
              />
              {document.getElementById("usability")?.defaultValue <= 25 ? (
                <div className={`${styles.progress} ${styles.progress1}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress1} ${styles.overlay}`}
                />
              )}
              {document.getElementById("usability")?.defaultValue > 25 &&
              document.getElementById("usability")?.defaultValue < 50 ? (
                <div className={`${styles.progress} ${styles.progress2}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress2} ${styles.overlay}`}
                />
              )}
              {document.getElementById("usability")?.defaultValue > 50 &&
              document.getElementById("usability")?.defaultValue < 75 ? (
                <div className={`${styles.progress} ${styles.progress3}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress3} ${styles.overlay}`}
                />
              )}
              {document.getElementById("tool")?.defaultValue > 75 &&
              document.getElementById("tool")?.defaultValue < 100 ? (
                <div className={`${styles.progress} ${styles.progress4}`} />
              ) : (
                <div
                  className={`${styles.progress} ${styles.progress4} ${styles.overlay}`}
                />
              )}
              {/* <div className={`${styles.progress} ${styles.progress1}`} />
              <div className={`${styles.progress} ${styles.progress2}`} />
              <div className={`${styles.progress} ${styles.progress3}`} />
              <div className={`${styles.progress} ${styles.progress4}`} /> */}
            </div>
            <p className={styles.description}>
              Degree to which current tools are intuitive and easy to use for
              employees
            </p>

            <ol className={styles.list}>
              <li>IMS</li>
              <li>MMF (SharePoint)</li>
              <li>OOF (Web form)</li>
              <li>Tubular Confirmation Sheet</li>
              <li>PD-15 (SharePoint)</li>
              <li>SmartBox</li>
              <li>QAR</li>
              <li>EAM</li>
              <li>EB (E-Bentley)</li>
              <li>O-Drive</li>
              <li>DCI</li>
              <li>CMEF</li>
              <li>DEEM</li>
              <li>DMS</li>
              <li>eSAR/intranet</li>
              <li>Power BI</li>
              <li>SharePoint</li>
              <li>SMART</li>
              <li>Supplier Systems</li>
              <li>Word</li>
              <li>Ariba</li>
              <li>Excel</li>
              <li>SAP</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewScoreScreen;
