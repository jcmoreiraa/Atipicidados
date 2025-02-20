"use client";

import Image from "next/image";
import logoDesktop from "../../public/images/logos.svg";
import logoMobile from '../../public/images/logo.png';
import { SlashedEyeIcon, OpenEyeIcon, CloseButton } from "../../public/icons/Icons";
import { useState } from "react";
import Link from "next/link";
import Checkbox from "@/components/Checkbox";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import Banner from "../../public/pexels-fabiano-cardoso-1671860-5654263.png";

export default function Home() {
  const [userType, setUserType] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [id, setID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (key: string, value: string) => {
    setLoginData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleCheckboxChange = (value: string) => {
    setUserType(value);
  }

  const revealLogin = () => {
    console.log(loginData);
  }

  const revealUserType = () => {
    console.log(userType);
  }

  const handleLogin = async (userType: any) => {
    setIsLoading(true);
    let url = ""
    switch (userType) {
      case ("Gerente"):
        url = "https://atipicidados-1.onrender.com/gerentes/login";
        localStorage.setItem(userType, 'gerente');
        break;
      case ("Colaborador"):
        url = "https://atipicidados-1.onrender.com/colaboradores/login"
        localStorage.setItem(userType, 'colaborador');
        break;
      case ("Paciente"):
        url = "https://atipicidados-1.onrender.com/pacientes/login"
        localStorage.setItem(userType, 'paciente');
        break;
      default:
        console.error("Unknown user type");
        setIsLoading(false);
        return;
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }


      const data = await response.json();
      console.log(data);
      let usuario: { id: string } = { id: "" };

      if (userType.toLowerCase() === 'gerente') {
        usuario = data.gerente;
      }
      if (userType.toLowerCase() === 'colaborador') {
        usuario = data.colaborador;
      }
      if (userType.toLowerCase() === 'paciente') {
        usuario = data.paciente;
      }

      setID(usuario.id);
      localStorage.setItem("userEmail", loginData.email);
      localStorage.setItem("userID", usuario.id);
      const homeLink = `/home/${userType.toLowerCase()}?email=${encodeURIComponent(loginData.email)}&id=${encodeURIComponent(usuario.id)}`
      localStorage.setItem("homeLink", homeLink)

      router.push(`/home/${userType.toLowerCase()}?email=${encodeURIComponent(loginData.email)}&id=${encodeURIComponent(usuario.id)}`);
    } catch (error: any) {
      console.log("Erro em seu login", error);
      setErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`flex min-h-screen ${isLoading && ""}`}>
      {errorMessage && (
        <>
          <div className="fixed z-40 place-self-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-800 p-5 text-white flex-row">
            <button className="text-white" onClick={() => { setErrorMessage("") }}><CloseButton /></button>
            <p>Erro ao fazer login. Tente novamente.</p>
          </div>
          <div className="fixed inset-0 bg-black/30 z-30" />
        </>
      )}

      {isLoading && (
        <>
          <div className="fixed z-40 place-self-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loading />
          </div>
          <div className="fixed inset-0 bg-black/30 z-30" />
        </>
      )}

      <div className="hidden lg:flex w-[60%] justify-center items-center">
        <Image
          src={Banner}
          alt="logos atipicidades"
          className="h-full object-cover w-full"
        />
      </div>

      <div className="flex bg-blue-100 w-full lg:w-[40%] flex-col justify-center items-center gap-10">
        <div className="flex flex-col w-full justify-center items-center">
          <Image
            src={logoDesktop}
            alt="logosDesktop atipicidades"
            className="hidden md:flex"
          />
          <Image
            src={logoMobile}
            alt="logosDesktop atipicidades"
            className="flex md:hidden"
          />
        </div>

        <form className="flex flex-col justify-center items-center gap-9">
          <h1>Acesse sua conta</h1>
          <div className="flex flex-row text-[13px] md:text-[16px] gap-4">
            <label className="flex items-center">
              <Checkbox
                value="Gerente"
                onChange={(e) => handleCheckboxChange(e.target.value)}
                checked={userType === "Gerente"}
              />

              Gerente
            </label>
            <label className="flex items-center">
              <Checkbox
                value="Colaborador"
                onChange={(e) => handleCheckboxChange(e.target.value)}
                checked={userType === "Colaborador"}
              />

              Colaborador
            </label>
            <label className="flex items-center">
              <Checkbox
                value="Paciente"
                onChange={(e) => handleCheckboxChange(e.target.value)}
                checked={userType === "Paciente"}
              />

              Paciente
            </label>
          </div>
          <div className="flex flex-col gap-[10px] w-full">
            <input
              className="login"
              type="text"
              name="email"
              placeholder="Insira seu e-mail"
              value={loginData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required />

            <div className="relative w-full">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="login"
                name="senha"
                placeholder="Insira sua senha"
                value={loginData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-4 py-2 bg-gray-300 rounded-r-md"
              >
                {passwordVisible ? <SlashedEyeIcon /> : <OpenEyeIcon />}
              </button>
            </div>

            <div className="flex px-[10px] text-[12px] md:text-[14px] justify-end w-full">
              <Link href='/recuperarsenha'>
                <p className="font-semibold text-blue-800 cursor-pointer">Esqueceu a senha?</p>
              </Link>
            </div>
          </div>
          {/* <button type="button" onClick={revealLogin}>Mostrar Dados do Login</button>
          <button type="button" onClick={revealUserType}>Mostrar Tipo de Usuário</button> */}
          <div className="flex flex-col gap-2 w-full">
            <button
              type="button"
              className="entrar botao"
              onClick={() => handleLogin(userType)}
            >
              Entrar
            </button>
            <Link href='/precadastro'>
              <button
                type="button"
                className="botaoreverse w-full">
                Fazer o pré-cadastro
              </button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
