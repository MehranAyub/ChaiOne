import { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import CompanyTabContent from './CompanyTabContent';
import ViewTabContent from './ViewTabContent';
import './overide-tab.scss';
import styles from './compute-score.module.scss';
import { useParams } from 'react-router-dom';

function ComputeScoreScreen() {
  const { companyId,projectId } = useParams<any>();
  const [tab, setTab] = useState<any>(companyId?.length>1?'view':'calculate');

  return (
    <main className="validate-screen" id={styles.computeScore}>
      <div className="top-panel"></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Benchmark Results</h2>
        </div>
        <div className='tab-container'>
          <Tabs
            activeKey={tab}
            onSelect={(k) => setTab(k)}
            id="calculate"
          >
            <Tab eventKey="calculate" title="Calculate">
              <CompanyTabContent />
            </Tab>
            <Tab eventKey="view" title="View">
              <ViewTabContent tabChange={tab} companyId={companyId?.length>1?companyId:'0'} projectId={projectId?.length>1?projectId:'0'} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

export default ComputeScoreScreen;
