import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import speakeasy from "speakeasy";
import Twilio from './twilio';

const prisma = new PrismaClient();




export const sendSMS = async (request: Request, response: Response) => {
    const { telefone } = request.body; // Assumindo que você recebe o número de telefone

    try {
        const userGerente = await prisma.gerente.findUnique({ where: { telefone} });

        if (!userGerente) {
            return response.status(404).json({ error: "Gerente não encontrado." });
        }

        // Gerar o código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000);

        // Salvar o código no banco de dados (por um tempo limitado)
        await prisma.gerente.update({
            where: { telefone },
            data: { twoFASecret: code, verificationCodeExpires: new Date(Date.now() + 300000) }, // Expira em 5 minutos
        });

        // Enviar o SMS usando Twilio
        const message = await twilio.messages.create({
            body: `Seu código de verificação é: ${code}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: telefone,
        });

        console.log(message.sid);

        return response.status(200).json({ message: "Código de verificação enviado por SMS." });
    } catch (error) {
        console.error(error);
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

        // Gerar o secret se ainda não existir
        if (!userGerente.twoFASecret) {
            const secret = speakeasy.generateSecret();
            await prisma.gerente.update({
                where: { email },
                data: { twoFASecret: secret.base32 },
            });
            userGerente.twoFASecret = secret.base32;
        }

        // Gerar o link otpauth
        const otpAuthUrl = speakeasy.otpauthURL({
            secret: userGerente.twoFASecret,
            label: userGerente.email,
            issuer: "Meu App",
            encoding: "base32",
        });

        // Configurar o transporte do e-mail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "juliomoreira0111@gmail.com",
                pass: "",
            },
        });

        // Enviar o e-mail
        await transporter.sendMail({
            from: `"Equipe Meu App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Configuração de autenticação de dois fatores",
            html: `
                <p>Olá <strong>${userGerente.nome}</strong>,</p>
                <p>
                    Para ativar a autenticação de dois fatores em sua conta, clique no link abaixo:<br>
                    <a href="${otpAuthUrl}" target="_blank">${otpAuthUrl}</a>
                </p>
                <p>
                    Se preferir, você também pode usar o seguinte código no aplicativo de autenticação:<br>
                    <strong>${userGerente.twoFASecret}</strong>
                </p>
                <p>Atenciosamente,<br>Equipe Meu App</p>
            `,
        });

        return response.status(200).json({ message: "E-mail enviado com sucesso!" });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Erro ao processar a solicitação." });
    }


};
