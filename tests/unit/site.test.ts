import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "../../lib/site";

describe("origem pública do site", () => {
  it("normaliza uma origem HTTPS explícita", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: " https://Portfolio.example:443/ " })).toBe(
      "https://portfolio.example",
    );
  });

  it.each(["development", "test"])("permite fallback local em %s", (NODE_ENV) => {
    expect(resolveSiteUrl({ NODE_ENV })).toBe("http://localhost:3000");
  });

  it.each(["http://localhost:3001", "http://127.0.0.1:3001", "http://[::1]:3001"])(
    "permite build/start local explícito em %s",
    (NEXT_PUBLIC_SITE_URL) => {
      expect(resolveSiteUrl({ NODE_ENV: "production", NEXT_PUBLIC_SITE_URL })).toBe(
        NEXT_PUBLIC_SITE_URL,
      );
    },
  );

  it("recusa produção sem origem e não usa host de preview como fallback", () => {
    expect(() =>
      resolveSiteUrl({ NODE_ENV: "production", VERCEL_URL: "preview.vercel.app" }),
    ).toThrow(/Defina NEXT_PUBLIC_SITE_URL/);
    expect(() =>
      resolveSiteUrl({ VERCEL_ENV: "production", VERCEL_URL: "preview.vercel.app" }),
    ).toThrow(/Defina NEXT_PUBLIC_SITE_URL/);
  });

  it("usa VERCEL_URL apenas para preview declarado", () => {
    expect(
      resolveSiteUrl({
        NODE_ENV: "production",
        VERCEL_ENV: "preview",
        VERCEL_URL: "portfolio-preview.vercel.app",
      }),
    ).toBe("https://portfolio-preview.vercel.app");
    expect(resolveSiteUrl({ NODE_ENV: "development", VERCEL_URL: "ignorado.vercel.app" })).toBe(
      "http://localhost:3000",
    );
  });

  it("origem explícita tem precedência no preview", () => {
    expect(
      resolveSiteUrl({
        VERCEL_ENV: "preview",
        NEXT_PUBLIC_SITE_URL: "https://portfolio.example",
        VERCEL_URL: "preview.vercel.app",
      }),
    ).toBe("https://portfolio.example");
  });

  it.each([
    undefined,
    "",
    "https://preview.vercel.app",
    "preview.vercel.app/path",
    "preview.vercel.app.evil.example",
    "user@preview.vercel.app",
    "localhost:3000",
  ])("recusa hostname de preview inválido: %s", (VERCEL_URL) => {
    expect(() => resolveSiteUrl({ VERCEL_ENV: "preview", VERCEL_URL })).toThrow(/Preview exige/);
  });

  it.each([
    "",
    " ",
    "portfolio.example",
    "//portfolio.example",
    "https:portfolio.example",
    "https:///portfolio.example",
    "javascript:alert(1)",
    "data:text/html,test",
    "ftp://portfolio.example",
    "http://portfolio.example",
    "http://192.168.1.1",
    "https://user:password@portfolio.example",
    "https://portfolio.example/path",
    "https://portfolio.example/path/..",
    "https://portfolio.example/?query=1",
    "https://portfolio.example/?",
    "https://portfolio.example/#fragment",
    "https://portfolio.example/#",
    "https://portfolio.example\\path",
    "https://port folio.example",
    "https://portfolio.example\n.invalid",
  ])("recusa configuração inválida sem fallback: %s", (NEXT_PUBLIC_SITE_URL) => {
    expect(() =>
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL, VERCEL_ENV: "preview", VERCEL_URL: "ok.vercel.app" }),
    ).toThrow(/deve ser uma origem/);
  });

  it.each(["production", "preview"])("recusa loopback em deploy %s", (VERCEL_ENV) => {
    expect(() =>
      resolveSiteUrl({ VERCEL_ENV, NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }),
    ).toThrow(/deve ser uma origem/);
    expect(() => resolveSiteUrl({ VERCEL_ENV, NEXT_PUBLIC_SITE_URL: "https://127.0.0.1" })).toThrow(
      /deve ser uma origem/,
    );
  });

  it("não reproduz credenciais acidentais na mensagem de erro", () => {
    expect(() =>
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://user:password@portfolio.example" }),
    ).toThrow(/^NEXT_PUBLIC_SITE_URL deve ser uma origem HTTPS, ou HTTP de loopback local\.$/);
  });
});
