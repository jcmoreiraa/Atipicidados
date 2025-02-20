"use client";
import Image from "next/image";
import NavBar from "@/components/NavBarPaciente";
import perfil from "../../../../public/images/perfil.png";
import { Card } from "@/components/Card";
import { useEffect, useState } from "react";

export default function Home() {
  const [userrEmail, setUserrEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [pacienteInfo, setPacienteInfo] = useState<any | null>(null);
  const [homeLink, setHomeLink] = useState("");
  const [imagemData, setImageData] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const id = localStorage.getItem("userID");
    const homeLink = localStorage.getItem("homeLink");
    if (email) setUserrEmail(email);
    if (id) {
      setUserID(id);
      fetchPacienteData(id);
    }
    if (homeLink) setHomeLink(homeLink);
  }, []);

  const fetchPacienteData = async (id: string) => {
    try {
      const response = await fetch(`https://atipicidados.onrender.com/pacientes/id/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch paciente data");
      }
      const data = await response.json();
      setPacienteInfo(data);
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

  const fallback = "Não encontrado";

  return (
    <main className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-col gap-[20px] mx-5 md:mx-[54px] lg:mx-[108px] mt-[33px] text-[14px]">
        <div className="flex flex-col md:flex-row gap-[20px]">
          <div className="box w-full md:w-3/5 flex flex-col gap-7">
            <h2>Meu cadastro</h2>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-[20px]">
                <Image
                  src={imagemData || perfil}
                  alt="foto de perfil <nome do usuario>"
                  width={68}
                  height={68}
                  className="rounded-full"
                />

                <div>
                  <p className="titulo">Nome e Sobrenome:</p>
                  <p>{pacienteInfo?.nome || fallback}</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="titulo">RG:</p>
                    <p>{pacienteInfo?.rg || fallback}</p>
                  </div>

                  <div>
                    <p className="titulo">CPF:</p>
                    <p>{pacienteInfo?.cpf || fallback}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <p className="titulo">Data de nascimento:</p>
                    <p>{pacienteInfo?.geral?.data || fallback}</p>
                  </div>

                  <div>
                    <p className="titulo">Endereço:</p>
                    <p>{pacienteInfo?.geral?.endereco || fallback}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box w-full md:w-2/5">
            <h3>Profissionais que me acompanham</h3>

            <div className="flex flex-col">
              <Card hasBorder={false} />
              <Card hasBorder={false} />
              <Card hasBorder={false} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-[20px]">
          <div className="gap-[18px] box w-full">
            <h3>Mãe</h3>
            <p className="titulo">{pacienteInfo?.mae?.nome || fallback}</p>

            <div className="flex gap-5 md:gap-1 lg:hidden">
              <div className="flex flex-col gap-[18px]">
                <div>
                  <p className="titulo">RG:</p>
                  <p>{pacienteInfo?.mae?.rg || fallback}</p>
                </div>
                <div>
                  <p className="titulo">Data de nascimento:</p>
                  <p>{pacienteInfo?.mae?.data || fallback}</p>
                </div>
                <div>
                  <p className="titulo">Escolaridade:</p>
                  <p>{pacienteInfo?.mae?.escolaridade || fallback}</p>
                </div>
              </div>
              <div className="flex flex-col gap-[18px]">
                <div>
                  <p className="titulo">CPF:</p>
                  <p>{pacienteInfo?.mae?.cpf || fallback}</p>
                </div>
                <div>
                  <p className="titulo">Contato:</p>
                  <p>{pacienteInfo?.mae?.telefone || fallback}</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex flex-row gap-[18px] items-center">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">RG:</p>
                  <p>{pacienteInfo?.mae?.rg || fallback}</p>
                </div>

                <div>
                  <p className="titulo">CPF:</p>
                  <p>{pacienteInfo?.mae?.cpf || fallback}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Data de nascimento:</p>
                  <p>{pacienteInfo?.mae?.data || fallback}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Escolaridade:</p>
                  <p>{pacienteInfo?.mae?.escolaridade || fallback}</p>
                </div>

                <div>
                  <p className="titulo">Contato:</p>
                  <p>{pacienteInfo?.mae?.telefone || fallback}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="gap-[18px] box w-full">
            <h3>Pai</h3>
            <p className="titulo">{pacienteInfo?.pai?.nome || fallback}</p>

            <div className="flex gap5 md:gap-1 lg:hidden">
              <div className="flex flex-col gap-[18px]">
                <div>
                  <p className="titulo">RG:</p>
                  <p>{pacienteInfo?.pai?.rg || fallback}</p>
                </div>
                <div>
                  <p className="titulo">Data de nascimento:</p>
                  <p>{pacienteInfo?.pai?.data || fallback}</p>
                </div>
                <div>
                  <p className="titulo">Escolaridade:</p>
                  <p>{pacienteInfo?.pai?.escolaridade || fallback}</p>
                </div>
              </div>
              <div className="flex flex-col gap-[18px]">
                <div>
                  <p className="titulo">CPF:</p>
                  <p>{pacienteInfo?.pai?.cpf || fallback}</p>
                </div>
                <div>
                  <p className="titulo">Contato:</p>
                  <p>{pacienteInfo?.pai?.telefone || fallback}</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex flex-row gap-[18px] items-center">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">RG:</p>
                  <p>{pacienteInfo?.pai?.rg || fallback}</p>
                </div>

                <div>
                  <p className="titulo">CPF:</p>
                  <p>{pacienteInfo?.pai?.cpf || fallback}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Data de nascimento:</p>
                  <p>{pacienteInfo?.pai?.data || fallback}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Escolaridade:</p>
                  <p>{pacienteInfo?.pai?.escolaridade || fallback}</p>
                </div>

                <div>
                  <p className="titulo">Contato:</p>
                  <p>{pacienteInfo?.pai?.telefone || fallback}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {pacienteInfo?.analise ? (
          <div className="bg-[#e1b831]/100 w-[470px] text-black py-3 px-4 rounded-xl self-end"> <span className="font-bold">!! Autenticação pendente:</span> Marque uma consulta na sua unidade mais próxima para autenticar seu cadastro.</div>
        ) : ""}
      </div>
    </main>
  );
}
