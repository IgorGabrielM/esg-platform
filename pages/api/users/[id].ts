import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
            });

            if (user) {
                let imageBase64 = null;
                if (user.imageBytes) {
                    imageBase64 = Buffer.from(user.imageBytes).toString('base64');
                }
                res.status(200).json({ ...user, image: imageBase64 });
            } else {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuário', error });
        }
    } else if (req.method === 'DELETE') {
        try {
            const deletedUser = await prisma.user.delete({
                where: { id: Number(id) },
            });
            res.status(200).json({ message: 'Usuário deletado com sucesso', user: deletedUser });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar usuário', error });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
