import { JSX, ClassAttributes, useState, useRef, useEffect } from "react";
import { CSSTransition } from 'react-transition-group';

interface SelectInputProps extends JSX.IntrinsicAttributes, ClassAttributes<HTMLDivElement> {
  value?: string;
  placeholder: string;
  onChange?: (selectedOption: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function SelectInput({ placeholder, onChange, className, style, ...props }: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    IBGEapi();
  }, [])

  const IBGEapi = async () => {
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/ba/distritos`);
      if (!response.ok) {
        throw new Error('Fetch falhou');
      }

      const data = await response.json();
      setOptions(cidadesSort(options));
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
    }
  }

  const cidadesSort = (options: any[]) => {
    let cidades: any[] = [];
    options.forEach(element => {
      if (element.municipio) {
        cidades.push(element.municipio.nome);
      }
    });
    cidades = cidades.filter((item, index) => cidades.indexOf(item) === index);
    cidades.sort();
    return cidades;
  };

  return (
    <div className={`relative inline-block text-left w-full ${className}`} style={style} ref={ref} {...props}>
      <div className={`${isOpen ? 'opacity-60' : 'opacity-100'}`}>
        <button
          type="button"
          className="py-[11px] leading-[19px] text-sm px-3 bg-[#7481F6] bg-opacity-40 rounded-xl focus:outline-none focus:bg-[#ABB1DC] flex items-center justify-between w-full"
          onClick={toggleOpen}
        >
          {props.value || selectedOption || `${placeholder}...`}
          <svg
            className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 5L7 11L13 5" stroke="#0B0C0E" strokeOpacity="0.8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="menu"
        unmountOnExit
      >
        <div className="absolute -mt-9 min-w-[250px] right-1 rounded-[9px] drop-shadow-menu bg-[#ECECEF] ring-1 ring-black ring-opacity-0 overflow-hidden z-40">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option, index) => (
              <div key={index}>
                {index !== 0 &&
                  <div className='w-full'>
                    <hr className='border-[#656565] border-opacity-20' />
                  </div>
                }
                <button
                  className="block w-full text-left px-3.5 py-[8px] text-sm hover:bg-black/[0.07] focus:outline-none focus:bg-black/[0.07]"
                  onClick={() => handleOptionClick(option.nome)}
                >
                  {option.nome}
                </button>
              </div>
            ))}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}
