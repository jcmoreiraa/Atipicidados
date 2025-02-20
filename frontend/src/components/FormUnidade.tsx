"use client";
import React, { useState } from "react";
import TextInput from "./TextInput";
import Termo from "./Termo";

type Step11State = {
  nome: string;
  endereco: string;
};

export default function FormGerente() {
  // States
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
  });

  const [Step11, setStep11] = useState<Step11State>({
    nome: "",
    endereco: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleUnityCreation = async () => {
    try {
      const response = await fetch("https://atipicidados.onrender.com/unidades/", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Erro ao criar unidade:", error);
    }
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

  const handleTermoClick = () => setIsModalVisible(true);

  const closeModal = () => setIsModalVisible(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    handleUnityCreation();
  };

  // State update helpers
  const updateForm = (data: Partial<Step11State>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  return (
		<>
    <form
			className="hidden md:flex w-full justify-center"
      onSubmit={handleSubmit}
    >
      <section className="flex flex-col gap-10 px-5 w-[600px] lg:w-[840px] place-self-center">
        <h2 className="font-bold">Nova Unidade</h2>

        <div className='flex flex-col gap-[12px]'>
          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <TextInput placeholder='Nome da unidade' value={Step11.nome} onChange={(e) => handleInputChange1("nome", e.target.value)} />
            <TextInput placeholder='Endereço' value={Step11.endereco} onChange={(e) => handleInputChange1("endereco", e.target.value)} />
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
		</>
  );
}
