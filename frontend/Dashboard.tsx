/**
 * Frontend entrypoint:
 * This module provides a default export that defines the UI that is created on the frontend
 * when a page is visited
 */
import { Context } from "uix/routing/context.ts";
import { Tag } from "common/types/tags.ts";
import { User } from "common/types/users.ts";
import {
  addProject,
  addTag,
  getTags,
  validateSession,
  getAllUsers,
  inviteUserToProject,
} from "backend/user-data.ts";
import { getProjects } from "backend/user-data.ts";
import { getTasks, addTask as addTaskBackend } from "backend/user-data.ts";
import { updateTask as updateTaskBackend } from "backend/user-data.ts";
import { deleteTask as deleteTaskBackend } from "backend/user-data.ts";
import { updateProject as updateProjectBackend } from "backend/user-data.ts";
import { Project } from "common/types/projects.ts";
import { ProjectProg } from "./components/projectsV1.tsx";
import { ProjectCard } from "./components/ProjectsCardV1.tsx";
import { Sidebar } from "./components/Sidebar.tsx";
import { Statistics } from "./components/Statistics.tsx";
import { LatestActivities } from "./components/LatestActivities.tsx";
import { TodoTask } from "common/types/task.ts";
import { getCurrentUser } from "backend/user-data.ts";

const editingProjectId = $("");
const editingTaskId = $("");

const username = $("");

async function loadCurrentUser() {
  const user = await getCurrentUser();
  if (user) {
    username.val = user.username;
  } else {
    console.error("Failed to load current user");
  }
}

const DEFAULT_TAGS: Tag[] = [
  { name: "Work", value: "work", icon: "fas fa-briefcase", isDefault: true },
  { name: "Uni", value: "uni", icon: "fa fa-university", isDefault: true },
  {
    name: "Startup",
    value: "startup",
    icon: "fas fa-brain",
    isDefault: true,
  },
  { name: "Homework", value: "homework", icon: "fa fa-home", isDefault: true },
  { name: "School", value: "school", icon: "fas fa-school", isDefault: true },
  {
    name: "Design",
    value: "design",
    icon: "fa fa-paint-brush",
    isDefault: true,
  },
  { name: "Idea", value: "idea", icon: "far fa-lightbulb", isDefault: true },
];

const serverTagsLoaded = $(false);

async function loadTags() {
  if (!serverTagsLoaded.val) {
    try {
      const custom = await getTags();
      tags = $<Tag[]>([...DEFAULT_TAGS, ...custom]);
      serverTagsLoaded.val = true;
    } catch (error) {
      console.error("Failed to load tags:", error);
      tags = $<Tag[]>([...DEFAULT_TAGS]);
      serverTagsLoaded.val = true;
    }
  }
}

let tags = $<Tag[]>([...DEFAULT_TAGS]);

let selectedTags = $<Set<string>>(new Set());

const resetTags = $(false);

const showModal = $(false);
const tagsExpanded = $(false);

const showTagInput = $(false);
const showCreateTaskButton = $(false);
const newTagName = $("");
const newTagIcon = $("fa fa-tag");

const showProjectInput = $(false);

let tasks = $<TodoTask[]>([]);
(globalThis as any).tasks = tasks;

const tasksLoaded = $(false);

async function loadTasks() {
  if (!tasksLoaded.val) {
    const fetchedTasks = await getTasks();
    tasks = $<TodoTask[]>([...fetchedTasks]);
    for (const project of projects) {
      project.projectTasks = [];
    }
    for (const task of tasks) {
      const project = projects.find((p) => p.title === task.project);
      if (project) {
        // project.projectTasks.push(task);
        project.projectTasks = [...project.projectTasks, task];

      }
    }
    tasksLoaded.val = true;
  }
}

const hideEmptyPlaceholder = $(false);

// Task creation state
const newName = $(""); // Title of the task
const newDescription = $(""); // Description of the task
const newDueDate = $(""); // Due date (ISO format)
const newPriority = $("medium"); // Priority (default "medium")
const assignedProjectID = $("");
const newProject = $(""); // Project ID this task is assigned to

const showTaskInput = $(false);

function resetTaskForm() {
    editingTaskId.val = "";
    newName.val = "";
    newDescription.val = "";
    newDueDate.val = "";
    
    const prioritySelect = document.getElementById('taskPriority') as HTMLSelectElement;
    prioritySelect.value = 'medium';
    newPriority.val = "medium";
    
    const projectSelect = document.getElementById('taskProject') as HTMLSelectElement;
    projectSelect.value = '';
    newProject.val = "";
    selectedTags.clear();
    resetTags.val = true;
    tagsExpanded.val = false;
    setTimeout(() => (resetTags.val = false), 0);
}


async function toggleTaskDone(tid: string) {
  // Find the task
  const task = tasks.find((t) => t.tid === tid);
  if (!task) return;

  // Toggle the done status
  const newDone = !task.done;
  task.done = newDone;

  // Optionally, update in backend
  const success = await updateTaskBackend(tid, { ...task });
  if (!success) {
    // Revert if backend update fails
    task.done = !task.done;
    console.error("Failed to update task status.");
  } else {
    // Update projectTasks for the relevant project REACTIVELY
    const project = projects.find((p) => p.title === task.project);
    if (project) {
      project.projectTasks = project.projectTasks.map((t) =>
        t.tid === tid ? { ...t, done: newDone } : t
      );
    }
  }
}

        

async function addNewTask(tasks: TodoTask[]) {
  const selectedTagObjects = Array.from(selectedTags)
    .map((tagValue) => tags.find((tag) => tag.value === tagValue))
    .filter(Boolean) as Tag[];

  const createdTask: TodoTask = {
    tid: crypto.randomUUID(),
    done: false,
    name: newName.val,
    description: newDescription.val,
    priority: newPriority.val.toLowerCase() as "low" | "medium" | "high",
    dueDate: newDueDate.val,
    tags: selectedTagObjects,
    assignedPID: assignedProjectID.val,
    project: newProject.val,
  };

  const success = await addTaskBackend(createdTask);

  if (success) {
    tasks.push(createdTask);

    const projectIndex = projects.findIndex((p) => p.title === createdTask.project);
    if (projectIndex !== -1) {
      const oldProject = projects[projectIndex];
      const updatedProject = {
        ...oldProject,
        projectTasks: [...oldProject.projectTasks, createdTask],
      };
      projects[projectIndex] = updatedProject;
    }

    hideEmptyPlaceholder.val = true;
  } else {
    console.error("Failed to add task.");
  }
}

async function deleteTask(tid: string) {
  const targetProject = projects.find((p) =>
    p.projectTasks.some((t) => t.tid === tid)
  );
  if (!targetProject) return;

  const success = await deleteTaskBackend(tid, targetProject.title);
  if (success) {
    // Update project tasks reactively
    const projectIndex = projects.findIndex(p => p.pid === targetProject.pid);
    if (projectIndex !== -1) {
        const oldProject = projects[projectIndex];
        const updatedProject = {
            ...oldProject,
            projectTasks: oldProject.projectTasks.filter(t => t.tid !== tid),
        };
        projects[projectIndex] = updatedProject;
    }

    // Update global task list reactively
    const globalTaskIndex = tasks.findIndex((t) => t.tid === tid);
    if (globalTaskIndex !== -1) {
      tasks.splice(globalTaskIndex, 1);
    }

    showTaskInput.val = false;
    console.log(`Task ${tid} deleted`);
  } else {
    console.error("Failed to delete task.");
  }
}

const newProjectTitle = $("");
const newProjectDescription = $("");
const newProjectDeadline = $("");

let projects = $<Project[]>([]);
const projectsLoaded = $(false);

async function loadProjects() {
  if (!projectsLoaded.val) {
    const ex_projects: Project[] = await getProjects();
    const correctedProjects = ex_projects.map(p => {
      if (p.deadline && typeof p.deadline === 'string') {
        return { ...p, deadline: new Date(p.deadline) };
      }
      return p;
    });
    projects = $<Project[]>([...correctedProjects]);
    projectsLoaded.val = true;
  }
}

async function addNewProject(projects: Project[]) {
  const selectedTagObjects = Array.from(selectedTags)
    .map((tagValue) => tags.find((tag) => tag.value === tagValue))
    .filter(Boolean) as Tag[];

  const newProject: Project = {
    pid: crypto.randomUUID(),
    title: newProjectTitle.val,
    description: newProjectDescription.val,
    deadline: new Date(newProjectDeadline.val),
    tags: [...selectedTagObjects],
    projectTasks: [],
  };

  const success = await addProject(newProject);

  if (success) {
    projects.push(newProject);

    newProjectTitle.val = "";
    newProjectDescription.val = "";
    newProjectDeadline.val = "";

    selectedTags = $<Set<string>>(new Set());
    resetTags.val = true;
    showModal.val = false;
    tagsExpanded.val = false;
    hideEmptyPlaceholder.val = true; 

    setTimeout(() => (resetTags.val = false), 0);
  } else {
    console.error("Failed to save project. Please try again.");
  }
}

async function updateProject(pid: string, updatedProject: Project) {
  const success = await updateProjectBackend(pid, updatedProject);
  if (success) {
    const targetProject = projects.find((p) => p.pid === pid);
    if (targetProject) {
      const oldTitle = targetProject.title;
      targetProject.title = updatedProject.title;
      targetProject.description = updatedProject.description;
      targetProject.deadline = updatedProject.deadline;
      targetProject.tags.splice(
        0,
        targetProject.tags.length,
        ...updatedProject.tags
      );
      targetProject.projectTasks = updatedProject.projectTasks;

      if (oldTitle !== updatedProject.title) {
        for (const task of tasks) {
          if (task.project === oldTitle) {
            task.project = updatedProject.title;
          }
        }
      }

      console.log(`Project ${pid} updated`);

      // Update all tasks assigned to this project
      for (const task of tasks) {
        if (task.project === oldTitle) {
          task.project = updatedProject.title;
        }
      }
    }
  } else {
    console.error("Failed to update project.");
  }
}

import { deleteProject as deleteProjectBackend } from "backend/user-data.ts";
import { provideRedirect } from "uix/providers/common.tsx";

async function deleteProject(pid: string) {
  const success = await deleteProjectBackend(pid);
  if (success) {
    const targetIndex = projects.findIndex((p) => p.pid === pid);
    if (targetIndex !== -1) {
      projects.splice(targetIndex, 1);
      showProjectInput.val = false;
      console.log(`Project ${pid} deleted`);
    }
  } else {
    console.error("Failed to delete project.");
  }
}

async function addCustomTag() {
  if (newTagName.val.trim()) {
    const tagValue = newTagName.val.toLowerCase().replace(/\s+/g, "-");

    const tagExists = tags.some((t) => t.value === tagValue);

    if (!tagExists) {
      const newTag: Tag = {
        name: newTagName.val,
        value: tagValue,
        icon: newTagIcon.val,
        isDefault: false,
      };

      const success = await addTag(newTag);

      if (success) {
        tags.push(newTag);
        newTagName.val = "";
      } else {
        console.error("Failed to save tag. It might already exist.");
      }
    } else {
      console.error("Tag already exists.");
    }
  }
  showTagInput.val = false;
}

function cancelAddTag() {
  newTagName.val = "";
  showTagInput.val = false;
}

function getFilteredProjects() {
  const query = searchQuery.val.toLowerCase();
  return projects
    .slice()
    .reverse()
    .filter((project) => project.title.toLowerCase().includes(query));
}

let searchQuery = $("");

// Project dropdown menu state for three-dot menu
const dropdownProjectId = $(null as string | null);

function toggleProjectMenu(pid: string) {
  dropdownProjectId.val = dropdownProjectId.val === pid ? null : pid;
}

function openProjectEditModal(project: Project) {
  editingProjectId.val = project.pid;
  newProjectTitle.val = project.title;
  newProjectDescription.val = project.description;
  const date = new Date(project.deadline);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  newProjectDeadline.val = `${year}-${month}-${day}`;
  selectedTags = $<Set<string>>(new Set(project.tags.map(tag => tag.value)));
  resetTags.val = false;
  showModal.val = true;
}

function inviteProjectModal(project: Project) {
  if (!project || !project.pid) {
    console.error("Cannot invite: project or project.pid is missing.", project);
    return;
  }
  console.log("Setting projectToInviteId for project:", project.title, "ID:", project.pid);
  projectToInviteId.val = project.pid;
  isInviteModalVisible.val = true;
}

const isInviteModalVisible = $(false);
const allUsers = $<User[]>([]);
const projectToInviteId = $("");
const inviteSearchQuery = $("");

async function loadAllUsers() {
  try {
    const users = await getAllUsers();
    allUsers.splice(0, allUsers.length, ...users);
  } catch (error) {
    console.error("Failed to load users:", error);
  }
}

function getFilteredUsers() {
  const query = inviteSearchQuery.val.toLowerCase().trim();
  const users = allUsers.slice();
  if (!query) {
    return users;
  }
  return users.filter(
    (user: User) =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );
}

export default async (ctx: Context) => {
  const user = await getCurrentUser();
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/loginPage";
    }
    return <div>Redirecting to login...</div>;
  }
  await loadTags();
  await loadTasks();
  await loadProjects();
  await loadCurrentUser();
  await loadAllUsers();

  <header>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </header>;
  return (
    <div class="page-layout">
      {/* Sidebar */}
      <Sidebar projects={projects} />

      <div class="main-container-with-sidebar">
        {/* Controls Section (Search, Filters, Create Dropdown) */}
        <div class="controls-wrapper">
          <div class="controls">
            <div class="top-controls">
              <div class="controls-container">
                {/* Search and Filters */}
                <i class="fa fa-search"></i>
                <input
                  type="text"
                  id="searchInput"
                  placeholder=" Search for projects..."
                  class="search-input"
                  value={searchQuery.val}
                  oninput={(e: Event) => {
                    const target = e.target as HTMLInputElement;
                    searchQuery.val = target.value;
                  }}
                />
                <div class="filter-group">
                  <select id="filterSelect" class="filter-select">
                    <option value="all">All Projects</option>
                    {$$(tags)?.map((tag) => (
                      <option value={tag.value}>{tag.name}</option>
                    ))}
                  </select>
                  {/* Create Project/Task Dropdown */}
                  <div
                    class="add-dropdown-wrapper"
                    style="position: relative; display: flex; align-items: center;"
                  >
                    <div
                      class="add-dropdown-container"
                      style="position: relative;"
                    >
                      <button
                        type="button"
                        class="add-dropdown-button"
                        style="width: 48px; height: 48px; padding: 0; display: flex; align-items: center; justify-content: center; background-color: #4b54b7;; color: white; border: none; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: background-color 0.3s;"
                        onclick={() =>
                          (showCreateTaskButton.val = !showCreateTaskButton.val)
                        }
                      >
                        <i
                          class={`fas ${
                            showCreateTaskButton.val ? "fa-times" : "fa-plus"
                          } fa-lg`}
                        ></i>
                      </button>
                      {showCreateTaskButton.val && (
                        <div
                          class="dropdown-expansion fade-In"
                          style="position: absolute; right: 0; top: 100%; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; margin-top: 8px; z-index: 9999; width: 200px; color: #333; font-size: 0.95rem;"
                        >
                          <button
                            type="button"
                            class="dropdown-item"
                            style="width: 100%; padding: 10px 16px; text-align: left; border: none; background: none; color: #333;"
                            onclick={() => {
                              editingProjectId.val = "";
                              newProjectTitle.val = "";
                              newProjectDescription.val = "";
                              newProjectDeadline.val = "";
                              selectedTags = $<Set<string>>(new Set());
                              resetTags.val = true;
                              showModal.val = true;
                              showCreateTaskButton.val = false;
                            }}
                          >
                            <i class="fas fa-folder-plus"></i> Create Project
                          </button>
                          <button
                            type="button"
                            class="dropdown-item"
                            style="width: 100%; padding: 10px 16px; text-align: left; border: none; background: none; color: #333;"
                            onclick={() => {
                              resetTaskForm();
                              showTaskInput.val = true;
                              showCreateTaskButton.val = false;
                            }}
                          >
                            <i class="fas fa-tasks"></i> Create Task
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <main class="container">
          <link rel="stylesheet" href="./Dashboard.css"></link>

          {/* Header */}
          <h1>Good morning, {username.val}</h1>
          <h4>
            Welcome back! Have a quick look on what's happening with your
            Projects today
          </h4>

          {/* Statistics and Latest Activities */}
          <Statistics />
          <LatestActivities />

          {/* Task List Section */}
          {/* ----------------- */}
          <h1>Your Tasks</h1>
          <link rel="stylesheet" href="./components/TaskTableModern.css"></link>
          <div class="task-table-container">
            <div class="task-table-header">
              <div class="task-status-column">Status</div>
              <div>Task</div>
              <div class="task-priority-column">Priority</div>
              <div>Due Date</div>
              <div>Assignee</div>
              <div class="task-project-column">Project</div>
              <div class="task-actions-column">Actions</div>
            </div>

            <div class="task-card-list"
              style="max-height: 410px; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; background-color: #f9fafb; padding: 1rem; border-radius: 1rem;"
            >
              <link rel="stylesheet" href="./components/TaskTableModern.css"></link>
              {tasks.map((task) => (
                <div class={`task-card-row ${task.done ? "completed" : ""}`}>
                  <div class="task-status task-row-top">
                    <button
                      class={`complete-button ${task.done ? "completed" : ""}`}
                      onclick={async () => {
                        const newDoneStatus = !task.done;
                        const updatedTask = { ...task, done: newDoneStatus };
                        const success = await updateTaskBackend(task.tid, updatedTask);
                        if (success) {
                            task.done = newDoneStatus;
                            const projectIndex = projects.findIndex(p => p.title === task.project);
                            if (projectIndex !== -1) {
                                const oldProject = projects[projectIndex];
                                const updatedProject = {
                                    ...oldProject,
                                    projectTasks: oldProject.projectTasks.map(t =>
                                        t.tid === task.tid ? { ...t, done: newDoneStatus } : t
                                    ),
                                };
                                projects[projectIndex] = updatedProject;
                            }
                        } else {
                            alert("Failed to update task completion.");
                        }
                      }}
                    >
                      <i class="fas fa-check"></i>
                    </button>
                  </div>
                  <div class="task-title">
                    <div class="task-name task-row-top">{task.name}</div>
                    <div class="task-tags">
                      {task.tags.map((tag) => (
                        <span class={`task-tag tag-${tag.value}`}>
                          <i class={tag.isDefault ? tag.icon : "fa fa-tag"}></i>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div class="task-priority task-priority-column">
                    <span class={`priority-label priority-${task.priority}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  <div class="task-due-date task-row-bottom">
                      <i class="fa fa-calendar" style="margin-right: 6px;"></i>
                      {new Date(task.dueDate).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                  <div class="task-assignee task-row-bottom">
                    <div class="assignee-pill">
                      {task.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                  </div>
                  <div class="task-project task-project-column">
                    {task.project}
                  </div>
                  <div class="task-actions task-row-bottom">
                    <i
                      class="fas fa-pen"
                      onclick={() => {
                        editingTaskId.val = task.tid;
                        newName.val = task.name;
                        newDescription.val = task.description;
                        newDueDate.val = task.dueDate;
                        newPriority.val = task.priority;
                        newProject.val = task.project;
                        selectedTags.clear();
                        task.tags.forEach(tag => selectedTags.add(tag.value));
                        resetTags.val = false;
                        showTaskInput.val = true;
                      }}
                    ></i>
                    <i
                      class="fas fa-trash"
                      onclick={() => deleteTask(task.tid)}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Modal */}
          <div
            id="addProjectModal"
            class={{ "modal-popUp": false, visible: showTaskInput.val }}
          >
            <div class="modal">
              <div class="modalHeader">
                <h3 class="modalTitle">New Task</h3>
                <button
                  type="button"
                  onclick={() => {
                    resetTaskForm();
                    showTaskInput.val = false;
                  }}
                  id="cancelTaskModalButton"
                  class="cancle-modal-button"
                >
                  <i class="fa fa-close"></i>
                </button>
              </div>
              <form id="taskForm" class="modal-main">
                <div class="form-group">
                  <label for="taskTitle" class="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    id="taskTitle"
                    class="form-input"
                    value={newName.val}
                    oninput={(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      newName.val = target.value;
                    }}
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="taskDescription" class="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    id="taskDescription"
                    class="form-input"
                    value={newDescription.val}
                    oninput={(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      newDescription.val = target.value;
                    }}
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="taskDueDate" class="form-label">
                    Due Date
                  </label>
                  <input
                    type="text"
                    id="taskDueDate"
                    class="form-input"
                    placeholder="YYYY-MM-DD"
                    value={newDueDate.val}
                    oninput={(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      newDueDate.val = target.value;
                    }}
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="taskPriority" class="form-label">
                    Priority
                  </label>
                  <select
                    id="taskPriority"
                    class="form-input"
                    value={newPriority.val}
                    onchange={(e: Event) => {
                      newPriority.val = (e.target as HTMLSelectElement).value;
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="taskProject" class="form-label">
                    Project
                  </label>
                  <select
                    id="taskProject"
                    class="form-input"
                    value={newProject.val}
                    oninput={(e: Event) => {
                      newProject.val = (e.target as HTMLSelectElement).value;
                    }}
                  >
                    <option value="">Select a project</option>
                    {projects.map((proj) => (
                      <option value={proj.title}>{proj.title}</option>
                    ))}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Tags</label>
                  <div class="tags-wrapper">
                    <div class="tags-container">
                      {tags
                        .filter((t) => t.isDefault)
                        .map((tag) => (
                          <div data-key={tag.value}>
                            <label class="tagOptions">
                              <input
                                type="checkbox"
                                name="tTag"
                                value={tag.value}
                                class="tag-checkbox"
                                checked={
                                  resetTags.val
                                    ? false
                                    : selectedTags.has(tag.value)
                                }
                                onchange={(e: Event) => {
                                  const checked = (e.target as HTMLInputElement)
                                    .checked;
                                  const tagValue = tag.value;
                                  if (checked) {
                                    selectedTags.add(tagValue);
                                  } else {
                                    selectedTags.delete(tagValue);
                                  }
                                }}
                              />
                              <span
                                class={`tag-label ${
                                  tag.isDefault
                                    ? `tag-${tag.value}`
                                    : "tag-custom"
                                }`}
                              >
                                <i
                                  class={tag.isDefault ? tag.icon : "fa fa-tag"}
                                ></i>
                                {tag.name}
                              </span>
                            </label>
                          </div>
                        ))}
                    </div>
                    <button
                      type="button"
                      class="expand-button"
                      onclick={() => (tagsExpanded.val = !tagsExpanded.val)}
                    >
                      <i
                        class={`far ${
                          tagsExpanded.val
                            ? "fas fa-angle-up"
                            : "fas fa-angle-down"
                        }`}
                      ></i>
                      {tagsExpanded.val ? " Less Tags" : " More Tags"}
                    </button>
                    {tagsExpanded.val && (
                      <div class="tags-container expanded-tags">
                        {tags
                          .filter((t) => !t.isDefault)
                          .map((tag) => (
                            <div data-key={tag.value}>
                              <label class="tagOptions">
                                <input
                                  type="checkbox"
                                  name="pTag"
                                  value={tag.value}
                                  class="tag-checkbox"
                                  checked={selectedTags.has(tag.value)}
                                  onchange={(e: Event) => {
                                    const checked = (
                                      e.target as HTMLInputElement
                                    ).checked;
                                    if (checked) {
                                      selectedTags.add(tag.value);
                                    } else {
                                      selectedTags.delete(tag.value);
                                    }
                                  }}
                                />
                                <span class="tag-label tag-custom">
                                  <i class="fa fa-tag"></i>
                                  {tag.name}
                                </span>
                              </label>
                            </div>
                          ))}
                        {showTagInput.val ? (
                          <div class="tag-input-container">
                            <input
                              type="text"
                              class="tag-input"
                              placeholder="Tag name..."
                              value={newTagName.val}
                              oninput={(e: Event) => {
                                newTagName.val = (
                                  e.target as HTMLInputElement
                                ).value;
                              }}
                            />
                            <button
                              type="button"
                              onclick={() => addCustomTag()}
                              class="tag-action-button confirm"
                            >
                              <i class="fas fa-check"></i>
                            </button>
                            <button
                              type="button"
                              onclick={cancelAddTag}
                              class="tag-action-button cancel"
                            >
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onclick={() => (showTagInput.val = true)}
                            class="add-tag-button"
                          >
                            <i class="fas fa-plus"></i>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  class="submit-button"
                  onclick={async (e) => {
                    e.preventDefault();
                    if (!newName.val.trim() || !newDescription.val.trim() || !newDueDate.val.trim() || !newProject.val.trim()) {
                      alert("Please fill out all required fields, including selecting a project.");
                      return;
                    }
                    const selectedTagObjects = Array.from(selectedTags)
                      .map((tagValue) =>
                        tags.find((tag) => tag.value === tagValue)
                      )
                      .filter(Boolean) as Tag[];

                    const editing = editingTaskId.val !== "";
                    if (editing) {
                      const idx = tasks.findIndex(
                        (t) => t.tid === editingTaskId.val
                      );
                      if (idx !== -1) {
                        const oldTask = tasks[idx];
                        const updatedTask: TodoTask = {
                          ...oldTask,
                          name: newName.val,
                          description: newDescription.val,
                          dueDate: newDueDate.val,
                          priority: newPriority.val.toLowerCase() as
                            | "low"
                            | "medium"
                            | "high",
                          tags: selectedTagObjects,
                          project: newProject.val,
                        };

                        const success = await updateTaskBackend(
                          editingTaskId.val,
                          updatedTask
                        );
                        if (success) {
                          tasks[idx] = updatedTask;
                          resetTaskForm();
                        } else {
                          console.error("Failed to update task.");
                        }
                      }
                    } else {
                      await addNewTask(tasks);
                      resetTaskForm();
                    }

                    showTaskInput.val = false;
                  }} 
                >
                  {editingTaskId.val ? "Update Task" : "Add Task"}
                </button>
              </form>
            </div>
          </div>

          {/* Project List Section */}
          <h1>Your Projects</h1>
          <div class = "projectListContainer">
            <div id="projectContainer" class="project-grid">
              {getFilteredProjects().map((project) => (
                <div class="project-card-container" style="position: relative;">
                  <ProjectCard
                    project={project}
                    onEdit={openProjectEditModal}
                    onDelete={deleteProject}
                    onInvite={inviteProjectModal}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            id="inviteProjectModal"
            class={{ "modal-popUp": false, visible: isInviteModalVisible.val }}
          >
            <div class="modal">
              <div class="modalHeader">
                <h3 class="modalTitle">Invite user to project</h3>
                <button
                  type="button"
                  onclick={() => {
                    isInviteModalVisible.val = false;
                    inviteSearchQuery.val = "";
                  }}
                  id="cancelInviteModalButton"
                  class="cancle-modal-button"
                >
                  <i class="fa fa-close"></i>
                </button>
              </div>
              <form id="inviteForm" class="modal-main" onsubmit={(e) => e.preventDefault()}>
                <div class="form-group">
                  <label for="inviteUserSearch" class="form-label">
                    Search by username or email
                  </label>
                  <input
                    type="text"
                    id="inviteUserSearch"
                    class="form-input"
                    placeholder="Enter username or email..."
                    value={inviteSearchQuery.val}
                    oninput={(e: Event) => {
                      inviteSearchQuery.val = (e.target as HTMLInputElement).value;
                    }}
                  />
                </div>

                <div class="user-suggestions-container">
                  <div class="user-suggestions-header">
                    <span>Suggested users</span>
                  </div>
                  <div class="user-suggestions-list">
                    {getFilteredUsers().map((user: User) => (
                      <div class="user-suggestion-item" data-key={user.email}>
                        <div class="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                        <div class="user-info">
                          <span class="user-name">{user.username}</span>
                          <span class="user-email">{user.email}</span>
                        </div>
                        <button 
                            type="button"
                            class="invite-action-button"
                            onclick={async (e) => {
                                e.preventDefault();
                                const projectId = projectToInviteId.val;
                                console.log(`Attempting to invite ${user.email} to project ID:`, projectId);

                                if (!projectId) {
                                    console.error("Cannot invite: Project ID is empty. Aborting.");
                                    return;
                                }

                                const result = await inviteUserToProject(user.email, projectId);
                                if (result.success) {
                                    console.log(result.message || `Successfully invited ${user.username}!`);
                                    isInviteModalVisible.val = false;
                                    inviteSearchQuery.val = "";
                                } else {
                                    console.error("Invitation failed. Reason:", result.message || "Unknown error.");
                                }
                            }}
                        >
                            Invite
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>


          {/* Empty Placeholder */}
          {(() => {
            const filteredProjects = getFilteredProjects();
            if (projectsLoaded.val && filteredProjects.length === 0) {
              if (searchQuery.val.trim() !== "") {
                return (
                  <div class="no-projects-message">
                    <h3>No projects found for "{searchQuery.val}"</h3>
                  </div>
                );
              } else {
                return (
                  <div id="noProjects" class="no-projects">
                    <i class="fas fa-wind"></i>
                    <h3>No Projects so far...</h3>
                    <p>
                      Simply create a new project using the "+"-Button or keep
                      waiting to get invited to a project
                    </p>
                  </div>
                );
              }
            }
            return null;
          })()}

          {/* Project Modal */}
          <div
            id="addProjectModal"
            class={{ "modal-popUp": false, visible: showModal.val }}
          >
            <div class="modal">
              <div class="modalHeader">
                <h3 class="modalTitle">{editingProjectId.val ? "Edit Project" : "New Project"}</h3>
                <button
                  type="button"
                  onclick={() => (showModal.val = false)}
                  id="cancleModalButton"
                  class="cancle-modal-button"
                >
                  <i class="fa fa-close"></i>
                </button>
              </div>
              <form id="projectForm" class="modal-main">
                {/* Project Modal Fields */}
                <div class="form-group">
                  <label for="projectTitle" class="form-lable">
                    Project Titel
                  </label>
                  <input
                    type="text"
                    value={newProjectTitle.val}
                    id="projectTItle"
                    class="form-input"
                    oninput={(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      newProjectTitle.val = target.value;
                    }}
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="projectdescription" class="form-label">
                    Description
                  </label>
                  <textarea
                    id="descriptionContent"
                    value={newProjectDescription.val}
                    class="form-input form-textarea"
                    oninput={(e: Event) => {
                      const target = e.target as HTMLTextAreaElement;
                      newProjectDescription.val = target.value;
                    }}
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="projectDeadline" class="form-label">
                    Due Date
                  </label>
                  <input
                    type="text"
                    id="projectDeadline"
                    class="form-input"
                    value={newProjectDeadline.val}
                    placeholder="YYYY-MM-DD"
                    oninput={(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      newProjectDeadline.val = target.value;
                    }}
                    required
                  />
                </div>
                {/* Project Modal Tags */}
                <div class="form-group">
                  <label class="form-label">Tags</label>
                  <div class="tags-wrapper">
                    {/* Standard Tags */}
                    <div class="tags-container">
                      {tags
                        .filter((tag) => tag.isDefault)
                        .map((tag) => (
                          <div data-key={tag.value}>
                            <label class="tagOptions">
                              <input
                                type="checkbox"
                                name="pTag"
                                value={tag.value}
                                class="tag-checkbox"
                                checked={
                                  resetTags.val
                                    ? false
                                    : selectedTags.has(tag.value)
                                }
                                onchange={(e: Event) => {
                                  const checked = (e.target as HTMLInputElement)
                                    .checked;
                                  const tagValue = tag.value;
                                  if (checked) {
                                    selectedTags.add(tagValue);
                                  } else {
                                    selectedTags.delete(tagValue);
                                  }
                                }}
                              />
                              <span
                                class={`tag-label ${
                                  tag.isDefault
                                    ? `tag-${tag.value}`
                                    : "tag-custom"
                                }`}
                              >
                                <i
                                  class={tag.isDefault ? tag.icon : "fa fa-tag"}
                                ></i>
                                {tag.name}
                              </span>
                            </label>
                          </div>
                        ))}
                    </div>
                    {/* Expand Custom Tags */}
                    <button
                      type="button"
                      class="expand-button"
                      onclick={() => (tagsExpanded.val = !tagsExpanded.val)}
                    >
                      <i
                        class={`far ${
                          tagsExpanded.val
                            ? "fas fa-angle-up"
                            : "fas fa-angle-down"
                        }`}
                      ></i>
                      {tagsExpanded.val ? " Less Tags" : " More Tags"}
                    </button>
                    {/* Custom Tags */}
                    {tagsExpanded.val && (
                      <div class="tags-container expanded-tags">
                        {tags
                          .filter((tag) => !tag.isDefault)
                          .map((tag) => (
                            <div data-key={tag.value}>
                              <label class="tagOptions">
                                <input
                                  type="checkbox"
                                  name="pTag"
                                  value={tag.value}
                                  class="tag-checkbox"
                                  checked={selectedTags.has(tag.value)}
                                  onchange={(e: Event) => {
                                    const checked = (
                                      e.target as HTMLInputElement
                                    ).checked;
                                    if (checked) {
                                      selectedTags.add(tag.value);
                                    } else {
                                      selectedTags.delete(tag.value);
                                    }
                                  }}
                                />
                                <span class="tag-label tag-custom">
                                  <i class="fa fa-tag"></i>
                                  {tag.name}
                                </span>
                              </label>
                            </div>
                          ))}
                        {/* Add-Tag */}
                        {showTagInput.val ? (
                          <div class="tag-input-container">
                            <input
                              type="text"
                              class="tag-input"
                              placeholder="Tag name..."
                              value={newTagName.val}
                              oninput={(e: Event) => {
                                const target = e.target as HTMLInputElement;
                                newTagName.val = target.value;
                              }}
                              onfocus={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.select();
                              }}
                              onblur={(e) => {
                                const input = e.target as HTMLInputElement;
                                if (!input.value.trim()) {
                                  newTagName.val = "";
                                }
                              }}
                            />
                            <button
                              type="button"
                              onclick={() => addCustomTag()}
                              class="tag-action-button confirm"
                            >
                              <i class="fas fa-check"></i>
                            </button>
                            <button
                              type="button"
                              onclick={cancelAddTag}
                              class="tag-action-button cancel"
                            >
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onclick={() => (showTagInput.val = true)}
                            class="add-tag-button"
                          >
                            <i class="fas fa-plus"></i>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  class="submit-button"
                  onclick={async (e) => {
                    e.preventDefault();
                    if (!newProjectTitle.val.trim() || !newProjectDescription.val.trim() || !newProjectDeadline.val.trim()) {
                      alert("Please fill out all required fields.");
                      return;
                    }
                    const selectedTagsArray = Array.from(selectedTags)
                      .map((val) => tags.find((t) => t.value === val))
                      .filter(Boolean) as Tag[];

                    const isEditing = editingProjectId.val !== "";
                    if (isEditing) {
                      const pid = editingProjectId.val;
                      const existingProject = projects.find(
                        (p) => p.pid === pid
                      );
                      if (existingProject) {
                        const updatedProject: Project = {
                          ...existingProject,
                          title: newProjectTitle.val,
                          description: newProjectDescription.val,
                          deadline: new Date(newProjectDeadline.val.replace(/-/g, '/')),
                          tags: selectedTagsArray,
                        };
                        await updateProject(pid, updatedProject);
                        editingProjectId.val = "";
                      }
                    } else {
                      await addNewProject(projects);
                    }

                    newProjectTitle.val = "";
                    newProjectDescription.val = "";
                    newProjectDeadline.val = "";
                    showModal.val = false;
                  }}
                >
                  {editingProjectId.val ? "Update Project" : "Create Project"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
