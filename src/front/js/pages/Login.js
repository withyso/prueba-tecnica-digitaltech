import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState, useContext } from "react"
import { Context } from '../store/appContext'
import toast, { Toaster } from 'react-hot-toast';
import { showNotification } from '../utils/ShowToast';

const Login = () => {
  const navigate = useNavigate()
  const { actions } = useContext(Context)
  const [UserData, setUserData] = useState({
    username: "",
    password: "",
  })

  const { username, password } = UserData

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(UserData);
    const result = await actions.login(UserData)
    console.log(result)
    if (result.success) {
      showNotification(result.message, "success")
      setInterval(() => {
        navigate('/home')
      }, 2000)
      return;
    } else {
      return showNotification(result.message, "error")
    }
  };


  return (
    <React.Fragment>
      <div className="container box">
        <div className="container login-box d-flex flex-column p-4 justify-content-between curvieBox mb-3">
          <h1 className='text-center mb-4 fs-1 text-secondary'>DTech Inc</h1>
          <form action="" className='d-flex flex-column justify-content-center gap-2' onSubmit={handleSubmit}>
            <input type="text" name="username" id="" placeholder='Username' className='curvieInput' onChange={handleInputChange} value={username} />
            <input type="password" name="password" id="" placeholder='Password' className='curvieInput' onChange={handleInputChange} value={password} />
            <button type='submit' className='curvieButton'>Enviar</button>
          </form>
          <div className="down mt-auto pb-2">
            <span style={{ fontSize: '14px' }}>Forgot your password?</span>
          </div>
        </div>
        <div className="curvieSmallBox container d-flex flex-column justify-content-center mt-auto">
          <span style={{ fontSize: '15px' }}> Don't have an account? <strong className='blueStrong' onClick={() => { navigate('/signup') }}>Sign up</strong></span>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Login