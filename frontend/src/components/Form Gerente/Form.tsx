"use client";
import React, { useEffect, useState } from 'react';
import Step1 from './Step1';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string | null,
  password: string | null,
  fotofile: string | null,
  nome: string | null,
  telefone: string | null,
  cpf: string | null,
  rg: string | null,
  raca: string | null,
  nascimento: string | null,
  genero: string | null,
  unidadeId: string | 0,
}

const Form: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: null,
    password: null,
    fotofile: null,
    nome: null,
    telefone: null,
    cpf: null,
    rg: null,
    raca: null,
    nascimento: null,
    genero: null,
    unidadeId: 0,
  });

  const updateForm = (data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data
    }));
  };

  const updateLogin = (data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      'email': data.email,
      'password': data.senha
    }));
  };

  const handleUserCreation = async () => {
    const data = new FormData();
    if (formData.nome) {
      data.append('nome', formData.nome)
    }
    if (formData.cpf) {
      data.append('cpf', formData.cpf)
    }
    if (formData.rg) {
      data.append('rg', formData.rg)
    }
    if (formData.email) {
      data.append('email', formData.email)
    }
    if (formData.fotofile) {
      data.append('fotofile', formData.fotofile)
    }
    if (formData.nascimento) {
      data.append('nascimento', formData.nascimento.concat("T00:00:00.000Z"))
    }
    if (formData.password) {
      data.append('password', formData.password)
    }
    if (formData.raca) {
      data.append('raca', formData.raca)
    }
    if (formData.telefone) {
      data.append('telefone', formData.telefone)
    }
    if (formData.genero) {
      data.append('genero', formData.genero)
    }
    try {
      const response = await fetch("https://atipicidados.onrender.com/gerentes/", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      console.log(result);
      router.push("/");
    } catch (error) {
      console.error("Erro ao criar gerente:", error);
    }
  };

  switch (currentStep) {
    case 1:
      return (
        <>
          {/* <button onClick={() => { console.log(formData) }}>Mostrar formData</button> */}
          <Step1
            handleFormDataSubmit={handleUserCreation}
            updateLogin={(data) => updateLogin(data)}
            updateForm={(data) => updateForm(data)}
          />
        </>
      );
    default:
      return null;
  }
};

export default Form;
