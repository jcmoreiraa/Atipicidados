import React from "react";

function LogOut(...props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5 1H2a1 1 0 00-1 1v10a1 1 0 001 1h3m-.5-6H13m0 0L9 3m4 4l-4 4"
      ></path>
    </svg>
  );
}

export default LogOut;
