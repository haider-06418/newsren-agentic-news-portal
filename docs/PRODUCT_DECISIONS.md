# Product decisions

## 1. Focus on evolving stories

Newsren prioritizes stories where the facts, rules, interpretations, or consequences are changing. Internally, these are called **evolving and contested stories**, not "non-deterministic news," because uncertainty should be traced to evidence and time rather than treated as randomness.

The product does not collapse multiple opinions into an artificial consensus. It shows:

- agreed facts;
- material disagreements;
- the evidence behind each position;
- source type and publication date;
- affected groups;
- unresolved questions; and
- upcoming events that could change the assessment.

## 2. Contextual assistant, not generic chatbot

The assistant is called **Ask Newsren**. On desktop it appears as a right-side pane on story pages. On smaller screens it becomes a bottom sheet.

The pane is grounded only in the active story's evidence bundle and connected timeline. It should:

- answer questions with source references;
- compare named sources or interpretations;
- adapt explanations for students, educators, and professionals;
- disclose missing evidence; and
- suggest useful follow-up questions.

It should not provide an unrestricted site-wide chat experience during Week 1.

## 3. Initial editorial desks

1. **Education & Immigration** - flagship desk and first complete story.
2. **Technology** - research, releases, evaluation, security, and regulation.
3. **Policy & Society** - policies with meaningful uncertainty or disputed impact.
4. **Business & Finance** - filings, earnings, industry change, and regulatory actions.

Sports is deferred. It can later cover governance, rules, labor, health and safety, and disputed decisions where the evidence-map approach adds value.

## 4. AI and cost strategy

The application uses a provider adapter rather than coupling product logic to one model.

Priority order:

1. Free hosted inference for the public prototype.
2. Ollama with the installed `qwen3.5:9b` model for local development.
3. Pre-generated and human-reviewed outputs when no model is available.

Source discovery and extraction remain deterministic where practical. Model calls are reserved for synthesis, question answering, and explanation modes. Results are cached by evidence-bundle version.

## 5. Account and follow strategy

Week 1 requires no account. Followed topics are stored in the browser and monitoring is demonstrated with seeded change events. Durable accounts and notifications are a later phase.

## 6. Human review

Generated stories move through `draft`, `needs_review`, `approved`, and `published` states. Finance items and high-impact policy claims cannot be published without approval.
