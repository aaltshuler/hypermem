Let's work on this ontology:

## Ontology

### Entities


CONTEXT
  Project
  Person
  Org

IDENTITY
  Trait
  Style
  Strength
  Preference

KNOWLEDGE
  Fact
  Know-how
  Best-practice
  Reference

OPS
  Template
  Tool
  Lib
  Stack

CONVENTION

PATTERN
ANTIPATTERN

RULE
ASSUMPTION
DECISION
CAUSE


### Relations


SUPERSEDES       Newer version of a fact
CONTRADICTS      Conflicts with another fact
SUPPORTS         Evidence for another fact
DEPENDS_ON       Prerequisite relationship
CAUSED_BY        Causal chain
CAUSES           Effect relationship
BLOCKED_BY       Impediment
ABOUT            Links atom to context
FROM_SOURCE      Provenance link
AUTHORED_BY      Creator link
RELATED          General association



The ontlogy will be used for agentic memory
List of entities is OK (althoug probably missing a few things)

We need a clean logic and hierarchy

Memory shoul be alive and updateble
Dedicated agent wil work on curating / polinating it

---
The idea is this (example):

We have specific element (tool, library, system, model and so on)

For example: 
ZOD - TypeScript-first schema validation

We have set of facts and assumptions about it

ASSUMPTION: 
Recent version: 4.2
Validated: 2025-11-14

ASSUMPTION: 
Default tool for validation in all TS projects
Validated: 2025-10-14

FACT:
Used in at least 3 projects by User

----

following this approach I want to understand how to handle different entites, like DECISION (should be cofirmed) or BEST PRACTICE (shoul be verified once in wile) and so on

Propose overall method, ontology update, set of relevant fileds for each entity

Keep in mind: ontolgy will be implemented in knowledge graph
