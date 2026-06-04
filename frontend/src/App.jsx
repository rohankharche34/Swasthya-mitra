import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import HealthTipsPage from './pages/HealthTipsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import HospitalMap from './components/HospitalMap';
import VideoConference from './components/VideoConference';
import { Nav } from 'react-bootstrap';
import DoctorsPage from './components/DoctorsPage';
import HealthBotPage from './pages/HealthBotPage';

function App() {
  const [auth,setAuth]=useState(localStorage.getItem("token"));
  const [user,setUser]=useState(JSON.parse(localStorage.getItem("user"))||null);
  const [roomId,setRoomId]=useState(null);
  // useEffect(()=>{
  //   localStorage.clear()
  // },[]);
  const navigate=useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(()=>{

    let storedAuth=localStorage.getItem("token");
    let storedUser=localStorage.getItem("user");

    if(storedAuth && storedUser){
      setAuth(storedAuth);
      setUser(JSON.parse(storedUser));
      return ;
    }

    if(storedAuth && !storedUser){
      fetch(`${API_BASE_URL}/api/login`,{
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
//  useEffect(() => {
//   const restoredId = localStorage.getItem("roomjoinid");
//   if(restoredId==null)localStorage.removeItem("roomjoinid");
//   if (restoredId) {
//     setRoomId(restoredId);
//   } else {
//     const newRoomId = Math.random().toString(36).substring(2, 10);
//     localStorage.setItem("roomjoinid", newRoomId);
//     setRoomId(newRoomId);
//   }
// }, [roomId]);


  let handleLogout=()=>{
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuth(null);
    setUser(null);
  }
  let handleLeave = () => {
  
  setRoomId(null);
  
  // Navigate away first, then generate new room
  
  navigate("/home");
  
  
}
 let handleConnectDoctor = () => {
    // Always generate a fresh room ID when connecting
    const newRoomId = Math.random().toString(36).substring(2, 10);
    
    setRoomId(newRoomId);
    
    
    const payload = {
    name: user.name,
    gender: user.gender,
    dob: user.dob,
    meetingLink:newRoomId
    };

    fetch(`${API_BASE_URL}/api/savelink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + localStorage.getItem("token"),
    },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .catch(err => console.error(err));


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
        <Route path="/doctorspage" element={(auth && user)?(<DoctorsPage/>):(<Navigate to={"/login"}/>)} />
        <Route path="/healthbot" element={(auth && user)?(<HealthBotPage user={user} />):(<Navigate to={"/login"}/>)} />
        
      </Route>
      <Route path="/room/:roomId" element={( auth && user)?(<VideoConference user={user} handleLeave={handleLeave}/>):(<Navigate to={"/login"}/>)} /> 
      
    </Routes>
  );
}

export default App;