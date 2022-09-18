import React, { useRef, useState } from "react";

// Utils
import formatDate from "../utils/FormatDate";

// Services
import {
  getCompanies,
  getCompanyProjects,
  postCompanies,
  deleteCompanies,
  getCompany,
} from "../services/companyAPI";
import {
  postAssignCompany,
  putAssignIndustries,
  putRemoveIndustries,
  putAssignProcesses,
  putRemoveProcesses,
} from "../services/surveysAPI";
import { postCreateForCompany, deleteProjects } from "../services/projectAPI";
import {
  getIndustries,
  postIndustries,
  deleteIndustries,
} from "../services/industriesAPI";
import {
  getProcesses,
  postProcesses,
  deleteProcesses,
} from "../services/processesAPI";
import * as surveysAPI from "../services/surveysAPI";

// Components
import CircularProgress from "../components/CircularProgress";
import DropBox from "../components/DropBox";
import DropBoxMulti from "../components/DropBoxMulti";
import StatusCell from "../components/StatusCell";
import DateCell from "../components/DateCell";
import { Button, Modal } from "react-bootstrap";
import Dropdown from "../components/Dropdown/Dropdown";
import DropdownItem from "../components/Dropdown/DropdownItem";

function OverviewScreen(props: any) {
  const [companyId, setCompanyId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [industryIds, setIndustryIds] = useState<any>([]);
  const [processIds, setProcessIds] = useState<any>([]);
  const [isfetchingSurvey, setIsFetchingSurvey] = useState(true);
  const [show, setShow] = useState(false);
  const [disableProject, setDisableProject] = useState(false);
  const [projectsArr, setProjectsArr] = useState<any>([]);

  const handleClose = () => setShow(false);

  React.useEffect(() => {
    if (props.overviewData) {
      setIndustryIds(props.overviewData.industryIds);
      setProcessIds(props.overviewData.processIds);

      if (props.overviewData.companyId) {
        setCompanyId(props.overviewData.companyId);
      }
      if (props.overviewData.companyId == props.overviewData.projectId) {
        setProjectId("");
      }
      if (props.overviewData.projectId) {
        setProjectId(props.overviewData.projectId);
      }

      setIsFetchingSurvey(false);
    }
  }, [props.overviewData]);

  React.useEffect(() => {
    if (companyId) {
      getCompanyProjects(companyId).then((projects) =>
        setProjectsArr(projects)
      );
    } else if (!companyId) {
      getCompanyProjects(companyId).then((projects) => setProjectsArr(""));
    }
    props.setCompanyId(companyId);
    props.setProjectId("");
  }, [companyId]);

  React.useEffect(() => {
    props.setProjectId(projectId);
  }, [projectId]);

  // -------- Refactored
  const [companies, setCompanies] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string | null;
    name: string | null;
  }>({ id: null, name: null });
  const [selectedProject, setSelectedProject] = useState<{
    id: string | null;
    name: string | null;
  }>({ id: null, name: null });

  React.useEffect(() => {
    const fetch = async () => {
      setCompanies(await getCompanies());
    };
    fetch();
  }, []);
  React.useEffect(() => {
    setSelectedCompany({
      name: companies?.find((comp) => comp.id === props.overviewData.companyId)
        ?.name,
      id: props.overviewData.companyId,
    });
  }, [props.overviewData.companyId, companies]);
  React.useEffect(() => {
    if (selectedCompany.id) {
      const fetch = async () => {
        await getCompanyProjects(selectedCompany.id).then((res:any)=>{
          if(res?.status==500){
            setProjects([])
          }else{
            setProjects(res);
          }
          console.log("getCompanyProjects",res);
        
        });
      };
      fetch();
    }
  }, [selectedCompany.id]);
  React.useEffect(() => {
    setSelectedProject({
      name: projects?.find((comp) => comp.id === props.overviewData.projectId)
        ?.name,
      id: props.overviewData.projectId,
    });
  }, [props.overviewData.projectId, projects]);
  const AssignCompany = async (companyId: string, surveyId: string) => {
    await postAssignCompany(surveyId, companyId,props?.responseId);
    await surveysAPI.updateProjectForSurvey(surveyId, "",props?.responseId);
    setCompanies(await getCompanies());
  };
  const AssignProject = async (projectId: string, surveyId: string) => {
    await surveysAPI.updateProjectForSurvey(surveyId, projectId,props?.responseId);
    await getCompanyProjects(companyId).then((res:any)=>{
      if(res?.status==500){
        setProjects([])
      }else{
        setProjects(res);
      }
      console.log("getCompanyProjects",res);
    
    });
  };

  const handleNewCompany = async (name: string, surveyId: string) => {
    const data = await postCompanies(name);
    setCompanies(await getCompanies());
    AssignCompany(data.id, surveyId);
    props.updateOverviewCompanyId(data.id);
  };
  const handleNewProject = async (name: string, surveyId: string) => {
    const data = await postCreateForCompany(name, companyId);
    setProjects(await getCompanyProjects(companyId));
    AssignProject(data.id, surveyId);
    props.updateOverviewProjectId(data.id);
  };
  const handleDelete = async (companyId: string) => {
    try {
      await deleteCompanies(companyId);
    } catch (e) {
      console.error(e);
    } finally {
      setCompanies(await getCompanies());
    }
  };
  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProjects(id);
    } catch (e) {
      console.error(e);
    } finally {
      setProjects(await getCompanyProjects(companyId));
    }
  };
  return (
    <article style={ScreenStyle.article}>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        style={ScreenStyle.modal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="true"
        backdropClassName="modal-backdrop.show modal-backdrop.dark"
      >
        <Modal.Header style={ScreenStyle.modalHeader}>
          <Modal.Title>Delete Company</Modal.Title>
        </Modal.Header>

        <Modal.Body style={ScreenStyle.modalBody}>
          This company is used on another survey and cannot be deleted.
        </Modal.Body>

        <Modal.Footer style={ScreenStyle.modalFooter}>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ backgroundColor: "#0073a0" }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={ScreenStyle.cardWrapper} >
        <div style={ScreenStyle.card}>
          <div style={ScreenStyle.cardHeader}>Status</div>
          <div style={ScreenStyle.cardLabel}>
            <StatusCell
              status={props.overviewData && props.overviewData.status}
            />
          </div>
        </div>
        <div style={ScreenStyle.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={ScreenStyle.cardHeader}>Progress</div>
              <div style={ScreenStyle.cardLabel}>{props?.questionValidationProgress}%</div>
            </div>
            <CircularProgress value={props?.questionValidationProgress} width={120} stroke={5} />
          </div>
        </div>
        <div style={ScreenStyle.card}>
          <div style={ScreenStyle.cardHeader}>Responses</div>
          <div style={ScreenStyle.cardLabel}>
            {props.overviewData && props.overviewData.responseCount}
          </div>
        </div>
        <div style={{ ...ScreenStyle.card, ...ScreenStyle.cardLast }}>
          <div style={ScreenStyle.cardHeader}>Last Response</div>

          <div style={{...ScreenStyle.cardLabel,minWidth:'120px'}}>
            <DateCell
              dateModified={
                props.overviewData &&
                props.overviewData.responses &&
                ((props.overviewData.responses[
                  props.overviewData.responses?.length - 1
                ] &&
                  props.overviewData.responses[
                    props.overviewData.responses?.length - 1
                  ]["dateModified"]) ||
                  (props.overviewData.responses[
                    props.overviewData.responses.length - 1
                  ] &&
                    props.overviewData.responses[
                      props.overviewData.responses.length - 1
                    ]["dateCreated"]))
              }
              todayDateObj={formatDate(new Date().toDateString())}
            />
          </div>
        </div>
      </div>

      <div style={ScreenStyle.cardWrapper}>
        <Dropdown
          deleteable
          creatable
          className="mr-4"
          placeholder="Please Select"
          id="Company"
          label="Company"
          onSelect={(id, name) => {
            setSelectedCompany({ id, name });
            id == props.overviewData.companyId
              ? props.updateOverviewCompanyId("")
              : props.updateOverviewCompanyId(id);
            !id && props.updateOverviewProjectId(id);
            id == props.overviewData.companyId
              ? AssignCompany("", props.overviewData.id)
              : AssignCompany(id, props.overviewData.id);
          }}
          selectedName={selectedCompany.name}
          onCreateItem={(companyName) => {
            handleNewCompany(companyName, props.overviewData.id);
          }}
        >
          {companies?.map(({ id, name }: { id: string; name: string }) => (
            <DropdownItem
              key={id}
              name={name}
              value={id}
              isSelected={selectedCompany.id === id}
              onDelete={() => {
                handleDelete(id);
              }}
            />
          ))}
        </Dropdown>

        <Dropdown
          deleteable
          creatable
          className="mr-4"
          id="Project"
          label="Project"
          placeholder="Please Select"
          onSelect={(id, name) => {
            setSelectedProject({ id, name });
            id == props.overviewData.projectId
              ? props.updateOverviewProjectId("")
              : props.updateOverviewProjectId(id);
            id == props.overviewData.projectId
              ? AssignProject("", props.overviewData.id)
              : AssignProject(id, props.overviewData.id);
          }}
          selectedName={selectedProject.name}
          disabled={!selectedCompany.id && true}
          onCreateItem={(companyName) => {
            handleNewProject(companyName, props.overviewData.id);
          }}
        >
          {projects?.map(({ id, name }: { id: string; name: string }) => (
            <DropdownItem
              key={id}
              name={name}
              value={id}
              isSelected={selectedProject.id === id}
              onDelete={() => {
                handleDeleteProject(id);
              }}
            />
          ))}
        </Dropdown>

        <DropBoxMulti
          style={ScreenStyle.dropboxM}
          header="Industry"
          surveyId={props.overviewData && props.overviewData.id}
          responseId={props?.responseId || 0}
          onLoad={getIndustries}
          selectedItems={industryIds}
          addAction={postIndustries}
          removeAction={deleteIndustries}
          assignAction={putAssignIndustries}
          unAssignAction={putRemoveIndustries}
          isfetchingSurvey={isfetchingSurvey}
          updateOverviewIndustryIds={props.updateOverviewIndustryIds}
        />

        <DropBoxMulti
          style={ScreenStyle.dropboxM}
          header="Process"
          surveyId={props.overviewData && props.overviewData.id}
          responseId={props?.responseId || 0}
          onLoad={getProcesses}
          selectedItems={processIds}
          addAction={postProcesses}
          removeAction={deleteProcesses}
          assignAction={putAssignProcesses}
          unAssignAction={putRemoveProcesses}
          isfetchingSurvey={isfetchingSurvey}
          updateOverviewprocessIds={props.updateOverviewprocessIds}
        />
      </div>
    </article>
  );
}
const ScreenStyle = {
  article: {
    borderTop: "solid 2px var(--pale-grey)",
    padding: 32,
  },
  card: {
    flex: 1,
    height: "20vh",
    borderRadius: 6,
    boxShadow: "0 1px 4px 0 rgba(160, 169, 186, 0.6)",
    marginRight: 32,
    padding: 24,
    marginBottom: 48,
    minHeight: 170,
  },
  cardLast: {
    marginRight: 0,
  },
  cardWrapper: { 
    flex: 1,
    display: 'flex', justifyContent: 'space-between' ,flexWrap:'wrap'
  },
  cardHeader: {
    color: "var(--grey)",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "proxima-nova, sans-serif",
    marginBottom: 24,
  },
  cardLabel: {
    color: "var(--gunmetal)",
    fontSize: 32,
    fontWeight: 400,
    fontFamily: "proxima-nova, sans-serif",
  },
  dropboxM: {
    marginRight: 32,
    marginTop: "5px",
  },
  modal: {
    bottom: "-36vh",
    position: "absolute",
    maxWidth: "650px",
    marginLeft: "361px",
    marginRight: "83px",
  },
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

export default OverviewScreen;
