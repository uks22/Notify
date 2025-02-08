import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";
function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  const [expand, setExpand] = useState(false);
  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function submitNote(event) {
    props.task?props.onAdd(note):props.onAddTask(note);
    setNote({
      title: "",
      content: "",
    });
    event.preventDefault();
  }
  function handleClick() {
    setExpand(true);
  }
  return (
    <div>
      <form className="create-note">
        {props.task && expand && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder={props.task ? "Take a note...":"Write a task..." }
          rows={expand ? 3 : 1}
          onClick={handleClick}
        />
        <Zoom in={expand}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
