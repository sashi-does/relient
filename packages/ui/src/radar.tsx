import React from 'react';

const Radar: React.FC = () => {
  return (
    <div
      className="w-screen h-screen bg-black absolute top-0 left-0 -z-10"
    >
      <span className="block absolute -translate-x-1/2 -translate-y-1/2 origin-center rounded-full left-1/2 top-1/2">
        <span className="block relative rounded-full">
          <span
            className="block absolute w-[11px] h-[11px] border-[5px] border-green-500 bg-transparent z-[1] opacity-20 animate-dot1 rounded-full -translate-x-1/2 -translate-y-1/2 origin-center"
          ></span>
          <span
            className="block absolute w-[11px] h-[11px] bg-green-500 z-[2] animate-dot2 rounded-full -translate-x-1/2 -translate-y-1/2 origin-center"
          ></span>
          <span
            className="block absolute w-[11px] h-[11px] bg-green-500 z-[3] animate-dot3 rounded-full -translate-x-1/2 -translate-y-1/2 origin-center"
          ></span>
        </span>
      </span>
    </div>
  );
};

export default Radar;