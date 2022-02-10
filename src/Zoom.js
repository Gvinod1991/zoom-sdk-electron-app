import React, { useEffect, useCallback } from "react";
import { ZoomMtg } from "@zoomus/websdk";
import "./App.css";
export default function Zoom() {
  const signatureEndpoint =
    "https://node-zoom-sdk-sign-generator.herokuapp.com";
  const LEAVE_URL = "/leave";
  const ZOOM_JWT_API_KEY = "nFu3f8RJQpqIIFGJvZ7_hw";
  const role = 0;
  const query = new URLSearchParams(window.location.search);
  const passWord = query.get("password");
  const meetingNumber = query.get("webinarId");
  const userName = query.get("userName");
  const userEmail = query.get("userEmail");
  const tk = query.get("token");
  const showZoomDIv = () => {
    document.getElementById("zmmtg-root").style.display = "block";
  };
  const startMeeting = useCallback(
    (signature) => {
      if (tk && passWord && meetingNumber) {
        ZoomMtg.init({
          leaveUrl: LEAVE_URL,
          isSupportAV: true,
          disablePreview: true,
          success: (success) => {
            ZoomMtg.join({
              signature: signature,
              meetingNumber: meetingNumber,
              apiKey: ZOOM_JWT_API_KEY,
              passWord: passWord,
              userName: userName,
              userEmail: userEmail,
              tk: tk,
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
      } else {
        console.log("Pass necessary param");
      }
    },
    [meetingNumber, passWord, tk, userEmail, userName]
  );

  const getSignature = useCallback(() => {
    if (meetingNumber) {
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
    } else {
      console.log("Meeting number requred");
    }
  }, [meetingNumber, startMeeting]);
  useEffect(() => {
    showZoomDIv();
    ZoomMtg.setZoomJSLib("https://source.zoom.us/2.2.0/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    getSignature();
  }, [getSignature]);
  return (
    <main>
      <div id="zoomAppRoot"></div>
    </main>
  );
}