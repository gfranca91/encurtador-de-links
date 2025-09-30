import { useState, FormEvent } from "react";
import Head from "next/head";

export default function HomePage() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setShortUrl("");
    setError("");
    if (!longUrl) {
      setError("Por favor, insira uma URL.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: longUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ocorreu um erro.");
      }
      setShortUrl(data.shortUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("URL copiada para a área de transferência!");
  };

  return (
    <>
      <Head>
        <title>Encurtador de Link Grátis - Diminua e Personalize URLs</title>

        <meta
          name="description"
          content="Encurte links longos de forma rápida e gratuita. Nossa ferramenta de encurtamento de URL é perfeita para redes sociais, marketing e para compartilhar links de maneira fácil."
        />

        <meta
          name="keywords"
          content="encurtador de link, encurtador de url, diminuir link, link curto, gerador de link curto, encurtador grátis"
        />

        <link
          rel="canonical"
          href="https://encurtador-de-links-chi.vercel.app/"
        />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center text-cyan-400">
            Encurtador de Link Grátis e Rápido
          </h1>
          <p className="text-center text-gray-400">
            Cole sua URL longa abaixo para gerar uma curta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://exemplo-de-url-muito-longa.com/etc"
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-semibold text-gray-900 bg-cyan-400 rounded-md hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Encurtando..." : "Encurtar URL"}
            </button>
          </form>

          {shortUrl && (
            <div className="p-4 mt-4 text-center bg-gray-700 rounded-md">
              <p className="text-gray-300">Sua URL curta está pronta:</p>
              <div className="flex items-center justify-center mt-2 space-x-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-cyan-400 hover:underline"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  title="Copiar"
                  className="p-2 bg-gray-600 rounded-md hover:bg-gray-500"
                >
                  📋
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 mt-4 text-center text-red-400 bg-red-900/50 rounded-md">
              <p>{error}</p>
            </div>
          )}
        </div>
        <section className="w-full max-w-lg mt-12 text-gray-400 text-left p-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            O que é um Encurtador de Links?
          </h2>
          <p className="mb-4">
            Um encurtador de links, ou encurtador de URL, é uma ferramenta
            online que transforma um endereço web longo e complicado em um link
            curto, fácil de lembrar e compartilhar. É ideal para postagens no
            Twitter, Instagram, ou qualquer lugar onde o espaço é limitado.
          </p>
          <h3 className="text-xl font-bold text-white mb-2">
            Vantagens de usar nossa ferramenta:
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Totalmente Gratuito:</strong> Crie quantos links curtos
              precisar, sem custo.
            </li>
            <li>
              <strong>Rápido e Fácil:</strong> Cole sua URL, clique em encurtar
              e pronto!
            </li>
            <li>
              <strong>Perfeito para Marketing:</strong> Links curtos são mais
              atraentes em campanhas e materiais de divulgação.
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
