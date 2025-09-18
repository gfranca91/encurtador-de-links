import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Inicializa o cliente do Prisma
const prisma = new PrismaClient();

// Função para gerar um código aleatório (nosso "slug")
const generateSlug = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < 7; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Aceitamos apenas requisições do tipo POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url } = req.body;

  // Validação simples da URL
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return res.status(400).json({ message: "URL inválida." });
  }

  try {
    let slug = generateSlug();

    // Prevenindo colisões: verifica se o slug já existe e gera um novo se necessário
    let existingLink = await prisma.link.findUnique({ where: { slug } });
    while (existingLink) {
      slug = generateSlug();
      existingLink = await prisma.link.findUnique({ where: { slug } });
    }

    // Salva o novo link no banco de dados
    const newLink = await prisma.link.create({
      data: {
        url: url,
        slug: slug,
      },
    });

    // Retorna a URL curta completa
    const shortUrl = `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"
    }/${slug}`;

    return res.status(200).json({ shortUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
