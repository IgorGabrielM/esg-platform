import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const form = new IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Erro ao processar o formulário:", err);
                return res.status(500).json({ error: 'Erro ao processar o formulário' });
            }

            const { name, email, password } = fields;
            let imageBytes: Buffer | null = null;

            if (files.image) {
                const fileObj = Array.isArray(files.image) ? files.image[0] : files.image;
                const filePath = fileObj?.filepath || fileObj?.filepath;
                if (filePath) {
                    imageBytes = fs.readFileSync(filePath);
                } else {
                    console.error("Caminho do arquivo não encontrado na resposta do Formidable.");
                    return res.status(500).json({ error: 'Erro ao ler arquivo enviado.' });
                }
            }

            try {
                const user = await prisma.user.create({
                    data: {
                        name: String(name),
                        email: String(email),
                        password: String(password),
                        imageBytes,
                    },
                });
                return res.status(201).json(user);
            } catch (error) {
                console.error("Erro ao criar usuário:", error);
                return res.status(500).json({ error: 'Erro ao criar usuário' });
            }
        });
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
}
