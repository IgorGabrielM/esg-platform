import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import Errors from "undici-types/errors";
import HTTPParserError = Errors.HTTPParserError;

export const config = {
    api: {
        bodyParser: false,
    },
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
                    console.error("Caminho do arquivo não encontrado.");
                    return res.status(500).json({ error: 'Erro ao ler o arquivo enviado.' });
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
            } catch (error: unknown) {
                // Se o erro for por violação de unicidade, ex: email já cadastrado
                if (error instanceof Error && (error as HTTPParserError).code === 'P2002') {
                    return res.status(409).json({ error: 'Email já cadastrado' });
                }
                console.error("Erro ao criar usuário:", error);
                return res.status(500).json({ error: 'Erro ao criar usuário:', body: error });
            }
        });
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
}
