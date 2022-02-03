import React, { useEffect, useCallback } from "react";
import { ZoomMtg } from "@zoomus/websdk";
import "./App.css";

const signatureEndpoint = "http://node-zoom-sdk-sign-generator.herokuapp.com";
const LEAVE_URL = "http://localhost:3000";
const ZOOM_JWT_API_KEY = "nFu3f8RJQpqIIFGJvZ7_hw";
const meetingNumber = "75878772635";
const role = 0;
const userName = "Vinod";
const userEmail = "vinod.godti@frostinteractive.com";
const passWord = "dA6G13";
const registrantToken = "";

export default function App() {
  const showZoomDIv = () => {
    document.getElementById("zmmtg-root").style.display = "block";
  };
  const startMeeting = (signature) => {
    ZoomMtg.init({
      leaveUrl: LEAVE_URL,
      isSupportAV: true,
      disablePreview: true,
      success: (success) => {
        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          apiKey: ZOOM_JWT_API_KEY,
          userEmail: userEmail,
          passWord: passWord,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  const getSignature = useCallback(() => {
    fetch(signatureEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        startMeeting(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    showZoomDIv();
    ZoomMtg.setZoomJSLib("https://source.zoom.us/2.2.0/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    getSignature();
  }, [getSignature]);
  return (
    <main>
      {/* For Component View */}
      <div id="zoomAppRoot">
        {/* Zoom Meeting SDK Component View Rendered Here */}
      </div>
    </main>
  );
}