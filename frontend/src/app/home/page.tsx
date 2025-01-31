"use client";
import PlusIcon from "@/assets/icons/plus";
import SearchIcon from "@/assets/icons/search";
import { Card } from "@/components/Card";
import NavBar from "@/components/NavBar";
import NavBarPaciente from "@/components/NavBarPaciente";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home/>
    </Suspense>
  )
}

function Home() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (email) {
      setUserEmail(decodeURIComponent(email));
    }
  }, [email]);
  
  return (
    <main className="flex flex-col min-h-screen">
      <NavBarPaciente />
      PACIENTE
      <div className="px-[84px] py-[30px]">
        <div className="flex justify-between">
          <div className="flex flex-col w-[340px]">
            <h2 className="mb-7">Página inicial</h2>
            <h3 className="mb-[22px]">Membros cadastrados</h3>
            <div className="relative w-full">
              <input
                type="text"
                className='input w-full h-[35px] mb-2 pb-1'
                placeholder="Buscar membro..." />

              <button
                type="button"
                className="absolute inset-y-0 right-0 px-[10px] py-2 pb-4 bg-gray-300 rounded-r-md"
              >
                <SearchIcon color="black" />
              </button>
            </div>

            <div className="flex justify-around">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox hover:none"
                />
                Gerente
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox hover:none"
                />
                Colaborador
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox hover:none"
                />
                Atendido
              </label>
            </div>
          </div>

          <div className="flex gap-[10px]">
            <button className="botao">
              <Link href='/cadastro/paciente' className="flex flex-row gap-1 items-center">
                <PlusIcon style={{ color: 'var(--texto-botao)' }} />
                <p>Novo Paciente</p>
              </Link>
            </button>
            <button className="botao">
              <Link href='/cadastro/colaborador' className="flex flex-row gap-1 items-center">
                <PlusIcon style={{ color: 'var(--texto-botao)' }} />
                <p>Colaborador</p>
              </Link>
            </button>
            <button className="botao">
              <Link href='/cadastro/unidade' className="flex flex-row gap-1 items-center">
                <PlusIcon style={{ color: 'var(--texto-botao)' }} />
                <p>Unidade</p>
              </Link>
            </button>
            <button className="botao">
              <Link href='/cadastro/gerente' className="flex flex-row gap-1 items-center">
                <PlusIcon style={{ color: 'var(--texto-botao)' }} />
                <p>Gerente</p>
              </Link>
            </button>
          </div>
        </div>

        <div className="mt-[42px]">
          <Card />
        </div>
      </div>
    </main>
  );
}
