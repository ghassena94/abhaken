import { Component, template, style } from "uix/components/Component.ts";
import { User } from "common/types/users.ts";
import { Project } from "common/types/projects.ts";


type ProjectCounterProps = {
  project: Project;
}

function countCompletedTasks(project: Project): number {
  return project.projectTasks.filter(task => task.done).length;
}

function countIncompletedTasks(project: Project): number {
  return project.projectTasks.filter(task => task.done === false).length;
}



function calcInProgressPercentage(project: Project): number {
  if (project.projectTasks.length === 0) {
    return 0;
  } 

  const sol = (project.projectTasks.filter(task => !task.done).length / project.projectTasks.length) * 100

  return sol;
}

function calcCompletedPercentage(project: Project): number {
  if (project.projectTasks.length === 0) {
    return 0;
  } 

  const sol = (project.projectTasks.filter(task => task.done).length / project.projectTasks.length) * 100

  return sol;
}




@template(({ project }) => (

  <div class="progress-container w-full">
    <div class="flex items-center justify-between w-full px-2">
      <div class="flex flex-row items-center gap-x-12 gap-y-4 w-full">
        <div class="flex items-center justify-center shrink-0 w-40 h-40 mb-4 relative">
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-red"></div>
            <div
              class="w-full h-full rounded-full"
              style={{
                background: project.projectTasks.length === 0
                  ? "#e5e7eb" // gray if no tasks
                  : calcInProgressPercentage(project) === 0
                    ? "#53daad" // all tasks completed, show only green
                    : `conic-gradient(
                        #2f83ff 0% ${calcInProgressPercentage(project)}%,
                        #53daad ${calcInProgressPercentage(project)}% 100%
                      )`
              }}
            ></div>


        </div>

        <div class="flex flex-col gap-4 grow min-w-[160px] pl-4 md:pl-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-[#FFFFFF]"></span>
              <span>Total</span>
            </div>
            <span class="font-bold text-gray-800">{project.projectTasks.length}</span> 
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-[#2f83ff]"></span>
              <span>In Progress</span>
            </div>
            <span class="font-bold text-gray-800">{countIncompletedTasks(project)}</span> 
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-[#53daad]"></span>
              <span>Completed</span>
            </div>
            <span class="font-bold text-gray-800">{countCompletedTasks(project)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
))
export class ProjectProg extends Component<ProjectCounterProps> {}