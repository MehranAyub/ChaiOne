import React,{ useState, useEffect } from 'react';
import { Accordion, Table, Modal } from 'react-bootstrap';
import { getSurveyListGroupByCompanyAndProjects } from '../../services/surveysAPI';
import * as scoreComputationAPI from '../../services/scoreComputationAPI';
import { ReactComponent as ArrowIcon } from '../../assets/arrow-collapse-icon.svg';
import ProjectRow from './ProjectRow';
import './overide-tab.scss';
import styles from './compute-score.module.scss';
import Check from '../../assets/check.svg';
import { Link } from 'react-router-dom';
export interface Company {
  companyId: string;
  companyName: string;
  projects: Project[];
}
export interface Project {
  projectId: string;
  projectName: string;
  surveys: Survey[];
}
export interface Survey {
  surveyId: string;
  surveyName: string;
  surveyType: string;
  surveyStatus: string;
  surveyDate: string;
  surveyScore: number;
  surveyScorePercentage: number;
  surveyScoreStatus: string;
  surveyScoreStatusPercentage: number;
  surveyScoreStatusDate: string;
  surveyScoreStatusComment: string;
  surveyScoreStatusCommentDate: string;
  surveyScoreStatusCommentUser: string;
  surveyScoreStatusCommentUserId: string;
  surveyScoreStatusCommentUserPicture: string;
  surveyScoreStatusCommentUserPictureId: string;
  surveyScoreStatusCommentUserPictureUrl: string;
  surveyScoreStatusCommentUserPictureUrlId: string;
}
export interface ScoreData {
  totalToolCount: number;
  score: number;
  scoreDescription: string;
  processScore: string;
  fitScore: number;
  usabilityScore: number;
  priorities: number;
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

function CompanyTabContent() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [collapse, setCollapse] = useState<string>(null);
  const [company, setCompany] = useState<Company>(null);
  const [project, setProject] = useState<Project>(null);
  const [scoreData, setScoreData] = useState<ScoreData>(null);
  const [modalShow, setModalShow] = React.useState(false);  
  const [modalMessage, setModalMessage] = React.useState('');

  useEffect(() => {
    getSurveyListGroupByCompanyAndProjects().then((data) => {
      setCompanies(data.companies);
    });
  }, []);

  const sortedCompanies = companies?.sort((a: Company, b: Company) => {
    if (a?.companyName < b?.companyName) { return -1; }
    if (a?.companyName > b?.companyName) { return 1; }
    return 0;
  });

  for (let i = 0; i < sortedCompanies?.length; i++) {
    if (sortedCompanies[i]) {
      sortedCompanies[i].projects = sortedCompanies[i]?.projects?.filter((x: any) => {
        if (x?.scoreData) {
          return false;
        } else {
          return true;
        }
      });
    }
  }

  console.log("sortedCompanies",sortedCompanies);

  const computeScore = (companyId: string, projectId: string) => {
    scoreComputationAPI.computeScore(companyId, projectId).then((data) => {
       setScoreData(data);
      setModalMessage(`Score for “${company.companyName} - ${project.projectName}” has been succesfully computed`);
      setModalShow(true);
    });
  };

  return (
    <div className={styles.companyTab}>
      <div className={styles.title}>
        <h3>Company</h3>
      </div>
      {companies && companies.length > 0 &&
        <div className={styles.customCollapse}>
          <Accordion activeKey={collapse} onSelect={(key: string) => setCollapse(key)}>
            {sortedCompanies.map((company: Company, key: number) => {
              const acordionKey = `company-${key}`;
           
              return ( company.projects && company.projects.length > 0 &&
                <div className={styles.collapseContainer} key={acordionKey}>
                 
                  <Accordion.Toggle className={`${styles.collapseHeader} ${collapse === acordionKey ? styles.active : ''}`} as="div" eventKey={acordionKey}>
                    <ArrowIcon /> <span>{company.companyName}</span>
                  </Accordion.Toggle> 
                  
                  <Accordion.Collapse eventKey={acordionKey}>
                    <div className={styles.accordionContent}>
                      <Table responsive className={styles.table}>
                        <thead>
                          <tr>
                            <th>Project</th>
                            <th>Source</th>
                            <th>Last Response</th>
                            <th></th>
                          </tr>
                        </thead>
                        {company.projects && company.projects.length > 0 &&
                          <ProjectRow projects={company.projects} toggleModal={() => setCompany(company)} setProject={setProject} />
                        }
                      </Table>
                    </div>
                  </Accordion.Collapse>
                </div> 
              );
            })}
          </Accordion>
        </div>
      }

      {company &&
        <Modal
          show={true}
          onHide={() => setCompany(null)}
          animation={false}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop
          className={`${styles.customModal} computeScorePopup`}
        >
          <Modal.Header className={styles.modalHeader}>
            <Modal.Title className={styles.title}>Compute Scores for Benchmark</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            Generate benchmark for {company.companyName} - {project.projectName}
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <button className={styles.confirmBtn}
              onClick={() => { setCompany(null); computeScore(company.companyId, project.projectId); }}
            >
              Compute
            </button>
            <button className={styles.cancelBtn} onClick={() => setCompany(null)}>Cancel</button>
          </Modal.Footer>
        </Modal>
      }

{/* <Modal
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
          </div>
      </Modal.Body>
  </Modal> */}

  <Modal            show={modalShow}
                    onHide={() => setModalShow(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    className={`snackbarComputeScore`}
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
                                onClick={() => { setModalShow(false) }}>
                                Review
                            </Link>
                        </div>
                    </Modal.Body>
                </Modal>


      {/* {scoreData &&
        <Modal
          show={true}
          onHide={() => setScoreData(null)}
          animation={false}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop
          className={styles.customModal}
        >
          <Modal.Header className={styles.modalHeader}>
            <Modal.Title className={styles.title}>Score</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            <div style={{ textAlign: 'left' }}>
              <p><b>Total Tool Count: </b>{scoreData.totalToolCount}</p>
              <p><b>Score: </b>{scoreData.score}</p>
              <p><b>Score Description: </b>{scoreData.scoreDescription}</p>
              <p><b>Process Score: </b>{scoreData.processScore}</p>
              <p><b>Fit Score: </b>{scoreData.fitScore}</p>
              <p><b>Usability Score: </b>{scoreData.usabilityScore}</p>
              <p><b>Priorities: </b>{scoreData.priorities}</p>
            </div>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <button className={styles.cancelBtn} onClick={() => setScoreData(null)}>Close</button>
          </Modal.Footer>
        </Modal>
      } */}
    </div>
  );
}

export default CompanyTabContent;
