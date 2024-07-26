import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router';


export default function PrivateRoute() { 
    const [loggedIn , setLoggedIn] = useState(false)
    useState(()=>{
        const token = localStorage.getItem('token')
        if(token){
            setLoggedIn(true)
        }
    },[])
   
   
    //custom hook to cheak if logged in or not
   //outlet is creating the private dom if loggedin is true then go to Outlet else back to sign in 
    return loggedIn ? <Outlet/> : <Navigate to='/login'/>
 }
