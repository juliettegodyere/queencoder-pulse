
## Summary

| Metric | Value |
|--------|-------|
| Questions per pack (Round 1 / Round 2) | 15 each |
| Coverage | Overview, I/O, variables & types, conditionals, loops, functions |
| Labels in reports | From `[topic]` in preset prompts |

---

## Why is the session report empty or incomplete?

- Wrong **session** or join code.
- **No responses** — nothing sent live, or no submissions.
- **Custom** questions without `[Label]` → **Custom / untagged** in the app until you add a tag.

---

## Lecture notes — Python introduction

### Python · Course overview

- **Python is** a **high-level** programming language: one language, many uses — teaching, scripts, data, web backends, and more.
- We type **source code** in text; we don’t need to wire hardware by hand for every line.

### Python · Introduction

- **Running Python** usually means using an **interpreter**: you save a `.py` file (or type in the REPL) and Python **reads and runs** your instructions.
- It’s **not** “only inside a browser with no install” as a rule — we run a Python program on the machine. Contrast briefly with **Scratch blocks** vs **text code**.

### Python · First program

- **A minimal first program** in this course is **`print("Hello, world!")`** — not `echo`, not `console.log`, not `printf` (those belong to other tools or languages).
- **Do together:** Type it once in the editor. Run it. Change the text inside the quotes.

### Python · Output (print)

- **`print(...)`** sends **values to the standard output** — usually what you see in the **terminal / console**.
- It **shows** things; it doesn’t delete files or start an infinite loop by itself.

### Python · User input (input)

- **`input()`** in Python 3, after the user types and presses Enter, **always returns a string** — even if they typed digits.
- If we need a **number**, we **convert**: `int(...)` or `float(...)`.
- **Demo:** `age = input("Age? ")` then `print(type(age))` — then `int(age)` if it’s safe.

### Python · Variables (introduction)

- **A variable** is a **name** that refers to a **value stored in memory**. The value can **change** as the program runs.
- The **name** is on the **left** of `=`; the **value** we store is on the **right**. (You’ll repeat that in **Creating variables**.)

### Python · Creating variables

- **Assignment** in Python is **`name = value`** — e.g. `score = 10`. The **name** must be on the **left**; **`10 = score` is invalid**.
- In maths class `x = y` can mean “both sides equal”; in Python **first** we pick a **box name**, **then** we put a value in it.

### Python · Data types

- **Types** describe what kind of value something is — e.g. **`3.14`** is a **float** (decimal number), text in quotes is a **str**.
- We read the **shape** of the literal: quotes → string; decimal point → often float; `True`/`False` → bool.

### Python · Conditionals (if)

- An **`if`** statement runs its **indented block only when** the **condition is True**.
- If the condition is **False**, Python **skips** that block — it doesn’t run “just in case”.

### Python · if / elif / else

- **`if` / `elif` / `else`** build **one chain of decisions**: at most **one** branch runs — the **first** whose condition is **True**, or **`else`** if none matched.
- **`elif`** means *else if* — only check the next condition when the previous ones failed. It’s **not** the same as three separate **`if`**s when only **one** outcome should win.
- **Do together:** Trace one variable (e.g. a score band) down the ladder on paper.

### Python · while loops

- A **`while`** loop **repeats the body while** the condition stays **True**. It is **not** “always exactly ten times” unless you write the condition that way.
- **Keep going as long as …** — stop when the condition becomes False.

### Python · for loops

- A **`for`** loop walks through a **sequence** — items in a **list**, characters in a **string**, numbers from **`range(...)`**, etc.
- **`for`** is for **stepping through a collection or range**, not “only for decimals.”

### Python · Loops comparison

- Python has **`while`** and **`for`**. It has **no `do-while` keyword** like some other languages.
- If you need “run at least once,” use **`while True`** with a **`break`**, or put the condition at the **top** of a **`while`**.

### Python · Functions (introduction)

- A **function** is a **named block** of code you can **call** many times. In Python you start with **`def name():`** — colon, then **indented** body.
- Not `function`, not `fn` — **`def`** is the Python word.

### Python · Function arguments

- When you **call** a function, the values you pass in are **arguments**. In the **`def` line**, the names that receive them are **parameters** — same idea, **call site vs definition**.
- **Arguments** go in the parentheses **when we call**; **parameters** are the **names in the header**.

---

## Students who may need more focus

The app lists names when someone has **≥ 40% wrong** with **≥ 3** answers — open **Revision & report** for your session. These three drills help most often:

- **`input()`** — show **`int(input("..."))`** or **`float(input("..."))`** on the board once; repeat “**input always gives text first**.”
- **`if` / `elif` / `else`** — draw a **ladder**: only **one** branch wins; trace with one example variable.
- **`def`** — write **three wrong headers** and **one** `def greet():` — vote on the real Python one.

