import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

const Private = ({ role }) => {

    const token = localStorage.getItem('access_token')

    return (
        token ? <Outlet /> : <Navigate to="/" />
    )
}

export default Private