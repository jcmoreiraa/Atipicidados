import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import dayjs from 'dayjs';

const prisma = new PrismaClient();

class RefreshTokenUserUseCase {
    async execute(refresh_token: string) {
        const refreshToken = await prisma.refreshToken.findFirst({
            where: {
                id : refresh_token
            }
        });

        if (!refreshToken) {
            throw new Error('Invalid refresh token');
        }

        const isExpired = dayjs().unix() > refreshToken.expireIn;
        if (isExpired) {
            throw new Error('Refresh token expired');
        }

        const token = jwt.sign(
            { userId: refreshToken.gerenteId },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token };
    }
}

export { RefreshTokenUserUseCase };
