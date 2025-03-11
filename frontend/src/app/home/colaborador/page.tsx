"use client";
import { API_BASE_URL } from "@/utils/apiConfig";
import PlusIcon from "@/assets/icons/plus";
import SearchIcon from "@/assets/icons/search";
import { Card } from "@/components/Card";
import Loading from "@/components/Loading";
import NavBarColaborador from "@/components/NavBarColaborador";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  const [userEmail, setUserEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [colaboradorInfo, setColaboradorInfo] = useState<any | null>(null);

  const [pacientes, setPacientes] = useState<any[]>([]);
  const [gerentes, setGerentes] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchBy, setSearchBy] = useState("");

  const fetchData = async () => {
    try {
      const responseColaborador = await fetch(`${API_BASE_URL}/colaboradores/getall`);
      const dataColaborador = await responseColaborador.json();
      setColaboradores(dataColaborador.colaboradores || []);

      const responsePaciente = await fetch(`${API_BASE_URL}/pacientes/getall/${id}`, { credentials: 'include' });
      const dataPaciente = await responsePaciente.json();
      setPacientes(dataPaciente.pacientes || []);

      const responseGerente = await fetch(`${API_BASE_URL}/gerentes/getall/${id}`, { credentials: 'include' });
      const dataGerente = await responseGerente.json();
      setGerentes(dataGerente.gerentes || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("userEmail");
    const idFromStorage = localStorage.getItem("userID");
    if (emailFromStorage) setUserEmail(decodeURIComponent(emailFromStorage));
    if (idFromStorage) {
      setUserID(decodeURIComponent(idFromStorage));
      fetchColaboradorData(decodeURIComponent(idFromStorage));
    }
    fetchData();
  }, []);

  const fetchColaboradorData = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/colaboradores/id/${id}`);
      const data = await response.json();
      setColaboradorInfo(data);
    } catch (error) {
      console.error("Erro ao buscar colaborador:", error);
    }
  };

  const allMembers = [
    ...pacientes.map((paciente) => ({ ...paciente, type: "Paciente" })),
    ...gerentes.map((gerente) => ({ ...gerente, type: "Gerente" })),
    ...colaboradores.map((colaborador) => ({ ...colaborador, type: "Colaborador" }))
  ];

  const filteringMembers = allMembers
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

  const handleSearchBar = (e: any) => setSearchBy(e.target.value);

  const urlToMemberPage = (member: any) => {
    localStorage.removeItem("acs");
    localStorage.setItem("acs", "c");

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
      <NavBarColaborador />
      {/* <button onClick={() => {console.log(pacientesAutenticados)}}>Mostrar pacientes autenticado</button> */}
      <div className="px-5 md:px-[84px] py-[40px]">
        <div className="flex flex-col">
          <div className="flex w-full justify-between">
            <h2 className="mb-7">Página inicial</h2>
            <div className="flex text-[13px] md:text-[16px] gap-[10px]">
              <button className="botao">
                <Link href='/cadastro/paciente' className="flex flex-row gap-1 items-center">
                  <PlusIcon style={{ color: 'var(--texto-botao)' }} />
                  <p>Novo Cadastro</p>
                </Link>
              </button>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-2 mb-4">
              <h3>Minha unidade (Nome da Unidade)</h3>
              <Link href='/unidade'>
                <p className="font-semibold text-blue-800 cursor-pointer">Mais informações</p>
              </Link>
            </div>
            <div className="relative w-[280px] md:w-[340px]">
              <input
                type="text"
                className='input w-full h-[35px] mb-2 pb-1'
                placeholder="Buscar membro..."
                value={searchBy}
                onChange={handleSearchBar}
              />

              <button
                type="button"
                className="absolute inset-y-0 right-0 px-[10px] py-2 pb-4 bg-gray-300 rounded-r-md"
              >
                <SearchIcon color="black" />
              </button>
            </div>

            <div className="flex text-[13px] lg:text-[16px] flex-wrap gap-3 md:gap-[18px]">
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
                Gerente
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
                Colaborador
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
                Atendido
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
                // checked={selectedFilters.includes("Autenticado")}
                // onChange={() => handleFilterChange("Autenticado")}
                />
                Autenticado
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
                // checked={selectedFilters.includes("Não autenticado")}
                // onChange={() => handleFilterChange("Não autenticado")}
                />
                Não autenticado
              </label>
            </div>
          </div>
        </div>

        <div className="mt-[28px] grid grid-cols-4 gap-2 w-full max-w-full">
          {filteringMembers.map((member) => (
            <button type="button" onClick={() => { urlToMemberPage(member) }} key={member.id} className="text-left">
              <Card title={member.nome} cpf={member.cpf} acesso={member.type} />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
