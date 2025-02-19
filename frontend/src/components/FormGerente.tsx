"use client";
import React, { useState } from "react";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import FileInput from "./FileInput";
import Termo from "./Termo";
import NumberInput from "./NumberInput";

// Utility functions for validation
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string) => password.length >= 8;

// Types for state management
type Step11State = {
  nome: string;
  cpf: string;
  telefone: string;
  rg: string;
  unidadeId: number;
  raca: string;
};

export default function FormGerente() {
	const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome: "",
    telefone: "",
    cpf: "",
    rg: "",
    raca: "",
    unidadeId: 0,
  });

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
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleUserCreation = async () => {
    try {
      const response = await fetch("https://atipicidados-1.onrender.com/gerentes/", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleLoginChange = (key: string, value: string) => {
    setLogin((prevState) => {
      const updatedLogin = { ...prevState, [key]: value };
      updateLogin(updatedLogin);
      return updatedLogin;
    });
  };

  const handleInputChange1 = (key: string, value: string) => {
    setStep11((prevState) => {
      const updatedForm = {
        ...prevState,
        [key]: key === "unidadeId" ? parseInt(value, 10) : value,
      };
      updateForm(updatedForm);
      return updatedForm;
    });
  };

  const handleFotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotoFile(e.target.files[0]);
    }
  };

  const handleTermoClick = () => setIsModalVisible(true);

  const closeModal = () => setIsModalVisible(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (login.email !== login.confirmarEmail || login.senha !== login.confirmarSenha) {
      setError("Os campos de e-mail e senha precisam ser iguais.");
      return;
    }

    if (!validateEmail(login.email)) {
      setError("O e-mail inserido não é válido.");
      return;
    }

    if (!validatePassword(login.senha)) {
      setError("A senha precisa ter no mínimo 8 caracteres.");
      return;
    }

    setError(null);
    handleUserCreation();
  };

  // State update helpers
  const updateForm = (data: Partial<Step11State>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const updateLogin = (data: Partial<typeof login>) => {
    setFormData((prevData) => ({
      ...prevData,
      email: data.email || prevData.email,
      password: data.senha || prevData.password,
    }));
  };

  return (
		<>
    <form
			className="hidden md:flex w-full justify-center"
      onSubmit={handleSubmit}
    >
      <section className="flex flex-col gap-10 px-5 w-[600px] lg:w-[840px] place-self-center">
        <h2 className="font-bold">Novo Gerente</h2>

        <div className='flex flex-col gap-[12px]'>
          <h4 className="pl-2 place-self-start mt-10">
            Crie um login e senha para o Gerente
          </h4>
          <div className="flex gap-3">
            <TextInput className="w-1/2" placeholder="E-mail" value={login.email} onChange={(e) => handleLoginChange("email", e.target.value)}/>
            <TextInput className="w-1/2" placeholder="Confirmar e-mail" value={login.confirmarEmail} onChange={(e) => handleLoginChange("confirmarEmail", e.target.value)}/>
          </div>
          <div className="flex gap-3">
            <TextInput className="w-1/2" placeholder="Senha" value={login.senha} onChange={(e) => handleLoginChange("senha", e.target.value)}/>
            <TextInput className="w-1/2" placeholder="Confirmar senha" value={login.confirmarSenha} onChange={(e) => handleLoginChange("confirmarSenha", e.target.value)}/>
          </div>
          {error && <div className="text-[#FF0F00] font-medium">{error}</div>}
        </div>

        <div className='flex flex-col gap-[12px]'>
					<button onClick={() => { console.log(fotoFile) }}>Mostrar Foto</button>
					
					<div className='flex w-full gap-[12px]'>
						<FileInput placeholder="Foto 3x4" className="min-w-[260px]" onChange={handleFotoFileChange} name="fotoFile"/>
          	<NumberInput placeholder="Telefone de contato" value={Step11.telefone} onChange={(e) => handleInputChange1("telefone", e.target.value)}/>
					</div>
          
          <TextInput placeholder="Nome completo" value={Step11.nome} onChange={(e) => handleInputChange1("nome", e.target.value)}/>
					
          <div className='flex w-full gap-[12px]'>
            <TextInput placeholder="CPF" className="w-1/2" value={Step11.cpf} onChange={(e) => handleInputChange1("cpf", e.target.value)}/>
            <TextInput placeholder="RG" className="w-1/2" value={Step11.rg} onChange={(e) => handleInputChange1("rg", e.target.value)}/>
          </div>

          <div className='flex w-full gap-[12px]'>
            <SelectInput
              options={["Amarelo", "Branco", "Indígena", "Preto", "Outra"]}
              placeholder="Raça/cor"
              onChange={(value) => {
								let formattedValue = "";
								switch (value) {
									case "Amarelo":
										formattedValue = "AMARELA";
										break;
									case "Branco":
										formattedValue = "BRANCA";
										break;
									case "Indígena":
										formattedValue = "INDIGENA";
										break;
									case "Preto":
										formattedValue = "NEGRA";
										break;
									case "Outra":
										formattedValue = "OUTRA";
										break;
									default:
										formattedValue = value;
								}
								handleInputChange1("raca", formattedValue);
							}}
            />
            <TextInput placeholder="Unidade Vinculada (Número)" value={Step11.unidadeId.toString()} onChange={(e) => handleInputChange1("unidadeId", e.target.value)}/>
          </div>
        </div>

        <div className="flex items-center ml-[14px]">
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
          Eu aceito o{" "}
          <span
            className="termo pl-[5px] text-blue-600 cursor-pointer"
            onClick={handleTermoClick}
          >
            Termo de Compromisso e Privacidade
          </span>
          <Termo isVisible={isModalVisible} onClose={closeModal} />
        </div>

        <button className="botao" type="submit">
          Enviar
        </button>
      </section>
    </form>

		<form
			id='gerenteMobile'
			className="flex md:hidden w-full justify-center px-5"
      onSubmit={handleSubmit}
    >
			{currentStep === 1 && (
      <section className="flex flex-col gap-10 px-5 place-self-center">
        <h2 className="font-bold">Novo Gerente</h2>

        <div className='flex flex-col gap-[12px]'>
          <h4 className="pl-2 place-self-start mt-10">
            Crie um login e senha para o Gerente
          </h4>
          <div className="flex flex-col w-full gap-3">
            <TextInput placeholder="E-mail" value={login.email} onChange={(e) => handleLoginChange("email", e.target.value)}/>
            <TextInput placeholder="Confirmar e-mail" value={login.confirmarEmail} onChange={(e) => handleLoginChange("confirmarEmail", e.target.value)}/>
          </div>
          <div className="flex flex-col w-full gap-3">
            <TextInput placeholder="Senha" value={login.senha} onChange={(e) => handleLoginChange("senha", e.target.value)}/>
            <TextInput placeholder="Confirmar senha" value={login.confirmarSenha} onChange={(e) => handleLoginChange("confirmarSenha", e.target.value)}/>
          </div>
          {error && <div className="text-[#FF0F00] font-medium">{error}</div>}
        </div>
				<button className='botao' type='submit' onClick={nextStep}>Próximo</button>
			</section>
			)}
			{currentStep === 2 && (
			<section>
        <div className='flex flex-col gap-[12px]'>
					<button onClick={() => { console.log(fotoFile) }}>Mostrar Foto</button>
					
					<div className='flex flex-col w-full gap-[12px]'>
						<FileInput placeholder="Foto 3x4" className="min-w-[260px]" onChange={handleFotoFileChange} name="fotoFile"/>
          	<NumberInput placeholder="Telefone de contato" value={Step11.telefone} onChange={(e) => handleInputChange1("telefone", e.target.value)}/>
					</div>
          
          <TextInput placeholder="Nome completo" value={Step11.nome} onChange={(e) => handleInputChange1("nome", e.target.value)}/>
					
          <div className='flex flex-col w-full gap-[12px]'>
            <TextInput placeholder="CPF" className="min-w-[220px]" value={Step11.cpf} onChange={(e) => handleInputChange1("cpf", e.target.value)}/>
            <TextInput placeholder="RG" className="min-w-[220px]" value={Step11.rg} onChange={(e) => handleInputChange1("rg", e.target.value)}/>
          </div>

          <div className='flex flex-col w-full gap-[12px]'>
            <SelectInput
              options={["Amarelo", "Branco", "Indígena", "Preto", "Outra"]}
              placeholder="Raça/cor"
              onChange={(value) => {
								let formattedValue = "";
								switch (value) {
									case "Amarelo":
										formattedValue = "AMARELA";
										break;
									case "Branco":
										formattedValue = "BRANCA";
										break;
									case "Indígena":
										formattedValue = "INDIGENA";
										break;
									case "Preto":
										formattedValue = "NEGRA";
										break;
									case "Outra":
										formattedValue = "OUTRA";
										break;
									default:
										formattedValue = value;
								}
								handleInputChange1("raca", formattedValue);
							}}
            />
            <TextInput placeholder="Unidade Vinculada (Número)" value={Step11.unidadeId.toString()} onChange={(e) => handleInputChange1("unidadeId", e.target.value)}/>
          </div>
        </div>

        <div className="flex items-center text-[13px] my-8 ml-[14px]">
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
          Eu aceito o{" "}
          <span
            className="termo pl-[5px] text-blue-600 cursor-pointer"
            onClick={handleTermoClick}
          >
            Termo de Compromisso e Privacidade
          </span>
          <Termo isVisible={isModalVisible} onClose={closeModal} />
        </div>
				<div className="flex w-full text-[13px] justify-between">
					<button className='botao' type='submit' onClick={previousStep}>Anterior</button>
					<button className="botao" type="submit">
        	  Enviar
        	</button>
				</div>
        
      </section>
			)}
    </form>
		</>
  );
}
