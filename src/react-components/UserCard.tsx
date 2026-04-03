import * as React from "react"
import { User } from "../classes/User"

const statusColors: Record<string, string> = {
  active: "#2ecc71",
  inactive: "#969696",
  busy: "#e74c3c"
}

interface Props {
  user: User
}

export function UserCard(props: Props) {
  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-avatar-wrapper">
          <img
            className="user-avatar"
            src={props.user.photoUrl}
            alt={props.user.name}
          />
          <span
            className="user-status-dot"
            style={{ backgroundColor: statusColors[props.user.status] }}
          />
        </div>
        <div>
          <h5>{props.user.name}</h5>
          <p style={{ color: "#969696", fontSize: 12 }}>{props.user.email}</p>
        </div>
      </div>
      <div className="card-content">
        <div className="card-property">
          <p style={{ color: "#969696" }}>Role</p>
          <p style={{ textTransform: "capitalize" }}>{props.user.role}</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Status</p>
          <p style={{ color: statusColors[props.user.status], textTransform: "capitalize" }}>
            {props.user.status}
          </p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Project</p>
          <p>{props.user.projectName}</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Last Active</p>
          <p>{props.user.lastActive}</p>
        </div>
      </div>
    </div>
  )
}
