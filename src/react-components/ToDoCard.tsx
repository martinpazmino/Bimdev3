import * as React from "react"
import { ToDo as ToDoModel, ToDoPriority, ToDoStatus } from "../classes/ToDo"

interface Props {
  todo: ToDoModel
  onEdit?: (todo: ToDoModel) => void
  onDelete?: (todo: ToDoModel) => void
}

function getPriorityStyles(priority: ToDoPriority): React.CSSProperties {
  switch (priority) {
    case "High":
      return { borderLeft: "4px solid #d9534f" }
    case "Medium":
      return { borderLeft: "4px solid #f0ad4e" }
    case "Low":
    default:
      return { borderLeft: "4px solid #5cb85c" }
  }
}

function getStatusBadge(status: ToDoStatus): { label: string; style: React.CSSProperties } {
  switch (status) {
    case "In Progress":
      return { label: "In Progress", style: { backgroundColor: "#5bc0de", color: "white" } }
    case "Done":
      return { label: "Done", style: { backgroundColor: "#5cb85c", color: "white" } }
    case "Pending":
    default:
      return { label: "Pending", style: { backgroundColor: "#ddd", color: "#333" } }
  }
}

export function ToDoCard(props: Props) {
  const { todo, onEdit, onDelete } = props
  const statusBadge = getStatusBadge(todo.status)
  const priorityStyles = getPriorityStyles(todo.priority)

  return (
    <div className="todo-card" style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, ...priorityStyles }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>{todo.title}</h4>
            <span
              style={{
                fontSize: 12,
                borderRadius: 12,
                padding: "2px 8px",
                ...statusBadge.style
              }}
            >
              {statusBadge.label}
            </span>
          </div>
          <p
            style={{
              margin: "6px 0 0 0",
              color: "#555",
              fontSize: ".9rem",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical" as unknown as undefined,
              overflow: "hidden"
            }}
            title={todo.description}
          >
            {todo.description}
          </p>
        </div>
        {(onEdit || onDelete) && (
          <div style={{ display: "flex", gap: 6 }}>
            {onEdit && (
              <button
                aria-label="Edit task"
                title="Edit"
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
                onClick={() => onEdit(todo)}
              >
                <span className="material-icons-round">edit</span>
              </button>
            )}
            {onDelete && (
              <button
                aria-label="Delete task"
                title="Delete"
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#d9534f" }}
                onClick={() => onDelete(todo)}
              >
                <span className="material-icons-round">delete</span>
              </button>
            )}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#888" }}>Priority:</span>
        <span style={{ fontSize: 12, color: "#333" }}>{todo.priority}</span>
      </div>
      {typeof todo.progress === "number" && (
        <div>
          <div style={{ backgroundColor: "#404040", borderRadius: 9999, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.max(0, Math.min(100, todo.progress))}%`,
                backgroundColor: "green",
                padding: "2px 0"
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: "#888" }}>{Math.max(0, Math.min(100, todo.progress))}%</span>
        </div>
      )}
    </div>
  )
}


