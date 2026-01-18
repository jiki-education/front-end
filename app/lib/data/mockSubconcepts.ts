import type { ConceptCardData } from "@/components/concepts/ConceptCard";

// Mock subconcepts for different main concepts
export const mockSubconcepts: Record<string, ConceptCardData[]> = {
  loops: [
    {
      slug: "for-loops",
      title: "For Loops",
      description: "Iterate through sequences with for loops. Learn basic iteration patterns and loop control."
    },
    {
      slug: "while-loops",
      title: "While Loops",
      description: "Execute code while conditions are true. Master conditional iteration and loop termination."
    },
    {
      slug: "nested-loops",
      title: "Nested Loops",
      description: "Work with loops inside loops. Understand complexity and multi-dimensional iteration."
    },
    {
      slug: "loop-control",
      title: "Loop Control",
      description: "Control loop execution with break and continue. Learn advanced loop manipulation techniques."
    },
    {
      slug: "infinite-loops",
      title: "Infinite Loops",
      description: "Understand and avoid infinite loops. Learn debugging techniques and safe iteration patterns."
    },
    {
      slug: "loop-optimization",
      title: "Loop Optimization",
      description: "Optimize loop performance and efficiency. Master advanced iteration techniques."
    }
  ],
  functions: [
    {
      slug: "function-basics",
      title: "Function Basics",
      description: "Create and call functions. Learn parameters, return values, and function scope."
    },
    {
      slug: "parameters-arguments",
      title: "Parameters & Arguments",
      description: "Pass data to functions effectively. Master parameter types and argument handling."
    },
    {
      slug: "return-values",
      title: "Return Values",
      description: "Return data from functions. Understand different return patterns and value types."
    },
    {
      slug: "function-scope",
      title: "Function Scope",
      description: "Understand variable scope in functions. Learn about local vs global variables."
    },
    {
      slug: "higher-order-functions",
      title: "Higher-Order Functions",
      description: "Functions that work with other functions. Master callbacks and functional programming."
    },
    {
      slug: "recursion",
      title: "Recursion",
      description: "Functions that call themselves. Learn recursive patterns and problem solving."
    },
    {
      slug: "arrow-functions",
      title: "Arrow Functions",
      description: "Modern function syntax and behavior. Understand lexical scoping and concise syntax."
    },
    {
      slug: "function-composition",
      title: "Function Composition",
      description: "Combine functions to create complex operations. Learn modular programming techniques."
    }
  ],
  arrays: [
    {
      slug: "array-basics",
      title: "Array Basics",
      description: "Create and manipulate arrays. Learn indexing, length, and basic array operations."
    },
    {
      slug: "array-methods",
      title: "Array Methods",
      description: "Use built-in array methods. Master map, filter, reduce, and other powerful operations."
    },
    {
      slug: "multidimensional-arrays",
      title: "Multidimensional Arrays",
      description: "Work with arrays of arrays. Understand matrices and complex data structures."
    },
    {
      slug: "array-iteration",
      title: "Array Iteration",
      description: "Loop through arrays efficiently. Learn different iteration patterns and techniques."
    },
    {
      slug: "array-sorting",
      title: "Array Sorting",
      description: "Sort arrays by different criteria. Understand sorting algorithms and custom comparisons."
    }
  ],
  conditionals: [
    {
      slug: "if-statements",
      title: "If Statements",
      description: "Make decisions with if statements. Learn basic conditional logic and branching."
    },
    {
      slug: "else-statements",
      title: "Else Statements",
      description: "Handle alternative conditions. Master if-else chains and default behaviors."
    },
    {
      slug: "logical-operators",
      title: "Logical Operators",
      description: "Combine conditions with AND, OR, and NOT. Learn complex conditional expressions."
    },
    {
      slug: "switch-statements",
      title: "Switch Statements",
      description: "Handle multiple conditions elegantly. Learn when to use switch vs if-else."
    },
    {
      slug: "ternary-operators",
      title: "Ternary Operators",
      description: "Write concise conditional expressions. Master the conditional operator syntax."
    },
    {
      slug: "comparison-operators",
      title: "Comparison Operators",
      description: "Compare values effectively. Understand equality, inequality, and relational operators."
    },
    {
      slug: "conditional-logic",
      title: "Conditional Logic",
      description: "Design complex decision-making logic. Learn to structure conditional flows effectively."
    }
  ]
};
