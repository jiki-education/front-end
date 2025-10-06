import type { CodingQuizQuestion } from "./CodingQuizCard";

export const mockCodingQuizQuestions: CodingQuizQuestion[] = [
  {
    id: "c1",
    content: `## Array Sum

Write a JavaScript function that returns the **sum** of all numbers in an array.

Example:
\`\`\`javascript
// Input: [1, 2, 3]
// Output: 6
\`\`\`

Write only the function body (the return statement):`,
    correctAnswer: "return arr.reduce((a, b) => a + b, 0)",
    hint: "Try using the reduce method with an initial value of 0",
    successMessage: "Perfect! You've used reduce correctly to sum the array.",
    errorMessage: "Remember to use reduce with an arrow function and initial value."
  },
  {
    id: "c2",
    content: `## Python List Comprehension

Create a list comprehension that returns all **even numbers** from 0 to 10.

Write the complete list comprehension:`,
    correctAnswer: "[x for x in range(11) if x % 2 == 0]",
    hint: "Use range(11) and check if x % 2 == 0",
    successMessage: "Great! Your list comprehension correctly filters even numbers.",
    errorMessage: "Make sure to use range(11) to include 10, and check x % 2 == 0 for even numbers."
  },
  {
    id: "c3",
    content: `## CSS Flexbox Center

Write the CSS property and value to **center** items both horizontally and vertically in a flex container.

Example:
\`\`\`css
.container {
  display: flex;
  /* Your answer here */
}
\`\`\`

Write only the property: value pair:`,
    correctAnswer: "justify-content: center; align-items: center",
    hint: "You need two properties: one for horizontal and one for vertical alignment",
    successMessage: "Excellent! You've mastered flexbox centering.",
    errorMessage: "Remember: justify-content for horizontal, align-items for vertical."
  },
  {
    id: "c4",
    content: `## React State Hook

Write the React hook to create a state variable called \`count\` with initial value 0.

Write the complete line of code:`,
    correctAnswer: "const [count, setCount] = useState(0)",
    hint: "Use array destructuring with useState hook",
    successMessage: "Perfect! You understand React's useState hook syntax.",
    errorMessage: "The pattern is: const [value, setValue] = useState(initialValue)"
  }
];
