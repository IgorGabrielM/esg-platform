import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { name, email, password } = req.body;
        try {
            const user = await prisma.user.create({
                data: { name, email, password },
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar usuário', error });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
