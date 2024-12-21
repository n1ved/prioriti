import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // Cleanup timer
  }, []);

  const formatTime = () => {
    const hours = is24Hour ? time.getHours() : time.getHours() % 12 || 12;
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");
    const amPm = is24Hour ? "" : time.getHours() >= 12 ? "PM" : "AM";

    return `${hours}:${minutes}:${seconds} ${amPm}`;
  };

  return (
    <div className="flex items-center justify-center h-fit bg-white p-6 ">
      <div className="p-6 bg-white rounded-xl font-extrabold text-center w-full">
        <h1 className="text-4xl font-bold text-gray-800">{formatTime()}</h1>
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="mt-4 px-4  py-2 bg-black  text-white rounded-lg shadow hover:bg-blue-600"
        >
          Toggle {is24Hour ? "12-hour" : "24-hour"} Format
        </button>
      </div>
    </div>
  );
};

export default DigitalClock;
