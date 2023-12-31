import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

export function GoogleLogout({ logout }) {
  return (
    <button
      type="button"
      className="flex justify-center items-center p-2 text-sm bg-black/[0.6] text-white shadow-lg rounded-lg hover:shadow-xl cursor-pointer"
      onClick={logout}
    >
      LOGOUT
    </button>
  );
}

const randomImage =
  "https://source.unsplash.com/1600x900?nature,japan,anime,snow";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => setUser(data[0]));
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client
        .fetch(createdPinsQuery)
        .then((data) => setPins(data))
        .catch((err) => console.log(err));
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client
        .fetch(savedPinsQuery)
        .then((data) => setPins(data))
        .catch((err) => console.log(err));
    }
  }, [text, userId]);

  if (!user) {
    return <Spinner message="Loading profile.." />;
  }
  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover "
              src={user.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-0 right-0 p-2 ">
              {userId === user._id && <GoogleLogout logout={logout} />}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold">No pins found</div>
          )}
        </div>
      </div>
    </div>
  );
}
