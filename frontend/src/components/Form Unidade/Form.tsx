"use client";
import React, { useEffect, useState } from 'react';
import Step1 from './Step1';
import { FormData } from './types';
import { useRouter } from 'next/navigation';

const Form: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: null,
    endereco: null,
  });

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const updateForm = (data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      'nome': data.nome,
      'endereco': data.endereco,
    }));
  };

  const handleUserCreation = async () => {
    try {
      const teste = await fetch("https://atipicidados.onrender.com/unidades/", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await teste.json();
      console.log(response);
      router.push("/");
    } catch {

    }
  }

  switch (currentStep) {
    case 1:
      return <>
        {/* <button onClick={() => { console.log(formData) }}>Mostrar formData</button> */}
        <Step1
          handleFormDataSubmit={handleUserCreation}
          updateForm={(data) => updateForm(data)}
        />;
      </>
    default:
      return null;
  }
};

export default Form;