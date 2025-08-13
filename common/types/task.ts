
// common/types/task.ts
import { Tag } from "common/types/tags.ts";
import {User} from "common/types/users.ts"
import {Project} from "common/types/projects.ts"

/**
 * NewTask describes the shape of a task object:
 * - name: Task title
 * - description: Task details
 * - priority: One of 'low' | 'medium' | 'high'
 * - dueDate: ISO date string
 */
export type TodoTask = {
  tid: string, // Unique identifier for the task
  done : boolean
  name: string,
  description: string,
  priority: 'low' | 'medium' | 'high';
  dueDate: string, // Optional tags for categorization
  tags: Tag[],
  assignedPID: string, // Optional project association
  project : string
};