import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import HealthTipsPage from './pages/HealthTipsPage'; // <-- Import
import ReportsPage from './pages/ReportsPage';       // <-- Import
import ProfilePage from './pages/ProfilePage';       // <-- Import
import HospitalMap from './components/HospitalMap';
import VideoConference from './components/VideoConference';
import { Nav } from 'react-bootstrap';

function App() {
  const [auth,setAuth]=useState(localStorage.getItem("token"));
  const [user,setUser]=useState(JSON.parse(localStorage.getItem("user"))||null);
  const [roomId,setRoomId]=useState(localStorage.getItem("roomjoinid"));
  // useEffect(()=>{
  //   localStorage.clear()
  // },[]);
  const navigate=useNavigate();
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
 useEffect(() => {
  const restoredId = localStorage.getItem("roomjoinid");
  if(restoredId==null)localStorage.removeItem("roomjoinid");
  if (restoredId) {
    setRoomId(restoredId);
  } else {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    localStorage.setItem("roomjoinid", newRoomId);
    setRoomId(newRoomId);
  }
}, [roomId]);


  let handleLogout=()=>{
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuth(null);
    setUser(null);
  }
  let handleLeave = () => {
  localStorage.removeItem("roomjoinid");
  setRoomId(null);
  
  // Navigate away first, then generate new room
  
  navigate("/home");
  
  
}
 let handleConnectDoctor = () => {
    // Always generate a fresh room ID when connecting
    const newRoomId = Math.random().toString(36).substring(2, 10);
    localStorage.setItem("roomjoinid", newRoomId);
    setRoomId(newRoomId);
    
    // Navigate to the new room
    
    navigate(`/room/${newRoomId}`);
    window.location.reload();
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
      <Route element={(auth && user)?(<MainLayout user={user} handleLogout={handleLogout} roomId={roomId} handleConnectDoctor={handleConnectDoctor} />):(<Navigate to={"/login"}/>)}>
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
      <Route path="/room/:roomId" element={( auth && user)?(<VideoConference user={user} handleLeave={handleLeave}/>):(<Navigate to={"/login"}/>)} /> 
      
    </Routes>
  );
}

export default App;