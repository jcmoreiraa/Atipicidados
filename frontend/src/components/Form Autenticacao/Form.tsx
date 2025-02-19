"use client";
import React, { useEffect, useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

interface FormProps {
  id: any;
}

type FormData = {
  email: string | null;
  password: string | null;
  geral: any | null;
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

const Form: React.FC<FormProps> = ({ id }) => {
  const [currentStep, setCurrentStep] = useState(1);
  // const pacienteData
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

  useEffect(() => {
    fetchData(id);
    // get id by through clicking a pacient card
  }, [id])

  const fetchData = async (id: any) => {
    try {
      const response = await fetch(`https://atipicidados-1.onrender.com/pacientes/id/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch paciente data");
      }
      const data = await response.json();
      setFormData(data);
      // setPacienteData(data);
    } catch (error) {
      console.error("Error fetching paciente data:", error);
    }
  }

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

  const putData = async (data: any, id: string, type: string) => {
    try {
      // se o tipo for analise o body eh apenas o id, pois ele so troca de true pra false 
      // ja se for alguma seção precisamos dos dados da seção 
      const body: Record<string, any> = { id };

      if (type !== "analise") {
        body[type] = JSON.stringify(data);
      }

      const response = await fetch(`https://atipicidados-1.onrender.com/pacientes/put${type}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const updatedPaciente = await response.json();
      console.log("Data updated successfully:", updatedPaciente);
      return updatedPaciente;
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }

  const handleUserEdition = async () => {
    try {
      if (formData.geral) {
        await putData(formData.geral, id, "geral");
      }
      if (formData.escola) {
        await putData(formData.escola, id, "escola");
      }
      if (formData.mae) {
        await putData(formData.mae, id, "mae");
      }
      if (formData.pai) {
        await putData(formData.pai, id, "pai");
      }
      if (formData.maisinfo) {
        await putData(formData.maisinfo, id, "maisinfo");
      }
      if (formData.saudeinfo) {
        await putData(formData.saudeinfo, id, "saudeinfo");
      }

      if (formData.rgdocfile) {
        await putData(formData.rgdocfile, id, "rgdocfile")
      }
      if (formData.fotofile) {
        await putData(formData.rgdocfile, id, "fotofile")
      }
      if (formData.compresfile) {
        await putData(formData.rgdocfile, id, "compresfile")
      }
      if (formData.laudofile) {
        await putData(formData.rgdocfile, id, "laudofile")
      }
      if (formData.relescolar) {
        await putData(formData.rgdocfile, id, "relescolar")
      }

      console.log("All updates completed successfully");
    } catch (error) {
      console.error("Error during the update process:", error);
    }
  };

  switch (currentStep) {
    case 1:
      return <>
        <button onClick={() => { console.log(formData) }}>Mostrar formData</button>
        <Step1
          nextStep={nextStep}

          receivedFormData={formData}

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

        receivedFormData={formData}

        updateMae={(data) => updateDataAt(data, "mae")}
        updatePai={(data) => updateDataAt(data, "pai")}
      />;
    case 3:
      return <Step3
        nextStep={nextStep}
        prevStep={prevStep}

        receivedFormData={formData}

        updateMaisInfo={(data) => updateDataAt(data, "maisinfo")}
      />;
    case 4:
      return <>
        <button onClick={() => { console.log(formData) }}>Mostrar formData</button>
        <Step4
          prevStep={prevStep}

          receivedFormData={formData}

          updateInfoSaude={(data) => updateDataAt(data, "saudeinfo")}
          updateLaudoFile={(data) => updateDataAt(data, "laudofile")}
          handleFormDataSubmit={handleUserEdition}
        />;
      </>
    default:
      return null;
  }
};

export default Form;