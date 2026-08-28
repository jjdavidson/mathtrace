# Authoring and AI conversion guidelines

These guidelines apply both to native MathTrace writing and to AI-assisted conversion of an existing LaTeX paper. The output of a conversion is an ordinary MathTrace folder—not a permanently tagged copy of the TeX source.

## Goal

Create a dependency graph that separates and distills the paper's mathematical structure. Preserve the mathematical meaning and the author's claims while making the conceptual units and their prerequisites explicit.

The converter is not trying to maximize the number of nodes. It is trying to find the smallest independently meaningful chunks.

## What becomes a node

- An individual definition, unless several definitions are introduced together and depend on the same setup.
- A theorem, lemma, proposition, or corollary together with its proof.
- A complete example, construction, algorithm, or computation.
- A reusable intermediate result that is proved inside a larger proof.
- A multi-paragraph exposition block when it develops one coherent idea needed elsewhere.

Do not create a separate node merely because the source starts a new paragraph, section, list item, or LaTeX environment.

## What belongs at paper level

Place the title, authors, abstract, introduction, conclusion, acknowledgments, broad motivation, and bibliographic provenance in `mathtrace.paper.md`. Short transitions and organizational prose may remain outside the node graph. Not every word of the source must appear as a node.

## Dependency inference

For every node, populate `requires` even when it is empty. Include direct mathematical prerequisites required to understand or justify the node.

Use all available evidence:

- explicit citations, labels, and `\ref` commands;
- definitions and notation invoked by the statement;
- constructions used in examples or proofs;
- earlier results actually used in an argument;
- prerequisites that the original author leaves implicit.

Do not add an edge merely because two topics are nearby or thematically related. Use `related` for useful non-prerequisite connections.

## Fidelity rules for AI

1. Preserve the original mathematical claims, formulas, hypotheses, and proof logic.
2. Do not silently correct, strengthen, weaken, or complete an argument.
3. Do not invent dependencies, citations, Lean verification, or bibliographic metadata.
4. Record source locations when possible so every extracted node can be checked against the paper.
5. Mark material AI assistance with `ai_assistance`, including whether a human reviewed it.
6. Surface uncertainty for human review instead of hiding it.

## Recommended conversion sequence

1. Read the complete paper before segmenting it.
2. Draft `mathtrace.paper.md` from paper-level metadata and prose.
3. Make a provisional list of coherent mathematical ideas.
4. Combine each result with its proof and merge inseparable setup.
5. Assign stable paper-qualified IDs, titles, and lowercase kinds. Keep IDs independent of folder placement.
6. Infer direct `requires` lists.
7. Give `mathtrace.paper.md` only its paper ID, title, and authors, then render the graph.
8. Review the graph as a structural outline: merge noise, split genuinely reusable ideas, and correct dependencies.
9. Compare every node with the source and record human review.

## Matrix Methods revision

The revised Matrix Methods trace uses broader idea-sized nodes, flattens singleton ID folders, and places applications beneath an `applications` namespace. Its structure should remain legible without relying on separate bundle metadata.

In particular, use the rendered graph to ask:

- Does each node make sense as a destination a reader would intentionally open?
- Are a theorem and its proof together?
- Are setup fragments meaningful independently, or should they be merged?
- Do the main routes through the graph correspond to the paper's actual conceptual stages?
- Can the same structure be communicated with fewer, stronger nodes without hiding a reusable idea?

The goal is not a smaller graph for its own sake. The goal is a graph whose nodes and arrows explain the architecture of the paper.
