import React, { useState } from "react";
import './main.css';  // Assuming you have a CSS file for styling

function Log(props) {
  // State to handle toggling between sign-in and sign-up views
  const [isSignIn, setIsSignIn] = useState(true);
  const [signup,setSignup]=useState({username:'',email:'',password:''});
  const [signin,setSignin]=useState({username:'',password:''});
  // Function to toggle between sign-in and sign-up with a delay (200ms)
  const toggleWithDelay = () => {
    setTimeout(() => {
      setIsSignIn(prevState => !prevState); // Toggle state after 200ms
    }, 200);
  };
  function handleChange(event){
    const val=event.target.value;
    const name=event.target.name;
    setSignup((prev)=>{
      return{
        ...prev,
        [name]:val
      }
    });
  }
  function handleChange1(event){
    const val=event.target.value;
    const name=event.target.name;
    setSignin((prev)=>{
      return{
        ...prev,
        [name]:val
      }
    });
  }
  return (
    <div id="container" className={`container ${isSignIn ? 'sign-in' : 'sign-up'}`}>
      {/* FORM SECTION */}
      <div className="row">
        {/* SIGN UP */}
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <div className="form sign-up">
              <div className="input-group">
                <i className='bx bxs-user'></i>
                <input onChange={handleChange} value={signup.username} name="username" type="text" placeholder="Username" />
              </div>
              <div className="input-group">
                <i className='bx bx-mail-send'></i>
                <input onChange={handleChange} value={signup.email} name="email"type="email" placeholder="Email" />
              </div>
              <div className="input-group">
                <i className='bx bxs-lock-alt'></i>
                <input onChange={handleChange} value={signup.password} name="password" type="password" placeholder="Password" />
              </div>
              <div className="input-group">
                <i className='bx bxs-lock-alt'></i>
                <input type="password" placeholder="Confirm password" />
              </div>
              <button onClick={()=>{
                props.handleNewUser(signup);
                setSignup({username:'',email:'',password:''});
              }}>Sign up</button>
              <p>
                <span>Already have an account?</span>
                <b onClick={toggleWithDelay} className="pointer">Sign in here</b>
              </p>
            </div>
          </div>
        </div>
        {/* END SIGN UP */}

        {/* SIGN IN */}
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <div className="form sign-in">
              <div className="input-group">
                <i className='bx bxs-user'></i>
                <input onChange={handleChange1} value={signin.username} name="username" type="text" placeholder="Username" />
              </div>
              <div className="input-group">
                <i className='bx bxs-lock-alt'></i>
                <input onChange={handleChange1} value={signin.password} name="password" type="password" placeholder="Password" />
              </div>
              <button onClick={()=>{
                props.handleExistingUser(signin);
                setSignin({username:'',password:''});
              }}>Sign in</button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <hr style={{ width: '80%', border: '1px solid #ccc', flex: 1, marginTop: '10px' }} />
                <div style={{ fontSize: '16px', color: '#777', flex: 1 }}>or sign-in with</div>
              </div>
              <p><b>Forgot password?</b></p>
              <p>
                <span>Don't have an account?</span>
                <b onClick={toggleWithDelay} className="pointer">Sign up here</b>
              </p>
            </div>
          </div>
        </div>
        {/* END SIGN IN */}
      </div>
      {/* END FORM SECTION */}

      {/* CONTENT SECTION */}
      <div className="row content-row">
        {/* SIGN IN CONTENT */}
        <div className="col align-items-center flex-col">
          <div className="text sign-in">
            <h2>Welcome</h2>
          </div>
          <div className="img sign-in"></div>
        </div>
        {/* END SIGN IN CONTENT */}

        {/* SIGN UP CONTENT */}
        <div className="col align-items-center flex-col">
          <div className="img sign-up"></div>
          <div className="text sign-up">
            <h2>Join with us</h2>
          </div>
        </div>
        {/* END SIGN UP CONTENT */}
      </div>
      {/* END CONTENT SECTION */}
    </div>
  );
}

export default Log;
