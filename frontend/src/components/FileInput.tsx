import { useEffect, useRef, useState } from 'react';
import { JSX, ClassAttributes, InputHTMLAttributes } from "react";
import { FileIcon } from '../../public/icons/Icons';

interface FileInputProps extends JSX.IntrinsicAttributes, ClassAttributes<HTMLDivElement>, InputHTMLAttributes<HTMLDivElement> {
  value: string;
  placeholder: string;
  id: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileInput(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>) {

  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const displayValue =
    props.value && typeof props.value === "string"
      ? props.value.replace(/^uploads\//, "")
      : fileName || props.placeholder;

  return (
    <div className="relative inline-block text-left w-full" {...props}>
      <label
        htmlFor={props.id}
        className='py-[11px] h-[41px] leading-[19px] px-3 bg-[#F01414]/[0.3] bg-opacity-40 rounded-xl focus:outline-none focus:border-[#7481F6] bg-indigo-400 flex items-center justify-end w-full relative'
      >
        <span className='text-sm left-3 w-[85%] absolute truncate pointer-events-none'>
          {displayValue}
        </span>
        <div className=''>
          <FileIcon />
        </div>
      </label>
      <input
        type="file"
        // value={props.value}
        className="absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0"
        id={props.id}
        name={props.name}
        onChange={handleFileChange}
      />
    </div>
  );
}
