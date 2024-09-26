import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from "../../localStorage";
import { ITask } from "../../models/ITask";

interface TaskState {
  tasks: ITask[];
  isLoading: boolean;
  error: string;
}
const initialState: TaskState = {
  tasks: loadTasksFromLocalStorage() || [],
  isLoading: false,
  error: ""
};
export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      const newTask: ITask = {
        id: Date.now(),
        name: action.payload,
        isDone: false
      };
      state.tasks.push(newTask);
      saveTasksToLocalStorage(state.tasks);
    },
    editTodo(state, action: PayloadAction<{ id: number; newName: string }>) {
      const { id, newName } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.name = newName;
      }
      saveTasksToLocalStorage(state.tasks);
    },
    deleteTodo(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      saveTasksToLocalStorage(state.tasks);
    },
    toggleComplete(state, action: PayloadAction<number>) {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.isDone = !task.isDone;
      }
      saveTasksToLocalStorage(state.tasks);
    },
    reorderTasks(state, action: PayloadAction<ITask[]>) {
      state.tasks = action.payload;
      saveTasksToLocalStorage(state.tasks);
    }
  }
});

export default todoSlice.reducer;
