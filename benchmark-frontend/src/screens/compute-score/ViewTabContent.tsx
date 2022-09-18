import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Table } from 'react-bootstrap';

// Services
import { getSurveyListGroupByCompanyAndProjects } from '../../services/surveysAPI';
import { ReactComponent as ArrowIcon } from '../../assets/arrow-collapse-icon.svg';

import './overide-tab.scss';
import styles from './compute-score.module.scss';
import moment from 'moment';

function ViewTabContent(props:any) {
  const [companies, setCompanies] = useState<[]>([]);
  const [projectId, setProjectId] = useState<[]>(props?.projectId);
  const [collapse, setCollapse] = useState<any>(props?.companyId?.length>1?'company-'+props?.companyId:'');

  useEffect(() => {
    console.log('useEffect Call',props);
    getSurveyListGroupByCompanyAndProjects().then((data) => {
      setCompanies(data.companies);
    });
  }, [props.tabChange]);

  let sortedCompanies:any = companies?.sort((a: any, b: any) => {
    if (a?.name < b?.name) { return -1; }
    if (a?.name > b?.name) { return 1; }
    return 0;
  });

  for (let i = 0; i < sortedCompanies?.length; i++) {
    if (sortedCompanies[i]) {
      sortedCompanies[i].projects = sortedCompanies[i]?.projects?.filter((x: any) => {
        if (x?.scoreData) {
          return true;
        } else {
          return false;
        }
      });
    }
  }
  sortedCompanies= sortedCompanies?.filter((x:any)=>x?.projects?.length>0);

  const retNumberOfResponses=(surveys:any[])=>{
    let responseCount=0;
    surveys?.forEach((x=>{
      responseCount+=x?.numberOfResponses;
    }));
    return responseCount;
  }
console.log(sortedCompanies);
const clickProjectId=(_projectId)=>{
  setProjectId(_projectId)
}
  return (
    <div className={styles.companyTab}>
      <Table responsive className={styles.table}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Projects</th>
            <th>Industry</th>
          </tr>
        </thead>
        <Accordion activeKey={collapse} onSelect={(key) => setCollapse(key)} as="tbody">
          {companies && companies.length > 0  &&
            sortedCompanies.map((company: any, key: number) => {
              const acordionKey = `company-${company?.companyId}`;
              return (
                <>
                  <Accordion.Toggle
                    key={company?.companyId}
                    className={`${styles.collapseHeader} ${styles.trigger}`}
                    as="tr"
                    eventKey={acordionKey}
                  >
                    <td>
                      <div className={`${styles.collapseTrigger} ${collapse === acordionKey ? styles.active : ''}`}>
                        <ArrowIcon /> <span className={styles.ml20}>{company?.companyName}</span>
                      </div>
                    </td>
                    <td>{company?.projects?.length}</td>
                    <td></td>
                  </Accordion.Toggle>
                  <tr className={`collapse ${acordionKey === collapse ? 'show' : ''}`}>
                    <td colSpan={5} className={styles.subColumn}>
                      <Table responsive className={styles.subTable}>
                        <thead>
                          <tr>
                            <th>Project</th>
                            <th>Score</th>
                            <th>Process</th>
                            <th>Tool Fit</th>
                            <th>Usability</th>
                            <th>Responses</th>
                            <th>Code Version</th>
                            <th>Date Calculated</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {company.projects.map((project: any, projectKey: number) => {
                            return (
                              <tr key={projectKey} className={styles.hoverRow} onClick={() => clickProjectId(project?.projectId)} style={{ backgroundColor:projectId==project?.projectId?'var(--pale-grey)':''}}>
                                <td>{project?.projectName}</td>
                                <td>
                                  <div className={styles.columnText}>
                                    <h4 className={styles.good}>{project?.scoreData?.score}</h4>
                                    <p>Good</p>
                                  </div>
                                </td>
                                <td>
                                  <div className={styles.columnText}>
                                    <h4 className={styles.fair}>{project?.scoreData?.processScore}</h4>
                                    <p>Fair</p>
                                  </div>
                                </td>
                                <td>
                                  <div className={styles.columnText}>
                                    <h4 className={styles.good}>{project?.scoreData?.fitScore}</h4>
                                    <p>Good</p>
                                  </div>
                                </td>
                                <td>
                                  <div className={styles.columnText}>
                                    <h4 className={styles.good}>{project?.scoreData?.usabilityScore}</h4>
                                    <p>Good</p>
                                  </div>
                                </td>
                                <td>{retNumberOfResponses(project?.surveys)}</td> 
                                <td>v1.2</td>
                                <td>{moment(project?.scoreData?.createdDate).format('MMM DD')} </td>
                                <td align="center">
                                  <Link to={`/view-score/${company.companyId}/${project.projectId}`} className={styles.viewBtn}>View</Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                </>
              );
          })}
        </Accordion>
      </Table>
    </div>
  );
}

export default ViewTabContent;
