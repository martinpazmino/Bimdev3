import * as React from "react"
import * as Firestore from "firebase/firestore"
import { IProject, ProjectStatus, UserRole } from "../classes/Project"
import { getCollection, updateDocument } from "../firebase"

interface SubmitResult {
  action: "create" | "update"
  id: string
  data: IProject
}

interface Props {
  project?: (Partial<IProject> & { id?: string }) | null
  onSubmit: (result: SubmitResult) => void
  onCancel?: () => void
}

const projectsCollection = getCollection<IProject>("projects")

export function ProjectForm(props: Props) {
  const [name, setName] = React.useState<string>(props.project?.name ?? "")
  const [description, setDescription] = React.useState<string>(props.project?.description ?? "")
  const [userRole, setUserRole] = React.useState<UserRole>((props.project?.userRole as UserRole) ?? "architect")
  const [status, setStatus] = React.useState<ProjectStatus>((props.project?.status as ProjectStatus) ?? "pending")
  const [finishDate, setFinishDate] = React.useState<string>(() => {
    if (props.project?.finishDate instanceof Date) {
      const y = props.project.finishDate.getFullYear()
      const m = `${props.project.finishDate.getMonth() + 1}`.padStart(2, "0")
      const d = `${props.project.finishDate.getDate()}`.padStart(2, "0")
      return `${y}-${m}-${d}`
    }
    return ""
  })
  const [submitting, setSubmitting] = React.useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) { return }
    setSubmitting(true)

    const data: IProject = {
      name,
      description,
      userRole,
      status,
      finishDate: finishDate ? new Date(finishDate) : new Date()
    }

    try {
      if (props.project?.id) {
        await updateDocument<IProject>("/projects", props.project.id, data)
        props.onSubmit({ action: "update", id: props.project.id, data })
      } else {
        const ref = await Firestore.addDoc(projectsCollection, data)
        props.onSubmit({ action: "create", id: ref.id, data })
      }
    } catch (error) {
      alert(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{ props.project?.id ? "Edit Project" : "New Project" }</h2>
      <div className="input-list">
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">apartment</span>Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="What's the name of your project?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p
            style={{
              color: "gray",
              fontSize: "var(--font-sm)",
              marginTop: 5,
              fontStyle: "italic"
            }}
          >
            TIP: Give it a short name
          </p>
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">subject</span>Description
          </label>
          <textarea
            name="description"
            cols={30}
            rows={5}
            placeholder="Give your project a nice description! So people is jealous about it."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">person</span>Role
          </label>
          <select name="userRole" value={userRole} onChange={(e) => setUserRole(e.target.value as UserRole)}>
            <option value="architect">Architect</option>
            <option value="engineer">Engineer</option>
            <option value="developer">Developer</option>
          </select>
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">not_listed_location</span>
            Status
          </label>
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <div className="form-field-container">
          <label htmlFor="finishDate">
            <span className="material-icons-round">calendar_month</span>
            Finish Date
          </label>
          <input name="finishDate" type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} />
        </div>
        <div
          style={{
            display: "flex",
            margin: "10px 0px 10px auto",
            columnGap: 10
          }}
        >
          <button type="button" style={{ backgroundColor: "transparent" }} onClick={props.onCancel}>
            Cancel
          </button>
          <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }} disabled={submitting}>
            {submitting ? "Saving..." : "Accept"}
          </button>
        </div>
      </div>
    </form>
  )
}


