import { IProject, Project } from "./Project"
import { IToDo } from "./ToDo"

const PROJECTS_KEY = "bimdev3_projects"

function saveToStorage(projects: Project[]) {
  const serializable = projects.map((p) => ({
    ...p,
    finishDate: p.finishDate.toISOString(),
  }))
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(serializable))
}

function loadFromStorage(): Project[] {
  const raw = localStorage.getItem(PROJECTS_KEY)
  if (!raw) { return [] }
  try {
    const parsed: any[] = JSON.parse(raw)
    return parsed.map((p) => new Project({ ...p, finishDate: new Date(p.finishDate) }, p.id))
  } catch { return [] }
}

export class ProjectsManager {
  list: Project[] = loadFromStorage()
  OnProjectCreated = (_project: Project) => {}
  OnProjectDeleted = (_id: string) => {}
  OnProjectUpdated = (_project: Project) => {}

  private persist() {
    saveToStorage(this.list)
  }

  filterProjects(value: string) {
    return this.list.filter((project) => project.name.toLowerCase().includes(value.toLowerCase()))
  }

  newProject(data: IProject, id?: string) {
    const projectNames = this.list.map((p) => p.name)
    if (projectNames.includes(data.name)) {
      throw new Error(`A project with the name "${data.name}" already exists`)
    }
    const project = new Project(data, id)
    this.list.push(project)
    this.persist()
    this.OnProjectCreated(project)
    return project
  }

  getProject(id: string) {
    return this.list.find((project) => project.id === id)
  }

  getProjectByName(name: string) {
    return this.list.find((project) => project.name === name)
  }

  updateProject(id: string, data: Partial<IProject & { todos: IToDo[] }>) {
    const project = this.getProject(id)
    if (!project) { return }
    if (data.name !== undefined) project.name = data.name
    if (data.description !== undefined) project.description = data.description
    if (data.status !== undefined) project.status = data.status
    if (data.userRole !== undefined) project.userRole = data.userRole
    if (data.finishDate !== undefined) {
      project.finishDate = data.finishDate instanceof Date ? data.finishDate : new Date(data.finishDate)
    }
    if (data.cost !== undefined) project.cost = data.cost
    if (data.progress !== undefined) project.progress = data.progress
    if (data.todos !== undefined) project.todos = data.todos
    this.persist()
    this.OnProjectUpdated(project)
    return project
  }

  deleteProject(id: string) {
    const project = this.getProject(id)
    if (!project) { return }
    this.list = this.list.filter((p) => p.id !== id)
    this.persist()
    this.OnProjectDeleted(id)
  }

  exportToJSON(fileName: string = "projects.json") {
    const data = this.list.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      userRole: p.userRole,
      finishDate: p.finishDate.toISOString(),
      cost: p.cost,
      progress: p.progress,
      todos: p.todos ?? [],
    }))
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  importFromJSON() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const json = reader.result
      if (!json) { return }
      const projects: any[] = JSON.parse(json as string)
      for (const p of projects) {
        const iProject: IProject = {
          name: p.name,
          description: p.description,
          status: p.status,
          userRole: p.userRole,
          finishDate: new Date(p.finishDate),
          cost: p.cost,
          progress: p.progress,
          todos: p.todos ?? [],
        }
        const existing = this.getProjectByName(p.name)
        if (existing) {
          // Update existing project (including todos)
          this.updateProject(existing.id, { ...iProject })
        } else {
          try {
            this.newProject(iProject, p.id)
          } catch (_) {}
        }
      }
      this.OnProjectCreated(this.list[0]) // trigger UI refresh
    })
    input.addEventListener("change", () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsText(filesList[0])
    })
    input.click()
  }
}