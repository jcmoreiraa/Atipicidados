import React, { useState, useRef, useEffect } from 'react';
import { StepProps } from './types';
import SelectInput from '../SelectInput';
import TextInput from '../TextInput';
import FileInput from '../FileInput';
import DateInput from '../DateInput';
import Termo from '../Termo';
import NumberInput from '../NumberInput';
import { type } from 'os';

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};

type Step11State = {
  nome: string;
  cpf: string;
  telefone: string;
  rg: string;
  unidadeId: number;
  raca: string;
  nascimento: string;
  genero: string
};

const Step1: React.FC<{
  handleFormDataSubmit: () => void;
  updateLogin: (data: any) => void;
  updateForm: (data: any) => void;
}> = ({ handleFormDataSubmit, updateLogin, updateForm }) => {

  const [login, setLogin] = useState({
    email: "",
    confirmarEmail: "",
    senha: "",
    confirmarSenha: "",
  });

  const [Step11, setStep11] = useState<Step11State>({
    nome: "",
    cpf: "",
    telefone: "",
    rg: "",
    unidadeId: 0,
    raca: "",
    nascimento: "",
    genero: "",

  });

  const errorRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  console.log(typeof (Step11.unidadeId))
  const [isCpfMissing, setIsCpfMissing] = useState(false);
  const [isEmailMissing, setIsEmailMissing] = useState(false);
  const [isSenhaMissing, setIsSenhaMissing] = useState(false);

  const handleLoginChange: any = (key: string, value: string) => {
    setLogin((prevState) => {
      const updatedLogin = {
        ...prevState,
        [key]: value,
      };
      updateLogin(updatedLogin);
      return updatedLogin;
    });
  };

  const handleInputChange1 = (key: string, value: string) => {
    if (key === "nascimento") {
      setStep11((prevState) => {
        const updatedForm = {
          ...prevState,
          [key]: value.concat("T00:00:00.000Z"),
        };
        updateForm(updatedForm);
        return updatedForm;
      });
    }
    setStep11((prevState) => {
      const updatedForm = {
        ...prevState,
        [key]: value,
      };
      updateForm(updatedForm);
      return updatedForm;
    });
  };


  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoFile(e.target.files[0]);
      updateForm({ fotofile: e.target.files[0] });
    }
  };


  const handleTermoClick = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    setError(null);
    setIsCpfMissing(false);
    setIsEmailMissing(false);
    setIsSenhaMissing(false);

    if (!Step11.cpf || !login.email || !login.senha) {
      setIsCpfMissing(!Step11.cpf);
      setIsEmailMissing(!login.email);
      setIsSenhaMissing(!login.senha);
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (login.email !== login.confirmarEmail) {
      setError("Os campos de e-mail precisam ser iguais.");
      setIsEmailMissing(true);
      return;
    }
    if (login.senha !== login.confirmarSenha) {
      setError("Os campos de senha precisam ser iguais.");
      setIsSenhaMissing(true);
      return;
    }
    if (!validateEmail(login.email)) {
      setError("O e-mail inserido não é válido.");
      setIsEmailMissing(true);
      return;
    }
    if (!validatePassword(login.senha)) {
      setError("A senha precisa ter no mínimo 8 caracteres.");
      setIsSenhaMissing(true);
      return;
    }

    handleFormDataSubmit();

  };

  return (
    <div className='flex flex-col gap-[162px]'>
      <div className='flex flex-col gap-[42px] px-5 md:w-[600px] lg:w-[840px] place-self-center'>
        <div className='flex flex-col gap-[12px]'>
          <h2 className='font-bold'>Novo Gerente</h2>
          {error && <div ref={errorRef} className="text-[#FFF] font-medium text-center mt-4 bg-[#e13c31] py-3 rounded-xl">{error}</div>}
          <h4 className='pl-2 place-self-start mt-10'>Crie um login e senha para o Gerente</h4>
          <div className='flex flex-col md:flex-row w-full gap-3'>
            <TextInput className='w-[400px] cursor-pointer' placeholder='E-mail' value={login.email} onChange={(e) => handleLoginChange("email", e.target.value)} />
            <TextInput className='w-[400px] cursor-pointer' placeholder='Confirmar e-mail' value={login.confirmarEmail} onChange={(e) => handleLoginChange("confirmarEmail", e.target.value)} />
          </div>
          <div className='flex flex-col md:flex-row w-full gap-3'>
            <TextInput className='md:w-1/2' placeholder='Senha' value={login.senha} onChange={(e) => handleLoginChange("senha", e.target.value)} />
            <TextInput className='md:w-1/2' placeholder='Confirmar senha' value={login.confirmarSenha} onChange={(e) => handleLoginChange("confirmarSenha", e.target.value)} />
          </div>
          <div className='mb-10'></div>

          <div className='flex flex-col gap-[12px]'>
            {/* <button onClick={() => { console.log(fotoFile) }}>Mostrar Foto</button> */}

            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
              <FileInput placeholder='Foto 3x4' onChange={handleFotoFileChange} name='fotofile' id='fotoFile' />
              <NumberInput placeholder="Telefone de contato" value={Step11.telefone} onChange={(e) => handleInputChange1("telefone", e.target.value)} />
            </div>

            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
              <TextInput placeholder='Nome completo' value={Step11.nome} onChange={(e) => handleInputChange1("nome", e.target.value)} />
              <SelectInput
                options={["Masculino", "Feminino", "Prefiro não dizer o sexo"]}
                placeholder={"Sexo"}
                onChange={(value) => {
                  let formattedValue = "";
                  switch (value) {
                    case "Masculino":
                      formattedValue = "masculino";
                      break;
                    case "Feminino":
                      formattedValue = "feminino";
                      break;
                    case "Prefiro não dizer o sexo":
                      formattedValue = "prefiro_nao_informar";
                      break;
                    default:
                      formattedValue = value;
                  }
                  handleInputChange1("genero", formattedValue)
                }} />
            </div>


            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
              <TextInput type="cpf" placeholder='CPF' className='md:w-1/3' value={Step11.cpf} onChange={(e) => handleInputChange1("cpf", e.target.value)} />
              <TextInput type="rg" placeholder='RG' className='md:w-1/3' value={Step11.rg} onChange={(e) => handleInputChange1("rg", e.target.value)} />
              <DateInput value={Step11.nascimento} className='md:w-1/3' onChange={(e) => handleInputChange1("nascimento", e.target.value)} />
            </div>
            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
              <SelectInput
                options={["Amarelo", "Branco", "Indígena", "Preto", "Outra"]}
                placeholder={"Raça/cor"}
                onChange={(value) => {
                  let formattedValue = "";
                  switch (value) {
                    case "Amarelo":
                      formattedValue = "amarela";
                      break;
                    case "Branco":
                      formattedValue = "branca";
                      break;
                    case "Indígena":
                      formattedValue = "indigena";
                      break;
                    case "Preto":
                      formattedValue = "negra";
                      break;
                    case "Outra":
                      formattedValue = "outra";
                      break;
                    default:
                      formattedValue = value;
                  }
                  handleInputChange1("raca", formattedValue);
                }} />
              <TextInput placeholder='Unidade Vinculada (Número)' value={(Step11.unidadeId)} onChange={(e) => handleInputChange1("unidadeId", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex items-center text-[13px] md:text-[16px] ml-[14px]">
          <input
            type="checkbox"
            className="
              relative w-4 h-4 appearance-none bg-white/[0.4] border-[1px] focus:outline-none rounded-[4px] mr-2
              checked:bg-blue-800 checked:border-none
              hover:ring hover:ring-offset-indigo-400 hover:cursor-pointer
              after:content-[''] after:w-full after:h-full after:absolute after:left-0 after:top-0 after:bg-no-repeat after:bg-center after:bg-[length:16px] 
              checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA4TDcuMjUgMTEuNzVMMTEuNzUgMy43NSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjc1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4K')]
          "
          //checked={rememberMe}
          //onChange={(e) => setRememberMe(e.target.checked)}
          />

          Eu aceito o <div className='termo pl-[5px]' onClick={handleTermoClick}>Termo de Compromisso e Privacidade</div>
          <Termo isVisible={isModalVisible} onClose={closeModal} />
        </div>
      </div>

      {/* Rodapé */}
      <div className='relative flex flex-row justify-between items-center mx-[147px]'>
        <button></button>

        <button className='botao' type='submit' onClick={handleSubmit}>Enviar</button>
      </div>
    </div>
  );
};

export default Step1;
