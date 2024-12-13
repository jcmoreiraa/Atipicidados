import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import speakeasy from "speakeasy";
import Twilio from "twilio";

const prisma = new PrismaClient();
const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);




export const sendSMS = async (request: Request, response: Response) => {
    const { telefone } = request.body; // Assumindo que você recebe o número de telefone

    try {
        // Verifica se o Gerente existe
        const userGerente = await prisma.gerente.findUnique({
            where: { telefone },
        });

        if (!userGerente) {
            return response.status(404).json({ error: "Gerente não encontrado." });
        }

        // Gerar o código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000);

        // Salvar o código no banco de dados
        await prisma.gerente.update({
            where: { telefone },
            data: {
                twoFASecret: code.toString(), // Salva o código como uma string
            },
        });

        // Enviar o SMS usando Twilio
        const message = await twilioClient.messages.create({
            body: `Seu código de verificação é: ${code}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: telefone,
        });

        console.log(`Mensagem enviada com SID: ${message.sid}`);

        return response.status(200).json({ message: "Código de verificação enviado por SMS." });
    } catch (error) {
        console.error("Erro no envio de SMS:", error);
        return response.status(500).json({ error: "Erro ao processar a solicitação." });
    }
};

export const sendMail = async (request: Request, response: Response) => {
    const { email } = request.body;

    try {
        const userGerente = await prisma.gerente.findUnique({ where: { email } });

        if (!userGerente) {
            return response.status(404).json({ error: "Gerente não encontrado." });
        }

        // Gerar o código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000);

        // Atualizar o código no banco de dados
        await prisma.gerente.update({
            where: { email },
            data: { twoFASecret: code.toString() }, // Salvar o código como string
        });

        // Configurar o transporte do e-mail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Ignorar erro de certificado
            },
        });


        // Enviar o e-mail
        await transporter.sendMail({
            from: `"Equipe Meu App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Código de Verificação",
            html: `
                <p>Olá <strong>${userGerente.nome}</strong>,</p>
                <p>Seu código de verificação é:</p>
                <h2>${code}</h2>
                <p>O código expira em 5 minutos.</p>
                <p>Atenciosamente,<br>Equipe Meu App</p>
            `,
        },);

        return response.status(200).json({ message: "E-mail com o código enviado com sucesso!" });
    } catch (error) {
        console.error("Erro ao enviar o e-mail:", error);
        return response.status(500).json({ error: "Erro ao processar a solicitação." });
    }
};
