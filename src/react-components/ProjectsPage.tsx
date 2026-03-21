import * as React from "react";
import * as Router from "react-router-dom";
import { IProject, Project } from "../classes/Project";
import { ProjectCard } from "./ProjectCard";
import { ProjectForm } from "./ProjectForm";
import { SearchBox } from "./SearchBox";
import { ProjectsManager } from "../classes/ProjectsManager";

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectsPage(props: Props) {

  const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list)

  props.projectsManager.OnProjectCreated = () => { setProjects([...props.projectsManager.list]) }
  props.projectsManager.OnProjectDeleted = () => { setProjects([...props.projectsManager.list]) }
  props.projectsManager.OnProjectUpdated = () => { setProjects([...props.projectsManager.list]) }

  const projectCards = projects.map((project) => {
    return (
      <Router.Link to={`/project/${project.id}`} key={project.id} >
        <ProjectCard project={project} />
      </Router.Link>
    )
  })

  const onNewProjectClick = () => {
    const modal = document.getElementById("new-project-modal")
    if (!(modal && modal instanceof HTMLDialogElement)) {return}
    modal.showModal()
  }

  const handleFormSubmit = (result: { action: "create" | "update", id: string, data: IProject }) => {
    try {
      if (result.action === "create") {
        props.projectsManager.newProject(result.data, result.id)
      }
      const modal = document.getElementById("new-project-modal")
      if (!(modal && modal instanceof HTMLDialogElement)) {return}
      modal.close()
    } catch (err) {
      alert(err)
    }
  }

  const handleFormCancel = () => {
    const modal = document.getElementById("new-project-modal")
    if (!(modal && modal instanceof HTMLDialogElement)) {return}
    modal.close()
  }

  const onExportProject = () => {
    props.projectsManager.exportToJSON()
  }

  const onImportProject = () => {
    props.projectsManager.importFromJSON()
  }

  const onProjectSearch = (value: string) => {
    setProjects(props.projectsManager.filterProjects(value))
  }

  return (
    <div className="page" id="projects-page" style={{ display: "flex" }}>
      <dialog id="new-project-modal">
        <ProjectForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      </dialog>
      <header>
        <h2>Projects</h2>
        <SearchBox onChange={(value) => onProjectSearch(value)}/>
        <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
          <span
            id="import-projects-btn"
            className="material-icons-round action-icon"
            onClick={onImportProject}
          >
            file_upload
          </span>
          <span
            id="export-projects-btn"
            className="material-icons-round action-icon"
            onClick={onExportProject}
          >
            file_download
          </span>
          <button onClick={onNewProjectClick} id="new-project-btn">
            <span className="material-icons-round">add</span>New Project
          </button>
        </div>
      </header>
      {
        projects.length > 0 ? <div id="projects-list">{ projectCards }</div> : <p>There is no projects to display!</p>
      }
    </div>
  )
}