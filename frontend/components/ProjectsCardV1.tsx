import { Component, template } from "uix/components/Component.ts";
import { Project } from "common/types/projects.ts";
import { ProjectProg } from "./projectsV1.tsx";

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (pid: string) => void;
  onInvite: (project: Project) => void;
};

@template(({ project, onEdit, onDelete, onInvite }) => (
  <div class="project-card">
    <div class="card-flex-container">
      <div class="card-content">
        <div class="project-header">
          <h3>{project.title}</h3>
          <div class="edit-project-button">
            <i
              class="fas fa-pen"
              onclick={() => onEdit(project)}  
            ></i>
          </div>
          <div class="delete-project-button">
            <i
              class="fas fa-trash"
              onclick={() => onDelete(project.pid)}
            ></i>
          </div>
          <div class="invite-project-button">
            <i
              class="fa fa-user-plus"
              onclick={() => onInvite(project)}
            ></i>
          </div>
        </div>
        <div class="project-description">
          <p>{project.description}</p>
        </div>
        <div class="projectDeadline">
          <p>
            <i class="fa fa-calendar"></i>
            {project.deadline.toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
            })}
          </p>
        </div>
        <div class="project-tags">
          {project.tags.map((tag) => (
            <span
              class={`tag-label ${
                tag.isDefault ? `tag-${tag.value}` : "tag-custom"
              }`}
            >
              <i class={tag.isDefault ? tag.icon : "fa fa-tag"}></i>
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      <ProjectProg project={project}/>
    </div>
  </div>
))
export class ProjectCard extends Component<ProjectCardProps> {}