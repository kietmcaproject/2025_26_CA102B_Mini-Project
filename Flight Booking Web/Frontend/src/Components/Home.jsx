import React from "react";
import video from "../assets/Video.mp4";
import image from "../assets/TakeOff.png";

function Home() {
  return (
    <div className="flex flex-col text-center pt-5 px-4 md:px-10 lg:px-20 relative">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5">
        Create Ever-lasting Memories With Us
      </h1>

      <div className="relative flex w-full my-3 justify-center items-center">
        <div className="w-full sm:w-4/5 md:w-3/5 aspect-w-16 aspect-h-9">
          <video
            src={video}
            autoPlay
            muted
            loop
            className="rounded-full w-full h-full object-cover"
          ></video>
        </div>

        <img
          src={image}
          alt="Airplane taking off"
          className="absolute top-1/2 transform -translate-y-1/2 w-[70%] sm:w-[60%] lg:w-[50%]"
        />
      </div>
    </div>
  );
}

export default Home;
