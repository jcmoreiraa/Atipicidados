"use client";
import Image from "next/image";
import Link from "next/link";
import logo from '../../public/logo.svg';
import perfil from '../../public/images/perfil.png'
import { ConfigIcon } from "../../public/icons/Icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Gerente = {
  nome: string;
  rg: string;
  cpf: string;
}

interface NavBarProps {
  id?: string;
  userEmail?: string | null;
  userName?: string | null;
}

export default function NavBar({ userEmail, userName, ...props }: NavBarProps) {
  const currentPath = usePathname().split('?')[0];
  const [userrEmail, setUserrEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [gerenteInfo, setGerenteInfo] = useState<any | null>(null);
  const [homeLink, setHomeLink] = useState("");
  const [nome, setNome] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [imagemData, setImageData] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const id = localStorage.getItem("userID");
    const homeLink = localStorage.getItem("homeLink");
    const nome = localStorage.getItem("userNome");
    if (email) setUserrEmail(email);
    if (id) {
      const decodedID = decodeURIComponent(id);
      setUserID(decodedID);
      fetchGerenteData(decodedID);
    }
    console.log(props.id);
    fetchGerenteData(props.id);
    if (nome) setNome(nome);
    if (homeLink) setHomeLink(homeLink);
  }, []);

  const fetchGerenteData = async (id: any) => {
    try {
      const response = await fetch(`https://atipicidados.onrender.com/gerentes/id/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gerente data");
      }
      const data = await response.json();
      setGerenteInfo(data.gerente);
    } catch (error) {
      console.error("Error fetching gerente data:", error);
    }
  };

  useEffect(() => {
    if (gerenteInfo?.fotofile) {
      const fotoNome = gerenteInfo.fotofile.slice(8);
      fetchFotoData(fotoNome);
    }
  }, [gerenteInfo]);

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

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex justify-between fundo w-full h-[76px] py-2 px-[20px] sm:px-[97px]">
        <Link href={homeLink}>
          <Image
            src={logo}
            alt="logo atipicidades"
            width={60}
            height={60}
          />
        </Link>

        {/* Menu - Large and Medium Screens */}
        <nav className="hidden sm:flex items-center gap-8 font-semibold text-[14px]">
          <Link href={homeLink} className={`px-3 py-2.5 ${currentPath.startsWith('/home') ? 'text-blue-800 font-bold bg-blue-800/15 rounded-lg' : 'text-gray-700'}`}>
            Página inicial
          </Link>
          <Link href={`/unidadesgerente?id=${props.id}`} className={`px-3 py-2.5 ${currentPath === '/unidadesgerente' ? 'text-blue-800 font-bold bg-blue-800/15 rounded-lg' : 'text-gray-700'}`}>
            Unidades
          </Link>
        </nav>

        {/* Right-side Actions */}
        <div className="flex items-center gap-8">
          <Link href='/meucadastro' className="hidden sm:flex gap-4 items-center">
            <div className='flex flex-col items-end gap-[2px] font-medium text-[14px] leading-[17px] text-black'>
              <p>{gerenteInfo?.nome || "Nome não encontrado"}</p>
              <p className="opacity-60">{userrEmail}</p>
            </div>
            <Image
              src={imagemData || perfil}
              alt="foto de perfil"
              width={44}
              height={44}
              className="rounded-full"
            />
          </Link>

          <button className="sm:hidden" onClick={toggleMenu}>
            <div className="w-6 h-[3px] bg-black mb-1"></div>
            <div className="w-6 h-[3px] bg-black mb-1"></div>
            <div className="w-6 h-[3px] bg-black"></div>
          </button>

          <Link href="/configuracoes" className="hidden sm:block">
            <ConfigIcon />
          </Link>
        </div>
      </div>

      {/* Fullscreen Menu - Small Screens */}
      {menuOpen && (
        <div className="fixed inset-0 fundo bg-opacity-90 z-50 flex items-center justify-center">
          <nav className="text-center">
            <ul className="flex flex-col gap-8 text-black font-bold text-2xl">
              <li>
                <Link href={homeLink} onClick={toggleMenu}>
                  Página inicial
                </Link>
              </li>
              <li>
                <Link href="/unidadesgerente" onClick={toggleMenu}>
                  Unidades
                </Link>
              </li>
              <li>
                <Link href="/meucadastro" onClick={toggleMenu}>
                  Meu Cadastro
                </Link>
              </li>
              <li>
                <Link href="/configuracoes" onClick={toggleMenu}>
                  Configurações
                </Link>
              </li>
            </ul>
            <button
              onClick={toggleMenu}
              className="mt-10 text-black text-lg underline"
            >
              Fechar
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
