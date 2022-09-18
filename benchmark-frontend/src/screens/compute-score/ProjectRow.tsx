import { useState } from 'react';
import { Accordion, Table } from 'react-bootstrap';
import moment from 'moment';
import { ReactComponent as ArrowIcon } from '../../assets/arrow-collapse-icon.svg';
import styles from './compute-score.module.scss';
import { Project } from './CompanyTabContent';

export interface ProductRowProps {
  projects: Project[];
  toggleModal: (value: boolean) => void;
  setProject: (value: Project) => void;
}

function ProductRow(props: ProductRowProps) {
  const [collapse, setCollapse] = useState<any>(null);
  const { projects, toggleModal, setProject } = props;

  return (
    <Accordion activeKey={collapse} onSelect={(key) => setCollapse(key)} as="tbody">
      {projects.map((project: any, key: number) => {
        const acordionKey = `project-${key}`;
        return (
          <>
            <tr key={key}>
              <Accordion.Toggle
                className={`${styles.collapseHeader} ${styles.trigger} ${collapse === acordionKey ? styles.active : ''}`}
                as="td"
                eventKey={acordionKey}
              >
                <div className={styles.collapseTrigger}>
                  <ArrowIcon /> <span>{project.projectName}</span>
                </div>
              </Accordion.Toggle>
              <td>{project.surveys.length}</td>
              <td>{project.surveys.length > 0 && moment(project.surveys[project.surveys.length - 1].lastResponseDate).format('MMM DD')}</td>
              <td><button onClick={() => { setProject(project); toggleModal(true); }}>Compute Score</button></td>
            </tr>

            <tr className={`collapse ${acordionKey === collapse ? 'show' : ''}`}>
              <td colSpan={4} className={styles.subColumn}>
                <Table className={`${styles.subTable} ${styles.company}`}>
                  <thead>
                    <tr>
                      <th>Form Name</th>
                      <th>Responses</th>
                      <th>Last Response</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.surveys.map((survey: any) => {
                      return (
                        <tr key={survey.id}>
                          <td>{survey.title}</td>
                          <td>{survey.numberOfResponses}</td>
                          <td>{moment(survey.lastResponseDate).format('MMM DD')}</td>
                          <td></td>
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
  );
};

export default ProductRow;
