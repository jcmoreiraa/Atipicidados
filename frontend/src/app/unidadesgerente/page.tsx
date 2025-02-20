"use client";
import { CardUnidade } from "@/components/Card";
import NavBarGerente from "@/components/NavBarGerente";
// import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import SearchIcon from "@/assets/icons/search";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";

export default function Page() {
  return (
    <Suspense fallback={<>
      <div className="fixed z-40 place-self-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loading />
      </div>
      <div className="fixed inset-0 bg-black/30 z-30" />
    </>}>
      <Home />
    </Suspense>
  )
}

function Home() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const gerenteId = searchParams.get("id");

  const [userEmail, setUserEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [gerenteInfo, setGerenteInfo] = useState<any | null>(null);

  const [unidades, setUnidades] = useState<any[]>([]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const id = localStorage.getItem("userID");
    if (email) {
      setUserEmail(decodeURIComponent(email));
    }
    if (id) {
      setUserID(id);
      fetchGerenteData(id);
    }
    fetchUnidades();
  }, []);

  const fetchGerenteData = async (id: any) => {
    try {
      const response = await fetch(`https://atipicidados.onrender.com/gerentes/id/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gerente data");
      }
      const data = await response.json();
      setGerenteInfo(data);
    } catch (error) {
      console.error("Error fetching gerente data:", error);
    }
  };

  const fetchUnidades = async () => {
    try {
      const response = await fetch("https://atipicidados.onrender.com/unidades/getall");
      if (!response.ok) {
        throw new Error("Failed to fetch unidades data");
      }
      const data = await response.json();
      console.log(data.unidades);
      setUnidades(data.unidades);
    } catch (error) {
      console.error("Error fetching unidades data:", error);
    }
  };

  const urlToUnidadePage = (unidade: any) => {
    //p de paciente g de gerente e c de colaborador, dps recebe o id, e qual eh o acesso ("acs") da pessoa que esta 
    localStorage.removeItem("acs");
    localStorage.setItem("acs", "g");

    router.push(`/unidades/${unidade.id}?id=${gerenteId}`);
  }

  return (
    <main className="flex flex-col min-h-screen">
      <NavBarGerente />

      <div className="px-[84px] pt-[40px]">
        <div className="flex justify-between">
          <div className="flex flex-col w-[280px] md:w-[340px]">
            <h2 className="mb-7">Unidades</h2>

            <div className="relative w-full">
              <input
                type="text"
                className='input w-full h-[35px] mb-2 pb-1'
                placeholder="Buscar unidade..." />

              <button
                type="button"
                className="absolute inset-y-0 right-0 px-[10px] py-2 pb-4 bg-gray-300 rounded-r-md"
              >
                <SearchIcon color="black" />
              </button>
            </div>

          </div>
        </div>

        <div className="mt-[28px] grid grid-cols-4 gap-2 w-full max-w-full">
          {unidades.length > 0 ? (
            unidades.map((unidade) => (
              <button key={unidade.id} onClick={() => { urlToUnidadePage(unidade) }} className="text-left">
                <CardUnidade title={unidade.nome} endereco={unidade.endereco} />
              </button>
            ))
          ) : (
            <p>Nenhum membro encontrado.</p>
          )}
        </div>
      </div>
    </main>
  );
}
