import React, { useEffect, useCallback } from "react";
import { ZoomMtg } from "@zoomus/websdk";
import "./App.css";

export default function Zoom() {
  const signatureEndpoint =
    "https://node-zoom-sdk-sign-generator.herokuapp.com";
  const LEAVE_URL = "/leave";
  const ZOOM_JWT_API_KEY = "wJqLH3I2S4yVgt5elm-zrg";
  const role = 0;
  const query = new URLSearchParams(window.location.search);
  const password = query.get("password");
  const meetingNumber = query.get("webinarId");
  const userName = query.get("userName");
  const userEmail = query.get("userEmail");
  const tk = query.get("token");
  const showZoomDIv = () => {
    document.getElementById("zmmtg-root").style.display = "block";
  };
  const startMeeting = useCallback(
    (signature) => {
      if (tk && password && meetingNumber) {
        ZoomMtg.init({
          leaveUrl: LEAVE_URL,
          isSupportAV: true,
          disablePreview: true,
          success: (success) => {
            setTimeout(() => {
              let options = {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "Asia/Kolkata",
              };
              let content = document.querySelector(".waiting-pannel-content");
              if (content) {
                content.firstElementChild.innerHTML = new Date(
                  content.firstElementChild.innerHTML
                ).toLocaleString("en-US", options);
              }
            }, 2000);
            ZoomMtg.join({
              signature: signature,
              meetingNumber: meetingNumber,
              apiKey: ZOOM_JWT_API_KEY,
              passWord: password,
              userName: userName,
              userEmail: userEmail,
              tk: tk,
              success: (success) => {
                console.log("Success", success);
              },
              error: (error) => {
                console.log("err", error);
              },
            });
          },
          error: (error) => {
            console.log("err", error);
          },
        });
      } else {
        console.log("Pass necessary param");
      }
    },
    [meetingNumber, password, tk, userEmail, userName]
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
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    ZoomMtg.i18n.load("en-US");
    ZoomMtg.i18n.reload("en-US");
    getSignature();
  }, [getSignature]);

  return (
    <main>
      <div id="zoomAppRoot"></div>
      <div id="aria-notify-area"></div>
    </main>
  );
}
