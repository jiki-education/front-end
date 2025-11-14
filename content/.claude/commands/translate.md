---
description: Translate a blog post or article into one or all supported languages
argument-hint: "[blog|article] [slug] [language?]"
allowed-tools: Task
---

**IMPORTANT: Always use the translation subagent system. Never translate manually.**

Translate content using the translation subagent system.

## Arguments

- **Type** ($1): `blog` or `article`
- **Slug** ($2): The post slug (e.g., `jiki-is-born`)
- **Language** ($3, optional): Specific language code (e.g., `hu`, `de`, `ja`) or omit to translate all

## Instructions

**You MUST use the Task tool to invoke the appropriate translation subagent(s).** The translate subagent will:

1. Verify the English source exists at `src/posts/$1/$2/en.md`
2. Check which translations already exist
3. Launch the appropriate language-specific subagents in parallel

### If language is specified ($3 is provided):

**Use the Task tool** to launch only the appropriate single subagent:

- Check if there is a `translate-{language}` subagent available for the specified language code
- If available, invoke that specific subagent (e.g., `translate-hungarian` for `hu`)
- If not available, inform the user that the language is not supported

### If language is NOT specified ($3 is empty):

**Use the Task tool** to launch the `translate` subagent, which will orchestrate all available language translations in parallel.

## Example Usage

```
/translate blog jiki-is-born          # Translates to all supported languages
/translate blog jiki-is-born hu       # Translates to Hungarian only (if supported)
/translate article about-jiki de      # Translates article to German only (if supported)
```

**Note**: The available languages are defined by the translation agents in the Jiki Claude Marketplace. Check the marketplace repository for the current list.
