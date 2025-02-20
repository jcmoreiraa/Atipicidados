"use client";
import Image from "next/image";
import NavBar from "@/components/NavBarPaciente";
import perfil from "../../../public/images/perfil.png";
import { Card } from "@/components/Card";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBarGerente from "@/components/NavBarGerente";
import NavBarColaborador from "@/components/NavBarColaborador";
import NavBarPaciente from "@/components/NavBarPaciente";
import Form from "@/components/Form Autenticacao/Form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  // const searchParams = useSearchParams();
  // const id = searchParams.get("id");
  // const acesso = searchParams.get("acs");

  const router = useRouter();

  const [userrEmail, setUserrEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [pacienteInfo, setPacienteInfo] = useState<any | null>(null);
  const [homeLink, setHomeLink] = useState("");

  const [memberID, setMemberID] = useState("");
  const [acesso, setAcesso] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    // const id = localStorage.getItem("userID");
    const memberId = localStorage.getItem("memberId");
    const acs = localStorage.getItem("acs");
    const homeLink = localStorage.getItem("homeLink");
    if (email) setUserrEmail(email);
    if (memberId) {
      setMemberID(memberId);
      fetchPacienteData(memberId);
      localStorage.removeItem("memberId")
    };
    if (homeLink) setHomeLink(homeLink);
    if (acs) {
      setAcesso(acs)
      localStorage.removeItem("acs");
    };
  })

  const fetchPacienteData = async (id: any) => {
    try {
      const response = await fetch(`https://atipicidados.onrender.com/pacientes/id/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gerente data");
      }
      const data = await response.json();
      setPacienteInfo(data);
    } catch (error) {
      console.error("Error fetching gerente data:", error);
    }
  };

  // Se a pessoa que clicou no card for um gerente, ou seja "acs" = "g" recebe navbar de gerente, caso contrario colaborador
  const getAcesso = () => {
    if (acesso === "g") return <NavBarGerente />
    if (acesso === "c") return <NavBarColaborador />
    if (acesso === "p") return <NavBarPaciente />
  }

  const jumpToPage = () => {
    localStorage.removeItem("memberId");
    localStorage.setItem("memberId", memberID);

    router.push("/autenticacao")
  }

  return (
    <main className="flex flex-col min-h-screen">
      {getAcesso()}
      <div className="flex flex-col gap-[20px] px-[108px] pt-[33px] pb-[50px] text-[14px]">
        <div className="flex gap-[20px]">
          <div className="box w-3/5 flex flex-col gap-7">
            <div className="w-full flex flex-row justify-between">
              <h2>Cadastro de {pacienteInfo ? pacienteInfo.nome : "Nome"}</h2>
              {/* {(acesso === "g" || acesso === "c") ? (
                                pacienteInfo && !pacienteInfo.analise ? (
                                    <button type="button" className="py-2 px-3 bg-blue-800 text-white rounded-lg font-medium -mr-2">Verificar</button>
                                ) : (
                                    <button type="button" className="bg-black/10 text-black/50 py-2 px-3 rounded-lg font-medium -mr-2" disabled>Verificado</button>
                                )
                            ) : null} */}
              {pacienteInfo && pacienteInfo.analise ? (
                <button type="button" className="py-2 px-3 bg-blue-800 text-white rounded-lg font-medium -mr-2" onClick={() => { jumpToPage() }}>Verificar</button>
              ) : (
                <button type="button" className="bg-black/10 text-black/50 py-2 px-3 rounded-lg font-medium -mr-2" disabled>Verificado</button>
              )}
            </div>

            <div className="flex flex-col gap-8">
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

              <div className="flex gap-6">
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
                    <p className="titulo">Data de nascimento:</p>
                    <p>{pacienteInfo && pacienteInfo.nascimentodata ? pacienteInfo.nascimentodata : "Nascimento"}</p>
                  </div>

                  <div>
                    <p className="titulo">Endereço:</p>
                    <p>{pacienteInfo && pacienteInfo.geral ? pacienteInfo.geral.endereco : "Endereço"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box w-2/5">
            <h3>Profissionais que acompanham</h3>

            <div className="flex flex-col">
              <Card hasBorder={false} />
              <Card hasBorder={false} />
              <Card hasBorder={false} />
            </div>
          </div>
        </div>

        <div className="flex gap-[20px]">
          <div className="gap-[18px] box w-full">
            <h3>Mãe</h3>
            <p className="titulo">{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.nome : "Nome da mãe"}</p>

            <div className="flex flex-row gap-[18px] items-center">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">RG:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.rg : "RG da mãe"}</p>
                </div>

                <div>
                  <p className="titulo">CPF:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.cpf : "CPF da mãe"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Data de nascimento:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.data : "Nascimento da mãe"}</p>
                </div>

                <div>
                  <p className="titulo">Endereço:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.endereco : "Endereço da mãe"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Escolaridade:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.escolaridade : "Escolaridade da mãe"}</p>
                </div>

                <div>
                  <p className="titulo">Contato:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.telefone : "Telefone da mãe"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="gap-[18px] box w-full">
            <h3>Pai</h3>
            <p className="titulo">{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.nome : "Nome do pai"}</p>

            <div className="flex flex-row gap-[18px] items-center">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">RG:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.rg : "RG do pai"}</p>
                </div>

                <div>
                  <p className="titulo">CPF:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.cpf : "CPF do pai"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Data de nascimento:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.data : "Nascimento do pai"}</p>
                </div>

                <div>
                  <p className="titulo">Endereço:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.endereco : "Endereço do pai"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Escolaridade:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.escolaridade : "Escolaridade do pai"}</p>
                </div>

                <div>
                  <p className="titulo">Contato:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.telefone : "Telefone do pai"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
