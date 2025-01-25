"use client";
import PlusIcon from "@/assets/icons/plus";
import SearchIcon from "@/assets/icons/search";
import { Card } from "@/components/Card";
import NavBarGerente from "@/components/NavBarGerente";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const id = searchParams.get("id");
  const [userEmail, setUserEmail] = useState("");
  const [userID, setUserID] = useState<string>("");
  const [gerenteInfo, setGerenteInfo] = useState<any | null>(null);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [gerentes, setGerentes] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);

  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  // selectedFilters = [Colaborador, Atendido, Gerente]
  const [searchBy, setSearchBy] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`http://localhost:3002/gerentes/token/${id}`, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/");
          return;
        }
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    };

    checkAuth();
  }, []);


  useEffect(() => {
    let filtered = allMembers;


    // Filter by search term
    if (searchBy.length > 0) {
      filtered = filtered.filter((member) =>
        member.nome?.toLowerCase().includes(searchBy.toLowerCase())
      );
    }

    // Filter by selected filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((member) => selectedFilters.includes(member.type));
    }

    setFilteredMembers(filtered);

    const email = localStorage.getItem("userEmail");
    const id = localStorage.getItem("userID");
    if (email) {
      setUserEmail(decodeURIComponent(email));
    }
    if (id) {
      const decodedID = decodeURIComponent(id);
      setUserID(decodedID);
      fetchGerenteData(decodedID);
    }
    if (!pacientes.length) {
      fetchPacientes();
    }
    if (!gerentes.length) {
      fetchGerentes();
    }
    if (!colaboradores.length) {
      fetchColaboradores();
    }
  }, [email, id, searchBy, selectedFilters, pacientes, gerentes, colaboradores]);

  const fetchGerenteData = async (id: any) => {
    try {
      const response = await fetch(`http://localhost:3002/gerentes/id/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gerente data");
      }
      const data = await response.json();
      setGerenteInfo(data);
    } catch (error) {
      console.error("Error fetching gerente data:", error);
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await fetch("http://localhost:3002/pacientes/getall");
      if (!response.ok) {
        throw new Error("Failed to fetch pacientes data");
      }
      const data = await response.json();
      setPacientes(data.pacientes);
      // console.log(data.pacientes);
    } catch (error) {
      console.error("Error fetching pacientes data:", error);
    }
  };
  const fetchGerentes = async () => {
    try {
      const response = await fetch(`http://localhost:3002/gerentes/getall/${id}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error("Failed to fetch gerentes data");
      }
      const data = await response.json();
      setGerentes(data.gerentes);
    } catch (error) {
      console.error("Error fetching gerentes data:", error);
    }
  };
  const fetchColaboradores = async () => {
    try {
      const response = await fetch("http://localhost:3002/colaboradores/getall");
      if (!response.ok) {
        throw new Error("Failed to fetch colaboradores data");
      }
      const data = await response.json();
      setColaboradores(data.colaboradores);
    } catch (error) {
      console.error("Error fetching gerentes data:", error);
    }
  };

  const allMembers = [
    ...pacientes.map((paciente) => ({ ...paciente, type: "Paciente" })),
    ...gerentes.map((gerente) => ({ ...gerente, type: "Gerente" })),
    ...colaboradores.map((colaborador) => ({ ...colaborador, type: "Colaborador" }))
  ];

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const handleSearchBar = (e: any) => {
    const value = e.target.value
    setSearchBy(value);
  }

  // seleciona a url certa caso o card seja de um paciente, gerente ou colaborador para enviar para a pagina certa
  const urlToMemberPage = (member: any) => {
    //p de paciente g de gerente e c de colaborador, dps recebe qual eh o acesso ("acs") da pessoa que esta 
    localStorage.removeItem("acs");
    localStorage.setItem("acs", "g");

    if (member.type === "Paciente") {
      router.push(`/p/${member.id}`);
    };
    if (member.type === "Gerente") {
      router.push(`/g/${member.id}`);
    };
    if (member.type === "Colaborador") {
      router.push(`/c/${member.id}`);
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      <NavBarGerente id={userID} />
      <div className="px-5 md:px-[84px] py-[40px]">
        <div className="flex justify-between">
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-full md:flex-row md:justify-between">
              <h2 className="mb-7">Página inicial</h2>
              <div className="flex text-[13px] md:text-[16px] flex-wrap gap-[10px]">
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
            <h3 className="mt-[28px] mb-[22px]">Membros cadastrados</h3>
            <div className="relative w-[280px] md:w-[340px]">
              <input
                type="text"
                className='input w-full h-[35px] mb-2 pb-1'
                placeholder="Buscar membro..."
                value={searchBy}
                onChange={(e) => { handleSearchBar(e) }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-[10px] py-2 pb-4 bg-gray-300 rounded-r-md"
              >
                <SearchIcon color="black" />
              </button>
            </div>

            <div className="flex text-[13px] md:text-[16px] flex-wrap gap-3 md:gap-[18px]">
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

        <div className="mt-[28px] grid grid-cols-4 gap-2 w-full max-w-full">
          {filteredMembers.map((member) => (
            // eslint-disable-next-line react/jsx-key
            <button key={member.id} onClick={() => { urlToMemberPage(member) }} className="text-left">
              <Card id={member.id} title={member.nome} cpf={member.cpf} acesso={member.type} />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
