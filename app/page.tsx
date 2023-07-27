
"use client"
import React, { useState } from "react";
import Board from '@/components/Board'
import Header from '@/components/Header'
import SideBar from '@/components/SideBar'
import {  XMarkIcon, SpeakerXMarkIcon} from "@heroicons/react/20/solid"; ; // Replace with the actual icons you want to use

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };


  return (
<>
    <Header />
    <div className="flex">
    <button
      className="fixed bottom-4 right-4 bg-white rounded-full p-2 shadow-md text-gray-500"
      onClick={toggleSidebar}
      >
      {sidebarVisible ? (
        < XMarkIcon className="h-6 w-6" />
        ) : (
          <SpeakerXMarkIcon className="h-6 w-6" />
          )}
    </button>
  {/* Automatically hide the sidebar on smaller screens using media queries */}
  <div className="hidden md:flex">
    <SideBar />
  </div>
  <div className="board-container relative w-full md:col-start-2">
    <Board />
  
  </div>
</div>
          </>
);
  
}