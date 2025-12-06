import type { ConceptCardData } from "@/components/concepts/ConceptCard";

// Mock subconcepts for different main concepts
export const mockSubconcepts: Record<string, ConceptCardData[]> = {
  loops: [
    {
      slug: "for-loops",
      title: "For Loops",
      description: "Iterate through sequences with for loops. Learn basic iteration patterns and loop control.",
      iconSrc: "static/images/concept-icons/icon-loops.png"
    },
    {
      slug: "while-loops",
      title: "While Loops",
      description: "Execute code while conditions are true. Master conditional iteration and loop termination.",
      iconSrc: "static/images/concept-icons/icon-loops.png"
    },
    {
      slug: "nested-loops",
      title: "Nested Loops",
      description: "Work with loops inside loops. Understand complexity and multi-dimensional iteration.",
      iconSrc: "static/images/concept-icons/icon-loops.png"
    },
    {
      slug: "loop-control",
      title: "Loop Control",
      description: "Control loop execution with break and continue. Learn advanced loop manipulation techniques.",
      iconSrc: "static/images/concept-icons/icon-loops.png"
    },
    {
      slug: "infinite-loops",
      title: "Infinite Loops",
      description: "Understand and avoid infinite loops. Learn debugging techniques and safe iteration patterns.",
      iconSrc: "static/images/concept-icons/icon-loops.png"
    },
    {
      slug: "loop-optimization",
      title: "Loop Optimization",
      description: "Optimize loop performance and efficiency. Master advanced iteration techniques.",
      iconSrc: "static/images/concept-icons/icon-loops.png"
    }
  ],
  functions: [
    {
      slug: "function-basics",
      title: "Function Basics",
      description: "Create and call functions. Learn parameters, return values, and function scope.",
      iconSrc: "static/images/concept-icons/icon-functions.png"
    },
    {
      slug: "parameters-arguments",
      title: "Parameters & Arguments",
      description: "Pass data to functions effectively. Master parameter types and argument handling.",
      iconSrc: "static/images/concept-icons/icon-functions.png"
    },
    {
      slug: "return-values",
      title: "Return Values",
      description: "Return data from functions. Understand different return patterns and value types.",
      iconSrc: "static/images/concept-icons/icon-functions.png"
    },
    {
      slug: "function-scope",
      title: "Function Scope",
      description: "Understand variable scope in functions. Learn about local vs global variables.",
      iconSrc: "static/images/concept-icons/icon-functions.png"
    },
    {
      slug: "higher-order-functions",
      title: "Higher-Order Functions",
      description: "Functions that work with other functions. Master callbacks and functional programming.",
      iconSrc: "static/images/concept-icons/icon-functions.png"
    },
    {
      slug: "recursion",
      title: "Recursion",
      description: "Functions that call themselves. Learn recursive patterns and problem solving.",
      iconSrc: "static/images/concept-icons/icon-functions.png"
    },
    {
      slug: "arrow-functions",
      title: "Arrow Functions",
      description: "Modern function syntax and behavior. Understand lexical scoping and concise syntax.",
      iconSrc: "static/images/concept-icons/icon-functions.png"
    },
    {
      slug: "function-composition",
      title: "Function Composition",
      description: "Combine functions to create complex operations. Learn modular programming techniques.",
      iconSrc: "static/images/concept-icons/icon-functions.png"
    }
  ],
  arrays: [
    {
      slug: "array-basics",
      title: "Array Basics",
      description: "Create and manipulate arrays. Learn indexing, length, and basic array operations.",
      iconSrc: "static/images/concept-icons/icon-arrays.png"
    },
    {
      slug: "array-methods",
      title: "Array Methods",
      description: "Use built-in array methods. Master map, filter, reduce, and other powerful operations.",
      iconSrc: "static/images/concept-icons/icon-arrays.png"
    },
    {
      slug: "multidimensional-arrays",
      title: "Multidimensional Arrays",
      description: "Work with arrays of arrays. Understand matrices and complex data structures.",
      iconSrc: "static/images/concept-icons/icon-arrays.png"
    },
    {
      slug: "array-iteration",
      title: "Array Iteration",
      description: "Loop through arrays efficiently. Learn different iteration patterns and techniques.",
      iconSrc: "static/images/concept-icons/icon-arrays.png"
    },
    {
      slug: "array-sorting",
      title: "Array Sorting",
      description: "Sort arrays by different criteria. Understand sorting algorithms and custom comparisons.",
      iconSrc: "static/images/concept-icons/icon-arrays.png"
    }
  ],
  conditionals: [
    {
      slug: "if-statements",
      title: "If Statements",
      description: "Make decisions with if statements. Learn basic conditional logic and branching.",
      iconSrc: "static/images/concept-icons/icon-conditionals.png"
    },
    {
      slug: "else-statements",
      title: "Else Statements",
      description: "Handle alternative conditions. Master if-else chains and default behaviors.",
      iconSrc: "static/images/concept-icons/icon-conditionals.png"
    },
    {
      slug: "logical-operators",
      title: "Logical Operators",
      description: "Combine conditions with AND, OR, and NOT. Learn complex conditional expressions.",
      iconSrc: "static/images/concept-icons/icon-conditionals.png"
    },
    {
      slug: "switch-statements",
      title: "Switch Statements",
      description: "Handle multiple conditions elegantly. Learn when to use switch vs if-else.",
      iconSrc: "static/images/concept-icons/icon-conditionals.png"
    },
    {
      slug: "ternary-operators",
      title: "Ternary Operators",
      description: "Write concise conditional expressions. Master the conditional operator syntax.",
      iconSrc: "static/images/concept-icons/icon-conditionals.png"
    },
    {
      slug: "comparison-operators",
      title: "Comparison Operators",
      description: "Compare values effectively. Understand equality, inequality, and relational operators.",
      iconSrc: "static/images/concept-icons/icon-conditionals.png"
    },
    {
      slug: "conditional-logic",
      title: "Conditional Logic",
      description: "Design complex decision-making logic. Learn to structure conditional flows effectively.",
      iconSrc: "static/images/concept-icons/icon-conditionals.png"
    }
  ]
};
