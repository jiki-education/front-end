---
title: "Installing an Agentic Coding Platform"
excerpt: "Step by step instructions for installing OpenCode, signing in, and choosing an AI model, including options that cost nothing at all."
tags: ["agentic-coding", "installation"]
seo:
  description: "A beginner friendly guide to installing OpenCode, the agentic coding platform we recommend, with free AI model options via Zen and the low cost Go plan."
  keywords:
    [
      "opencode",
      "install opencode",
      "agentic coding",
      "ai coding assistant",
      "opencode zen",
      "opencode go",
      "free ai coding",
      "vscode"
    ]
---

## Introduction

An agentic coding platform is a tool that lets an AI work on code with you: reading files, making changes, and running commands on your computer. If that sentence is new to you, start with our overview of [agentic coding fundamentals](/guides/agentic-coding-fundamentals) and come back here when you are ready to install one.

This guide walks you through installing **OpenCode**, signing in, and choosing an AI model. You only need to do this once, and you can do the whole thing without spending any money.

## Why we recommend OpenCode

There are several good agentic coding tools, including Claude Code (Anthropic) and Codex (OpenAI). They are all broadly similar to use, so nothing you learn is wasted if you switch later. That said, we recommend **[OpenCode](https://opencode.ai)** while you are learning, for three reasons:

- **The tool itself is free and open source.** You are not locked into any company's subscription.
- **It works with almost any AI model**, including genuinely free ones, so you can start at a cost of zero and upgrade only if you want to.
- **It runs in the terminal**, which is a skill you want to build anyway. Working in the terminal is a big part of real-world programming, and you can run it inside VS Code so it sits right next to your code.

You can use OpenCode in two ways, and this guide sets you up for both:

- **On its own**, in any terminal window.
- **Embedded in VS Code**, where it opens in a panel beside your code and can see which file you are working on. This is what we recommend: you watch the agent's changes appear in your editor as it makes them.

## What it costs

OpenCode itself costs nothing. What you (sometimes) pay for is the AI model that does the thinking. OpenCode has a built-in model service called **Zen**, and there are two sensible ways to use it when you are starting out:

- **Free models.** Zen always offers a handful of models at no cost. They are free because the companies behind them are promoting them, which means the selection rotates over time, and your conversations may be used to help improve the models. That is a fine trade-off for learning exercises, but do not paste anything private or personal into them.
- **The Go plan.** For **$10/month** (with the first month at $5), OpenCode's Go plan gives you generous access to a much stronger set of models. You do not need this on day one. Start free, and upgrade if you find yourself hitting the limits of the free models.

## Which model should I choose?

If you are not sure what a "model" even is, our guide to [key agentic coding concepts](/guides/key-agentic-coding-concepts) explains it properly. The short version: the model is the actual AI brain, and different models are smarter, faster, or cheaper than others.

Inside OpenCode you can switch models at any time by typing `/models`. Our advice:

- **On the free tier**, try the free models on offer and see which you get on with. The list changes as promotions come and go, so we will not pretend to know what you will see, but at the time of writing **DeepSeek V4 Flash** is an excellent free choice.
- **On the Go plan**, the coding-focused models (at the time of writing, Kimi K2.7 Code, GLM-5.2, and the Qwen 3.7 family) are all strong. Pick one, and only worry about comparing them once you know the basics.

Do not agonise over this. For the exercises you will be doing while learning, every model on offer is more than capable.

## Before you start

You need two things in place:

- **VS Code**, so you can use OpenCode embedded in your editor. If you have not installed it yet, follow our guide on [installing VS Code](/guides/installing-vscode).
- **On Windows only: WSL.** OpenCode's terminal version runs best in Linux, and WSL gives your Windows machine a proper Linux terminal. Follow our guide on [installing WSL](/guides/installing-wsl) first, including the "Using WSL from VS Code" section at the end. Then come back here. On macOS and Linux there is nothing extra to install.

## Installing OpenCode

Installing OpenCode is a single command in the terminal. If you have never used a terminal before, this is a nice first taste: you type an instruction, and the computer does the work.

### Windows

1. Open VS Code, connect it to WSL (Ctrl+Shift+P, then **WSL: Connect to WSL**), and open a terminal (Terminal menu, then **New Terminal**).
2. Copy and paste this command into the terminal and press Enter:
   ```
   curl -fsSL https://opencode.ai/install | bash
   ```
3. When it finishes, close the terminal, open a new one, and type `opencode --version` followed by Enter. If it prints a version number, you are done.

### macOS

1. Open **Terminal** (press Cmd+Space, type "terminal", and press Enter), or open a terminal inside VS Code (Terminal menu, then **New Terminal**).
2. Copy and paste this command into the terminal and press Enter:
   ```
   curl -fsSL https://opencode.ai/install | bash
   ```
3. When it finishes, close the terminal, open a new one, and type `opencode --version` followed by Enter. If it prints a version number, you are done.

### Linux

1. Open your terminal, or open one inside VS Code (Terminal menu, then **New Terminal**).
2. Copy and paste this command into the terminal and press Enter:
   ```
   curl -fsSL https://opencode.ai/install | bash
   ```
3. When it finishes, close the terminal, open a new one, and type `opencode --version` followed by Enter. If it prints a version number, you are done.

<!-- SCREENSHOT: terminal after the install script has completed -->

## Signing in

Now connect OpenCode to Zen so it has a model to talk to:

1. In your terminal, type `opencode auth login` and press Enter.
2. Use the arrow keys to choose **OpenCode Zen** and press Enter. It will open your browser so you can create a free account and sign in. No payment details are needed.

<!-- SCREENSHOT: the opencode auth login provider list -->

## Your first conversation

Time to try it out:

1. In VS Code, open a folder with some code in it (any of your practice projects is perfect), and open a terminal.
2. Type `opencode` and press Enter. The OpenCode interface will appear in the terminal panel, right next to your code. (The first time you do this, it also installs a small VS Code extension that connects the two, so OpenCode can see which file you have open.)
3. Type `/models` and pick one of the **free** models.

<!-- SCREENSHOT: the /models picker showing free models -->

4. Now ask it something. Type a message like:

> Look at the files in this folder and explain what they do.

Watch what happens. It will read files, think, and report back, and it will ask your permission before changing anything. That loop of reading, acting, and checking is the heart of agentic coding.

<!-- SCREENSHOT: a first conversation in OpenCode inside VS Code -->

The same thing works in any terminal, with or without VS Code. Open a terminal, move into a project folder, type `opencode`, and you are off. Some people love working that way; try both and see which suits you.

That is it. You now have a working agentic coding setup that costs nothing to run. To understand what is actually going on under the hood, and what words like tokens and context mean, carry on to [key agentic coding concepts](/guides/key-agentic-coding-concepts).
