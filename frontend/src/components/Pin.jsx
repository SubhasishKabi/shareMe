import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { urlFor, client } from "../client";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  // console.log(postedBy, image, _id, save)
  // console.log(postedBy)
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();

  const user = fetchUser();
  //   console.log(user)
  const alreadySaved = !!save?.filter((item) => item?.postedBy?._id === user?.sub)
    ?.length;
  //   console.log(alreadySaved);
  // 1, filter=> [1,2,3] => returns [1] but .length returns 1 or 0 here which are boolean values
  // !! to convert 1 and ) to boolean

  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };
  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow:lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out hover:scale-105"
      >
        <img
          className="rounded-lg w-full"
          alt="user post"
          src={urlFor(image).width(250).url()}
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2z-50"
            style={{ width: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none "
                  onClick={(e) => e.stopPropagation()}
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none "
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full ">
              {destination && (
                <a
                  href={destination}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-1 pl-2 pr-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination?.slice(8, 17)}...
                </a>
              )}
              {postedBy?._id === user?.sub && (
                <button
                  type="button"
                  className="bg-white p-2  opacity-70 hover:opacity-100  font-bold px-5 py-1 text-dark rounded-3xl hover:shadow-md outlined-none "
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover "
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize text-dark ">
          {postedBy.userName}
        </p>
      </Link>
    </div>
  );
};

export default Pin;
