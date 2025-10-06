import type { FillInQuizQuestion } from "./FillInQuizCard";

export const mockFillInQuizQuestions: FillInQuizQuestion[] = [
  {
    id: "f1",
    content: `## Array Reduce

Which JavaScript method returns this output?

Given:
- \`arr = [1, 2, 3]\`
- \`output = 6\`

Fill in the missing method:`,
    codeLines: [
      "const arr = [1, 2, 3];",
      "const output = arr.{{method}}((a, b) => a + b, 0);",
      "console.log(output); // 6"
    ],
    blanks: {
      method: {
        id: "method",
        placeholder: "method",
        correctAnswer: "reduce"
      }
    },
    successMessage: "Excellent! The reduce method is perfect for aggregating array values.",
    errorMessage: "Think about which array method can aggregate values into a single result."
  },
  {
    id: "f2",
    content: `## Export Default Function

How do you export a default function in JavaScript ES6?

Complete the code:`,
    codeLines: ["{{keyword}} function sayHello(name) {", "  return `Hello, ${name}!`;", "}"],
    blanks: {
      keyword: {
        id: "keyword",
        placeholder: "keyword",
        correctAnswer: "export default"
      }
    },
    successMessage: "Perfect! You know how to export default functions.",
    errorMessage: "Remember: 'export default' is used for default exports."
  },
  {
    id: "f3",
    content: `## React Component with Props

Complete this React functional component with TypeScript:`,
    codeLines: [
      "interface ButtonProps {",
      "  label: string;",
      "  onClick: () => void;",
      "}",
      "",
      "const Button{{syntax1}} React.{{type}}<ButtonProps> = ({ label, onClick }) => {",
      "  return (",
      "    <button {{handler}}={onClick}>",
      "      {label}",
      "    </button>",
      "  );",
      "};"
    ],
    blanks: {
      syntax1: {
        id: "syntax1",
        placeholder: ":",
        correctAnswer: ":"
      },
      type: {
        id: "type",
        placeholder: "FC/FunctionComponent",
        correctAnswer: "FC"
      },
      handler: {
        id: "handler",
        placeholder: "event",
        correctAnswer: "onClick"
      }
    },
    successMessage: "Great! You understand React TypeScript component syntax.",
    errorMessage: "Check the TypeScript syntax and React event handlers."
  },
  {
    id: "f4",
    content: `## Python List Comprehension

Complete this Python list comprehension to get squares of even numbers:`,
    codeLines: [
      "numbers = [1, 2, 3, 4, 5, 6]",
      "even_squares = [x{{operator}}2 for x in numbers {{condition}} x % 2 == 0]",
      "print(even_squares)  # Output: [4, 16, 36]"
    ],
    blanks: {
      operator: {
        id: "operator",
        placeholder: "op",
        correctAnswer: "**"
      },
      condition: {
        id: "condition",
        placeholder: "keyword",
        correctAnswer: "if"
      }
    },
    showLineNumbers: true,
    successMessage: "Excellent! You've mastered Python list comprehensions.",
    errorMessage: "Remember: ** is for exponentiation, and 'if' filters the list."
  },
  {
    id: "f5",
    content: `## CSS Flexbox Layout

Complete the CSS to create a centered flexbox container:`,
    codeLines: [
      ".container {",
      "  display: {{display}};",
      "  justify-content: {{horizontal}};",
      "  align-items: {{vertical}};",
      "  height: 100vh;",
      "}"
    ],
    blanks: {
      display: {
        id: "display",
        placeholder: "value",
        correctAnswer: "flex"
      },
      horizontal: {
        id: "horizontal",
        placeholder: "value",
        correctAnswer: "center"
      },
      vertical: {
        id: "vertical",
        placeholder: "value",
        correctAnswer: "center"
      }
    },
    showLineNumbers: false,
    successMessage: "Perfect! You've mastered flexbox centering.",
    errorMessage: "Remember: display: flex, then center for both axes."
  }
];
