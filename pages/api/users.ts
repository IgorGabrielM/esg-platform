import { PrismaClient } from '@prisma/client'
import {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const users = await prisma.user.findMany()
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuários', error })
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' })
    }
}
