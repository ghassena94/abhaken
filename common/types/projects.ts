import { Tag } from "common/types/tags.ts";
import {TodoTask } from "common/types/task.ts"
export type Project = {
  pid : string; 
  title: string;
  description: string;
  deadline: Date;
  tags: Tag[];
  projectTasks: TodoTask[]
};
