import * as React from "react"

function SvgComponent(...props: any) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2.75a.75.75 0 01.75.75v13a.75.75 0 01-1.5 0v-13a.75.75 0 01.75-.75z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.75 10a.75.75 0 01.75-.75h13a.75.75 0 010 1.5h-13a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  )
}

export default SvgComponent
