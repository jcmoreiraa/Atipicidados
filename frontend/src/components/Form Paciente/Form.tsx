"use client";
import React, { useEffect, useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import { useRouter } from "next/navigation";
import Loading from '../Loading';

type Geral = {
  nome?: string;
  rg?: string;
  cpf?: string;
};

type FormData = {
  email: string | null;
  password: string | null;
  geral: Geral | null;
  escola: any | null;
  mae: any | null;
  pai: any | null;
  maisinfo: any | null;
  saudeinfo: any | null;
  fotofile: File | null;
  relescolar: File | null;
  laudofile: File | null;
  rgdocfile: File | null;
  compresfile: File | null;
};

const Form: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: null,
    password: null,
    geral: null,
    escola: null,
    mae: null,
    pai: null,
    maisinfo: null,
    saudeinfo: null,
    fotofile: null,
    relescolar: null,
    laudofile: null,
    rgdocfile: null,
    compresfile: null,
  });

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const updateDataAt = (data: any, type: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: data,
    }))
  }
  const updateLogin = (data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      'email': data.email,
      'password': data.senha,
    }));
  };

  const handleUserCreation = async () => {
    setIsLoading(true);
    const data = new FormData();

    if (formData.geral?.nome) data.append('nome', formData.geral.nome);
    if (formData.geral?.rg) data.append('rg', formData.geral.rg);
    if (formData.geral?.cpf) data.append('cpf', formData.geral.cpf);
    if (formData.password) data.append('password', formData.password);
    if (formData.email) data.append('email', formData.email);
    data.append('geral', JSON.stringify(formData.geral));
    data.append('mae', JSON.stringify(formData.mae));
    data.append('pai', JSON.stringify(formData.pai));
    data.append('maisinfo', JSON.stringify(formData.maisinfo));
    data.append('escola', JSON.stringify(formData.escola));
    data.append('saudeinfo', JSON.stringify(formData.saudeinfo));

    if (formData.fotofile) {
      data.append('fotofile', formData.fotofile);
      console.log('tem foto')
    }
    if (formData.relescolar) {
      data.append('relescolar', formData.relescolar);
      console.log('tem relatorio')
    }
    if (formData.laudofile) {
      data.append('laudofile', formData.laudofile);
      console.log('tem laudo')
    }
    if (formData.compresfile) {
      data.append('compresfile', formData.compresfile);
      console.log('tem comprovante de residencia')
    }
    if (formData.rgdocfile) {
      data.append('rgdocfile', formData.rgdocfile);
      console.log('tem rg')
    }

    console.log(data);

    try {

      const response = await fetch("https://atipicidados.onrender.com/pacientes/", {
        method: "POST",
        body: data, // mudar caso queira colocar o blob para body: formDataToSend, 
        // headers: { 'Content-Type': 'application/json' }
      })
      const result = await response.json();
      console.log(result);
      router.push("/");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const [isLoading, setIsLoading] = useState(false);

  switch (currentStep) {
    case 1:
      return <>
        {/* <button onClick={() => { console.log(formData) }}>Mostrar formData</button> */}
        <Step1
          nextStep={nextStep}
          updateLogin={(data) => updateLogin(data)}
          updateGeral={(data) => updateDataAt(data, "geral")}
          updateEscola={(data) => updateDataAt(data, "escola")}
          updateFoto={(data) => updateDataAt(data, "fotofile")}
          updateRelatorio={(data) => updateDataAt(data, "relescolar")}
          updateRG={(data) => updateDataAt(data, "rgdocfile")}
          updateResidencia={(data) => updateDataAt(data, "compresfile")}
        />;
      </>
    case 2:
      return <Step2
        nextStep={nextStep}
        prevStep={prevStep}
        updateMae={(data) => updateDataAt(data, "mae")}
        updatePai={(data) => updateDataAt(data, "pai")}
      />;
    case 3:
      return <Step3
        nextStep={nextStep}
        prevStep={prevStep}
        updateMaisInfo={(data) => updateDataAt(data, "maisinfo")}
      />;
    case 4:
      return <>
        {isLoading && (
          <>
            <div className="fixed z-40 place-self-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Loading />
            </div>
            <div className="fixed inset-0 bg-black/30 z-30" />
          </>
        )}
        {/* <button onClick={() => { console.log(formData) }}>Mostrar formData</button> */}
        <Step4
          prevStep={prevStep}
          updateInfoSaude={(data) => updateDataAt(data, "saudeinfo")}
          updateLaudoFile={(data) => updateDataAt(data, "laudofile")}
          handleFormDataSubmit={handleUserCreation}
        />;
      </>
    default:
      return null;
  }
};

export default Form;