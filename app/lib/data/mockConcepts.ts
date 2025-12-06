import type { ConceptCardData } from "@/components/concepts/ConceptCard";

export const mockConcepts: ConceptCardData[] = [
  {
    slug: "loops",
    title: "Loops",
    description:
      "Direct how your program runs and makes decisions. Use loops to repeat code and conditionals to choose paths.",
    iconSrc: "static/images/concept-icons/icon-loops.png",
    subConceptCount: 6
  },
  {
    slug: "variables",
    title: "Variables",
    description:
      "Store and manipulate data in your programs. Learn about different data types and how to use them effectively.",
    iconSrc: "static/images/concept-icons/icon-variables.png",
    subConceptCount: 4
  },
  {
    slug: "functions",
    title: "Functions",
    description: "Organize your code into reusable blocks. Master parameters, return values, and function composition.",
    iconSrc: "static/images/concept-icons/icon-functions.png",
    subConceptCount: 8
  },
  {
    slug: "arrays",
    title: "Arrays",
    description:
      "Organize and store collections of data efficiently. Learn to manipulate lists and iterate through elements.",
    iconSrc: "static/images/concept-icons/icon-arrays.png",
    subConceptCount: 5
  },
  {
    slug: "conditionals",
    title: "Conditionals",
    description:
      "Make decisions in your code based on different conditions. Learn if statements, switch cases, and logical operators.",
    iconSrc: "static/images/concept-icons/icon-conditionals.png",
    subConceptCount: 7
  },
  {
    slug: "classes",
    title: "Classes",
    description:
      "Model real-world entities using classes and objects. Understand inheritance, encapsulation, and polymorphism.",
    iconSrc: "static/images/concept-icons/icon-classes.png",
    subConceptCount: 10
  },
  {
    slug: "strings",
    title: "Strings",
    description:
      "Work with text data in your programs. Learn string manipulation, formatting, and text processing techniques.",
    iconSrc: "static/images/concept-icons/icon-strings.png",
    subConceptCount: 6
  },
  {
    slug: "objects",
    title: "Objects",
    description:
      "Create and work with complex data structures. Learn about object properties, methods, and data modeling.",
    iconSrc: "static/images/concept-icons/icon-objects.png",
    subConceptCount: 9
  },
  {
    slug: "async",
    title: "Asynchronous Programming",
    description:
      "Handle time-dependent operations and concurrent execution. Master promises, async/await, and event handling.",
    iconSrc: "static/images/concept-icons/icon-async.png",
    subConceptCount: 12
  }
];
