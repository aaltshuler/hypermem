```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  GENERATOR   │ ──▶ │  REFLECTOR   │ ──▶ │  VALIDATOR   │ ──▶ │   CURATOR    │
│              │     │              │     │              │     │              │
│ Pre-task     │     │ LLM pattern  │     │ Evidence     │     │ Deterministic│
│ context      │     │ extraction   │     │ gate against │     │ delta merge  │
│ hydration    │     │ from diary   │     │ history      │     │ (NO LLM!)    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```