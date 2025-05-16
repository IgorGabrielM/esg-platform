import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, password } = req.body
        const user = await prisma.user.create({
            data: { name, email, password },
        })
        res.status(201).json(user)
    } else {
        res.status(405).json({ message: 'Método não permitido' })
    }
}
