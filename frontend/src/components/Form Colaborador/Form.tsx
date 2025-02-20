"use client";
import React, { useEffect, useState } from 'react';
import Step1 from './Step1';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string | null;
  password: string | null;
  fotofile: File | null;
  nome: string | null;
  cpf: string | null;
  rg: string | null;
  nascimento: string | null;
  telefone: string | null;
  titulo: string | null;
  formacao: string | null;
  genero: string | null;
  raca: string | null;
  unidadeId: string;
}

const Form: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
    unidadeId: "",
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
    if (formData.unidadeId) {
      data.append('unidadeId', "")
    }

    const dataJSON = formData.nascimento ? {
      email: formData.email,
      password: formData.password,
      nome: formData.nome,
      cpf: formData.cpf,
      rg: formData.rg,
      nascimento: formData.nascimento.concat("T00:00:00.000Z"),
      telefone: formData.telefone,
      titulo: formData.titulo,
      formacao: formData.formacao,
      genero: formData.genero,
      raca: formData.raca,
      unidadeId: "",
    } : "";

    try {
      const response = await fetch("https://atipicidados.onrender.com/colaboradores/", {
        method: "POST",
        body: JSON.stringify(dataJSON),
        headers: { 'Content-Type': 'application/json' },
      });

      const responseText = await response.text();
      console.log('Resposta do servidor:', responseText);

      if (response.ok) {
        const result = JSON.parse(responseText);
        console.log('Resultado:', result);
      } else {
        console.log('Erro do servidor:', responseText);
      }

      // router.push("/")
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