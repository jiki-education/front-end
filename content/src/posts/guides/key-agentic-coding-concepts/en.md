---
title: "Key Agentic Coding Concepts"
excerpt: "Models, tokens, context windows, and the other ideas you need to understand to use AI coding agents well."
tags: ["agentic-coding"]
seo:
  description: "The core concepts behind agentic coding explained for beginners: what AI models and tokens are, how context windows work, and why agents sometimes get things wrong."
  keywords: ["agentic coding concepts", "llm", "tokens", "context window", "ai models", "prompts", "hallucinations"]
---

## Introduction

At this stage, we presume you have OpenCode or an equivalent installed. If not, follow our guide on [installing an agentic coding platform](/guides/installing-an-agentic-coding-platform) first.

You can use an agentic coding tool without understanding how it works, in the same way you can drive a car without knowing what a clutch does. But a little understanding goes a long way. It explains why the tool sometimes seems brilliant and sometimes seems baffling, why some things cost money, and how to get much better results. These are the concepts worth knowing.

## Models

The **model** (or LLM, for "large language model") is the actual AI. Tools like OpenCode and Claude Code are not intelligent themselves. They are the harness: they gather up your request and your code, send it off to a model, and act on whatever comes back. The model is the "brain".

There are lots of models, made by different companies, and they differ in three ways that matter to you:

- **Capability.** Bigger, newer models are better at understanding messy problems and writing correct code. The very best (often called "frontier" models) are noticeably smarter than the rest.
- **Speed.** Smaller models respond faster. For simple questions, a fast model is often the nicer experience.
- **Cost.** The best models can cost fifty times more to run than perfectly decent ones. This is why free tiers use smaller or promotional models.

There is no permanent "best model". The leaderboard reshuffles every few months, which is one reason we recommend a tool that lets you switch models freely (in OpenCode, type `/models`).

## Tokens

Models do not read letters or words. They read **tokens**: small chunks of text, roughly three-quarters of a word each on average. "Understanding" is one token. "Misunderstanding" might be three. Everything you send to a model is chopped into tokens, and everything it writes comes back token by token. That is why you see responses appear as a stream of words rather than all at once.

Tokens matter for one big reason: **they are what you pay for**. Model pricing is quoted per million tokens, both for what the model reads ("input") and what it writes ("output"). When an agent reads five files of your code, that might be tens of thousands of input tokens. This is why free tiers have limits, and why an agent working on a big project costs more than one answering a quick question.

## The context window

A model has no memory. Every single time you send a message, the tool sends the _entire conversation so far_, plus any files the agent has read, all over again. The model's **context window** is the maximum amount it can be sent in one go: its working memory, measured in tokens.

Two practical things follow from this:

- **Long sessions degrade.** As a conversation grows, the context fills up with old detours and stale file contents. Models get measurably worse at paying attention when their context is stuffed. When an agent starts making silly mistakes late in a long session, it is often not being dim, it is drowning.
- **Fresh starts are free.** Starting a new session with a clean, well-stated request often beats soldiering on in a cluttered one. Do not be sentimental about your conversation history.

## Prompts

Your **prompt** is whatever you write to the model. The single highest-leverage skill in agentic coding is writing good ones. The difference between "fix my code" and "the tests in this folder fail with this error message, and I expected the function to return 5, not 3" is the difference between the agent guessing and the agent knowing.

A good prompt says three things: what you are trying to achieve, what is actually happening, and what you have already tried. Exactly what you would want from a colleague asking for help.

## The agentic loop

What separates an agent from a chatbot is the **loop**. When you give an agent a task, it does not just answer. It works:

1. It decides what it needs to know, and uses **tools** (reading files, searching, running commands) to find out.
2. It makes a change.
3. It checks its own work, usually by running your code or your tests.
4. If something failed, it goes back to step 1 with the new information.

Watching this loop is genuinely instructive: it is a decent model of how experienced programmers actually work. Investigate, change one thing, verify, repeat. Your job during the loop is supervision. The tool will ask your permission before doing anything significant, and you should read what it is proposing rather than reflexively approving everything.

## Hallucinations, or: the model is confidently wrong sometimes

Models do not know things the way you do. They generate the most plausible-looking response, and sometimes the most plausible-looking response is simply wrong: a function that does not exist, a setting that was never real, an explanation that sounds airtight but actually is incorrect. This is called **hallucination**, and it never fully goes away, even in the best models.

The defence is the same one professionals use: **never trust, always verify**. Run the code. Read the change before you accept it. If an explanation matters, ask the model to show you the line of code it is based on. Agents are far less prone to this than chatbots, precisely because their loop involves running things and seeing real results, but the habit of verifying is one you should build from day one.

## Privacy

One more thing worth knowing, especially on free tiers: free models are usually free because the companies behind them are collecting conversations to improve their models. For learning exercises that is a perfectly fine deal. But treat anything you send to a free model as potentially public: no passwords, no personal information, and later in your career, no private company code without checking the rules.

## That's the foundation

Models are the "brains", tokens are the currency, context is the memory, prompts are the steering wheel, and the loop is what makes it an agent. Everything else you will pick up by getting your hands dirty, which is exactly what we suggest you go and do. If you have not set up a tool yet, our [installation guide](/guides/installing-an-agentic-coding-platform) will get you there in ten minutes. Then watch the first [Frontend Basics](/build/frontend-basics/setting-up-the-project) session in Build with Jeremy to see it all in action.
