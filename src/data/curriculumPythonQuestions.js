/**
 * 15 multiple-choice questions for an introductory Python class
 * (basics, I/O, variables, types, conditionals, loops, functions).
 * Separate from the Scratch / computational thinking pack.
 * Correct answers are rotated across A–D (indices 0–3).
 */
export const CURRICULUM_PYTHON_QUESTIONS = [
  {
    topic: 'Python · Course overview',
    prompt:
      'Python is most often described as…',
    choices: [
      'A high-level programming language used for many tasks (apps, data, automation, teaching)',
      'A type of snake that cannot be used on computers',
      'Only a database product from Microsoft',
      'Hardware inside the CPU that runs without software',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Python · Introduction',
    prompt:
      'Which statement about Python is generally true?',
    choices: [
      'It must always be compiled to machine code by hand before every line',
      'It is usually run by an interpreter (you write source code and run it with Python)',
      'It can only run inside a web browser with no installation',
      'It is identical to Scratch blocks with no text code',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Python · First program',
    prompt:
      'What is a common minimal first program in Python that prints a greeting?',
    choices: [
      'echo Hello, world!',
      'console.log("Hello, world!")',
      'print("Hello, world!")',
      'printf("Hello, world!") without any import',
    ],
    correctIndex: 2,
  },
  {
    topic: 'Python · Output (print)',
    prompt:
      'What does the print() function do in Python?',
    choices: [
      'Deletes a file from the disk',
      'Starts an infinite loop automatically',
      'Reads a password without showing it',
      'Displays values to the standard output (often the terminal or console)',
    ],
    correctIndex: 3,
  },
  {
    topic: 'Python · User input (input)',
    prompt:
      'What does input() return in Python 3 when the user types text and presses Enter?',
    choices: [
      'A string containing what the user typed',
      'Always an integer, even if they typed letters',
      'Nothing; it only prints to the screen',
      'A random number between 0 and 9',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Python · Variables (introduction)',
    prompt:
      'In Python, a variable is best thought of as…',
    choices: [
      'A fixed label that can never change after creation',
      'A name that refers to a value stored in memory',
      'Only a number between 0 and 255',
      'The same thing as a function definition',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Python · Creating variables',
    prompt:
      'Which line correctly assigns the integer 10 to a variable named score in Python?',
    choices: [
      '10 = score',
      'var score := 10',
      'score = 10',
      'int score = 10;',
    ],
    correctIndex: 2,
  },
  {
    topic: 'Python · Data types',
    prompt:
      'Which of these is a valid way to describe the type of the value 3.14 in Python?',
    choices: [
      'Text string only',
      'Boolean (True/False)',
      'A list of characters only, never a number',
      'Floating-point number (float)',
    ],
    correctIndex: 3,
  },
  {
    topic: 'Python · Conditionals (if)',
    prompt:
      'What does a simple if statement do in Python?',
    choices: [
      'Runs a block of code only when a condition is True',
      'Repeats code forever regardless of the condition',
      'Imports a library automatically',
      'Defines a new function with return type void',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Python · if / elif / else',
    prompt:
      'When would you use elif in Python?',
    choices: [
      'To exit the program immediately',
      'To check another condition when previous if/elif conditions were False',
      'To declare a variable with no value',
      'To create a loop that runs exactly once',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Python · while loops',
    prompt:
      'A while loop in Python repeats its body…',
    choices: [
      'Exactly ten times always',
      'Only once, like an if statement',
      'As long as its condition stays True',
      'Never; Python has no while loop',
    ],
    correctIndex: 2,
  },
  {
    topic: 'Python · for loops',
    prompt:
      'What does a for loop in Python typically iterate over?',
    choices: [
      'Only floating-point numbers',
      'Only the keyword True',
      'Errors in the program only',
      'Items in a sequence (e.g. elements of a list, characters of a string, or a range of numbers)',
    ],
    correctIndex: 3,
  },
  {
    topic: 'Python · Loops comparison',
    prompt:
      'Which loop form is **not** built into Python the way it is in some other languages?',
    choices: [
      'do-while (Python uses while and for; there is no do-while keyword)',
      'while',
      'for',
      'A loop that iterates over a list',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Python · Functions (introduction)',
    prompt:
      'How do you start defining a function named greet in Python?',
    choices: [
      'function greet():',
      'def greet():',
      'fn greet() {',
      'define greet():',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Python · Function arguments',
    prompt:
      'In Python, values passed into a function when you call it are called…',
    choices: [
      'Decorators only',
      'Imports',
      'Arguments (or parameters in the definition)',
      'Indentation levels',
    ],
    correctIndex: 2,
  },
];
