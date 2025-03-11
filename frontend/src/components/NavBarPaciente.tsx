"use client";
import Image from "next/image";
import Link from "next/link";
import logo from '../../public/logo.svg';
import perfil from '../../public/images/perfil.png'
import { ConfigIcon } from "../../public/icons/Icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/utils/apiConfig";

type Paciente = {
    nome: string;
    rg: string;
    cpf: string;
}

interface NavBarProps {
    id?: string;
    userEmail?: string | null;
    userName?: string | null;
}

export default function NavBar({ userEmail, userName }: NavBarProps) {
    const currentPath = usePathname().split('?')[0];
    const [userrEmail, setUserrEmail] = useState("");
    const [userID, setUserID] = useState("");
    const [pacienteInfo, setPacienteInfo] = useState<any | null>(null);
    const [homeLink, setHomeLink] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const [imagemData, setImageData] = useState<string>("");

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        const id = localStorage.getItem("userID");
        const homeLink = localStorage.getItem("homeLink");
        if (email) setUserrEmail(email);
        if (id) {
            setUserID(id);
            fetchPacienteData(id);
        };
        if (homeLink) setHomeLink(homeLink);
    }, []);

    const fetchPacienteData = async (id: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pacientes/id/${id}`);
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

                {/* Menu */}
                <div className="flex items-center gap-8">
                    <Link href='/meucadastro' className="hidden sm:flex gap-4 items-center">
                        <div className='flex flex-col items-end gap-[2px] font-medium text-[14px] leading-[17px]'>
                            <p>{pacienteInfo?.nome}</p>
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

            {/* Fullscreen Menu */}
            {menuOpen && (
                <div className="fixed inset-0 fundo text-[#000000] bg-opacity-90 z-50 flex items-center justify-center">
                    <nav className="text-center">
                        <ul className="flex flex-col gap-8 font-bold text-2xl">
                            <li>
                                <Link href={homeLink} onClick={toggleMenu}>
                                    Página inicial
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
                            className="mt-10 text-lg underline"
                        >
                            Fechar
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}
