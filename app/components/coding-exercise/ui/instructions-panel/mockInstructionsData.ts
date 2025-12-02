import type { ConceptCardData } from "@/components/concepts/ConceptCard";

// Type definitions for the enhanced instruction data
export interface FunctionInfo {
  name: string;
  description: string;
  signature: string;
  examples?: string[];
  category: string;
}

// Mock data object - this will come from orchestrator later
export const mockInstructionsData = {
  instructions: `## What is an Acronym?

An acronym is an abbreviation formed from the initial letters of words in a phrase. For example:
- "Portable Network Graphics" becomes "PNG"
- "World Wide Web" becomes "WWW"
- "Application Programming Interface" becomes "API"

## Task Overview

Your goal is to create a function that processes a text string and extracts the first letter of each word to form an acronym.

### Algorithm Steps:

1. **Parse the input string** - Go through each character
2. **Identify word boundaries** - Look for spaces, hyphens, or other separators
3. **Extract first letters** - Capture the first character of each word
4. **Convert to uppercase** - Ensure all letters are capitalized
5. **Combine results** - Join all letters into the final acronym

### Example Code Structure:

\`\`\`javascript
function createAcronym(phrase) {
  let result = "";
  let isNewWord = true;

  for (let i = 0; i < phrase.length; i++) {
    let char = get_character(phrase, i);

    if (char === " " || char === "-") {
      isNewWord = true;
    } else if (isNewWord) {
      result = concatenate(result, char);
      isNewWord = false;
    }
  }

  return to_upper_case(result);
}
\`\`\`

## Edge Cases to Consider

- **Multiple spaces**: Handle consecutive spaces between words
- **Hyphenated words**: Treat hyphens as word separators
- **Leading/trailing spaces**: Ignore spaces at the beginning or end
- **Empty strings**: Return empty string for empty input
- **Single words**: Should return first letter only

## Success Criteria

Your solution should correctly handle all the test cases and produce the expected acronyms for various input phrases.`,

  functions: [
    {
      name: "concatenate",
      description:
        "Joins two strings together to create a new string. This is essential for building up your acronym letter by letter.",
      signature: "concatenate(str1, str2)",
      examples: ['concatenate("A", "B") → "AB"', 'concatenate("Hello", " World") → "Hello World"'],
      category: "String Operations"
    },
    {
      name: "to_upper_case",
      description:
        "Converts all characters in a string to uppercase. Use this to ensure your final acronym is properly capitalized.",
      signature: "to_upper_case(text)",
      examples: ['to_upper_case("png") → "PNG"', 'to_upper_case("Hello World") → "HELLO WORLD"'],
      category: "String Operations"
    },
    {
      name: "get_character",
      description:
        "Retrieves the character at a specific position in a string. Essential for iterating through the input text character by character.",
      signature: "get_character(text, index)",
      examples: ['get_character("Hello", 0) → "H"', 'get_character("Hello", 4) → "o"'],
      category: "String Access"
    },
    {
      name: "string_length",
      description:
        "Returns the total number of characters in a string. Useful for loop conditions when iterating through text.",
      signature: "string_length(text)",
      examples: ['string_length("Hello") → 5', 'string_length("") → 0'],
      category: "String Access"
    },
    {
      name: "is_letter",
      description:
        "Checks if a character is a letter (A-Z, a-z). Helpful for identifying valid word characters vs separators.",
      signature: "is_letter(character)",
      examples: ['is_letter("A") → true', 'is_letter(" ") → false', 'is_letter("-") → false'],
      category: "Character Testing"
    },
    {
      name: "is_space",
      description: "Checks if a character is a space or whitespace character. Use this to identify word boundaries.",
      signature: "is_space(character)",
      examples: ['is_space(" ") → true', 'is_space("A") → false', 'is_space("\\t") → true'],
      category: "Character Testing"
    }
  ] as FunctionInfo[],

  conceptLibrary: [
    {
      slug: "string-manipulation",
      title: "String Manipulation",
      description: "Working with text data including concatenation, case conversion, and character access.",
      iconSrc: "static/images/concept-icons/icon-strings.png"
    },
    {
      slug: "iteration-loops",
      title: "Iteration and Loops",
      description: "Going through each element in a sequence one by one to process data systematically.",
      iconSrc: "static/images/concept-icons/icon-loops.png"
    }
    // {
    //   slug: "conditional-logic",
    //   title: "Conditional Logic",
    //   description: "Making decisions in code based on different conditions and boolean logic.",
    //   iconSrc: "static/images/concept-icons/icon-conditionals.png"
    // },
    // {
    //   slug: "functions",
    //   title: "Functions",
    //   description: "Reusable blocks of code that perform specific tasks and can accept parameters.",
    //   iconSrc: "static/images/concept-icons/icon-functions.png"
    // },
    // {
    //   slug: "variables",
    //   title: "Variables",
    //   description: "Storage containers for data values that can be referenced and manipulated.",
    //   iconSrc: "static/images/concept-icons/icon-variables.png"
    // },
    // {
    //   slug: "arrays",
    //   title: "Arrays",
    //   description: "Ordered collections of data elements that can be accessed by index position.",
    //   iconSrc: "static/images/concept-icons/icon-arrays.png"
    // }
  ] as ConceptCardData[]
};
