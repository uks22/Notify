import React,{useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
function Task(props) {
  
  return (
    <div className="task" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <input
    type="checkbox"
    checked={props.check}
    onChange={() => {
      !props.check ? props.onCheck(props.id) : props.onUncheck(props.id);
    }}
    style={{ marginRight: '10px' }} // Optional: Add space between checkbox and task content
  />
  <span style={{ flexGrow: 1 }}>{props.content}</span> {/* Ensure task content takes available space */}
  <DeleteIcon
    style={{
      cursor: 'pointer',
      marginLeft: 'auto', // Push delete icon to the far right
    }}
    onClick={() => props.onDelete(props.id, !(props.check))}
  />
</div>

  );
}

export default Task;
