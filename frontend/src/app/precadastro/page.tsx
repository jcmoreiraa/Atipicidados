import Form from "@/components/Form/Form";
import logoDesktop from "../../../public/images/logos.svg"
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Image
        src={logoDesktop}
        alt="logo atipicidades"
        height={60}
        className="ml-[57px] mt-5" />


      <div className="mt-[44px] flex flex-col gap-[37px]">
        <h2 className="ml-[147px]">Faça o seu pré-cadastro</h2>
        <Form />
      </div>
    </main>
  );
}
