import * as React from "react"
import * as Firestore from "firebase/firestore"
import { firestoreDB } from "../firebase"
import { ToDoCard } from "./ToDoCard"
import { ToDo as ToDoModel } from "../classes/ToDo"

interface Props {
  projectId: string
  queryText?: string
  showCreate?: boolean
  onRequestCloseCreate?: () => void
}

export function ProjectTasksList(props: Props) {
  const [todos, setTodos] = React.useState<ToDoModel[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [priority, setPriority] = React.useState<ToDoModel["priority"]>("Low")
  const [status, setStatus] = React.useState<ToDoModel["status"]>("Pending")
  const [progress, setProgress] = React.useState<number>(0)

  React.useEffect(() => {
    setLoading(true)
    const baseQuery = Firestore.query(
      Firestore.collection(firestoreDB, "ToDo"),
      Firestore.where("projectId", "==", props.projectId)
    )
    const unsubscribe = Firestore.onSnapshot(baseQuery, (snapshot) => {
      const items: ToDoModel[] = snapshot.docs.map((doc) => {
        const data = doc.data() as any
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          projectId: data.projectId,
          createdAt: data.createdAt,
          progress: typeof data.progress === "number" ? data.progress : undefined
        } as ToDoModel
      })
      setTodos(items)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [props.projectId])

  const createToDo = async (todo: Omit<ToDoModel, "id" | "createdAt">) => {
    const payload = {
      ...todo,
      createdAt: Firestore.serverTimestamp()
    }
    await Firestore.addDoc(Firestore.collection(firestoreDB, "ToDo"), payload)
  }

  const updateToDo = async (id: string, updates: Partial<ToDoModel>) => {
    const ref = Firestore.doc(firestoreDB, `ToDo/${id}`)
    await Firestore.updateDoc(ref, updates as any)
  }

  const deleteToDo = async (id: string) => {
    const ref = Firestore.doc(firestoreDB, `ToDo/${id}`)
    await Firestore.deleteDoc(ref)
  }

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
        {loading && <p>Loading tasks…</p>}
        {!loading && filteredTodos.length === 0 && <p>No tasks yet.</p>}
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
          onSubmit={async (e) => {
            e.preventDefault()
            await createToDo({
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
            display: "grid",
            gap: 10,
            gridTemplateColumns: "1fr 1fr 1fr 1fr 120px auto"
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ gridColumn: "span 2" }}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ gridColumn: "span 2" }}
            required
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value as ToDoModel["priority"]) }>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as ToDoModel["status"]) }>
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
            placeholder="Progress %"
          />
          <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
            <span className="material-icons-round">add</span>
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
        display: "grid",
        gap: 10,
        gridTemplateColumns: "1fr 1fr 140px 160px 120px auto auto",
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
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value as ToDoModel["priority"]) }>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value as ToDoModel["status"]) }>
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
        placeholder="Progress %"
      />
      <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
      <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>Save</button>
    </form>
  )
}


