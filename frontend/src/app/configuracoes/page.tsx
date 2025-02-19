'use client';
import LogOut from "@/assets/icons/logout";
import NavBar from "@/components/NavBar";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { SlashedEyeIcon, OpenEyeIcon } from "../../../public/icons/Icons";
import { cookies } from "next/headers";

export default function Home() {
  const router = useRouter();

  const fetchChangePasswordData = async (id: string) => {
    try {
      const colaboradorData = localStorage.getItem('Colaborador');
      const colaborador = colaboradorData?.toLowerCase();
      console.log(colaboradorData);

      const response = await fetch(`https://atipicidados-1.onrender.com/${colaborador + 'es'}/id/${id}/changePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const [changePasswordIsVisible, setChangePasswordIsVisible] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false); // Estado para mostrar/ocultar a antiga senha
  const [showNewPassword, setShowNewPassword] = useState(false); // Estado para mostrar/ocultar a nova senha

  const handleChangePassword = () => {
    const id = localStorage.getItem('userID');
    if (id) {
      fetchChangePasswordData(id);
      console.log('Senha mudada com sucesso');
      router.push('/configuracoes');
    } else {
      console.error("User ID not found in localStorage");
    }
  };

  function leaveAtipicidades() {
    localStorage.clear();
    router.push('/');
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = "refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";  }

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen">
        <div className="px-[137px] pt-[30px]">
          <div className="flex flex-col space-y-10">
            <h2 className="mb-7">Configurações</h2>

            <div className="flex flex-col gap-10 min-w-[288px]">
              {/* <button 
                className="botao mt-4 max-w-[220px]" 
                onClick={() => setChangePasswordIsVisible(!changePasswordIsVisible)}
              >
                Mudar senha
              </button> */}
              {changePasswordIsVisible && (
                <div className="flex flex-col">
                  <h3 className="mb-4">Mudar sua senha</h3>
                  <div className="flex flex-col space-y-3">
                    <div className="relative">
                      <input
                        className="input px-1 py-1 w-full"
                        type={showOldPassword ? "text" : "password"} // Altera o tipo do input
                        placeholder="Antiga senha"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <SlashedEyeIcon /> : <OpenEyeIcon />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        className="input px-1 py-1 w-full"
                        type={showNewPassword ? "text" : "password"} // Altera o tipo do input
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <SlashedEyeIcon /> : <OpenEyeIcon />}
                      </button>
                    </div>

                    <button
                      className="botao mt-2"
                      onClick={handleChangePassword}
                    >
                      Enviar nova senha
                    </button>
                  </div>
                </ div>
              )}
              <button
                className="botao min-w-[210px] flex flex-row gap-2"
                onClick={leaveAtipicidades}
                aria-label="Sair do Atipicidades"
              >
                <LogOut />
                <p>Sair</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
