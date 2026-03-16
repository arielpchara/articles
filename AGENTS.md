# AGENTS.md — Author's Voice & Writing Conventions

This file defines the writing style, tone, and conventions for articles in this repository.
Any AI agent generating, editing, or translating content must follow these instructions.

---

## Identity

The author is a software engineer writing from personal experience.
Every article is a conversation — not a lecture, not documentation, not a manual.
The author shares a way of thinking, not a set of rules.

---

## Tone

**Conversational, not formal.**
Write as if explaining something to a colleague, not presenting to an audience.

**Propositional, not prescriptive.**
Suggest, don't command. The author never says "you must do this." Preferred phrasings:
- "pode ser que..." / "maybe..."
- "acredito ser..." / "I believe..."
- "resolvi escrever meu ponto de vista" / "I decided to share my point of view"
- "vale desfazer antes de continuar" / "worth clearing up before we go further"

**Experience-based, not authoritative.**
Motivation always comes from something the author lived, read, or discussed.
Never from a generic external authority.

**First person singular, then second person.**
The author speaks from "I" and moves toward "you" — not from a neutral "one" or "we" (except when inviting the reader into a shared journey: "vamos separar" / "let's split").

---

## Structure

**Context before technique.**
Always build a real-world scenario or motivation before introducing any code or concept.

**"Journey" as the primary structural metaphor.**
Sections are journeys, not steps. Use:
- "Jornada de..." / "... journey"
- "Agora começa a jornada dos testes" / "Now the test journey begins"
- Never "Step 1, Step 2, Step 3" as the top-level structure.

**Scenario block in telegraphic style.**
When describing a project scenario, use short one-line bullets — no full paragraphs:

```
The project has several products, and one team per product.
There is a strong need to reuse code across all products.
Each team specializes in solving business problems.
```

Not:
```
The project is composed of several products. Each product has its own dedicated team,
and there is a strong organizational need to share code between all of them.
```

**No horizontal rules (`---`) between every section.**
Use sparingly — only for major structural breaks, not between every heading.

**No summary tables for concepts** unless the content is genuinely comparative.
Avoid converting prose into tables just to look organized.

---

## Formatting

**Bold for emphasis on what matters, not for decoration.**
Only bold things the reader must not miss. Do not bold entire phrases.

**Quotes (`"`) to humanize technical terms.**
When borrowing a word from another domain (e.g., "client" when referring to developers), use quotes.
```
O "cliente" deste produto serão os outros desenvolvedores.
The "clients" of this product will be the other developers.
```

**Parentheses to reinforce, not to explain.**
The author presumes the reader understands. Parentheses anchor context, not definitions:
```
estrutura tecnológica para receber as necessidades do produto (business)
to receive the needs of the product (business)
```

**Misconceptions as inline prose, not a formatted list.**
Bad:
```
| Misconception | Reality |
|---|---|
| "TDD is slow" | It's faster in the long run |
```

Good:
```
"TDD is slow" — it's slower at the start of a feature. It's much faster when you need
to change that feature six months later.
```

**Conclusion as flowing text, not bullet points.**
The closing section must feel like the author wrapping up a conversation — not a checklist.

Bad:
```
## Summary
- Start from the contract
- Write failing tests first
- Implement the minimum
```

Good:
```
## To wrap up
TDD is not about tests. It's about design guided by the behavior you want to see.

Start from the contract — how it will be used, not how it will be implemented.
Write the failing test before any code.
Implement the minimum to pass, then refactor.
```

---

## Code

**Code as documentation.**
The first code block in a section should show how something is *used*, not how it is *implemented*.
Always include a `// como usar` / `// how to use` comment on the first usage example.

**Test descriptions in the language of behavior.**
Test names describe business rules or observable outcomes — never implementation details.

```ts
// ✅
it('applies a 10% discount when the cart has more than 5 items', ...)
it('retorna 404 quando o usuário não existe', ...)

// ❌
it('should work', ...)
it('calculateTotal test', ...)
```

**Inline ✅/❌ comments for correct vs wrong patterns.**
When showing a right/wrong comparison, use inline comments — not separate prose blocks.

```ts
// ✅ correct — mock the external dependency, real logic
// ❌ wrong — mocking the very logic that should be tested
```

**No over-typing in early examples.**
First code examples should be minimal. Types and interfaces come in later when needed for clarity.

---

## Language (PT-BR)

- Use "jornada" as the structural metaphor, not "etapa" or "passo" (for top-level sections)
- Use "contrato" for API/behavioral contracts, not "interface" or "especificação"
- Use "cola" metaphorically for integration glue: "testes de integração cobrem a cola entre as partes"
- Avoid formal connectives like "outrossim", "destarte", "ademais"
- "Perceba" instead of "Note que" or "Observe que"
- "Vamos separar" instead of "Dividiremos" or "Separamos"

## Language (EN)

- Mirror the PT register — conversational, not academic
- "journey" not "phase" or "stage" for top-level structure
- "contract" not "interface" or "specification"
- "glue" for integration metaphor: "integration tests cover the glue between the parts"
- "Notice:" not "Note that:" or "Observe that:"
- "Let's split" not "We will divide" or "The following sections cover"
- Preserve the hesitant opener: "Maybe you need..." not "How to..." or "A guide to..."

---

## What to avoid

- Section titles like "Introduction", "Conclusion", "Overview" — use descriptive or narrative titles
- Numbered steps as the primary structure ("Step 1", "Step 2") — use journey language instead
- Passive voice for recommendations — "you want" not "it is recommended that"
- Ending on a formal note — the last sentence should land like the author closing a conversation, not a manual
- Adding content the author didn't initiate — do not add references, external links, or citations unless the author explicitly included them
- Filler phrases: "In this article we will explore...", "As we can see...", "It is worth noting that..."
