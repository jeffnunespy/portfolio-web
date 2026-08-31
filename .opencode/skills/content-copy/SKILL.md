---
name: content-copy
provider: local
model: "claude-3-5-sonnet"
description: Revisar/redigir textos do portfólio garantindo Princípio X (veracidade), tom pt-BR, consistência e sem invenção. Use após adicionar/editar perfil ou projeto, ou para auditoria de conteúdo de texto.
compatibility: opencode
metadata:
  audience: developers
  workflow: content-review
---

# content-copy

Este skill implementa o Princípio X (Uso responsável de IA) mais Princípio I (Evidências acima de afirmações), Princípio VII (Acessibilidade e experiência consistente) em um único workflow de revisão de texto. Ele reescreve frases inventadas ou inconsistentes em linguagem simples e verificável, mantendo o tom português de um desenvolvedor.

## 1. Coletar evidências reais

Antes de corrigir qualquer texto, solicitar evidências do usuário:

```
Problemas potenciais que requerem verificação:

1. Métricas inventadas
   - Afirmações: "reduziu 30% do tempo de execução", "500+ usuários ativos", "100% de uptime"
   - Perguntar: "Qual é a fonte dessa métrica? Forneça a origem original"

2. Contexto profissional inventado
   - Afirmações: "Trabalhei no desenvolvimento de aplicações cloud em uma startup SaaS"
   - Perguntar: "Qual foi o cargo específico? Quais tecnologias e tempo estavam envolvidos?"

3. Decisão arquitetural inventada
   - Afirmações: "Optei por um monolito em Go por causa do escalonamento crítico"
   - Perguntar: "Qual era o problema de design que esse monolite resolveu? Escreva uma breve explicação técnica"

4. Responsabilidade do proprietário não comprovada
   - Afirmações: "Fui responsável pela integração do usuário"
   - Perguntar: "Quem mais estava envolvido? Qual era o seu papel exato?"

5. Resultados de validação de usuário inventados
   - Afirmações: "50 usuários testaram, todos adoraram"
   - Perguntar: "Quando e como a validação foi realizada? Forneça o feedback real"

6. Texto fabricado para campos obrigatórios
   - Afirmações: frase plausível para qualquer campo do JSON
   - Perguntar: "Esta afirmação corresponde a uma fonte independente? Se sim, qual?"
```

Se o usuário se recusar a provar, reportar como "Invenção não verificável" e parar de editar esse campo.

## 2. Revisão da redação

### A. Verificação de dados críticos
- [ ] Field que afirma um resultado:
  - `projeto.problemaTratado`
  - `projeto.responsabilidadeProprietario`
  - `projeto.resultados`
  - `perfil.tituloPosicionamento`
  - `perfil.descricaoPosicionamento`

Para cada um:
1. Sinalizar qualquer frase sem origem verificável
2. Substituir por: "O problema era X, que foi resolvido implementando Y"
3. Garantir que cada número venha de uma fonte específica

### B. Verificação de consistência
- [ ] Tom entre projetos: comparar `contexto` de cada projeto:
  - Todos profissionais? (se natureza="profissional")
  - Mesmo nível de formalidade? (perguntar se "reduziu 30%" é usado em outro lugar)
- [ ] Gramática: marcar erro:
  - "Usando Node.js, eu implementei APIs REST"
  - Corrigir para: "Usando Node.js, implementei APIs REST"
- [ ] Semânticas de link e botão:
  - Garantir que `linkDemonstracao` aponta para uma URL externa real
  - Garantir que `linkRepositorio` usa a string literal "privado" quando é privado

### C. Checklist de ortografia e acentuação (pt-BR)
- [ ] Palavras que deveriam ter diacrítico e estão sem (lista completa):
  - "concluido", "portfolio", "experiencia", "codigo", "tecnicas"
  - "responsabilidade", "realizado", "desenvolvido", "implementado"
- [ ] Consistência de acentuação dentro de um objeto (cada termo deve aparecer
  da mesma forma em todos os campos onde é citado).

### D. Verificação de evidência
- [ ] Todos os verbos no passado quando o trabalho foi realizado:
  - Alterar "Quero implementar" para "Implementei"
- [ ] Atribuição de crédito clara:
  - "Nós desenvolvemos” → "Eu desenvolvi" (se o trabalho foi individual)

## 3. Gerar a redação corrigida

**Padrão para problemaTratado:**

```
Original: "Desenvolvimento de API para reduzir o tempo de resposta"
Corrigido:  "Desenvolvimento de API REST em Node.js que reduziu o tempo de resposta de 500ms para 150ms."
```

**Padrão para responsabilidadeProprietario:**

```
Original: "Fui responsável pela arquitetura de microsserviços"
Corrigido:  "Projetei e implementei a arquitetura de microsserviços usando Docker e Kubernetes, implementando cada serviço e garantindo a comunicação via gRPC."
```

**Padrão para objetivos:**

```
Original: "Objetivo: sistemas confiáveis"
Corrigido:  "Objetivo: projetar e implementar sistemas confiáveis com alta disponibilidade (>=99,9%) usando CloudWatch e autoescalonamento."
```

**Padrão para funcionalidadesPrincipais:**

```
Original: "Banco de dados, front-end"
Corrigido:  "Modelagem de dados no PostgreSQL, front-end em Next.js com renderização do lado do servidor e autenticação JWT."
```

## 4. Validar o conteúdo final

1. **Re-executar testes de validação de conteúdo:**
   - `npx vitest run tests/unit/content.test.ts`
   - Se passar, executar E2E do conteúdo alterado

2. **Rodar os testes de acessibilidade do diff:**
   - `npx playwright test tests/e2e/home.a11y.spec.ts tests/e2e/project-detail.a11y.spec.ts`

3. **Verificar o lint e typecheck:**
   - `npm run lint`
   - `npm run typecheck`

## 5. Reportar o redato texto

```
## Revisão de redação — <arquivo>/<campo>

### Original
"<frase original>"

### Corrigido
"<frase corrigida>"

### Justificativa

- [ ] O texto contém verbos no presente sem evidência de cronologia
- [ ] Consertado para dizer "Fui responsável por" → "Implementei"
- [ ] Garantir um verbo no passado que indique fato real
- [ ] Lista de qualquer erro de ortografia encontrado: "concluido" → "concluído"

### Status da evidência
✅ A origem verificável para X foi revisada
✅ Termo comparativo de ortografia pt-BR verificado

### Acertividade
Pronto para commit (texto validado contra Princípio I, X, VII)
```

Se algum campo não puder ser validado com evidência concreta, parar de editar e reportar como pendente para o usuário confirmar antes de publicar.
