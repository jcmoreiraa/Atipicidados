"use client";
import React, { useState } from "react";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import FileInput from "./FileInput";
import Termo from "./Termo";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";

// Utility functions for validation
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string) => password.length >= 8;

// Types for state management
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

export default function FormColaborador() {
	const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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
    unidadeId: "",
    raca: "",
    rg: "",
    nascimento: "",
    titulo: "",
    formacao: "",
    genero: "",
  });

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

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleUserCreation = async () => {
    try {
      const response = await fetch("https://atipicidados.onrender.com/colaboradores/", {
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

        <div className='flex flex-col gap-[12px]'></div>
					<h4 className='pl-2 place-self-start mt-10'>Crie um login e senha para o Colaborador</h4>
          <div className='flex flex-col md:flex-row w-full gap-3'>
            <TextInput className='md:w-1/2' placeholder='E-mail' value={login.email} onChange={(e) => handleLoginChange("email", e.target.value)} />
            <TextInput className='md:w-1/2' placeholder='Confirmar e-mail' value={login.confirmarEmail} onChange={(e) => handleLoginChange("confirmarEmail", e.target.value)} />
          </div>
          <div className='flex flex-col md:flex-row w-full gap-3'>
            <TextInput className='md:w-1/2' placeholder='Senha' value={login.senha} onChange={(e) => handleLoginChange("senha", e.target.value)} />
            <TextInput className='md:w-1/2' placeholder='Confirmar senha' value={login.confirmarSenha} onChange={(e) => handleLoginChange("confirmarSenha", e.target.value)} />
          </div>
          {error && <div className="text-[#FF0F00] font-medium">{error}</div>}
          <div className='mb-10'></div>

          <div className='flex flex-col gap-[12px]'>
            <button onClick={() => { console.log(fotoFile) }}>Mostrar Foto</button>

            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
              <FileInput placeholder='Foto 3x4' className='min-w-[260px]' onChange={handleFotoFileChange} name='fotoFile' />
              <NumberInput placeholder="Telefone de contato" value={Step11.telefone} onChange={(e) => handleInputChange1("telefone", e.target.value)} />
            </div>

            <TextInput placeholder='Nome completo' value={Step11.nome} onChange={(e) => handleInputChange1("nome", e.target.value)} />

            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
              <TextInput placeholder='CPF' className='min-w-[220px]' value={Step11.cpf} onChange={(e) => handleInputChange1("cpf", e.target.value)} />
              <DateInput value={Step11.nascimento} onChange={(e) => handleInputChange1("nascimento", e.target.value)} />
            </div>

            {/* <div className='flex w-full gap-[12px]'>
              <TextInput placeholder='Nacionalidade' value={Step11.nacionalidade} onChange={(e) => handleInputChange1("nacionalidade", e.target.value)} />
              <TextInput placeholder='Naturalidade' value={Step11.naturalidade} onChange={(e) => handleInputChange1("naturalidade", e.target.value)} />
            </div> */}

            <div className='flex flex-col md:flex-row w-full gap-[12px]'>
              <SelectInput options={["Masculino", "Feminino", "Intersexo", "Outro sexo", "Prefiro não dizer o sexo"]} placeholder={"Sexo"} onChange={(value) => handleInputChange1("sexo", value)} />
              <SelectInput options={["Amarelo", "Branco", "Indígena", "Pardo", "Preto"]} placeholder={"Raça/cor"} onChange={(value) => handleInputChange1("raca", value)} />
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
			id='colaboradorMobile'
			className="flex md:hidden w-full justify-center px-5"
      onSubmit={handleSubmit}
    >
			{currentStep === 1 && (
      <section className="flex flex-col gap-10 place-self-center">
        <h2 className="font-bold">Novo Colaborador</h2>

        <div className='flex flex-col gap-[12px]'>
					<h4 className='pl-2 place-self-start mt-10'>Crie um login e senha para o Colaborador</h4>
          <div className='flex flex-col w-full gap-3'>
            <TextInput className='md:w-1/2' placeholder='E-mail' value={login.email} onChange={(e) => handleLoginChange("email", e.target.value)} />
            <TextInput className='md:w-1/2' placeholder='Confirmar e-mail' value={login.confirmarEmail} onChange={(e) => handleLoginChange("confirmarEmail", e.target.value)} />
          </div>
          <div className='flex flex-col w-full gap-3'>
            <TextInput className='md:w-1/2' placeholder='Senha' value={login.senha} onChange={(e) => handleLoginChange("senha", e.target.value)} />
            <TextInput className='md:w-1/2' placeholder='Confirmar senha' value={login.confirmarSenha} onChange={(e) => handleLoginChange("confirmarSenha", e.target.value)} />
          </div>
          {error && <div className="text-[#FF0F00] font-medium">{error}</div>}
        </div>
				<button className='botao text-[13px]' type='submit' onClick={nextStep}>Próximo</button>

			</section>
			)}
			{currentStep === 2 && (	
				<section>
          <div className='flex flex-col gap-[12px]'>
            <button onClick={() => { console.log(fotoFile) }}>Mostrar Foto</button>

            <div className='flex flex-col w-full gap-[12px]'>
              <FileInput placeholder='Foto 3x4' className='min-w-[280px]' onChange={handleFotoFileChange} name='fotoFile' />
              <NumberInput placeholder="Telefone de contato" value={Step11.telefone} onChange={(e) => handleInputChange1("telefone", e.target.value)} />
            </div>

            <TextInput placeholder='Nome completo' value={Step11.nome} onChange={(e) => handleInputChange1("nome", e.target.value)} />

            <div className='flex flex-col mt-8 w-full gap-[12px]'>
              <TextInput placeholder='CPF' className='w-full' value={Step11.cpf} onChange={(e) => handleInputChange1("cpf", e.target.value)} />
              <DateInput value={Step11.nascimento} onChange={(e) => handleInputChange1("nascimento", e.target.value)} />
            </div>

            {/* <div className='flex w-full gap-[12px]'>
              <TextInput placeholder='Nacionalidade' value={Step11.nacionalidade} onChange={(e) => handleInputChange1("nacionalidade", e.target.value)} />
              <TextInput placeholder='Naturalidade' value={Step11.naturalidade} onChange={(e) => handleInputChange1("naturalidade", e.target.value)} />
            </div> */}

            <div className='flex flex-col w-full gap-[12px]'>
              <SelectInput options={["Masculino", "Feminino", "Intersexo", "Outro sexo", "Prefiro não dizer o sexo"]} placeholder={"Sexo"} onChange={(value) => handleInputChange1("sexo", value)} />
              <SelectInput options={["Amarelo", "Branco", "Indígena", "Pardo", "Preto"]} placeholder={"Raça/cor"} onChange={(value) => handleInputChange1("raca", value)} />
            </div>
					</div>
					<div className="flex w-full text-[13px] my-8 justify-between">
						<button className='botao' type='submit' onClick={previousStep}>Anterior</button>
						<button className="botao" type="submit" onClick={nextStep}>
        		  Próximo
        		</button>
					</div>
				</section>
				)}

				{currentStep === 3 && (   
					<section>
            <div className='flex flex-col w-full gap-[12px]'>
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
              <div className='flex flex-col w-full gap-[12px]'>
                <TextInput placeholder='Título' value={Step11.titulo} onChange={(e) => handleInputChange1("titulo", e.target.value)} />
                <TextInput placeholder='Unidade Vinculada(Número)' value={Step11.unidadeId} onChange={(e) => handleInputChange1("unidadeId", e.target.value)} />
              </div>
            </div>

        <div className="flex text-[13px] items-center my-8 ml-[14px]">
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
