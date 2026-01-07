From Francis's framework, these concepts map directly to agent architecture:

**Understanding Phase**
- **Establish external realities** → What's the current date, available tools, API versions, project state
- **Establish internal system configuration** → Agent's current context, loaded memories, session state
- **Define outcomes** → Task goals, success criteria, user intent
- **Select focus** → Decide if next cycle is learning vs. executing

**FMCB Model**
- **Frames** → Agent's interpretation of situation + response strategy (not just data, but meaning)
- **Models** → Causal understanding of how things work (if X then Y)
- **Capabilities** → Available tools, APIs, permissions (agents forget they have tools - you mentioned this explicitly)
- **Behavior** → Actual actions taken + reasoning traces

**Variation/Selection Cycle**
- **Problem → Causal analysis** → Every problem triggers understanding of WHY (mandatory, not optional)
- **Fact vs Assumption distinction** → Critical for agents treating stale info as ground truth
- **Staleness detection** → Facts decay into assumptions over time
- **Sanity checking** → Validate assumptions before acting (find contradictions)

**Goal Alignment**
- **Means-ends relationship** → Agents can optimize for intermediate goals, losing sight of actual objective
- **Frame surfacing** → Make implicit operating assumptions explicit and testable

**Relevance Realization**
- What's changed in the environment that matters vs. noise
- Avoid overfitting (probing everything) or underfitting (missing critical signals)

The core insight: agents need the same understanding → variation → selection → realization loop, with explicit tracking of confidence levels and periodic frame validation.