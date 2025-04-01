import React, { useEffect, useRef, useState } from 'react';
import { StepProps } from './types';
import SelectInput from '../SelectInput';
import TextInput from '../TextInput';
import FileInput from '../FileInput';
import DateInput from '../DateInput';
import Termo from '../Termo';
import NumberInput from '../NumberInput';

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};

type Step11State = {
  nome: string;
  nascimento: string;
  cpf: string;
  rg: string;
  telefone: string;
  // nacionalidade: string;
  // naturalidade: string;

  // sexo: string;
  genero: string;
  raca: string;

  // cep: string;
  // endereco: string;
  // cidade: string;
  unidadeId: string;

  titulo: string;
  formacao: string;
};

const Step1: React.FC<{
  updateForm: (data: any) => void;
  updateLogin: (data: any) => void;
  handleFormDataSubmit: () => void
}> = ({ handleFormDataSubmit, updateForm, updateLogin }) => {

  const [login, setLogin] = useState({
    email: "",
    confirmarEmail: "",
    senha: "",
    confirmarSenha: "",
  });

  const [Step11, setStep11] = useState<Step11State>({
    nome: "",
    nascimento: "",
    cpf: "",
    rg: "",
    telefone: "",
    // nacionalidade: "",
    // naturalidade: "",

    // sexo: "",
    genero: "",
    raca: "",

    // cep: "",
    // endereco: "",
    // cidade: "",
    unidadeId: "",

    titulo: "",
    formacao: "",
  });

  const errorRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
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
    <div className='flex flex-col gap-[162px] w-screen'>
      <div className='flex flex-col gap-[42px] px-5 md:w-[600px] lg:w-[840px] place-self-center'>
        <div className='flex flex-col gap-[12px]'>
          {error && <div ref={errorRef} className="text-[#FFF] font-medium text-center mt-4 bg-[#e13c31] py-3 rounded-xl">{error}</div>}
          <h4 className='pl-2 place-self-start mt-10'>Crie um login e senha para o Colaborador</h4>
          <div className='flex flex-col md:flex-row w-full gap-3'>
            <TextInput error={isEmailMissing} className='md:w-1/2' placeholder='E-mail' value={login.email} onChange={(e) => handleLoginChange("email", e.target.value)} />
            <TextInput error={isEmailMissing} className='md:w-1/2' placeholder='Confirmar e-mail' value={login.confirmarEmail} onChange={(e) => handleLoginChange("confirmarEmail", e.target.value)} />
          </div>
          <div className='flex flex-col md:flex-row w-full gap-3'>
            <TextInput error={isSenhaMissing} className='md:w-1/2' placeholder='Senha' value={login.senha} onChange={(e) => handleLoginChange("senha", e.target.value)} />
            <TextInput error={isSenhaMissing} className='md:w-1/2' placeholder='Confirmar senha' value={login.confirmarSenha} onChange={(e) => handleLoginChange("confirmarSenha", e.target.value)} />
          </div>
          <div className='mb-10'></div>

          <div className='flex flex-col gap-[12px]'>
            {/* <button onClick={() => { console.log(fotoFile) }}>Mostrar Foto</button> */}

            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
              <FileInput placeholder='Foto 3x4' onChange={handleFotoFileChange} name='fotoFile' />
              <NumberInput placeholder="Telefone de contato" value={Step11.telefone} onChange={(e) => handleInputChange1("telefone", e.target.value)} />
            </div>

            <TextInput placeholder='Nome completo' value={Step11.nome} onChange={(e) => handleInputChange1("nome", e.target.value)} />

            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
              <TextInput type="cpf" error={isCpfMissing} placeholder='CPF' value={Step11.cpf} onChange={(e) => handleInputChange1("cpf", e.target.value)} />
              <TextInput type="rg" placeholder='RG' value={Step11.rg} onChange={(e) => handleInputChange1("rg", e.target.value)} />
              <DateInput value={Step11.nascimento} onChange={(e) => handleInputChange1("nascimento", e.target.value)} />
            </div>

            {/* <div className='flex w-full gap-[12px]'>
              <TextInput placeholder='Nacionalidade' value={Step11.nacionalidade} onChange={(e) => handleInputChange1("nacionalidade", e.target.value)} />
              <TextInput placeholder='Naturalidade' value={Step11.naturalidade} onChange={(e) => handleInputChange1("naturalidade", e.target.value)} />
            </div> */}

            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
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
              <SelectInput
                options={["Amarelo", "Branco", "Indígena", "Preto", "Outra"]}
                placeholder={"Raça/cor"}
                onChange={(value) => {
                  let formattedValue = "";
                  switch (value) {
                    case "Amarelo":
                      formattedValue = "AMARELA";
                      formattedValue = "amarela";
                      break;
                    case "Branco":
                      formattedValue = "BRANCA";
                      formattedValue = "branca";
                      break;
                    case "Indígena":
                      formattedValue = "INDIGENA";
                      formattedValue = "indigena";
                      break;
                    case "Preto":
                      formattedValue = "NEGRA";
                      formattedValue = "negra";
                      break;
                    case "Outra":
                      formattedValue = "OUTRA";
                      formattedValue = "outra";
                      break;
                    default:
                      formattedValue = value;
                  }
                  handleInputChange1("raca", formattedValue);
                }} />
            </div>

            <div className='mb-4'></div>

            <div className='flex w-full gap-[12px]'>
              {/* <TextInput placeholder='CEP' className='min-w-[220px]' value={Step11.cep} onChange={(e) => handleInputChange1("cep", e.target.value)} /> */}
              {/* <SelectInput options={["Salvador", "Lauro de Freitas", "Camaçari", "Catu"]} placeholder={"Cidade"} onChange={(value) => handleInputChange1("cidade", value)} /> */}
            </div>

            {/* <TextInput placeholder="Endereço" value={Step11.endereco} onChange={(e) => handleInputChange1("endereco", e.target.value)} /> */}

            <div className='mb-4'></div>

            <div className='flex flex-col lg:flex-row w-full gap-[12px]'>
              <SelectInput
                placeholder={"Formação"}
                options={[
                  "Ensino fundamental incompleto",
                  "Ensino fundamental completo",
                  "Ensino médio completo",
                  "Técnico/profissionalizante",
                  "Cursando ensino superior",
                  "Ensino superior completo"
                ]}
                onChange={(value) => handleInputChange1("formacao", value)}
              />
              <div className='flex flex-col md:flex-row w-full gap-[12px]'>
                <TextInput placeholder='Título' value={Step11.titulo} onChange={(e) => handleInputChange1("titulo", e.target.value)} />
                <TextInput placeholder='Unidade Vinculada(Número)' value={Step11.unidadeId} onChange={(e) => handleInputChange1("unidadeId", e.target.value)} />
              </div>


            </div>
          </div>
          {/* <button onClick={reveal}>reveal</button> */}
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
