export type ToDoPriority = "Low" | "Medium" | "High"
export type ToDoStatus = "Pending" | "In Progress" | "Done"

export interface IToDo {
  title: string
  description: string
  priority: ToDoPriority
  status: ToDoStatus
  projectId: string
  progress?: number
  createdAt?: Date | { seconds: number; nanoseconds: number }
}

export class ToDo implements IToDo {
  title: string
  description: string
  priority: ToDoPriority
  status: ToDoStatus
  projectId: string
  progress?: number
  createdAt?: Date | { seconds: number; nanoseconds: number }
  id?: string

  constructor(data: IToDo, id?: string) {
    this.title = data.title
    this.description = data.description
    this.priority = data.priority
    this.status = data.status
    this.projectId = data.projectId
    this.progress = data.progress
    this.createdAt = data.createdAt
    this.id = id
  }
}


