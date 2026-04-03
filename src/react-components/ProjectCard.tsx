import * as React from "react";
import { Project } from "../classes/Project";

const iconColors = ["#ca8134", "#468547", "#4a6fa5", "#9b59b6", "#e74c3c", "#1abc9c"]

function getRandomColor() {
  return iconColors[Math.floor(Math.random() * iconColors.length)]
}

interface Props {
  project: Project;
}

export function ProjectCard(props: Props) {
  const [bgColor] = React.useState(getRandomColor)

  return (
    <div className="project-card">
      <div className="card-header">
        <p
          style={{
            backgroundColor: bgColor,
            padding: 10,
            borderRadius: 8,
            aspectRatio: 1,
            textTransform: "uppercase"
          }}
        >
          {props.project.name.slice(0, 2)}
        </p>
        <div>
          <h5>{ props.project.name }</h5>
          <p>{ props.project.description }</p>
        </div>
      </div>
      <div className="card-content">
        <div className="card-property">
          <p style={{ color: "#969696" }}>Status</p>
          <p>{ props.project.status }</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Role</p>
          <p>{ props.project.userRole }</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Cost</p>
          <p>$ { props.project.cost }</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Estimated Progress</p>
          <p>{ props.project.progress } %</p>
        </div>
      </div>
    </div>
  )
}