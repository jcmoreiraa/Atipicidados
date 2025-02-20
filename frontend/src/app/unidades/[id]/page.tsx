"use client";
import { Card } from "@/components/Card";
import NavBar from "@/components/NavBar";
import NavBarColaborador from "@/components/NavBarColaborador";
import NavBarGerente from "@/components/NavBarGerente";
import NavBarPaciente from "@/components/NavBarPaciente";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import SearchIcon from "@/assets/icons/search";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  const params = useParams();
  const id = params.id;

  const router = useRouter();

  const searchParams = useSearchParams();
  const gerenteId = searchParams.get("id");

  const [homeLink, setHomeLink] = useState("");
  const [acesso, setAcesso] = useState("");
  const [unidadeInfo, setUnidadeInfo] = useState<any | null>(null);

  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [gerentes, setGerentes] = useState<any[]>([]);

  const [searchBy, setSearchBy] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])


  const fetchData = async () => {
    try {
      const responseColaborador = await fetch("https://atipicidados-1.onrender.com/colaboradores/getall");
      const dataColaborador = await responseColaborador.json();
      setColaboradores(dataColaborador.colaboradores || []);

      const responseGerente = await fetch(`https://atipicidados-1.onrender.com/gerentes/getall/${gerenteId}`, { credentials: 'include' });
      const dataGerente = await responseGerente.json();
      setGerentes(dataGerente.gerentes || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    const acs = localStorage.getItem("acs");
    const homeLink = localStorage.getItem("homeLink");

    if (id) fetchUnidadeData(id);
    if (homeLink) setHomeLink(homeLink);
    if (acs) {
      setAcesso(acs)
      localStorage.removeItem("acs");
    };
    fetchData();
  }, []);

  const fetchUnidadeData = async (id: any) => {
    try {
      const response = await fetch(`https://atipicidados-1.onrender.com/unidades/getUnidadeById/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch unidades data");
      }
      const data = await response.json();
      setUnidadeInfo(data.unidade);
    } catch (error) {
      console.error("Error fetching unidades data:", error);
    }
  };

  const allMembers = [
    ...gerentes.map((gerente) => ({ ...gerente, type: "Gerente" })),
    ...colaboradores.map((colaborador) => ({ ...colaborador, type: "Colaborador" }))
  ];

  const filteringMembers = allMembers
    .filter((member) =>
      unidadeInfo && member.unidadeId && member.unidadeId === unidadeInfo.id
    )
    .filter((member) =>
      member.nome && member.nome.toLowerCase().includes(searchBy.toLowerCase())
    )
    .filter((member) => {
      if (selectedFilters.length === 0) return true;
      return selectedFilters.includes(member.type);
    });

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  // Se a pessoa que clicou no card for um gerente, ou seja "acs" = "g" recebe navbar de gerente, caso contrario colaborador
  const getAcesso = () => {
    if (acesso === "g") return <NavBarGerente />
    if (acesso === "c") return <NavBarColaborador />
    if (acesso === "p") return <NavBarPaciente />
  }

  const urlToMemberPage = (member: any) => {
    localStorage.removeItem("acs");
    localStorage.setItem("acs", acesso);

    if (member.type === "Paciente") {
      router.push(`/p/${member.id}`);
    }
    if (member.type === "Gerente") {
      router.push(`/g/${member.id}`);
    }
    if (member.type === "Colaborador") {
      router.push(`/c/${member.id}`);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      {getAcesso()}
      <div className="px-5 md:px-[84px] lg:px-[137px] pt-[30px]">
        <div className="flex flex-col w-full justify-between">
          <h2 className="mb-2">{unidadeInfo ? unidadeInfo.nome : "Nome não encontrado"}</h2>
          <button className="flex justify-start">
            <h4 className="mb-[32px] text-blue-800">Mais informações</h4>
          </button>
          <div className="relative w-[280px] md:w-[340px]">
            <input
              type="text"
              className='input w-full h-[35px] mb-2 pb-1'
              placeholder={`Buscar membros em ${unidadeInfo ? unidadeInfo.nome : "unidade"}`}
              value={searchBy}
              onChange={(e) => { setSearchBy(e.target.value) }}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-0 px-[10px] py-2 pb-4 bg-gray-300 rounded-r-md"
            >
              <SearchIcon color="black" />
            </button>
          </div>

          <div className="flex justify-start text-[13px] md:text-[16px]">
            <div className="flex gap-[18px]">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="
                    relative w-4 h-4 appearance-none bg-white/[0.4] border-[1px] border-black/40 focus:outline-none rounded-[4px] mr-2
                    checked:bg-blue-800 checked:border-none
                    hover:ring hover:ring-offset-indigo-400 hover:cursor-pointer
                    after:content-[''] after:w-full after:h-full after:absolute after:left-0 after:top-0 after:bg-no-repeat after:bg-center after:bg-[length:16px] 
                    checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA4TDcuMjUgMTEuNzVMMTEuNzUgMy43NSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjc1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4K')]
                  "
                  checked={selectedFilters.includes("Gerente")}
                  onChange={() => handleFilterChange("Gerente")}
                />
                Gerentes
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="
                    relative w-4 h-4 appearance-none bg-white/[0.4] border-[1px] border-black/40 focus:outline-none rounded-[4px] mr-2
                    checked:bg-blue-800 checked:border-none
                    hover:ring hover:ring-offset-indigo-400 hover:cursor-pointer
                    after:content-[''] after:w-full after:h-full after:absolute after:left-0 after:top-0 after:bg-no-repeat after:bg-center after:bg-[length:16px] 
                    checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA4TDcuMjUgMTEuNzVMMTEuNzUgMy43NSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjc1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4K')]
                  "
                  checked={selectedFilters.includes("Colaborador")}
                  onChange={() => handleFilterChange("Colaborador")}
                />
                Colaboradores
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="
                    relative w-4 h-4 appearance-none bg-white/[0.4] border-[1px] border-black/40 focus:outline-none rounded-[4px] mr-2
                    checked:bg-blue-800 checked:border-none
                    hover:ring hover:ring-offset-indigo-400 hover:cursor-pointer
                    after:content-[''] after:w-full after:h-full after:absolute after:left-0 after:top-0 after:bg-no-repeat after:bg-center after:bg-[length:16px] 
                    checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA4TDcuMjUgMTEuNzVMMTEuNzUgMy43NSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjc1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4K')]
                  "
                  checked={selectedFilters.includes("Paciente")}
                  onChange={() => handleFilterChange("Paciente")}
                />
                Atendidos
              </label>
            </div>
          </div>

        </div>

        <div className="mt-[42px]">
          <h3 className="mb-4 ml-[5px]">Membros cadastrados</h3>

          <div className="mt-[28px] grid grid-cols-4 gap-2 w-full max-w-full">
            {
              filteringMembers.length === 0 ? 
                "Nenhum usuário encontrado." :
                filteringMembers.map((member) => (
                  <button type="button" onClick={() => { urlToMemberPage(member) }} key={member.id} className="text-left">
                    <Card title={member.nome} cpf={member.cpf} acesso={member.type} />
                  </button>
                ))
            }
          </div>
        </div>
      </div>
    </main>
  );
}
