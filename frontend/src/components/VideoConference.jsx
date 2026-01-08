import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Sticky } from 'react-bootstrap-icons';

export default function VideoConference({user, handleLeave}) {
  const {roomId} = useParams();
  const containerRef = useRef(null);
  const zpInstanceRef = useRef(null);
  const navigate=useNavigate();
  const [homebut,setHomeBut]=useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const initMeeting = async () => {
      if (!containerRef.current || !isMounted) return;

      // Clear any existing instance first
      if (zpInstanceRef.current) {
        zpInstanceRef.current = null;
      }

      const appID = 1034893946;
      const serverSecret = "98cdadca0b8f0886d6b1c1c556c6f661";

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        user.gmail,
        user.name
      );

      let zp = ZegoUIKitPrebuilt.create(kitToken);
      
      zpInstanceRef.current = zp;
      
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: 'Personal link',
            url: `${window.location.origin}/room/${roomId}`
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        onJoinRoom: ()=>{
           setHomeBut(false);
        },
        onLeaveRoom: () => {
          // Give ZegoCloud time to clean up before navigating
          setTimeout(() => {
            if (isMounted) {
              zpInstanceRef.current = null;
            
              handleLeave();
              
            }
          }, 3000);
        },
        showScreenSharingButton: true,
        showPreJoinView: true,
        turnOnCameraWhenJoining: true,
        turnOnMicrophoneWhenJoining: true,
      });
    };

    initMeeting();

    // Cleanup function
    return () => {
      isMounted = false;
      zpInstanceRef.current = null;
    };
  }, [roomId, user.gmail, user.name]); // Re-run when roomId changes
  
  return (
    <>
    {homebut && (
  <div className="home-btn-wrapper">
    <Button
      variant="dark"
      onClick={() => {navigate("/home")
        window.location.reload()
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
        fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
        <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
      </svg>
    </Button>
  </div>
)}

    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />
    
    
    </>
    
  );
}