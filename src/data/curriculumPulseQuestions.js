/**
 * 15 multiple-choice questions aligned with Stage 1 (computational thinking)
 * and Stage 2 (Scratch / visual blocks). Import from the teacher dashboard.
 * Correct answers are rotated across A–D (indices 0–3) so “always pick A” is not a strategy.
 */
export const CURRICULUM_PULSE_QUESTIONS = [
  {
    topic: 'Stage 1 · What is coding?',
    prompt:
      'What best describes “coding” when we talk about computers?',
    choices: [
      'Writing instructions that a computer can follow step by step',
      'Only drawing pictures on a screen',
      'Turning the computer off and on again',
      'Buying software from a shop',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Stage 1 · Algorithms',
    prompt:
      'Which of these is closest to the idea of an algorithm?',
    choices: [
      'A random guess with no steps',
      'A clear, ordered set of steps to complete a task',
      'A type of computer virus',
      'The brand name of a keyboard',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Stage 1 · Debugging',
    prompt:
      'What is debugging in programming?',
    choices: [
      'Deleting all your files',
      'Making the screen brighter',
      'Finding and fixing mistakes in your instructions or code',
      'Printing your project on paper',
    ],
    correctIndex: 2,
  },
  {
    topic: 'Stage 1 · Sequencing',
    prompt:
      'Why does the order of steps matter in a program?',
    choices: [
      'Because order never matters for computers',
      'Because longer steps always run first',
      'Because the internet requires alphabetical order',
      'Because computers run steps in order; changing order can change the result',
    ],
    correctIndex: 3,
  },
  {
    topic: 'Stage 1 · Patterns & repetition',
    prompt:
      'In computational thinking, repetition (loops) is useful mainly to…',
    choices: [
      'Do the same kind of action many times without rewriting every step',
      'Make the computer run slower on purpose',
      'Turn off Wi-Fi',
      'Skip every second instruction',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Stage 1 · Graph paper programming',
    prompt:
      'In “graph paper programming” activities, arrows and symbols usually represent…',
    choices: [
      'Only decoration with no meaning',
      'Movement or actions on a grid, like a simple program',
      'Passwords for email',
      'The volume of the speakers',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Stage 2 · Scratch introduction',
    prompt:
      'Scratch is best described as…',
    choices: [
      'A text-only language that forbids graphics',
      'A tool that only makes spreadsheets',
      'A visual, block-based language for creating interactive projects',
      'Hardware inside the mouse',
    ],
    correctIndex: 2,
  },
  {
    topic: 'Stage 2 · Coordinates',
    prompt:
      'On the Scratch stage, the centre of the stage is usually at which coordinates?',
    choices: [
      'x = 100, y = 100',
      'x = 0 only; y is always ignored',
      'There are no coordinates in Scratch',
      'x = 0, y = 0',
    ],
    correctIndex: 3,
  },
  {
    topic: 'Stage 2 · Conditionals',
    prompt:
      'In Scratch, an “if … then … else” block is used to…',
    choices: [
      'Run different code depending on whether a condition is true or false',
      'Play music only in slow motion',
      'Delete every sprite automatically',
      'Stop the project from ever running',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Stage 2 · Control blocks',
    prompt:
      'Which kind of Scratch block is meant to repeat actions (e.g. “repeat” or “forever”)?',
    choices: [
      'A Sound block only',
      'A Control block',
      'A Comment block (notes for humans)',
      'The stage backdrop colour picker',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Stage 2 · Events',
    prompt:
      'The block “when green flag clicked” is an example of…',
    choices: [
      'A Sensing block that measures distance',
      'An Operator that adds two numbers',
      'An Event — something that starts scripts when something happens',
      'A Variable that stores text',
    ],
    correctIndex: 2,
  },
  {
    topic: 'Stage 2 · Sensing',
    prompt:
      'Sensing blocks in Scratch are mainly used to…',
    choices: [
      'Draw new costumes automatically',
      'Change the language of the editor menus',
      'Export the project to a USB stick only',
      'Detect things in the project (keys, touching, distance, etc.)',
    ],
    correctIndex: 3,
  },
  {
    topic: 'Stage 2 · Operators',
    prompt:
      'Operator blocks in Scratch are used for tasks such as…',
    choices: [
      'Math and comparisons (e.g. add, subtract, equals, greater than)',
      'Only changing sprite size with the mouse',
      'Importing photos from the internet without rules',
      'Saving the file to the cloud automatically',
    ],
    correctIndex: 0,
  },
  {
    topic: 'Stage 2 · Variables',
    prompt:
      'In Scratch, a variable is best described as…',
    choices: [
      'A block that can never change once set',
      'A named place to store a value that can change while the program runs',
      'The same thing as a costume',
      'Only the title of your project file',
    ],
    correctIndex: 1,
  },
  {
    topic: 'Stage 2 · Custom blocks (My Blocks)',
    prompt:
      'In Scratch, “Make a Block” (My Blocks) lets you…',
    choices: [
      'Delete every sprite in one click',
      'Change Scratch into a different app entirely',
      'Create your own reusable block that runs a script you define',
      'Only rename the stage backdrop',
    ],
    correctIndex: 2,
  },
];
