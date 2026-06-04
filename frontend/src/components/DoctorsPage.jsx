import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Button } from "react-bootstrap";

export default function DoctorsPage() {
    const [links,setLinks]=useState([]);
    const navigate=useNavigate();

    // Use `process.env.REACT_APP_API_BASE_URL` if you created your app with Create React App.
    // If you are using Vite, change this to `import.meta.env.VITE_API_BASE_URL`
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    useEffect(()=>{
        fetch(`${API_BASE_URL}/api/getlink`,{
            headers:{
                        Authorization: "Basic " + localStorage.getItem("token"),
                    }, 
        })
        .then(res=>res.json())
        .then((data)=>{
            setLinks(data)
            console.log(data);
        })
        .catch(err=>console.log(err));
        
    },[]);
    const handleJoin=(rid)=>{
        navigate(`/room/${rid}`);
    }
    const handleComplete=(id)=>{
         fetch(`${API_BASE_URL}/api/deletelink/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Basic " + localStorage.getItem("token"),
                },
                })
      .then(() => {
        setLinks(prev => prev.filter(link => link.id !== id));
      })
      .catch(err => console.error(err));
    }
  return (
    <div className="p-4">
      <h3 className="mb-4">Doctor Dashboard</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Room Id</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No active meetings
              </td>
            </tr>
          ) : (
            links.map(link => (
              <tr key={link.id}>
                <td>{link.name}</td>
                <td>{link.gender}</td>
                <td>{link.dob}</td>
                <td>{link.meetingLink}</td>
                <td className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={()=>{handleJoin(link.meetingLink)}}
                  >
                    Join
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleComplete(link.id)}
                  >
                    Completed
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}
