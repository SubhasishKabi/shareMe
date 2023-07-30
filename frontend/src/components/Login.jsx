import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import jwt_decode from "jwt-decode";
import { client } from "../client";

export default function Login() {
  const navigate = useNavigate();
  const getUserData = async (response) => {
    const decoded = jwt_decode(response.credential);
    // console.log(decoded)
    localStorage.setItem("user", JSON.stringify(decoded));

    const { name, picture, sub } = decoded;

    const doc = {
      _id: sub,
      _type: "user", //this type is different from the types in schema fields
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });

    // console.log(decoded);
  };

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <div className="relative w-full h-full ">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={(response) => getUserData(response)}
              onError={(error) => console.log(error)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
