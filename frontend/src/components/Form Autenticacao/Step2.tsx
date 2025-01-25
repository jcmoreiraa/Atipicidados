import React, { useEffect, useState } from 'react';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import DateInput from '../DateInput';
import NumberInput from '../NumberInput';

type maeState = {
  nome: string;
  data: string;
  rg: string;
  cpf: string;
  escolaridade: string;
  telefone: string;
  email: string;
};
type paiState = {
  nome: string;
  data: string;
  rg: string;
  cpf: string;
  escolaridade: string;
  telefone: string;
  email: string;
  presente: string;
};

const Step2: React.FC<{ 
  nextStep: () => void;
  prevStep: () => void;
  updateMae: (data: maeState) => void;
  updatePai: (data: paiState) => void;

  receivedFormData: any | null;
}> = ({ nextStep, prevStep, updateMae, updatePai, receivedFormData }) => {
  const [Step21, setStep21] = useState<maeState>({
    nome: receivedFormData.mae?.nome || '',
    data: receivedFormData.mae?.data || '',
    rg: receivedFormData.mae?.rg || '',
    cpf: receivedFormData.mae?.cpf || '',
    escolaridade: receivedFormData.mae?.escolaridade || '',
    telefone: receivedFormData.mae?.telefone || '',
    email: receivedFormData.mae?.email || '',
  });
  const [Step22, setStep22] = useState<paiState>({
    nome: receivedFormData.pai?.nome || '',
    data: receivedFormData.pai?.data || '',
    rg: receivedFormData.pai?.rg || '',
    cpf: receivedFormData.pai?.cpf || '',
    escolaridade: receivedFormData.pai?.escolaridade || '',
    telefone: receivedFormData.pai?.telefone || '',
    email: receivedFormData.pai?.email || '',
    presente: receivedFormData.pai?.presente || '',
  });

  useEffect(() => {
    setStep21({
      nome: receivedFormData.mae?.nome,
      data: receivedFormData.mae?.data,
      rg: receivedFormData.mae?.rg,
      cpf: receivedFormData.mae?.cpf,
      escolaridade: receivedFormData.mae?.escolaridade,
      telefone: receivedFormData.mae?.telefone,
      email: receivedFormData.mae?.email,
    });
    setStep22({
      nome: receivedFormData.pai?.nome,
      data: receivedFormData.pai?.data,
      rg: receivedFormData.pai?.rg,
      cpf: receivedFormData.pai?.cpf,
      escolaridade: receivedFormData.pai?.escolaridade,
      telefone: receivedFormData.pai?.telefone,
      email: receivedFormData.pai?.email,
      presente: receivedFormData.pai?.presente,
    });
  }, [receivedFormData])

  const [outroResponsavel, setOutroResponsavel] = useState("");

  const handleInputChange1 = (key: string, value: string) => {
    setStep21((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleInputChange2 = (key: string, value: string) => {
    setStep22((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const reveal = () => {
    console.log(Step21);
    console.log(Step22);
  }

  const [responsavelOutro, setResponsavelOutro] = useState(false);

  // Fazer o JSON para o outro responsavel
  const handleResponsavelChange = (selectedOption: string) => {
    setResponsavelOutro(selectedOption === 'Outro');
    handleInputChange2("presente", selectedOption);
  };

  const handleNext = () => {
    updateMae(Step21);
    updatePai(Step22);
    nextStep();
  };

  return (
    <div className='flex flex-col gap-[162px] w-screen'>
      <div className='flex flex-col gap-[42px] px-5 lg:w-[840px] place-self-center'>

        <div className='flex flex-col gap-[12px]'>
          <h4 className='pl-2'>Mãe</h4>
          <button onClick={reveal}>reveal</button>

          <TextInput placeholder="Nome completo da mãe" value={Step21.nome} onChange={(e) => handleInputChange1("nome", e.target.value)} />

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <DateInput value={Step21.data} onChange={(e) => handleInputChange1("data", e.target.value)} />
            <TextInput placeholder='RG da mãe' className='min-w-[220px]' value={Step21.rg} onChange={(e) => handleInputChange1("rg", e.target.value)} />
            <TextInput placeholder='CPF da mãe' className='min-w-[220px]' value={Step21.cpf} onChange={(e) => handleInputChange1("cpf", e.target.value)} />
          </div>

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <SelectInput
              value={Step21.escolaridade}
              placeholder={"Escolaridade"}
              options={[
                "Ensino fundamental incompleto",
                "Ensino fundamental completo",
                "Ensino médio completo",
                "Técnico/profissionalizante",
                "Cursando ensino superior",
                "Ensino superior completo"
              ]}
              onChange={(value) => handleInputChange1("escolaridade", value)}
            />
            <NumberInput placeholder="Telefone de contato" value={Step21.telefone} onChange={(e) => handleInputChange1("telefone", e.target.value)} />
            <TextInput placeholder="E-mail" value={Step21.email} onChange={(e) => handleInputChange1("email", e.target.value)} />
          </div>
        </div>

        <div className='flex flex-col gap-[12px]'>
          <h4 className='pl-2'>Pai</h4>

          <TextInput placeholder="Nome completo do pai" value={Step22.nome} onChange={(e) => handleInputChange2("nome", e.target.value)} />

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <DateInput value={Step22.data} onChange={(e) => handleInputChange2("data", e.target.value)} />
            <TextInput placeholder='RG do pai' className='min-w-[220px]' value={Step22.rg} onChange={(e) => handleInputChange2("rg", e.target.value)} />
            <TextInput placeholder='CPF do pai' className='min-w-[220px]' value={Step22.cpf} onChange={(e) => handleInputChange2("cpf", e.target.value)} />
          </div>

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <SelectInput
              value={Step22.escolaridade}
              placeholder={"Escolaridade"}
              options={[
                "Ensino fundamental incompleto",
                "Ensino fundamental completo",
                "Ensino médio completo",
                "Técnico/profissionalizante",
                "Cursando ensino superior",
                "Ensino superior completo"
              ]}
              onChange={(value) => handleInputChange2("escolaridade", value)}
            />
            <NumberInput placeholder="Telefone de contato" value={Step22.telefone} onChange={(e) => handleInputChange2("telefone", e.target.value)} />
            <TextInput placeholder="E-mail" value={Step22.email} onChange={(e) => handleInputChange2("email", e.target.value)} />
          </div>
        </div>

        <div className='flex flex-col gap-[12px]'>
          <SelectInput
            value={Step22.presente}
            placeholder={"Responsável que compareceu ao acolhimento"}
            options={["Mãe", "Pai", "Outro"]}
            onChange={handleResponsavelChange}
          />
          {responsavelOutro && (
            <div className='flex flex-col gap-[12px]'>
              <h4 className='pl-2'>Informações do responsável</h4>

              <TextInput value={outroResponsavel} placeholder="Nome completo do responsável" />

              <div className='flex flex-col md:flex-row w-full gap-[12px]'>
                <DateInput />
                <TextInput value={outroResponsavel} placeholder='RG do responsável' className='min-w-[220px]' />
                <TextInput value={outroResponsavel} placeholder='CPF do responsável' className='min-w-[220px]' />
              </div>

              <div className='flex flex-col md:flex-row w-full gap-[12px]'>
                <SelectInput placeholder={"Escolaridade"} options={["Ensino fundamental incompleto", "Ensino fundamental completo", "Ensino médio completo", "Técnico/profissionalizante", "Cursando ensino superior", "Ensino superior completo"]} />
                <NumberInput placeholder="Telefone de contato" />
                <TextInput value={outroResponsavel} placeholder="E-mail" />
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Rodapé */}
      <div className='relative text-[13px] md:text-[16px] flex flex-row justify-between items-center mx-[147px]'>
        <button onClick={prevStep} className='botao'>Página anterior</button>

        <div className='hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          2 de 4
        </div>

        <button onClick={handleNext} className='botao'>Próxima página</button>
      </div>
    </div>
  );
};

export default Step2;
