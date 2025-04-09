import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import dayjs from "dayjs";

const prisma = new PrismaClient();

class RefreshTokenUserUseCase {
    async execute(refresh_token: string) {
        const refreshToken = await prisma.refreshToken.findFirst({
            where: { id: refresh_token },
        });

        if (!refreshToken) {
            throw new Error("Invalid refresh token");
        }

        const isExpired = dayjs().unix() > refreshToken.expireIn;
        if (isExpired) {
            throw new Error("Refresh token expired");
        }

        const userId = this.identifyUserFromToken(refreshToken);

        if (!userId) {
            throw new Error("Nenhum usuário válido associado ao refresh token");
        }

        const newExpireIn = dayjs().add(900, "seconds").unix();
        await prisma.refreshToken.update({
            where: { id: refresh_token },
            data: { expireIn: newExpireIn },
        });

        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "900s" });

        return { token, newExpireIn, userId };
    }

    private identifyUserFromToken(refreshToken: {
        id: string;
        expireIn: number;
        pacienteId: string | null;
        colaboradorId: string | null;
        gerenteId: string | null;
    }): string | null {
        if (refreshToken.gerenteId) {
            return refreshToken.gerenteId;
        } else if (refreshToken.colaboradorId) {
            return refreshToken.colaboradorId;
        } else if (refreshToken.pacienteId) {
            return refreshToken.pacienteId;
        }
        return null;
    }
}

export { RefreshTokenUserUseCase };
