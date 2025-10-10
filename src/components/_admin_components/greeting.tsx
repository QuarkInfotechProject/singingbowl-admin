"use client"
import React, { useEffect, useState } from 'react';
import { IoIosPartlySunny } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import { BsFillMoonStarsFill } from "react-icons/bs";



const GreetingComponent = () => {
  const [greeting, setGreeting] = useState('');
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    const currentHour = new Date().getHours();

    let greet;
    let iconComponent;
    if (currentHour < 12) {
        greet = 'Good Morning';
        iconComponent = <IoIosPartlySunny className="text-gray-900 text-2xl" />;
      } else if (currentHour >= 12 && currentHour <= 17) {
        greet = 'Good Afternoon';
        iconComponent = <IoSunny  className="text-gray-900 text-2xl"  />;
      } else if (currentHour >= 17 && currentHour <= 24) {
        greet = 'Good Evening';
        iconComponent = < BsFillMoonStarsFill className="text-gray-900 text-2xl" />;
      }

    setGreeting(greet);
    setIcon(iconComponent);
  }, []);

  return (
    <div className="flex items-center ">
      <div className=''>{icon}</div>
      <b className="ml-2 ">{greeting}</b>
      
    </div>
  );
};

export default GreetingComponent;