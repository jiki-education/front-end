import type { QuizQuestion } from "./QuizCard";

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "1",
    content: `## JavaScript Arrays

Which method would you use to **add** an element to the **end** of an array?

Consider the following code:
\`\`\`javascript
const fruits = ['apple', 'banana'];
// Add 'orange' to the end
\`\`\``,
    options: ['fruits.unshift("orange")', 'fruits.push("orange")', 'fruits.shift("orange")', 'fruits.pop("orange")'],
    correctIndex: 1,
    explanation:
      "The push() method adds one or more elements to the end of an array and returns the new length of the array."
  },
  {
    id: "2",
    content: `## Python Functions

What will be the output of this Python code?

\`\`\`python
def multiply(a, b=2):
    return a * b

result = multiply(5)
print(result)
\`\`\``,
    options: ["5", "10", "Error: missing argument", "None"],
    correctIndex: 1,
    explanation:
      "The function multiply has a default parameter b=2. When called with only one argument (5), it uses the default value for b, resulting in 5 * 2 = 10."
  },
  {
    id: "3",
    content: `## React Hooks

Which of the following statements about **useEffect** is correct?

*Choose the most accurate statement:*`,
    options: [
      "useEffect runs only once when the component mounts",
      "useEffect runs after every render by default",
      "useEffect cannot have a cleanup function",
      "useEffect runs before the component renders"
    ],
    correctIndex: 1,
    explanation:
      "By default, useEffect runs after every render (both after the first render and after every update). You can control this behavior by providing a dependency array."
  }
];
