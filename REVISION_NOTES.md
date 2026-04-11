# Revision notes — Queencoder Pulse competitions

Use this document after each competition week. It is aligned with the **Stage 1–2 / Scratch** and **Python intro** question packs used in Pulse.

### Automated report (built into the app)

On the **teacher dashboard** for a session, open **Revision & report** or **Download revision report (.md)**. The session report reads Firestore **questions**, **responses**, and **players** for that session. It includes:

- **Topic / area table** — wrong counts and class-wide % wrong (topics come from `[Label]` on curriculum preset prompts; custom questions show as “Custom / untagged”).
- **Students to focus on** — players with **≥ 40% wrong** among those with **≥ 3** answers (you can change thresholds in `src/features/revision/revisionReportService.js`).
- **Per-topic names** — who missed questions in each area.

**Curriculum revision guides** (syllabus-wide priorities, same section layout as the report page) ship in the app at **`/teacher/revision-notes/pulse`** (Scratch) and **`/teacher/revision-notes/python`** — linked from the teacher desk and from the **Revision & report** page. Source Markdown: `src/content/revision/`.

Merge that file into the sections below, or keep it as a separate attachment. This repo does not store your live class data — the session report is generated in the browser when you open the page or download.

---

## How to use this with Pulse (manual + optional)

| Source in Pulse | What to look at |
|-----------------|-----------------|
| **Automated revision report** | Download from teacher desk (see above). |
| **Per-question results** | Which prompts had the most wrong answers or slowest average time? |
| **Leaderboard** | Total score and total response time (tie-breakers). |
| **Session ended** | Per-session medals (gold / silver / bronze) on student profiles. |
| **Global leaderboard** | Cumulative progress across sessions (optional). |

Fill in **“This week’s observations”** below after each competition day (add colour the automated report cannot know — e.g. who was absent, behaviour notes).

---

# Class A — Computational thinking & Scratch (Stage 1–2)

## Topics you practised (competition set)

| Block | Topics |
|-------|--------|
| **Stage 1** | What coding is · Algorithms · Debugging · Sequencing · Patterns & repetition · Graph paper programming |
| **Stage 2 (Scratch)** | Intro to Scratch · Coordinates · Conditionals · Control (loops) · Events · Sensing · Operators · Variables · My Blocks (custom blocks) |

## Key ideas to remember

### Stage 1 — Foundations

- **Coding** = clear instructions the computer follows in order.
- **Algorithm** = ordered steps to solve a task (like a recipe).
- **Debugging** = find and fix mistakes; order of steps **matters** (sequencing).
- **Repetition / loops** = do the same kind of action many times without rewriting everything.
- **Graph paper programming** = symbols/arrows on a grid representing movement and actions (like a simple program).

### Stage 2 — Scratch

- **Scratch** = visual, block-based; good for stories, games, animation.
- **Stage centre** ≈ coordinates **(0, 0)** — x is horizontal, y is vertical.
- **Conditionals** = `if / then / else` — different behaviour when something is true or false.
- **Control blocks** = `repeat`, `forever`, etc. (repeat actions).
- **Events** = start scripts (e.g. **when green flag clicked**).
- **Sensing** = keyboard, touching, distance, etc.
- **Operators** = maths and comparisons (+, −, =, &gt;, …).
- **Variables** = store values that can change (e.g. score).
- **My Blocks** = your own reusable block (like a mini-program).

## Common mix-ups to revise

- **Events vs Sensing** — “when something happens” vs “detecting” something.
- **Control vs Operators** — repeating work vs doing maths/logic.
- **Coordinates** — centre of stage vs corner; both x and y matter.

## This week’s observations *(fill in after competition)*

- Topics that felt strong:
- Topics to revisit (e.g. many wrong answers or confusion):
- Students to check in with (optional):

---

# Class B — Python introduction

## Topics you practised (competition set)

| Area | Topics |
|------|--------|
| **Basics** | What Python is · Interpreter · First program · `print` · `input` |
| **Variables & types** | Variables · Assignment · Data types (e.g. float) |
| **Control flow** | `if` · `if` / `elif` / `else` · `while` · `for` · No `do-while` in Python |
| **Functions** | `def` · Arguments / parameters |

## Key ideas to remember

- Python is often run with an **interpreter** (you write `.py` source and run it).
- **`print(...)`** sends output to the console; **`input()`** in Python 3 returns a **string**.
- **Variables**: assign with `name = value` (e.g. `score = 10`).
- **Types**: e.g. `3.14` is a **float**; text is a **str**.
- **`if`** runs a block only when the condition is **True**; **`elif`** checks the next condition when earlier ones were **False**.
- **`while`** repeats **while** the condition is True; **`for`** walks through a **sequence** (list, string, `range`, …).
- Python has **no `do-while`** keyword (use `while` / `for` patterns instead).
- **`def name():`** defines a function; values passed in are **arguments** (parameters in the definition).

## Common mix-ups to revise

- **`input()` always returns a string** — convert with `int()` / `float()` if you need a number.
- **`if` vs `elif`** — chain conditions vs many separate `if`s when only one branch should run.
- **Syntax** — `def` not `function`; assignment `x = 1` not `1 = x`.

## This week’s observations *(fill in after competition)*

- Topics that felt strong:
- Topics to revisit:
- Students to check in with (optional):

---

## Next step in Pulse

Load the **Round 2** curriculum packs from the teacher desk (**Scratch Round 2** / **Python Round 2**) for a **new quiz** with different questions on the same syllabus — see `curriculumPulseQuestionsRound2.js` and `curriculumPythonQuestionsRound2.js`.
