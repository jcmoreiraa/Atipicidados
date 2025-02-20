import React, { useEffect, useState, useRef } from 'react';
import { StepProps } from './types';
import SelectInput from '../SelectInput';
import TextInput from '../TextInput';
import FileInput from '../FileInput';
import DateInput from '../DateInput';

type Step11State = {
  nome: string | undefined;
  data: string | undefined;
  rg: string | undefined;
  cpf: string | undefined;
  sexo: string | undefined;
  cor: string | undefined;
  cep: string | undefined;
  endereco: string | undefined;
  cidade: string | undefined;
};
type Step12State = {
  nome: string | undefined;
  serie: string | undefined;
  endereco: string | undefined;
  cidade: string | undefined;
  possuiAdi: string | undefined;
  tipo: string | undefined;
  tempoNaEscola: string | undefined;
  possuiRelatorio: string | undefined;
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};


const Step1: React.FC<{
  nextStep: () => void;
  updateLogin: (data: any) => void;
  updateFoto: (data: any) => void;
  updateRelatorio: (data: any) => void;
  updateRG: (data: any) => void;
  updateResidencia: (data: any) => void;
  updateGeral: (data: Step11State) => void;
  updateEscola: (data: Step12State) => void;

  receivedFormData: any | null;
}> = ({ nextStep, updateLogin, updateGeral, updateEscola, updateFoto, updateRelatorio, updateRG, updateResidencia, receivedFormData }) => {

  const [Step11, setStep11] = useState<Step11State>({
    nome: receivedFormData.geral?.nome || '',
    data: receivedFormData.geral?.data || '',
    rg: receivedFormData.geral?.rg || '',
    cpf: receivedFormData.geral?.cpf || '',
    sexo: receivedFormData.geral?.sexo || '',
    cor: receivedFormData.geral?.cor || '',
    cep: receivedFormData.geral?.cep || '',
    endereco: receivedFormData.geral?.endereco || '',
    cidade: receivedFormData.geral?.cidade || '',
  });
  const [Step12, setStep12] = useState<Step12State>({
    nome: receivedFormData.escola?.nome || '',
    serie: receivedFormData.escola?.serie || '',
    endereco: receivedFormData.escola?.endereco || '',
    cidade: receivedFormData.escola?.cidade || '',
    possuiAdi: receivedFormData.escola?.possuiAdi || '',
    tipo: receivedFormData.escola?.tipo || '',
    tempoNaEscola: receivedFormData.escola?.tempoNaEscola || '',
    possuiRelatorio: receivedFormData.escola?.possuiRelatorio || '',
  })

  const [login, setLogin] = useState({
    email: receivedFormData.email || '',
    confirmarEmail: '',
    senha: receivedFormData.password || '',
    confirmarSenha: receivedFormData.password || '',
  });

  const errorRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCpfMissing, setIsCpfMissing] = useState(false);
  const [isEmailMissing, setIsEmailMissing] = useState(false);
  const [isSenhaMissing, setIsSenhaMissing] = useState(false);

  const handleLoginChange: any = (key: string, value: string) => {
    setLogin((prevState) => {
      const updatedForm = {
        ...prevState,
        [key]: value,
      };
      updateLogin(updatedForm);
      return updatedForm;
    });
  };

  const handleInputChange1 = (key: string, value: string) => {
    setStep11((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleInputChange2 = (key: string, value: string) => {
    setStep12((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const [hasRelatorio, setHasRelatorio] = useState(false);

  const handleRelatorioChange = (selectedOption: string) => {
    setHasRelatorio(selectedOption === 'Sim, possui relatório escolar');
    handleInputChange2("possuiRelatorio", selectedOption);
  };

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);
  // ARQUIVOS //

  const [fotoFile, setFotoFile] = useState<any>(receivedFormData?.fotofile);
  const [relatorioFile, setRelatorioFile] = useState<any>(receivedFormData?.relescolar);
  const [rgFile, setRGFile] = useState<any>(receivedFormData?.rgdocfile);
  const [residenciaFile, setResidenciaFile] = useState<any>(receivedFormData?.compresfile);

  const handleFotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.name === "fotoFile") {
      setFotoFile(e.target.files[0]);
    }
  };

  const handleRelatorioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.name === "relatorioFile") {
      setRelatorioFile(e.target.files[0]);
    }
  };

  const handleRGFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.name === "rgFile") {
      setRGFile(e.target.files[0]);
    }
  };

  const handleResidenciaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.name === "residenciaFile") {
      setResidenciaFile(e.target.files[0]);
    }
  };

  //////////

  useEffect(() => {
    setFotoFile(receivedFormData.fotofile);
    setRelatorioFile(receivedFormData.relescolar);
    setRGFile(receivedFormData.rgdocfile);
    setResidenciaFile(receivedFormData.compresfile);
    setLogin({
      email: receivedFormData.email || '',
      confirmarEmail: login.confirmarEmail,
      senha: receivedFormData.password || '',
      confirmarSenha: receivedFormData.password || '',
    });
    setStep11({
      nome: receivedFormData.geral?.nome,
      data: receivedFormData.geral?.data,
      rg: receivedFormData.geral?.rg,
      cpf: receivedFormData.geral?.cpf,
      sexo: receivedFormData.geral?.sexo,
      cor: receivedFormData.geral?.cor,
      cep: receivedFormData.geral?.cep,
      endereco: receivedFormData.geral?.endereco,
      cidade: receivedFormData.geral?.cidade,
    });
    setStep12({
      nome: receivedFormData.escola?.nome,
      serie: receivedFormData.escola?.serie,
      endereco: receivedFormData.escola?.endereco,
      cidade: receivedFormData.escola?.cidade,
      possuiAdi: receivedFormData.escola?.possuiAdi,
      tipo: receivedFormData.escola?.tipo,
      tempoNaEscola: receivedFormData.escola?.tempoNaEscola,
      possuiRelatorio: receivedFormData.escola?.possuiRelatorio,
    });
  }, [receivedFormData]);

  const handleNext = () => {
    setError(null);
    setIsCpfMissing(false);
    setIsEmailMissing(false);
    setIsSenhaMissing(false);

    if (!Step11.cpf || !login.email) {
      setIsCpfMissing(!Step11.cpf);
      setIsEmailMissing(!login.email);
      // setIsSenhaMissing(!login.senha);
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (login.email !== login.confirmarEmail) {
      setError("Os campos de e-mail precisam ser iguais.");
      setIsEmailMissing(true);
      return;
    }
    if (login.senha !== login.confirmarSenha) {
      setError("Os campos de senha precisam ser iguais.");
      setIsSenhaMissing(true);
      return;
    }
    if (!validateEmail(login.email)) {
      setError("O e-mail inserido não é válido.");
      setIsEmailMissing(true);
      return;
    }
    // if (!validatePassword(login.senha)) {
    //   setError("A senha precisa ter no mínimo 8 caracteres.");
    //   setIsSenhaMissing(true);
    //   return;
    // }

    updateGeral(Step11);
    updateEscola(Step12);

    updateFoto(fotoFile);
    updateRelatorio(relatorioFile);
    updateRG(rgFile);
    updateResidencia(residenciaFile);

    nextStep();
  };

  return (
    <div className='flex flex-col gap-[162px] w-screen'>
      <div className='flex flex-col gap-[42px] px-5 lg:w-[840px] place-self-center'>
        <div className='flex flex-col gap-[12px]'>
          {error && <div ref={errorRef} className="text-[#FFF] font-medium text-center mt-4 bg-[#e13c31] py-3 rounded-xl">{error}</div>}
          {/* <button onClick={() => { console.log(login) }}>Mostrar login</button> */}
          <h4 className='pl-2 place-self-start mt-8'>Crie seu login e senha</h4>
          <div className='flex flex-col md:flex-row w-full gap-3'>
            <TextInput error={isEmailMissing} className='md:w-1/2' placeholder='E-mail' value={login.email} onChange={(e) => handleLoginChange("email", e.target.value)} />
            <TextInput error={isEmailMissing} className='md:w-1/2' placeholder='Confirmar e-mail' value={login.confirmarEmail} onChange={(e) => handleLoginChange("confirmarEmail", e.target.value)} />
          </div>
          {/* <div className='flex w-full gap-3'>
            <TextInput error={isSenhaMissing} className='w-[400px]' placeholder='Senha' value={login.senha} onChange={(e) => handleLoginChange("senha", e.target.value)} />
            <TextInput error={isSenhaMissing} className='w-[400px]' placeholder='Confirmar senha' value={login.confirmarSenha} onChange={(e) => handleLoginChange("confirmarSenha", e.target.value)} />
          </div> */}

          <div className='mb-4'></div>

          <h4 className='pl-2'>Geral</h4>
          {/* <button onClick={() => { console.log(Step11); console.log(Step12) }}>Mostrar Respostas</button> */}
          {/* <button onClick={() => { console.log(fotoFile) }}>Mostrar Foto</button> */}
          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <FileInput placeholder='Foto 3x4' className='md:w-1/3' onChange={handleFotoFileChange} name='fotoFile' id='fotoFile' value={fotoFile} />
            <TextInput placeholder='Nome completo' className='md:w-2/3' value={Step11.nome} onChange={(e) => handleInputChange1("nome", e.target.value)} />
          </div>

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <FileInput placeholder='Foto do RG' onChange={handleRGFileChange} name='rgFile' id='rgFile' value={rgFile} />
            <FileInput placeholder='Comprovante de residência' onChange={handleResidenciaFileChange} name='residenciaFile' id='residenciaFile' value={residenciaFile} />
          </div>

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <DateInput value={Step11.data} onChange={(e) => handleInputChange1("data", e.target.value)} />
            <TextInput placeholder='RG' type='rg' className='min-w-[220px]' value={Step11.rg} onChange={(e) => handleInputChange1("rg", e.target.value)} />
            <TextInput error={isCpfMissing} placeholder='CPF' type='cpf' className='min-w-[220px]' value={Step11.cpf} onChange={(e) => handleInputChange1("cpf", e.target.value)} />
          </div>


          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <SelectInput value={Step11.sexo} options={["Masculino", "Feminino", "Intersexo", "Outro sexo", "Prefiro não dizer o sexo"]} placeholder={"Sexo"} onChange={(value) => handleInputChange1("sexo", value)} />
            <SelectInput value={Step11.cor} options={["Amarelo", "Branco", "Indígena", "Pardo", "Preto"]} placeholder={"Raça/cor"} onChange={(value) => handleInputChange1("cor", value)} />
            <TextInput placeholder='CEP' type="cep" className='min-w-[220px]' value={Step11.cep} onChange={(e) => handleInputChange1("cep", e.target.value)} />
          </div>

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <TextInput placeholder="Endereço" value={Step11.endereco} onChange={(e) => handleInputChange1("endereco", e.target.value)} />
            <SelectInput value={Step11.cidade} options={["Salvador", "Lauro de Freitas", "Camaçari", "Catu"]} placeholder={"Cidade"} onChange={(value) => handleInputChange1("cidade", value)} />
          </div>
        </div>

        <div className='flex flex-col gap-[12px]'>
          <h4 className='pl-2'>Escola</h4>

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <TextInput placeholder="Nome da escola" value={Step12.nome} onChange={(e) => handleInputChange2("nome", e.target.value)} />
            <SelectInput value={Step12.serie} placeholder="Série" options={["1ª série", "2ª série", "3ª série", "4ª série", "5ª série", '6ª série', '8ª série']} className='min-w-[260px]' onChange={(value) => handleInputChange2("serie", value)} />
          </div>

          <TextInput placeholder="Endereço da escola" value={Step12.endereco} onChange={(e) => handleInputChange2("endereco", e.target.value)} />

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <SelectInput value={Step12.cidade} placeholder={"Cidade da escola"} options={["Salvador", "Lauro de Freitas", "Camaçari", "Catu"]} onChange={(value) => handleInputChange2("cidade", value)} />
            <SelectInput value={Step12.possuiAdi} options={["Sim, possui ADI", "Não possui ADI"]} placeholder={"Possui ADI?"} onChange={(value) => handleInputChange2("possuiAdi", value)} />
          </div>

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <SelectInput value={Step12.tipo} placeholder={"Tipo da escola"} options={["Pública", "Particular"]} className='min-w-[260px]' onChange={(value) => handleInputChange2("tipo", value)} />
            <SelectInput value={Step12.tempoNaEscola} placeholder={"Há quanto tempo estuda na escola?"} options={["Menos de 1 ano", "1 ano", "2 anos", "3 anos", "4 anos", "5 anos", "6 anos", "7 anos", "8 anos", "9 anos", "10 anos", "Mais de 10 anos"]} onChange={(value) => handleInputChange2("tempoNaEscola", value)} />
          </div>

          <div className='flex flex-col md:flex-row w-full gap-[12px]'>
            <SelectInput
              value={Step12.possuiRelatorio}
              placeholder={"Possui relatório escolar?"}
              options={["Sim, possui relatório escolar", "Não possui relatório escolar"]}
              onChange={handleRelatorioChange}
            />
            <FileInput
              placeholder="Relatório Escolar"
              className={`transition-opacity duration-300 ${Step12.possuiRelatorio ? 'relative inline-block text-left w-full' : 'opacity-40 cursor-not-allowed pointer-events-none inline-block w-full'}`}
              disabled={!hasRelatorio}
              name='relatorioFile'
              onChange={handleRelatorioFileChange}
              value={relatorioFile}
              id='relatorioFile'
            />
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className='relative text-[13px] md:ttext-[16px] flex flex-row justify-between items-center mx-[147px]'>
        <button></button>

        <div className='hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          1 de 4
        </div>

        <button onClick={handleNext} className='botao'>Próxima página</button>
      </div>
    </div>
  );
};

export default Step1;
