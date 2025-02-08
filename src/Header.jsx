import React, { useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import HighlightIcon from "@mui/icons-material/Highlight";
import TaskIcon from '@mui/icons-material/Task';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotesIcon from '@mui/icons-material/Notes';
import Tooltip from '@mui/material/Tooltip';

function Header(props) {
  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper
        <Tooltip title="Log out" arrow>
          <LogoutIcon
            onClick={() => {
              props.logOut();
            }}
            style={{ float: "right", marginTop: "10px", cursor: "pointer" }}
          />
        </Tooltip>

        {(props.task) ? (
          <Tooltip title="Task View" arrow>
            <TaskIcon
              style={{ float: "right", marginTop: "10px", cursor: "pointer", marginRight: "20px" }}
              onClick={props.handleClick}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Notes View" arrow>
            <NotesIcon
              style={{ float: "right", marginTop: "10px", cursor: "pointer", marginRight: "20px" }}
              onClick={props.handleClick}
            />
          </Tooltip>
        )}

        {!(props.darkMode) ? (
          <Tooltip title="Enable Dark Mode" arrow>
            <DarkModeIcon
              style={{ float: "right", marginTop: "10px", cursor: "pointer", marginRight: "20px" }}
              onClick={props.handleDarkMode}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Enable Light Mode" arrow>
            <LightModeIcon
              style={{ float: "right", marginTop: "10px", cursor: "pointer", marginRight: "20px" }}
              onClick={props.handleDarkMode}
            />
          </Tooltip>
        )}
        
      </h1>
    </header>
  );
}

export default Header;
/*
import React,{useState} from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import HighlightIcon from "@mui/icons-material/Highlight";
import TaskIcon from '@mui/icons-material/Task';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotesIcon from '@mui/icons-material/Notes';
function Header(props) {
  return (
    <header>
      <h1>
        <HighlightIcon/>
        Keeper
        <LogoutIcon onClick={()=>{
          props.logOut();
        }}  style={{float:"right",marginTop:"10px",cursor:"pointer"}}/>
        {(props.task)?<TaskIcon  style={{float:"right",marginTop:"10px",cursor:"pointer",marginRight:"20px"} } onClick={props.handleClick}/>:<NotesIcon style={{float:"right",marginTop:"10px",cursor:"pointer",marginRight:"20px"} } onClick={props.handleClick}/>}

        {!(props.darkMode) ? <DarkModeIcon style={{float:"right",marginTop:"10px",cursor:"pointer",marginRight:"20px"}} onClick={props.handleDarkMode}/>:<LightModeIcon style={{float:"right",marginTop:"10px",cursor:"pointer",marginRight:"20px"}} onClick={props.handleDarkMode}/>}
        
      </h1>
    </header>
  );
}

export default Header;
*/ 