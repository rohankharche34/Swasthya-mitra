import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import HealthTipsPage from './pages/HealthTipsPage'; // <-- Import
import ReportsPage from './pages/ReportsPage';       // <-- Import
import ProfilePage from './pages/ProfilePage';       // <-- Import
import HospitalMap from './components/HospitalMap';

function App() {
  const [auth,setAuth]=useState(localStorage.getItem("token"));
  const [user,setUser]=useState(JSON.parse(localStorage.getItem("user"))||null);
  // useEffect(()=>{
  //   localStorage.clear()
  // },[]);
  useEffect(()=>{

    let storedAuth=localStorage.getItem("token");
    let storedUser=localStorage.getItem("user");

    if(storedAuth && storedUser){
      setAuth(storedAuth);
      setUser(JSON.parse(storedUser));
      return ;
    }

    if(storedAuth && !storedUser){
      fetch("http://localhost:8080/api/login",{
        headers: {
        "Authorization": "Basic " + storedAuth
      }
      })
      .then(res=>{
        if(!res.ok)throw new Error("Unauthorize")
        return res.json();
      })
      .then(data=>{
        setAuth(storedAuth);
        setUser(data);
        localStorage.setItem("user",JSON.stringify(data));
      })
      .catch(err=>{
        console.log(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuth(null);
        setUser(null);
      })
    }
    
  },[auth]);

  let handleLogout=()=>{
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuth(null);
    setUser(null);
  }



  return (
    <Routes>
      {/* Routes WITHOUT Navbar/Footer (Auth Pages) */}
      <Route path="/login" element={
        (auth && user)?(<Navigate to={"/home"}/>):(
        <LoginPage setAuth={(token)=>{
          setAuth(token);
          localStorage.setItem("token",token);
        }} />)} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path='*' element={<Navigate to={"/login"}/>}/>

      {/* Routes WITH Navbar/Footer */}
      <Route element={(auth && user)?(<MainLayout user={user} handleLogout={handleLogout} />):(<Navigate to={"/login"}/>)}>
        <Route path="/home" element={
          (auth && user)?
          (<HomePage />):(<Navigate to={"/login"}/>)} />
        <Route path="/dashboard" element={(auth && user)?(<DashboardPage user={user} />):(<Navigate to={"/login"}/>)} />
        <Route path="/health-tips" element={<HealthTipsPage />} /> {/* <-- Add Route */}
        <Route path="/reports" element={(auth && user)?(<ReportsPage />):(<Navigate to={"/login"}/>)} />       {/* <-- Add Route */}
        <Route path="/profile" element={(auth && user)?(<ProfilePage user={user} />):(<Navigate to={"/login"}/>)} />       {/* <-- Add Route */}
        {/* Add a placeholder route for settings */}
        <Route path="/settings" element={(auth && user)?(<ProfilePage user={user}/>):(<Navigate to={"/login"}/>)} /> 
        <Route path="/map" element={(auth && user)?(<HospitalMap/>):(<Navigate to={"/login"}/>)} /> 
      </Route>
    </Routes>
  );
}

export default App;