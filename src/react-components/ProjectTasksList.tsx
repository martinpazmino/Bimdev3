import * as React from "react"
import { ProjectsManager } from "../classes/ProjectsManager"
import { ToDoCard } from "./ToDoCard"
import { ToDo as ToDoModel, IToDo } from "../classes/ToDo"
import { v4 as uuidv4 } from "uuid"

interface Props {
  projectId: string
  projectsManager: ProjectsManager
  queryText?: string
  showCreate?: boolean
  onRequestCloseCreate?: () => void
}

export function ProjectTasksList(props: Props) {
  const getProjectTodos = (): ToDoModel[] => {
    const project = props.projectsManager.getProject(props.projectId)
    return (project?.todos ?? []).map((t) => new ToDoModel(t, (t as any).id ?? uuidv4()))
  }

  const [todos, setTodos] = React.useState<ToDoModel[]>(getProjectTodos)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [priority, setPriority] = React.useState<ToDoModel["priority"]>("Low")
  const [status, setStatus] = React.useState<ToDoModel["status"]>("Pending")
  const [progress, setProgress] = React.useState<number>(0)

  const persistTodos = (updated: ToDoModel[]) => {
    props.projectsManager.updateProject(props.projectId, { todos: updated as IToDo[] })
    setTodos(updated)
  }

  const createToDo = (todo: Omit<ToDoModel, "id" | "createdAt">) => {
    const newTodo = new ToDoModel({ ...todo, createdAt: new Date() }, uuidv4())
    persistTodos([...todos, newTodo])
  }

  const updateToDo = (id: string, updates: Partial<ToDoModel>) => {
    const updated = todos.map((t) => t.id === id ? { ...t, ...updates } as ToDoModel : t)
    persistTodos(updated)
  }

  const deleteToDo = (id: string) => {
    persistTodos(todos.filter((t) => t.id !== id))
  }

  // Re-sync when project data changes externally (e.g. after import)
  React.useEffect(() => {
    setTodos(getProjectTodos())
  }, [props.projectId])

  const filteredTodos = React.useMemo(() => {
    const q = (props.queryText ?? "").trim().toLowerCase()
    if (!q) { return todos }
    return todos.filter((t) =>
      t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    )
  }, [props.queryText, todos])

  return (
    <div style={{ padding: "0 30px 20px 30px" }}>
      <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
        {filteredTodos.length === 0 && <p>No tasks yet.</p>}
        {filteredTodos.map((t) => (
          <EditableToDoCard
            key={t.id}
            todo={t}
            onSave={(updates) => updateToDo(t.id!, updates)}
            onDelete={() => deleteToDo(t.id!)}
          />
        ))}
      </div>
      {props.showCreate && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createToDo({
              title,
              description,
              priority,
              status,
              progress,
              projectId: props.projectId
            })
            setTitle("")
            setDescription("")
            setPriority("Low")
            setStatus("Pending")
            setProgress(0)
            props.onRequestCloseCreate && props.onRequestCloseCreate()
          }}
          style={{
            marginTop: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center"
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: "1 1 120px", minWidth: 0 }}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: "2 1 140px", minWidth: 0 }}
            required
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value as ToDoModel["priority"])} style={{ flex: "0 1 90px" }}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as ToDoModel["status"])} style={{ flex: "0 1 110px" }}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <input
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            placeholder="%"
            style={{ flex: "0 1 60px", minWidth: 0 }}
          />
          <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)", padding: "6px 10px", flexShrink: 0 }}>
            <span className="material-icons-round" style={{ fontSize: 18 }}>add</span>
          </button>
        </form>
      )}
    </div>
  )
}

function EditableToDoCard(props: { todo: ToDoModel; onSave: (updates: Partial<ToDoModel>) => void; onDelete: () => void }) {
  const { todo, onSave, onDelete } = props
  const [isEditing, setIsEditing] = React.useState(false)
  const [title, setTitle] = React.useState(todo.title)
  const [description, setDescription] = React.useState(todo.description)
  const [priority, setPriority] = React.useState<ToDoModel["priority"]>(todo.priority)
  const [status, setStatus] = React.useState<ToDoModel["status"]>(todo.status)
  const [progress, setProgress] = React.useState<number>(typeof todo.progress === "number" ? todo.progress : 0)

  if (!isEditing) {
    return (
      <ToDoCard
        todo={todo}
        onEdit={() => setIsEditing(true)}
        onDelete={() => onDelete()}
      />
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ title, description, priority, status, progress })
        setIsEditing(false)
      }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        background: "var(--background-100)",
        padding: 12,
        borderRadius: 8
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{ flex: "1 1 120px", minWidth: 0 }}
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        style={{ flex: "2 1 140px", minWidth: 0 }}
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value as ToDoModel["priority"])} style={{ flex: "0 1 90px" }}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value as ToDoModel["status"])} style={{ flex: "0 1 110px" }}>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <input
        type="number"
        min={0}
        max={100}
        value={progress}
        onChange={(e) => setProgress(Number(e.target.value))}
        placeholder="%"
        style={{ flex: "0 1 60px", minWidth: 0 }}
      />
      <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: "6px 10px", flexShrink: 0 }}>
        <span className="material-icons-round" style={{ fontSize: 18 }}>close</span>
      </button>
      <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)", padding: "6px 10px", flexShrink: 0 }}>
        <span className="material-icons-round" style={{ fontSize: 18 }}>check</span>
      </button>
    </form>
  )

}
