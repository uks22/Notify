import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";
import Log from "./Log";
import Task from "./Task";
function App() {
  const [darkMode,setDarkMode] = useState(false);
  const [task, setTask] = useState(true);
  const [change, setChange] = useState(false); // Toggle state
  const [notes, setNotes] = useState([]); // State for storing notes
  const [currTableName, setCurrTableName] = useState("");
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  function handleTask() {
    setTask((prev) => !prev);
  }
  function handleDarkMode(){
    if(darkMode===false)document.body.style.backgroundColor="rgb(60,60,60)";
    else document.body.style.backgroundColor="rgb(255,253,208)";
    setDarkMode(prev=>!prev);
  }
  async function handleCheck(id) {
    console.log(activeTasks);
    console.log(id);
    try {
      const task=activeTasks.find(task => task.id === id);
      const response = await axios.post("http://localhost:3000/submitcompleted", {
        ...task,
        tableName: currTableName,
      });
      setCompletedTasks((prevNotes) => [...prevNotes, response.data.item]); // Update notes state
    } catch (error) {
      console.error("Error adding note:", error);
    }
    deleteTask(id,true);
    
  }

  async function handleUncheck(id) {
  /*  console.log("hello1");
    const updatedCompletedTasks = completedTasks.filter(
      (task) => task.id !== id
    );
    const taskToRevert = completedTasks.find((task) => task.id === id);

    setCompletedTasks(updatedCompletedTasks);
    setActiveTasks((prevTasks) => [
      ...prevTasks,
      { ...taskToRevert, completed: false },
    ]);
*/
    try {
      const task=completedTasks.find(task => task.id === id);
      const response = await axios.post("http://localhost:3000/submitactive", {
        ...task,
        tableName: currTableName,
      });
      setActiveTasks((prevNotes) => [...prevNotes, response.data.item]); // Update notes state
    } catch (error) {
      console.error("Error adding note:", error);
    }
    deleteTask(id,false);
  }
 /* function deleteTask(id,flag){
    const updatedtask=(flag)?setActiveTasks(activeTasks.filter((task)=>task.id!==id)):setCompletedTasks(completedTasks.filter((task)=>task.id!==id));

  }*/
  async function deleteTask(id,flag) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/deletetask/${id}`,
        { params: { tableName: currTableName,flag:flag } }
      );
      if (response.status === 200) {
        flag?setActiveTasks((prevTasks) =>
          prevTasks.filter((taskItem) => taskItem.id !== id)
        ):setCompletedTasks((prevTasks) =>
          prevTasks.filter((taskItem) => taskItem.id !== id)
        );
        ; // Remove note
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }
  async function onAddTask(task){
    try {
      const response = await axios.post("http://localhost:3000/submitactive", {
        ...task,
        tableName: currTableName,
      });
      setActiveTasks((prevNotes) => [...prevNotes, response.data.item]); // Update notes state
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }
  // Handle change between Log and Notes display
  useEffect(() => {
    const savedTableName = localStorage.getItem("tableName");

    if (savedTableName) {
      // If there's a saved tableName, set it as the current table name
      setCurrTableName(savedTableName);
      setChange(true); // Switch to notes display
    }
  }, []);
  function handleChange() {
    setChange((prev) => !prev);
  }
  async function handleNewUser(user) {
    try {
      const response = await axios.post("http://localhost:3000/register", user);
      const name = response.data.tableName;
      localStorage.setItem("tableName", name);
      setCurrTableName(name);
      handleChange();
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  }
  async function handleExistingUser(user) {
    try {
      const response = await axios.post("http://localhost:3000/login", user);
      if (response.data.message === "Login successful") {
        const name = response.data.tableName;
        localStorage.setItem("tableName", name);
        setCurrTableName(name);
        handleChange();
      } else {
        return;
      }
    } catch (error) {
      console.error("Error handling existing user:".error);
      localStorage.removeItem("tableName");
      setCurrTableName("");
      setChange(false);
    }
  }
  // Fetch notes from the backend when the component mounts
  useEffect(() => {
    if (change) {
      // Only fetch notes when `change` is true
      async function fetchNotes() {
        try {
          const response = await axios.get("http://localhost:3000/notes", {
            params: {
              tableName: currTableName,
            },
          });
          setNotes(response.data.item); // Assuming 'item' is the key holding the notes
          setActiveTasks(response.data.item1);
          setCompletedTasks(response.data.item2);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      }
      fetchNotes();
    }
  }, [change]); // Dependency on `change` so it refetches when `change` toggles

  // Adding a new note to the list
  async function addNote(newNote) {
    try {
      const response = await axios.post("http://localhost:3000/submit", {
        ...newNote,
        tableName: currTableName,
      });
      setNotes((prevNotes) => [...prevNotes, response.data.item]); // Update notes state
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  // Deleting a note from the list
  async function deleteNote(id) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/delete/${id}`,
        { params: { tableName: currTableName } }
      );
      if (response.status === 200) {
        setNotes((prevNotes) =>
          prevNotes.filter((noteItem) => noteItem.id !== id)
        ); // Remove note
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }
  async function logOut() {
    try {
      const response = await axios.get("http://localhost:3000/logout");
      localStorage.removeItem("tableName"); // Remove the stored tableName
      setCurrTableName(""); // Clear current table name state
      setChange(false);
    } catch (error) {
      console.error("Error, not able to log out:", error);
    }
  }
  return (
    <div>
      {change ? (
        <div>
          <Header logOut={logOut} task={task} handleClick={handleTask} handleDarkMode={handleDarkMode} darkMode={darkMode}/>
          <CreateArea onAdd={addNote} task={task} onAddTask={onAddTask}/>

          {task ? (
            notes.map((noteItem) => (
              <Note
                key={noteItem.id} // Use unique id as key
                id={noteItem.id}
                title={noteItem.title}
                content={noteItem.content}
                onDelete={deleteNote} // Pass delete function as prop
              />
            ))
          ) : (
            <div className="task-list">
              <div className="task-section active-tasks">
                <h3 style={{color:darkMode?"white":"black"}}>Active Tasks</h3>
                {activeTasks.map((taskItem,index) => {
                  return (
                    <Task
                      key={taskItem.id}
                      id={taskItem.id}
                      content={taskItem.content}
                      onDelete={deleteTask}
                      onCheck={handleCheck}
                      onUncheck={handleUncheck}
                      check={false}
                    />
                  );
                })}
              </div>
              <div className="task-section completed-tasks">
                <h3 style={{color:darkMode?"white":"black"}}>Completed Tasks</h3>
                {completedTasks.map((taskItem,index) => {
                  return (
                    <Task
                      key={taskItem.id}
                      id={taskItem.id}
                      check={true}
                      content={taskItem.content}
                      onDelete={deleteTask}
                      onCheck={handleCheck}
                      onUncheck={handleUncheck}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Log
          handleChange={handleChange}
          handleNewUser={handleNewUser}
          handleExistingUser={handleExistingUser}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
