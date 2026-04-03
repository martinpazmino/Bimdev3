import { v4 as uuidv4 } from 'uuid'

export type UserRole = "architect" | "engineer" | "developer"
export type UserStatus = "active" | "inactive" | "busy"

export interface IUser {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  projectName: string
  lastActive: string
  photoUrl: string
}

export class User implements IUser {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  projectName: string
  lastActive: string
  photoUrl: string
  id: string

  constructor(data: IUser, id = uuidv4()) {
    this.name = data.name
    this.email = data.email
    this.role = data.role
    this.status = data.status
    this.projectName = data.projectName
    this.lastActive = data.lastActive
    this.photoUrl = data.photoUrl
    this.id = id
  }
}

export const mockUsers: User[] = [
  new User({
    name: "Martin Weber",
    email: "martin.weber@masterbimsoftware.com",
    role: "architect",
    status: "active",
    projectName: "Berlin Central Tower",
    lastActive: "2 min ago",
    photoUrl: "https://i.pravatar.cc/150?img=11"
  }),
  new User({
    name: "Sophie Muller",
    email: "sophie.muller@masterbimsoftware.com",
    role: "engineer",
    status: "active",
    projectName: "Munich Residence Complex",
    lastActive: "15 min ago",
    photoUrl: "https://i.pravatar.cc/150?img=5"
  }),
  new User({
    name: "Lukas Schmidt",
    email: "lukas.schmidt@masterbimsoftware.com",
    role: "developer",
    status: "busy",
    projectName: "Hamburg Port Facility",
    lastActive: "1 hour ago",
    photoUrl: "https://i.pravatar.cc/150?img=12"
  }),
  new User({
    name: "Anna Fischer",
    email: "anna.fischer@masterbimsoftware.com",
    role: "architect",
    status: "active",
    projectName: "Frankfurt Office Park",
    lastActive: "30 min ago",
    photoUrl: "https://i.pravatar.cc/150?img=9"
  }),
  new User({
    name: "Jonas Braun",
    email: "jonas.braun@masterbimsoftware.com",
    role: "engineer",
    status: "inactive",
    projectName: "Stuttgart Bridge Project",
    lastActive: "3 days ago",
    photoUrl: "https://i.pravatar.cc/150?img=53"
  }),
  new User({
    name: "Elena Hoffmann",
    email: "elena.hoffmann@masterbimsoftware.com",
    role: "developer",
    status: "active",
    projectName: "Berlin Central Tower",
    lastActive: "5 min ago",
    photoUrl: "https://i.pravatar.cc/150?img=45"
  }),
  new User({
    name: "Max Richter",
    email: "max.richter@masterbimsoftware.com",
    role: "architect",
    status: "busy",
    projectName: "Dresden Cultural Center",
    lastActive: "45 min ago",
    photoUrl: "https://i.pravatar.cc/150?img=33"
  }),
  new User({
    name: "Clara Wagner",
    email: "clara.wagner@masterbimsoftware.com",
    role: "engineer",
    status: "active",
    projectName: "Munich Residence Complex",
    lastActive: "10 min ago",
    photoUrl: "https://i.pravatar.cc/150?img=32"
  })
]
