import * as React from "react";
import * as Router from "react-router-dom";
import { ProjectsManager } from "../classes/ProjectsManager";
import { ThreeViewer } from "./ThreeViewer";
import { ProjectTasksList } from "./ProjectTasksList";

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectDetailsPage(props: Props) {
  const routeParams = Router.useParams<{id: string}>()
  const navigateTo = Router.useNavigate()

  if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
  const project = props.projectsManager.getProject(routeParams.id)
  if (!project) {return (<p>The project with ID {routeParams.id} wasn't found.</p>)}

  props.projectsManager.OnProjectDeleted = (_id) => {
    navigateTo("/")
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      props.projectsManager.deleteProject(project.id)
    }
  }

  const [showCreateToDo, setShowCreateToDo] = React.useState(false)
  const [toDoQuery, setToDoQuery] = React.useState("")

  return (
    <div className="page" id="project-details">
      <header>
        <div style={{ display: "flex", alignItems: "center", columnGap: 16 }}>
          <button
            className="btn-secondary"
            onClick={() => navigateTo("/")}
            title="Back to Projects"
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px" }}
          >
            <span className="material-icons-round" style={{ fontSize: 20 }}>arrow_back</span>
            Back
          </button>
          <div>
            <h2 data-project-info="name">{project.name}</h2>
            <p style={{ color: "#969696" }}>{project.description}</p>
          </div>
        </div>
        <button onClick={handleDelete} style={{backgroundColor: "red"}}>Delete Project</button>
      </header>
      <div className="main-page-content">
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
          <div className="dashboard-card" style={{ padding: "30px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 30px",
                marginBottom: 30
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  backgroundColor: "#ca8134",
                  aspectRatio: 1,
                  borderRadius: "100%",
                  padding: 12
                }}
              >
                HC
              </p>
              <button className="btn-secondary">
                <p style={{ width: "100%" }}>Edit</p>
              </button>
            </div>
            <div style={{ padding: "0 30px" }}>
              <div>
                <h5>{project.name}</h5>
                <p>{project.description}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: 30,
                  padding: "30px 0px",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Status</p>
                  <p>{project.status}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Cost</p>
                  <p>$ {project.cost}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Role</p>
                  <p>{project.userRole}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Finish Date</p>
                  <p>{project.finishDate.toDateString()}</p>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#404040",
                  borderRadius: 9999,
                  overflow: "auto"
                }}
              >
                <div
                  style={{
                    width: `${project.progress * 100}%`,
                    backgroundColor: "green",
                    padding: "4px 0",
                    textAlign: "center"
                  }}
                >
                  {project.progress * 100}%
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-card" style={{ flexGrow: 1 }}>
            <div
              style={{
                padding: "20px 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <h4>To-Do</h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  columnGap: 20
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", columnGap: 10 }}
                >
                  <span className="material-icons-round">search</span>
                  <input
                    type="text"
                    placeholder="Search To-Do's by name"
                    value={toDoQuery}
                    onChange={(e) => setToDoQuery(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
                <span className="material-icons-round" onClick={() => setShowCreateToDo(true)} style={{cursor: "pointer"}}>add</span>
              </div>
            </div>
            <ProjectTasksList
              projectId={project.id}
              projectsManager={props.projectsManager}
              queryText={toDoQuery}
              showCreate={showCreateToDo}
              onRequestCloseCreate={() => setShowCreateToDo(false)}
            />
          </div>
        </div>
        <ThreeViewer />
      </div>
    </div>
  );
}