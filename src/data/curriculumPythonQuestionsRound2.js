/**
 * Round 2 — 15 new MCQs (same syllabus as curriculumPythonQuestions.js).
 * Correct answers rotated across A–D (indices 0–3).
 */
export const CURRICULUM_PYTHON_QUESTIONS_ROUND2 = [
  {
    topic: 'Python · Why Python?',
    prompt:
      'A common reason schools teach Python first is that it…',
    choices: [
      'Often has readable syntax and suits beginners well',
      'Can only run on expensive mainframes',
      'Cannot be used for real software',
      'Must be written entirely in binary',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Python · Running code',
    prompt:
      'When you run a `.py` file with the Python interpreter, what is executed?',
    choices: [
      'Only the first line; the rest is ignored',
      'The source code you wrote, line by line by the interpreter',
      'Only comments, not code',
      'Random lines each time',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Python · Hello World',
    prompt:
      'Which line prints two words separated by a space: Hello then world?',
    choices: [
      'echo Hello world',
      'say Hello world',
      'print("Hello", "world")',
      'print("Hello world")',
    ],
    correctIndex: 2,
  },
  {
    topic: 'Python · print',
    prompt:
      'By default, what does `print("A"); print("B")` typically output?',
    choices: [
      'A B on one line with no newline',
      'Nothing',
      'An error because of the semicolon',
      'A and B on separate lines',
    ],
    correctIndex: 3,
  },
  {
    topic: 'Python · input',
    prompt:
      'If `name = input("Your name: ")`, and the user types `Ada` and presses Enter, what is `name`?',
    choices: [
      'The string "Ada"',
      'The integer 3',
      'The boolean True',
      'None — input returns nothing in Python 3',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Python · Variables',
    prompt:
      'After `x = 5` then `x = x + 1`, what is the value of `x`?',
    choices: [
      '5',
      '6',
      '1',
      'An error',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Python · Assignment',
    prompt:
      'Which assignment swaps the idea correctly: “put the value 100 into `points`”?',
    choices: [
      '100 = points',
      'points := 100',
      'points = 100',
      'set points to 100',
    ],
    correctIndex: 2,
  },
  {
    topic: 'Python · Types',
    prompt:
      'What is the type of the literal `42` in Python?',
    choices: [
      'float',
      'str',
      'bool',
      'int',
    ],
    correctIndex: 3,
  },
  {
    topic: 'Python · if',
    prompt:
      'When does the body of `if score >= 10:` run?',
    choices: [
      'Only when `score >= 10` is True',
      'Always, regardless of score',
      'Only on Sundays',
      'Never; Python has no if',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Python · if / elif / else',
    prompt:
      'You have `if`, then `elif`, then `else`. How many of those branches can run in one pass?',
    choices: [
      'All of them always',
      'At most one matching branch in a single chain',
      'Exactly three always',
      'Only the else',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Python · while',
    prompt:
      'What can accidentally cause an infinite loop with `while`?',
    choices: [
      'Using a colon at the end of the line',
      'Indenting with four spaces',
      'A condition that stays True forever with no change inside the loop',
      'Using print inside the loop',
    ],
    correctIndex: 2,
  },
  {
    topic: 'Python · for',
    prompt:
      'What does `for i in range(3):` make `i` take (in order)?',
    choices: [
      '3, 2, 1',
      '1, 2, 3',
      'Only 3',
      '0, 1, 2',
    ],
    correctIndex: 3,
  },
  {
    topic: 'Python · Loops',
    prompt:
      'Which statement is true about Python’s built-in loop keywords?',
    choices: [
      'You use `while` and `for`; there is no `do-while` keyword',
      'Python has `do` and `while` as one keyword like some languages',
      'Python has no while loop',
      'for loops may only run twice',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Python · def',
    prompt:
      'What does `return` do inside a function?',
    choices: [
      'Deletes the function',
      'Sends a value back to the caller and ends that function call (for that path)',
      'Starts an infinite loop',
      'Imports a module',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Python · Parameters',
    prompt:
      'In `def add(a, b): return a + b`, the names `a` and `b` are…',
    choices: [
      'Global variables that ignore the function',
      'Only used for strings',
      'Parameters — placeholders for values passed when the function is called',
      'Reserved words in Python',
    ],
    correctIndex: 2,
  },
];
