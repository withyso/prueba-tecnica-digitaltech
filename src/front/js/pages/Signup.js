import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState, useContext } from "react"
import { Context } from '../store/appContext'
import toast, { Toaster } from 'react-hot-toast';
import { showNotification } from '../utils/ShowToast';

const Signup = () => {
    const navigate = useNavigate()
    const { actions } = useContext(Context)
    const [newUserData, setNewUserData] = useState({
        username: "",
        name: "",
        surname: "",
        password: "",
    })

    const { username, name, surname, password } = newUserData

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUserData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await actions.signUpUser(newUserData)
        if (result.success) {
            showNotification('Usuario creado con exito', "success")
            navigate('/')
            return;
        } else {
            return showNotification(result.message, "error")
        }

    };

    return (
        <React.Fragment>
            <div className="container box d-flex flex-column justify-content-evenly" style={{ marginTop: '7em' }}>
                <div className="title-box mt-auto text-center">
                    <h1 className='fs-1 text-secondary mb-3'>DTech Inc</h1>
                </div>
                <div className="container login-box d-flex flex-column p-4 justify-content-evenly curvieBigBox mb-3">
                    <h3 className='fs-5 text-center mb-4 blueStrong'>Sign up</h3>
                    <form action="" className='d-flex flex-column justify-content-center gap-2' onSubmit={handleSubmit}>
                        <label className="labelCustom" htmlFor="username">Your username</label>
                        <input type="text" name="username" id="username" value={username} placeholder='Username' className='curvieInput' onChange={handleInputChange} />
                        <label className="labelCustom" htmlFor="name">Your name</label>
                        <input type="text" name="name" id="name" value={name} placeholder='Name' className='curvieInput' onChange={handleInputChange} />
                        <label className="labelCustom" htmlFor="surname">Your surname</label>
                        <input type="text" name="surname" id="surname" value={surname} placeholder='Surname' className='curvieInput' onChange={handleInputChange} />
                        <label className="labelCustom" htmlFor="password">Your Password</label>
                        <input type="password" name="password" id="password" value={password} placeholder='Password' className='curvieInput' onChange={handleInputChange} />
                        <button type='submit' className='curvieButton'>Sign up</button>
                    </form>
                    <div className="down mt-auto pb-1 text-center">
                        <span style={{ fontSize: '14px' }}>Forgot your password?</span>
                    </div>
                </div>
                <div className="curvieMediumBox container d-flex flex-column justify-content-center mt-auto text-center">
                    <span style={{ fontSize: '15px' }}> Already have account?
                        <strong className='blueStrong' onClick={() => { navigate('/login') }}> Login</strong></span>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Signup