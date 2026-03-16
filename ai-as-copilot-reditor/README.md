# I rebuilt a project from scratch in under 24 hours — using AI as my Copilot

Not "AI built it for me." I built it — with AI as an extension of my thinking.

Let me tell you what actually happened.

---

## The idea

I wanted a simple tool: **edit server files from the browser**. No SSH client, no SCP, no copying files back and forth. Just run a command on the server, open a URL, and edit.

That became [REDITOR](https://github.com/arielpchara/reditor-refactored).

The first version was more concept than product. So I decided to rebuild it from scratch — properly. With architecture, tests, security, a real CLI. And I set myself a constraint: do it in under 24 hours.

---

## What I actually shipped

- **52 commits, 69 files, ~3,600 lines of code, ~1,200 lines of tests**
- A CLI tool runnable directly via `npx` — no install needed
- Browser-based file editor (React + Vite) with syntax highlighting via `prism-code-editor`
- HTTPS with auto-generated self-signed certificate
- OTP authentication: a one-time password printed in the terminal, entered in the browser
- JWT (RS256) after OTP exchange — with configurable TTL and persistent RSA keys
- Brute-force protection: server exits after 3 failed OTP attempts
- Startup validation: fails fast if the file doesn't exist, is a directory, exceeds 512 KB, or contains binary content
- Structured logging with Winston

```sh
npx github:arielpchara/reditor-refactored serve ./any-file.txt
```

The OTP shows in the terminal. Paste it in the browser. Done.

---

## The architecture came first

Before writing a single line of code with AI, I architected everything myself.

I wrote an `AGENTS.md` — 356 lines defining:

- **Hexagonal architecture** (domain, application, infrastructure layers)
- **Coding conventions** (naming, file structure, import rules)
- **Dependency rules** (what can import what)
- **Test patterns** (unit, integration, how to mock ports)
- **Commit conventions**

This is not a README. This is an instruction set for the AI — a contract it must follow.

Then I created **5 Skills**: specialized instruction files that teach the AI how to perform specific recurring tasks:

| Skill | Purpose |
|---|---|
| `commit` | Format and structure commit messages following conventions |
| `update-docs` | Keep documentation in sync with code changes |
| `http-scenarios` | Generate HTTP test scenarios from endpoints |
| `bump-version` | Manage semantic versioning |
| `track-ai-usage` | Log which parts were AI-assisted |

**I set the rules. The AI executed. I reviewed and steered.**

---

## Things changed mid-flight — that's real development

The project didn't follow a straight line, even with AI:

- Plain HTML → **React + Vite** (the UI needed proper component state)
- `tsc` → **esbuild** (for a lightweight, fast `npx`-ready bundle)
- The UI was redesigned **twice**

Every pivot required re-evaluating decisions, updating the architecture, and steering the AI back to the new direction. That's not a failure of the process — that's software development.

---

## Not all models are equal

I tested several models during this session. Here's the honest breakdown:

### Claude Sonnet — the sweet spot ✅
Understood the Skills system. Followed conventions consistently. Produced code that matched the architecture without constant correction. Reasonable token cost for long sessions.

### Claude Opus — powerful but expensive ⚠️
More capable on complex reasoning tasks, but burned through tokens fast. Not sustainable for a 21-hour session with constant back-and-forth.

### Claude Haiku — too limited for this ❌
Couldn't handle complex multi-step tasks. Failed to follow the Skills instructions properly. Good for isolated, simple tasks — not for architectural work.

### Codex (OpenAI) — ignored the skills system ❌
Generated code outside the defined conventions. Treated the Skills files as optional hints instead of hard rules. Required significantly more correction.

---

## The moment AI starts to degrade

There were several moments during the session where the AI visibly started to drift:

- Context too long → it started forgetting previous architectural decisions
- Proposing unnecessary refactors for things that were already correct
- Generating code that contradicted conventions it had followed 10 commits earlier

The fix every time: **clear the context, start a fresh session, re-anchor to the AGENTS.md**.

This is the part no one talks about. AI doesn't degrade in a dramatic way — it degrades gradually. A slightly wrong import here, a convention ignored there. If you're not reviewing carefully, it compounds.

---

## The lesson

> **AI is a tool, not autopilot. The output quality is directly proportional to the quality of your instructions and your supervision.**

The AGENTS.md and Skills system are what made this work. Without them, I'd have spent as much time correcting the AI as I would have spent writing the code myself.

If you want to use AI effectively on a real project:

1. **Architect first** — define structure, conventions, and boundaries before involving AI
2. **Write explicit instructions** — `AGENTS.md`, skill files, or equivalent. Be specific, not vague
3. **Review everything** — AI is fast at generating; you need to be fast at evaluating
4. **Manage context actively** — long sessions degrade. Reset when you see drift
5. **Choose the right model** — capability, cost, and instruction-following are different axes

---

## Try it

```sh
npx github:arielpchara/reditor-refactored serve ./any-file.txt
```

Requires Node.js ≥ 18. On first run it builds from source — subsequent runs use the npm cache.

Source: [github.com/arielpchara/reditor-refactored](https://github.com/arielpchara/reditor-refactored)

---

52 commits. 69 files. ~3,600 lines of code. 5 skills. 1 AGENTS.md. Under 24 hours.

The AI didn't build this. **I did — with AI as an extension of my thinking.**
