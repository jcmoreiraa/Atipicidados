"use client";
import Checkbox from "@/components/Checkbox";
import TextInput from "@/components/TextInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState({
    email: '',
  });
  const router = useRouter();
  const [userType, setUserType] = useState("");

  const handleCheckboxChange = (value: string) => {
    setUserType(value);
  }

  const changeEmail = (data: any) => {
    setEmail((prevData) => ({
      ...prevData,
      [`email`]: data,
    }));
  }

  const handleSendNewPassword = async (email: any) => {
    let url = ""
    switch (userType) {
      case ("Gerente"):
        url = "https://atipicidados.onrender.com/gerentes/senha"
        break;
      case ("Colaborador"):
        url = "https://atipicidados.onrender.com/colaboradores/senha"
        break;
      case ("Paciente"):
        url = "https://atipicidados.onrender.com/pacientes/senha"
        break;
      default:
        console.error("Unknown user type");
        return;
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(email),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Password sending failed');
      }

      const data = await response.json();
      console.log(data);

      router.push("/confirmacao")
    } catch (error) {
      console.log("Erro no envio de nova senha", error)
    }
  }

  const revealEmail = () => {
    console.log(email);
  }

  const revealUserType = () => {
    console.log(userType);
  }

  return (
    <main className="flex min-h-screen">
      <div className="hidden lg:flex w-[40%] justify-center items-center">
        <p>colocar imagem aqui</p>
      </div>

      <div className="flex bg-blue-100 w-full lg:w-[60%] flex-col justify-center items-center gap-9 pb-20">
        <h1 className="font-extrabold text-center">Esqueci minha senha</h1>

        <div className="flex flex-col w-[280px] md:w-[520px] h-[200px] text-center gap-5 items-center">
          <h3 className="text-xl">Tem certeza que deseja redefinir sua senha?</h3>
          <p className="text-sm pl-1">Enviaremos uma nova senha aleatória para seu e-mail. A senha nova enviada deve ser usada em seu próximo acesso. Cuidado, após a mudança da senha essa ação não poderá ser desfeita.</p>
          <TextInput
            placeholder="Insira o e-mail vinculado à sua conta"
            className="mt-3 w-[280px] md:w-[380px]"
            value={email.email}
            onChange={(e) => changeEmail(e.target.value)}
          />
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
          {/* <button type="button" onClick={revealUserType}>Reveal UserType</button>
          <button onClick={revealEmail}>Mostrar email</button> */}
          <Link href="/recuperarsenha/confirmacao">
            <button className="botao w-[250px] mt-9 font-medium" onClick={() => handleSendNewPassword(email)}>Enviar nova senha</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
