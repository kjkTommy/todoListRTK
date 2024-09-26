import { ITask } from "./models/ITask";

const TASKS_STORAGE_KEY = "task";
export const loadTasksFromLocalStorage = () => {
  const tasks = localStorage.getItem(TASKS_STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : null;
};
export const saveTasksToLocalStorage = (tasks: ITask[]) => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};
