---
name: dependency-audit
description: Princípio VI da constituição: executa npm audit, verifica Dependabot config e detecta expoentes. Use ao modificar package.json, adicionar dependência nova ou quando o usuário pedir auditoria de segurança.
compatibility: opencode
metadata:
  audience: developers
  workflow: security-review
---

# dependency-audit

Esta skill implementa o Princípio VI (Segurança e privacidade desde o início) da constituição. Audita tanto dependências em tempo real (npm audit, segurança e vulnerabilidades) quanto verificação contínua (Dependabot, issues).

## 1. Verificação automática em tempo real

```bash
npm audit --omit=dev --audit-level=high
# Se usar Dependabot:
#   Dependabot alerta e aprova automaticamente atualizações de segurança
```

**O que procura:**
- Vulnerabilidades high/critical reportadas pelo `npm audit`
- Pacotes sem publicação há mais de 2 anos (sem manutenção)
- Vulnerabilidades conhecidas em pacotes amplamente usados (ex.: `ws`, `axios`)

## 2. Verificação de configuração em tempo real

**Dependabot** (`.github/dependabot.yml`):
- Exige `security-updates: true`
- Define `labels: ["security"]`
- Autoriza atualizações automáticas de segurança por major version bump

**npm audit regular**
- Armazena no `package-lock.json`
- Permite `npm audit fix` para atualizações triviais

## 3. O que faz

- Reporta o status de segurança de cada dependência (seguro, vulnerável, pendente)
- Identifica a causa:
  - `dependabot.json`
  - `security-updates`
  - manutenção adequada
- Oferece correção concreta para cada vulnerabilidade (atualização de versão)

## 4. Regras de julgamento

- Nenhuma correção recomendada sem justificativa concreta (ex.: versão insegura)
- Se encontrar `$audit: ignore` no `package.json`, pergunte ao usuário sobre a regra de ignorar
- Se Dependabot estiver desativado, proponha ativação em seguida
- Nenhuma execução sem permissão explícita (FR-012)

## 5. Formato do relatório

```
## Auditoria de segurança

### 🔒 Seguro (2 dependências)
- react: ^19.2.8 (última)
- next: ^16.3.1 (última)

### ⚠️ Vulnerável (1 dependência)
- ws: 2.0.0 (CVE-XXXX) → atualizar para ^2.0.1

### ✅ Dependabot ativo
- Configurado em `.github/dependabot.yml`
- security-updates: true

### ✗ Dependabot desativado
- Adicione `security-updates: true` a `.github/dependabot.yml`

### Veredito
- Safe to proceed / Manual intervention required
```