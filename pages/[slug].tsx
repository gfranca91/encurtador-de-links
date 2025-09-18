// pages/[slug].tsx

import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";

// Este componente React na verdade não será visto pelo usuário na maioria das vezes.
// Ele serve como um fallback caso o redirecionamento demore.
const SlugPage = () => {
  return <p>Redirecionando...</p>;
};

// Esta é a função principal que roda no SERVIDOR a cada requisição.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();

  // 1. Pegamos o 'slug' da URL. Ex: se a URL for /aB1cDe2, slug será 'aB1cDe2'.
  const { slug } = context.params as { slug: string };

  try {
    // 2. Procuramos no banco de dados por um link com este slug.
    const link = await prisma.link.findUnique({
      where: {
        slug: slug,
      },
    });

    // 3. Se encontrarmos o link...
    if (link) {
      return {
        redirect: {
          destination: link.url, // ...redirecionamos o usuário para a URL longa original.
          permanent: false, // Dizemos que é um redirecionamento não-permanente.
        },
      };
    }
  } catch (error) {
    console.error("Erro ao buscar o link:", error);
  }

  // 4. Se não encontrarmos o link no banco, mostramos uma página 404.
  return {
    notFound: true,
  };
};

export default SlugPage;
