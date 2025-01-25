import * as React from "react"

function SvgComponent({ color = "#ECECEF" }) {
  return (
    <svg
      width={19}
      height={19}
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.825 8.075a4.75 4.75 0 11-9.5 0 4.75 4.75 0 019.5 0zm-1.107 4.987a6.175 6.175 0 111.344-1.344l4.235 4.235a.95.95 0 11-1.344 1.344l-4.235-4.236z"
        fill={color}
        fillOpacity={0.5}
      />
    </svg>
  )
}

export default SvgComponent
