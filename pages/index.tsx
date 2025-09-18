// pages/index.tsx

import { useState, FormEvent } from "react";
import Head from "next/head";

export default function HomePage() {
  // --- Estados do nosso componente ---

  // Guarda a URL longa que o usuário digita.
  const [longUrl, setLongUrl] = useState("");

  // Guarda a URL curta que nossa API retorna.
  const [shortUrl, setShortUrl] = useState("");

  // Controla o estado de "carregando" para o botão.
  const [isLoading, setIsLoading] = useState(false);

  // Guarda mensagens de erro.
  const [error, setError] = useState("");

  // --- Lógica para lidar com o envio do formulário ---
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Previne o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault();

    // Reseta os estados antes de uma nova requisição
    setIsLoading(true);
    setShortUrl("");
    setError("");

    // Validação simples no frontend
    if (!longUrl) {
      setError("Por favor, insira uma URL.");
      setIsLoading(false);
      return;
    }

    try {
      // Faz a chamada para a nossa API (o backend que criamos no Passo 3)
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: longUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a API retornar um erro (ex: URL inválida), nós o capturamos aqui.
        throw new Error(data.message || "Ocorreu um erro.");
      }

      // --- SUCESSO! ---
      setShortUrl(data.shortUrl);

      // >>> Ponto 1 da Monetização: Anúncio Pop-up <<<
      // Abre uma nova aba com o anúncio. Substitua a URL pela do seu parceiro de anúncios.
      window.open("https://www.google.com", "_blank");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      // Garante que o estado de "carregando" seja desativado no final.
      setIsLoading(false);
    }
  };

  // Função para copiar a URL curta para a área de transferência
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("URL copiada para a área de transferência!");
  };

  // --- Estrutura Visual (JSX e Tailwind CSS) ---
  return (
    <>
      <Head>
        <title>Encurtador de Links</title>
        <meta
          name="description"
          content="Encurtador de links simples e monetizado"
        />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center text-cyan-400">
            Encurtador de Links
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

          {/* Área de Resultado: URL Curta */}
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

          {/* Área de Resultado: Erro */}
          {error && (
            <div className="p-3 mt-4 text-center text-red-400 bg-red-900/50 rounded-md">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* >>> Ponto 2 da Monetização: Anúncio em Banner <<< */}
        <div className="w-full max-w-lg mt-8 h-24 bg-gray-700/50 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">[ Espaço para Anúncio em Banner ]</p>
        </div>
      </main>
    </>
  );
}
