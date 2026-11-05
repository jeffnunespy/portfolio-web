import { createServer, type ServerResponse } from "node:http";
import { once } from "node:events";

export type ImageMode = "valid" | "transparent" | "network" | "404" | "500" | "invalid";
export const imagePath = "/images/projects/plataforma-portfolio.svg";

function barrier() {
  let release!: () => void;
  const promise = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { promise, release };
}

// Proxy de teste: o HTML/CSS/JS vêm do build real. Apenas transporte da imagem,
// entrega dos scripts e cache são controlados; nenhuma rota do produto é criada.
export async function imageServer(mode: ImageMode, cache = false) {
  const image = barrier();
  const scripts = barrier();
  let requests = 0;
  const paths: string[] = [];
  let finished = false;
  const transparent =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600"><circle cx="500" cy="300" r="180" fill="#ff9a6b"/></svg>';
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url!, "http://localhost").pathname;
      paths.push(pathname);
      if (pathname === "/__aud03/warm") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(
          `<!doctype html><html lang="pt-BR"><title>Cache de teste</title><img src="${imagePath}" alt=""></html>`,
        );
        return;
      }
      if (pathname === "/__aud03/source-b.svg") {
        response.setHeader("Content-Type", "image/svg+xml");
        response.end(transparent);
        return;
      }
      if (pathname === imagePath) {
        requests++;
        await image.promise;
        if (mode === "network") {
          finished = true;
          response.destroy();
          return;
        }
        if (mode === "404" || mode === "500" || mode === "invalid" || mode === "transparent") {
          response.statusCode = mode === "404" ? 404 : mode === "500" ? 500 : 200;
          response.setHeader("Content-Type", mode === "404" ? "text/plain" : "image/svg+xml");
          response.setHeader(
            "Cache-Control",
            cache ? "public, max-age=31536000, immutable" : "no-store",
          );
          response.end(mode === "transparent" ? transparent : "recurso de teste nao decodificavel");
          finished = true;
          return;
        }
      }
      if (
        pathname.startsWith("/_next/") &&
        pathname.includes("/turbopack-") &&
        pathname.endsWith(".js")
      )
        await scripts.promise;
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers)) {
        if (value && !["host", "connection", "accept-encoding"].includes(key))
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
      headers.set("accept-encoding", "identity");
      const upstream = await fetch(`http://localhost:3001${request.url}`, {
        headers,
        redirect: "manual",
      });
      response.statusCode = upstream.status;
      upstream.headers.forEach((value, key) => {
        if (
          !["content-encoding", "content-length", "transfer-encoding", "connection"].includes(key)
        )
          response.setHeader(key, value);
      });
      if (pathname === imagePath)
        response.setHeader(
          "Cache-Control",
          cache ? "public, max-age=31536000, immutable" : "no-store",
        );
      response.end(Buffer.from(await upstream.arrayBuffer()));
      if (pathname === imagePath) finished = true;
    } catch (error) {
      if (!response.destroyed) fail(response, error);
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Proxy sem porta");
  return {
    origin: `http://127.0.0.1:${address.port}`,
    get paths() {
      return paths;
    },
    get requests() {
      return requests;
    },
    get finished() {
      return finished;
    },
    releaseImage: image.release,
    releaseScripts: scripts.release,
    close: async () => {
      image.release();
      scripts.release();
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    },
  };
}

function fail(response: ServerResponse, error: unknown) {
  response.statusCode = 502;
  response.end(error instanceof Error ? error.message : "Falha do proxy de teste");
}
