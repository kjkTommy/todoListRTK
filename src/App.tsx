import { Done } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Reorder } from "framer-motion";
import { useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { ITask } from "./models/ITask";
import { todoSlice } from "./store/reducers/TodoSlice";

function App() {
  const [todoText, setTodoText] = useState("");
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskText, setEditTaskText] = useState("");

  const { tasks } = useAppSelector((state) => state.todoReducer);
  const { deleteTodo, addTodo, editTodo, toggleComplete, reorderTasks } = todoSlice.actions;
  const dispatch = useAppDispatch();

  const handleDeleteTask = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const handleAddTask = () => {
    if (todoText.trim()) {
      dispatch(addTodo(todoText));
      setTodoText("");
    }
  };

  const handleEditTaskName = (id: number) => {
    setEditTaskId(id);
    const task = tasks.find((todo) => todo.id === id);
    if (task) {
      setEditTaskText(task.name);
    }
  };

  const handleSaveTask = (id: number) => {
    if (editTaskText.trim()) {
      dispatch(editTodo({ id, newName: editTaskText }));
      setEditTaskId(null);
    }
  };

  const handleCompleteTask = (id: number) => {
    dispatch(toggleComplete(id));
    setEditTaskId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTaskText(e.target.value);
  };

  const handleReorder = (newTasks: ITask[]) => {
    dispatch(reorderTasks(newTasks));
  };

  return (
    <>
      <Typography variant="h2" fontWeight={700}>
        To Do List
      </Typography>
      <Box className="todo_container">
        <TextField
          style={{
            marginBottom: 20,
            borderRadius: "12px",
            width: "600px",
            padding: 12,
            backgroundColor: "transparent"
          }}
          InputProps={{
            style: {
              color: "white",
              fontFamily: "revert",
              fontWeight: 500
            }
          }}
          variant="standard"
          onChange={handleChange}
          value={todoText}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
          placeholder="Add a new task"
        />

        <Reorder.Group
          axis="y"
          values={tasks}
          onReorder={handleReorder}
          className="deals_list"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {tasks.map((todo: ITask) => (
            <Reorder.Item key={todo.id} value={todo}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "2",
                  p: "10px",
                  alignItems: "center",
                  flex: "0 0 auto",
                  backgroundColor: todo.isDone ? "rgba(0, 255, 0, 0.2)" : "white",
                  border: todo.isDone ? "2px solid green" : "2px solid transparent"
                }}>
                <IconButton onClick={() => handleCompleteTask(todo.id)}>
                  <Done sx={{ color: todo.isDone ? "green" : "gray" }} />
                </IconButton>

                {editTaskId === todo.id ? (
                  <TextField
                    value={editTaskText}
                    onChange={handleEditChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSaveTask(todo.id);
                      }
                    }}
                    InputProps={{
                      readOnly: todo.isDone
                    }}
                    placeholder="Edit task"
                  />
                ) : (
                  <Typography variant="h6" fontWeight={500}>
                    {todo.name}
                  </Typography>
                )}

                {editTaskId === todo.id ? (
                  <IconButton onClick={() => handleSaveTask(todo.id)}>
                    <Done sx={{ color: "green" }} />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEditTaskName(todo.id)}>
                    <Edit />
                  </IconButton>
                )}
                <IconButton onClick={() => handleDeleteTask(todo.id)}>
                  <Delete color="error" />
                </IconButton>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </Box>
    </>
  );
}

export default App;
