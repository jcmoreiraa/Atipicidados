import { useEffect, useRef, useState } from "react";
import { CSSTransition } from 'react-transition-group';

interface CheckInputProps {
  value?: string[];
  options: string[];
  title: string;
  onChange: (list: string[]) => void;
}

export default function CheckInput({ value, options, title, onChange, ...props }: CheckInputProps) {
  const [broughtOptions, setBroughtOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [localOptions, setLocalOptions] = useState<string[]>(options);
  const ref = useRef<HTMLDivElement>(null);

  const [isInitialRender, setIsInitialRender] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (item: string) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(item)
        ? prevSelectedOptions.filter((option) => option !== item)
        : [...prevSelectedOptions, item]
    );
  };

  // const handleCheckboxChange = (item: string) => {
  //   setSelectedOptions((prevSelectedOptions) => {
  //     // If `broughtOptions` is not empty and the item is not yet in `selectedOptions`
  //     if (broughtOptions.length > 0) {
  //       const combinedOptions = new Set([...prevSelectedOptions, ...broughtOptions]); // Add `broughtOptions` to `selectedOptions`
  //       combinedOptions.add(item); // Include the newly checked item
  //       setBroughtOptions([]); // Clear `broughtOptions` to avoid adding it again
  //       return Array.from(combinedOptions); // Return updated options without duplicates
  //     }
  //     // Normal toggle logic for the item
  //     return prevSelectedOptions.includes(item)
  //       ? prevSelectedOptions.filter((option) => option !== item) // Remove item if already selected
  //       : [...prevSelectedOptions, item]; // Add item if not selected
  //   });
  // };  

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (ref.current && !ref.current.contains(event.target as Node)) {
  //     setIsOpen(false);
  //   }
  // };

  const handleAddOption = () => {
    if (inputValue.trim() !== '' && !localOptions.includes(inputValue)) {
      const updatedOptions = [...localOptions, inputValue];
      setLocalOptions(updatedOptions);
      setInputValue('');
      toggleOpen();
    }
  };

  useEffect(() => {
    if (isInitialRender && value) {
      setIsInitialRender(false);
      setBroughtOptions(value);
    }
  }, []);

  useEffect(() => {
    if (onChange) {
      const combinedOptions = selectedOptions.concat(broughtOptions);
      onChange(combinedOptions);
    }
  }, [selectedOptions]);

  return (
    <div className="relative inline-block" {...props}>
      <div className="bg-indigo-400/[0.4] flex flex-col px-4 py-3 rounded-xl gap-1">
        <label htmlFor="" className="text-base font-semibold">{title}</label>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-3.5 justify-normal">
            {localOptions.map((item, index) => (
              <div key={index} className="flex flex-row gap-1.5 items-center">
                <input
                  type="checkbox"
                  name={item}
                  id={item}

                  className="
                    relative w-4 h-4 appearance-none bg-white/[0.4] border-[1px] focus:outline-none border-white/[0.2] rounded-[4px]
                    checked:bg-blue-800 checked:border-none
                    hover:ring hover:ring-offset-indigo-400 hover:cursor-pointer
                    after:content-[''] after:w-full after:h-full after:absolute after:left-0 after:top-0 after:bg-no-repeat after:bg-center after:bg-[length:16px] 
                    checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA4TDcuMjUgMTEuNzVMMTEuNzUgMy43NSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjc1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4K')]
                "
                  onChange={() => handleCheckboxChange(item)}
                  checked={value ? broughtOptions.concat(selectedOptions).includes(item) : undefined}
                />
                <label htmlFor={item} className="tracking-tight">{item}</label>
              </div>
            ))}
          </div>
          {/* <button onClick={() => { console.log(selectedOptions) }}>Mostrar localOptions</button> */}
          <button className="font-semibold tracking-tight text-blue-800" onClick={toggleOpen}>
            Outros...
          </button>
        </div>
      </div>
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="menu"
        unmountOnExit
      >
        <div className="absolute -mt-9 w-[300px] right-1 rounded-2xl drop-shadow-menu bg-[#ECECEF] ring-1 ring-black ring-opacity-0 overflow-hidden z-40" ref={ref}>
          <div className="p-2 pb-0">
            <input
              type="text"
              className="box-border w-full px-3 py-[8px] text-sm bg-blue-800/[.15] font-medium focus:outline-none rounded-lg"
              placeholder="Adicionar opção"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="w-full flex gap-2 justify-end p-2">
            <button
              className="block w-min text-right px-2 py-1.5 text-sm bg-blue-800/[0.2] hover:bg-blue-800/[0.3] rounded-lg focus:outline-none focus:bg-black/[0.07] font-medium "
              onClick={toggleOpen}
            >
              Cancelar
            </button>
            <button
              className="block w-min text-right px-2 py-1.5 text-sm text-white bg-blue-800 hover:bg-blue-800/[0.6] rounded-lg focus:outline-none focus:bg-black/[0.06] font-medium "
              onClick={handleAddOption}
            >
              Confirmar
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}
