-- CreateEnum
CREATE TYPE "Raca" AS ENUM ('branca', 'negra', 'amarela', 'indigena', 'outra');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('masculino', 'feminino', 'prefiro_nao_informar');

-- CreateTable
CREATE TABLE "Gerente" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "raca" "Raca" NOT NULL,
    "unidadeId" INTEGER NOT NULL DEFAULT 1,
    "rgdocfile" TEXT,
    "fotofile" TEXT,
    "compresfile" TEXT,
    "twoFASecret" TEXT,
    "twoFAEnable" BOOLEAN NOT NULL DEFAULT false,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "genero" "Genero" NOT NULL,

    CONSTRAINT "Gerente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colaborador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "telefone" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "formacao" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "genero" "Genero" NOT NULL,
    "email" TEXT NOT NULL,
    "raca" "Raca" NOT NULL,
    "unidadeId" INTEGER NOT NULL DEFAULT 1,
    "rgdocfile" TEXT,
    "fotofile" TEXT,
    "compresfile" TEXT,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "analise" BOOLEAN NOT NULL DEFAULT true,
    "nome" TEXT,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "nascimentodata" TEXT,
    "nomemae" TEXT,
    "nomepai" TEXT,
    "unidadeId" INTEGER NOT NULL DEFAULT 1,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefone" TEXT,
    "rgdocfile" TEXT,
    "fotofile" TEXT,
    "compresfile" TEXT,
    "laudofile" TEXT,
    "relescolar" TEXT,
    "gestacao" JSONB,
    "nascimento" JSONB,
    "autonomia" JSONB,
    "comportamento" JSONB,
    "desenvolimento" JSONB,
    "pedagogico" JSONB,
    "geral" JSONB,
    "mae" JSONB,
    "pai" JSONB,
    "maisinfo" JSONB,
    "escola" JSONB,
    "saudeinfo" JSONB,
    "raca" "Raca",

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,

    CONSTRAINT "Unidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "expireIn" INTEGER NOT NULL,
    "pacienteId" TEXT,
    "colaboradorId" TEXT,
    "gerenteId" TEXT,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PacienteColaboradores" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Gerente_cpf_key" ON "Gerente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Gerente_rg_key" ON "Gerente"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "Gerente_email_key" ON "Gerente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Gerente_telefone_key" ON "Gerente"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_cpf_key" ON "Colaborador"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_rg_key" ON "Colaborador"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_telefone_key" ON "Colaborador"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_email_key" ON "Colaborador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PacienteColaboradores_AB_unique" ON "_PacienteColaboradores"("A", "B");

-- CreateIndex
CREATE INDEX "_PacienteColaboradores_B_index" ON "_PacienteColaboradores"("B");

-- AddForeignKey
ALTER TABLE "Gerente" ADD CONSTRAINT "Gerente_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colaborador" ADD CONSTRAINT "Colaborador_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_gerenteId_fkey" FOREIGN KEY ("gerenteId") REFERENCES "Gerente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PacienteColaboradores" ADD CONSTRAINT "_PacienteColaboradores_A_fkey" FOREIGN KEY ("A") REFERENCES "Colaborador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PacienteColaboradores" ADD CONSTRAINT "_PacienteColaboradores_B_fkey" FOREIGN KEY ("B") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
