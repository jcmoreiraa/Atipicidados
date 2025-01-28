"use client";
import React, { useEffect, useState } from 'react';
import Step1 from './Step1';
import { useRouter } from 'next/navigation';

const Form: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: null,
    password: null,

    fotofile: null,
    nome: null,
    cpf: null,
    rg: null,
    nascimento: null,
    telefone: null,
    titulo: null,
    formacao: null,
    genero: null,
    raca: null,
    unidadeId: null,
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
      'password': data.senha,
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
      data.append('nascimento', formData.nascimento)
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
    if (formData.titulo) {
      data.append('titulo', formData.titulo)
    }
    if (formData.formacao) {
      data.append('formacao', formData.formacao)
    }

    try {
      const response = await fetch("http://localhost:3002/colaboradores/", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      console.log(result);

      router.push("/")
    } catch (error) {
      console.error("Erro ao criar gerente:", error);
    }
  }

  switch (currentStep) {
    case 1:
      return (
        <>
          <button onClick={() => { console.log(formData) }}>Mostrar formData</button>
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