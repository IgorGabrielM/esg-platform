import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
            });
            if (user) {
                res.status(200).json(user);
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
