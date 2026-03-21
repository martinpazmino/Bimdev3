import { v4 as uuidv4 } from 'uuid'
import { IToDo } from './ToDo'

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
  name: string
  description: string
  status: ProjectStatus
  userRole: UserRole
  finishDate: Date
  cost?: number
  progress?: number
  todos?: IToDo[]
}

export class Project implements IProject {
  //To satisfy IProject
  name: string
  description: string
  status: "pending" | "active" | "finished"
  userRole: "architect" | "engineer" | "developer"
  finishDate: Date
  
  //Class internals
  cost: number = 0
  progress: number = 0
  id: string
  todos: IToDo[] = []

  constructor(data: IProject, id = uuidv4()) {
    this.name = data.name
    this.description = data.description
    this.status = data.status
    this.userRole = data.userRole
    this.finishDate = data.finishDate instanceof Date ? data.finishDate : new Date(data.finishDate)
    this.cost = data.cost ?? 0
    this.progress = data.progress ?? 0
    this.todos = data.todos ?? []
    this.id = id
  }
}