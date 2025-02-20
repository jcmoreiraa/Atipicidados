"use client";
import Image from "next/image";
import NavBar from "@/components/NavBarPaciente";
import perfil from "../../../../public/images/perfil.png";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBarGerente from "@/components/NavBarGerente";
import NavBarColaborador from "@/components/NavBarColaborador";
import NavBarPaciente from "@/components/NavBarPaciente";

export default function Home() {
  const params = useParams();
  const id = params.id;

  const [userrEmail, setUserrEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [pacienteInfo, setPacienteInfo] = useState<any | null>(null);
  const [homeLink, setHomeLink] = useState("");
  const [unidade, setUnidade] = useState<any | null>(null);
  const [imagemData, setImageData] = useState<string>("");
  const [acesso, setAcesso] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const acs = localStorage.getItem("acs");
    const homeLink = localStorage.getItem("homeLink");

    if (email) setUserrEmail(email);

    if (id) fetchPacienteData(id);
    if (homeLink) setHomeLink(homeLink);
    if (acs) {
      setAcesso(acs);
      localStorage.removeItem("acs");
    }
  }, [id]);

  const fetchPacienteData = async (id: any) => {
    try {
      const response = await fetch(`https://atipicidados.onrender.com/gerentes/id/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch paciente data");
      }
      const data = await response.json();
      setPacienteInfo(data.gerente);
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
      const response = await fetch(`https://atipicidados.onrender.com/imagens/${fotoNome}`);
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

  const getAcesso = () => {
    if (acesso === "g") return <NavBarGerente />;
    if (acesso === "c") return <NavBarColaborador />;
    if (acesso === "p") return <NavBarPaciente />;
  };

  return (
    <main className="flex flex-col min-h-screen">
      {getAcesso()}
      <div className="flex flex-col gap-[20px] px-5 md:px-[108px] pt-[33px] pb-[50px] text-[14px]">
        <div className="flex gap-[20px]">
          <div className="box w-full flex flex-col gap-7">
            <h2>Cadastro de {pacienteInfo ? pacienteInfo.nome : "Nome"}</h2>

            <div className="flex flex-col gap-8 pb-2">
              <div className="flex items-center gap-[20px]">
                <Image
                  src={imagemData || perfil} // Se a imagem não foi carregada, exibe a imagem padrão
                  alt="foto de perfil"
                  width={68}
                  height={68}
                  className=" object-cover rounded-full"
                />

                <div>
                  <p className="titulo">Nome e Sobrenome:</p>
                  <p>{pacienteInfo ? pacienteInfo.nome : "Nome"}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="titulo">RG:</p>
                    <p>{pacienteInfo ? pacienteInfo.rg : "RG"}</p>
                  </div>

                  <div>
                    <p className="titulo">CPF:</p>
                    <p>{pacienteInfo ? pacienteInfo.cpf : "CPF"}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <p className="titulo">E-mail:</p>
                    <p>{pacienteInfo ? pacienteInfo.email : "Email não encontrado"}</p>
                  </div>

                  <div>
                    <p className="titulo">Telefone:</p>
                    <p>{pacienteInfo ? pacienteInfo.telefone : "Telefone não encontrado"}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <p className="titulo">Unidade vinculada:</p>
                    <p>{pacienteInfo?.unidadeId}</p>
                  </div>

                  <div>
                    <p className="titulo">Raça:</p>
                    <p>{pacienteInfo ? pacienteInfo.raca : "Raça não encontrada"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
