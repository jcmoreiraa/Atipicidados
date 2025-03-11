"use client";
import { API_BASE_URL } from "@/utils/apiConfig";
import Image from "next/image";
import NavBar from "@/components/NavBarPaciente";
import perfil from "../../../../public/images/perfil.png";
import { Card } from "@/components/Card";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import NavBarGerente from "@/components/NavBarGerente";
import NavBarColaborador from "@/components/NavBarColaborador";
import NavBarPaciente from "@/components/NavBarPaciente";

export default function Home() {
  // const searchParams = useSearchParams();
  // const id = searchParams.get("id");
  // const acesso = searchParams.get("acs");

  const params = useParams();
  const id = params.id;

  const [userrEmail, setUserrEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [pacienteInfo, setPacienteInfo] = useState<any | null>(null);
  const [homeLink, setHomeLink] = useState("");
  const [imagemData, setImageData] = useState<string>("");
  const [unidade, setUnidade] = useState<any | null>(null);
  /* A unidade data é retornada nesse modelo:
  {
    "error": false,
    "unidade": {
      "id": 1,
      "nome": "teste",
      "endereco": "teste"
  }
  }
  */
  const [memberID, setMemberID] = useState("");
  const [acesso, setAcesso] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    // const id = localStorage.getItem("userID");
    const acs = localStorage.getItem("acs");
    const homeLink = localStorage.getItem("homeLink");
    if (email) setUserrEmail(email);

    if (id) fetchPacienteData(id);

    if (acs) {
      setAcesso(acs)
      localStorage.removeItem("acs");
    };
    if (homeLink) setHomeLink(homeLink);
    if (pacienteInfo && pacienteInfo.unidadeId) fetchUnidadeData();
  })

  const fetchPacienteData = async (id: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/colaboradores/id/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gerente data");
      }
      const data = await response.json();
      setPacienteInfo(data);
    } catch (error) {
      console.error("Error fetching gerente data:", error);
    }
  };

  const fetchUnidadeData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/unidades/getUnidadeById/${pacienteInfo.unidadeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch unidades data");
      }
      const data = await response.json();
      setUnidade(data);
    } catch (error) {
      console.error("Error fetching unidades data:", error);
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
      const response = await fetch(`${API_BASE_URL}/imagens/${fotoNome}`);
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


  // Se a pessoa que clicou no card for um gerente, ou seja "acs" = "g" recebe navbar de gerente, caso contrario colaborador
  const getAcesso = () => {
    if (acesso === "g") return <NavBarGerente />
    if (acesso === "c") return <NavBarColaborador />
    if (acesso === "p") return <NavBarPaciente />
  }

  return (
    <main className="flex flex-col min-h-screen">
      {getAcesso()}
      {/* <button onClick={() => { console.log(pacienteInfo) }}>Mostrar pacienteInfo</button> */}
      <div className="flex flex-col gap-[20px] px-5 md:px-[108px] pt-[33px] pb-[50px] text-[14px]">
        <div className="flex gap-[20px]">
          <div className="box w-full flex flex-col gap-7">
            <h2>Cadastro de {pacienteInfo ? pacienteInfo.nome : "Nome"}</h2>

            <div className="flex flex-col gap-8 pb-2">
              <div className="flex items-center gap-[20px]">
                <Image
                  src={perfil}
                  alt='foto de perfil <nome do usuario>'
                  width={68}
                  height={68} />

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
                    <p>{unidade?.unidade?.nome || "Unidade não encontrada"}</p>
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
