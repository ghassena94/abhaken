import { Context } from "uix/routing/context.ts";
import { User } from "common/types/users.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Tag } from "common/types/tags.ts";
import { Project } from "common/types/projects.ts";
import { provideRedirect } from "uix/providers/common.tsx";
import { TodoTask } from "common/types/task.ts";

export const users = eternalVar("app-users") ?? $({} as Record<string, User>);

(globalThis as any).users = users;


declare global {
  interface PrivateData {
    userId?: string;
    sessionValid?: boolean;
  }
}

/*
Status-Codes:
status 200 - Ok
status 300 - Mehrere Antwortoptionen
status 400 - Ungültige Anfrage
status 500 - Serverfehler
*/


function isValidEmail(email: string): boolean {
  const emailRegex = /\b[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,6}\b/;
  return emailRegex.test(email);
}


export async function register(ctx: Context) {
  try {
    const data = await ctx.request.formData();
    const username = data.get("username") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    if (username in users) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "username_exists",
          field: "username",
          message: "Username already exists",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    if (!username.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "username_req",
          field: "username",
          message: "Username is required",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    if (Object.values(users).some((u) => u.email === email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "email_exists",
          field: "email",
          message: "Email already in use",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "invalid_email",
          field: "email",
          message: "Invalid email address",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    if (!email.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "email_req",
          field: "email",
          message: "Email is required",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    if (!password.trim() || password.replace(/\s/g, "").length < 8) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "password_req",
          field: "password",
          message: "Password is required",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    users[username] = {
      username,
      email,
      password: await bcrypt.hash(password, await bcrypt.genSalt()),
      tags: [],
      projects: [],
    };

    const session = await ctx.getPrivateData();
    session.userId = username;
    session.sessionValid = true;

    return new Response(
      JSON.stringify({
        success: true,
        redirect: "/DashboardPage",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Registration failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "registration_failed",
        message: "Something went wrong during registration",
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
  }
}


export async function login(ctx: Context) {
  try {
    const data = await ctx.request.formData();
    const email = (data.get("email") as string).trim().toLowerCase();
    const password = (data.get("password") as string).trim();

    const user = Object.values(users).find((user) => user.email === email);

    console.log("Current users:", users);
    console.log("Looking for email:", email);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "invalid_credentials",
          field: "email",
          message: "Invalid email or password",
        }),
        {
          status: 401,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    console.log("Found user:", user.username);
    console.log("Stored hash:", user.password);
    console.log("Input password:", password);

    const passwordMatch = await bcrypt.compare(password, String(user.password));
    if (!passwordMatch) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "invalid_credentials",
          field: "password",
          message: "Invalid email or password",
        }),
        {
          status: 401,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const session = await ctx.getPrivateData();
    session.userId = user.username as string;
    session.sessionValid = true;
    return new Response(
      JSON.stringify({
        success: true,
        redirect: "/DashboardPage",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "login_failed",
        message: "Something went wrong during login",
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
  }
}


export async function logout(ctx: Context) {
  const session = await ctx.getPrivateData();
  session.userId = undefined;
  session.sessionValid = false;

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": `session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      Location: "/",
    },
  });
}


export async function addProject(project: Project) {
  try {
    const session = await Context.getPrivateData(datex.meta);
    const userId = session.userId;
    
    if (userId && users[userId]) {
      users[userId].projects = users[userId].projects || [];
      users[userId].projects.push(project);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding project:", error);
    return false;
  }
}


export async function addTag(tag: Tag) {
  try {
    const session = await Context.getPrivateData(datex.meta);
    const userId = session.userId;
    
    if (userId && users[userId]) {
      users[userId].tags = users[userId].tags || [];
      
      const tagExists = users[userId].tags.some((t: { value: string; }) => t.value === tag.value);
      if (!tagExists) {
        users[userId].tags.push(tag);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error adding tag:", error);
    return false;
  }
}


export async function getCurrentUser() {
  const session = await Context.getPrivateData(datex.meta);
  return session.userId ? users[session.userId] : null;
}


export async function validateSession(ctx: Context): Promise<boolean> {
  const session = await ctx.getPrivateData();
  return !!session.sessionValid && !!session.userId && !!users[session.userId];
}


export async function getTags() {
  const session = await Context.getPrivateData(datex.meta);
  if (session.userId && session.userId in users) {
    return users[session.userId].tags as Tag[];
  }
  return [];
}


export async function getProjects() {
  const session = await Context.getPrivateData(datex.meta);
  if (session.userId && session.userId in users) {
    return users[session.userId].projects as Project[];
  }
  return [];
}


export async function getTasks() {
  const session = await Context.getPrivateData(datex.meta);
  const userId = session.userId;

  if (userId && users[userId]) {
    const allTasks = users[userId].projects
      .flatMap((project: Project) => project.projectTasks || []);
    return allTasks;
  }
  return [];
}


export async function updateProject(pid: string, updatedProject: Project) {
  try {
    const session = await Context.getPrivateData(datex.meta);
    const userId = session.userId;
    if (!userId || !users[userId]) {
      return false;
    }

    const user = users[userId];
    const projectIndex = user.projects.findIndex((p: Project) => p.pid === pid);

    if (projectIndex === -1) {
      return false; 
    }

    for (const u of Object.values(users)) {
      const pIndex = u.projects.findIndex((p: Project) => p.pid === pid);
      if (pIndex !== -1) {
        u.projects[pIndex] = updatedProject;
      }
    }
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    return false;
  }
}


export async function deleteProject(pid: string) {
  try {
    const session = await Context.getPrivateData(datex.meta);
    const userId = session.userId;

    if (userId && users[userId]) {
      const projectIndex = users[userId].projects.findIndex((p: Project) => p.pid === pid);
      if (projectIndex !== -1) {
        users[userId].projects.splice(projectIndex, 1);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}


export async function addTask(task: TodoTask) {
  try {
    const session = await Context.getPrivateData(datex.meta);
    const userId = session.userId;

    if (userId && users[userId]) {
      let targetProject: Project | undefined;
      for (const user of Object.values(users)) {
        targetProject = user.projects.find((p: Project) => p.title === task.project);
        if (targetProject) {
          break;
        }
      }

      if (targetProject) {
        targetProject.projectTasks = targetProject.projectTasks || [];
        if (!targetProject.projectTasks.some(t => t.tid === task.tid)) {
            targetProject.projectTasks.push(task);
        }
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error adding task:", error);
    return false;
  }
}


export async function deleteTask(tid: string, projectTitle: string) {
  try {
    const session = await Context.getPrivateData(datex.meta);
    const userId = session.userId;

    if (userId && users[userId]) {
      const user = users[userId];
      const targetProject = user.projects.find((p: Project) => p.title === projectTitle);
      if (targetProject && targetProject.projectTasks) {
        const index = targetProject.projectTasks.findIndex((t: TodoTask) => t.tid === tid);
        if (index !== -1) {
          targetProject.projectTasks.splice(index, 1);
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
}

export async function updateTask(tid: string, updatedTask: TodoTask) {
  try {
    const session = await Context.getPrivateData(datex.meta);
    const userId = session.userId;

    if (!userId || !users[userId]) {
      return false;
    }

    for (const user of Object.values(users)) {
      let oldProject: Project | undefined;
      let taskIndex = -1;

      for (const project of user.projects) {
        const index = project.projectTasks?.findIndex((t: TodoTask) => t.tid === tid);
        if (index !== undefined && index !== -1) {
          oldProject = project;
          taskIndex = index;
          break;
        }
      }

      if (oldProject && taskIndex !== -1) {
        if (oldProject.title === updatedTask.project) {
          const taskToUpdate = oldProject.projectTasks[taskIndex];
          taskToUpdate.name = updatedTask.name;
          taskToUpdate.description = updatedTask.description;
          taskToUpdate.priority = updatedTask.priority;
          taskToUpdate.dueDate = updatedTask.dueDate;
          taskToUpdate.done = updatedTask.done;
          taskToUpdate.tags = updatedTask.tags;
        } 
        else {
          oldProject.projectTasks.splice(taskIndex, 1);
          
          const newProject = user.projects.find((p: Project) => p.title === updatedTask.project);
          if (newProject) {
            newProject.projectTasks = newProject.projectTasks || [];
            newProject.projectTasks.push(updatedTask);
          }
        }
        break;
      }
    }

    return true;
  } catch (error) {
    console.error("Error updating task:", error);
    return false;
  }
}

export async function getAllUsers() {
  return Object.values(users);
}

export async function inviteUserToProject(email: string, projectId: string): Promise<{success: boolean, message?: string}> {
  try {
    const session = await Context.getPrivateData(datex.meta);
    const currentUserId = session.userId;

    if (!currentUserId || !users[currentUserId]) {
      const message = "Current user not found or not logged in.";
      console.error(message);
      return { success: false, message };
    }

    const targetUser = Object.values(users).find(u => u.email === email);
    if (!targetUser) {
      const message = `User to invite not found: ${email}`;
      console.error(message);
      return { success: false, message };
    }

    const currentUser = users[currentUserId];
    const projectToInvite = currentUser.projects.find((p: Project) => p.pid === projectId);

    if (!projectToInvite) {
      const message = `Project not found in current user's list. Project ID: ${projectId}`;
      console.error(message);
      return { success: false, message };
    }
    
    if (targetUser.projects.some((p: Project) => p.pid === projectId)) {
        const message = "User is already a member of this project.";
        console.log(message);
        return { success: true, message };
    }

    targetUser.projects.push(projectToInvite);
    const message = `Project ${projectId} shared with user ${targetUser.username}`;
    console.log(message);
    return { success: true, message };

  } catch (error) {
    const message = `Error inviting user to project: ${error}`;
    console.error(message);
    return { success: false, message };
  }
}