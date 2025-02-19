"use client";
import Image from "next/image";
import perfil from '../../public/images/perfil.png'
import Link from "next/link";
import { useEffect, useState } from "react";

interface CardProps {
  id?: string;
  title?: string;
  cpf?: string;
  acesso?: string;
  endereco?: string;
  hasBorder?: boolean;
}

export function Card({ id, title, cpf, acesso, hasBorder = true }: CardProps) {
  const [pacienteInfo, setPacienteInfo] = useState<any | null>(null);
  const [imagemData, setImageData] = useState<string>("");

  useEffect(() => {
    if (id) fetchPacienteData(id);
  }, [id])

  const fetchPacienteData = async (id: any) => {
    let url = ""
    switch (acesso) {
      case ("Gerente"):
        url = `https://atipicidados-1.onrender.com/gerentes/id/${id}`;
        break;
      case ("Colaborador"):
        url = `https://atipicidados-1.onrender.com/colaboradores/id/${id}`;
        break;
      case ("Paciente"):
        url = `https://atipicidados-1.onrender.com/pacientes/id/${id}`;
        break;
      default:
        console.error("Unknown user type");
        return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch paciente data");
      }
      const data = await response.json();
      if (acesso === "Gerente") {
        setPacienteInfo(data.gerente);
        console.log(data.gerente);
      } else {
        setPacienteInfo(data);
      }
    } catch (error) {
      console.error("Error fetching paciente data:", error);
    }
  };

  useEffect(() => {
    if (pacienteInfo?.fotofile) {
      const fotoNome = pacienteInfo.fotofile.slice(8);
      fetchFotoData(fotoNome);
    }
  }, [pacienteInfo]);

  const fetchFotoData = async (fotoNome: string) => {
    try {
      const response = await fetch(`https://atipicidados-1.onrender.com/imagens/${fotoNome}`);
      if (!response.ok) {
        throw new Error('Fetch falhou');
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageData(imageUrl);
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
    }
  };

  function formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  const borderClass = hasBorder ? 'border border-black/10' : '';

  return (
    <div className={`flex flex-col items-start w-[280px] justify-around ${borderClass} bg-[#FFFFFF] hover:bg-blue-100 cursor-pointer rounded-xl`}>
      {/* <hr className="opacity-20" /> */}
      <div className="flex flex-row items-center justify-start gap-3 py-4 px-4 w-full">
        <Image
          src={imagemData || perfil}
          alt="foto de identificação colaborador"
          width={60}
          height={60}
          className="rounded-full"
        />

        <div className="flex flex-col gap-px">
          <p className="font-semibold truncate w-[180px]">{title ?? "Nome desconhecido"}</p>
          <p className="font-medium text-[14px] text-[#000000]/80">{cpf ? formatCPF(cpf) : "Nenhum CPF"}</p>
          {/*cargo filtro*/}
          <p className="font-semibold text-[14px] text-[#000000]/80">{acesso === "Paciente" ? "Atendido(a)" : acesso === "Colaborador" ? "Colaborador(a)" : acesso ?? "Nenhum acesso"}</p>
        </div>
      </div>

      {/* <hr className="opacity-20" /> */}
    </div>
  )
}

export function CardUnidade({ title, endereco, hasBorder = true }: CardProps) {

  const borderClass = hasBorder ? 'border border-black/10' : '';

  return (
    <div className={`flex flex-col w-[280px] items-start justify-around ${borderClass} bg-[#FFFFFF] hover:bg-blue-100 cursor-pointer rounded-xl`}>
      {/* <hr /> */}

      <div className="flex flex-col gap-1 py-3 pb-[14px] px-4">
        <p className="font-semibold">{title ?? "Nome desconhecido"}</p>
        <p className="font-medium text-[14px]">{endereco ?? "Nenhum endereco"}</p>
      </div>

      {/* <hr /> */}
    </div>
  )
}