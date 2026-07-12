---
title: "The Fascinating History of the Text Editor"
excerpt: "From punching holes in cardboard to editors that write code for you. The story of the humble text editor, and the rivalry between Vi and Emacs that's older than most of the people alive today."
tags: ["history", "text-editors", "vim", "emacs", "coding"]
seo:
  description: "The history of the text editor, from punch cards and line editors to Vi, Emacs, VS Code and the AI era. How the gap between an idea and running code kept shrinking."
  keywords: ["history of text editors", "vi vs emacs", "text editor history", "history of code editors"]
---

## Introduction

Since I started coding 30 years ago, I've used a text editor almost every day. I've tried many different ones and from time to time got somewhat religious about which is best.

For that whole period, one of the first rites of passage of a new developer is to install and learn how to use a text editor. But as agentic coding changes what it means to be a developer, the era of the text editor's dominance is maybe coming to an end.

So I thought it would be interesting to look at the story of the text editor. From punching holes in cardboard and waiting hours, to editing one line at a time on a printer, to a rivalry between Vi and Emacs that's older than most of the people alive today.

This is the story of the humble text editor.

## Before the editor: holes in cardboard (1950s-1960s)

It's hard to imagine programming without a screen to see your code on, but that's where this start.

In the 1950s and 1960s, the screen hadn't yet been invented and instead programs were physically punched into cardboard cards (or paper tape), one line of code per card. "Editing" meant re-punching a card, or physically swapping cards in and out of the deck.

If it takes my code more than a few seconds to run, I get very furstrated with the slow feedback loop, but back in this period, feedback was measured in hours. You would hand your deck to an operator, who would then put it in a queue of tasks to run. You'd get a printout back hours, or maybe days, later. I imagine a "typo" really wasn't a thing then...!

<figure class="post-figure">
  <img src="/images/blog/the-history-of-the-text-editor/keypunch-operator.webp" alt="A keypunch operator in the 1950s, punching data onto cards" />
  <figcaption>A keypunch operator in the 1950s. Photo by the U.S. Census Bureau via <a href="https://commons.wikimedia.org/wiki/File:Keypunch_operator_1950_census_IBM_016.jpg">Wikimedia Commons</a>, public domain.</figcaption>
</figure>

## The computer starts to talk back (1960s)

Two inventions dragged editing out of that slow batch world and into something interactive.

The first was the **teletype**. The teletype replaced the concept of batches of prepunched cards. Instead, you would type on a keyboard. Your keystrokes would be sent to the machine in real time, and it would print its replies straight onto a roll of paper. There was still no screen, but for the first time you had a live, back-and-forth channel to the computer instead of a stack of cardboard.

The second was **time-sharing**. Without time-sharing, a computer would be still be connected to one person a time, limited to the speed they could time and process replies. This led to a huge amount of wasted time waiting for the human operator to act. Time-sharing solved that by allowing the machine to flit between different people at once. Multiple people could be connected to one machine, and it would switch so fast that each of them got the illusion that they'd got the whole computer to themselves.

Put those two together and you've got a proper conversation with the machine. And once you can have a conversation, you can start editing your code while you're sitting there, a line at a time, instead of re-punching cards and praying. Which is exactly what the first real editors let you do.

<figure class="post-figure" style="max-width:300px">
  <img src="/images/blog/the-history-of-the-text-editor/teletype-asr33.webp" alt="A Teletype Model 33 ASR terminal, which printed output onto paper rather than a screen"/>
  <figcaption>Teletype Model 33 ASR. Photo by ComputerGeek7066 via <a href="https://commons.wikimedia.org/wiki/File:Teletype_model_33_ASR.jpg">Wikimedia Commons</a>, CC BY-SA 4.0.</figcaption>
</figure>

## The line editors: ed, QED and TECO (1962-1971)

The 1960s brought another huge paradigm shift. Your program stopped being a physical object you carried (a card deck in a box) and became a named file living on the computer's own disk. Rather than printing out a new card to change your program, you could now actually edit your program.

We still didn't have screens though. Instead everything you executed, and a copy printed onto a piece of paper. That printout is what is known as a "hard copy" - a permentnat record of the isntructions you gave to the computer.

This was the first time we had anything like modern editors, but they were still quite alien as they were **line-oriented**. You worked one line at a time, and they were command based. You would issue commands (some which feel very recognisable to those of us who have used vim), and those commands would make changes. For example, editing a poem to fix a typo might look like this:

```
input         output            what it does
------------  ----------------  ----------------------------------------
ed poem       45                open the file "poem"; ed prints its size
1,$p                            print all lines - ed then replies:
              Roses are red
              Violets are blu   the typo!
              Sugar is sweet
2             Violets are blu   jump to line 2; ed prints it
s/blu/blue/                     on this line, change blu to blue
p             Violets are blue  print the current line (now fixed)
w             46                write/save; ed prints the new size
q                               quit
```

The few people who were coding in this time would probably tell you about three notiable editors from this period:

- **TECO** created in 1962 by Dan Murphy at MIT, wsa originally for editing punched paper tape. It was famously cryptic, and doubled as a programming language (this matters later)
- **QED** created in 1965/66, by Butler Lampson and L. Peter Deutsch at Berkeley, was one of the first line editors. Two years later, Ken Thompson rewrote it and gave it **regular expressions** (a type of programming language used to match patterns in text), which was the first time they'd appeared in an editor.
- **ed** released in the early 1970s by Ken Thompson at Bell Labs, stripped QED's ideas down to a minimal editor that shipped with the first Unix. `ed` is still installed on every Mac and Linux machine today, and its command language is the direct ancestor of `grep`, `sed` and Vi's `:` commands (all of which have [Exercism tracks](http://exercism.org/tracks) if you want to learn them!)

TECO is also home to what's widely thought to be the earliest known software easter egg (a hidden feature found in many games today). On a later version of TECO, typing `make love` got you the cheeky reply `not war?`. It was slipped in around 1967 at the Stanford AI Lab, roughly a decade before easter eggs became a thing in video games. You can [install TECO](https://github.com/blakemcbride/TECOC) and try it out!

<figure class="post-figure">
  <img src="/images/blog/the-history-of-the-text-editor/teco-easter-egg.webp" alt="A green-on-black terminal showing the command make love answered by TECO with Not war?" />
  <figcaption>TECO's <code>make love</code> / <code>not war?</code> easter egg, reproduced in a modern TECO build.</figcaption>
</figure>

## Seeing the whole page: Bravo and WYSIWYG (1974)

Meanwhile, at **Xerox PARC**, a different branch of the story was starting.

In 1974, Butler Lampson and Charles Simonyi release **Bravo**, the first **WYSIWYG** editor ("what you see is what you get"). It showed formatted text with real fonts on a bitmap screen, and used the **mouse** to select text (the mouse was patented actually much older, but that's a story for another time!).

A little like Vim, it had two modes - a "Command mode" where pressing the keys _did_ things, and "Insert mode", where pressing keys typed on the screen.

This is actually a key pivot point in our story. On one hand, Simonyi later took these ideas to Microsoft where he built Word, and gave us word processors. And on the other hand, the screen mouse and modal editing fed directly into the code editors that followed.

<figure class="post-figure">
  <img src="/images/blog/the-history-of-the-text-editor/xerox-alto.webp" alt="A Xerox Alto computer, which ran Bravo, the first WYSIWYG editor" />
  <figcaption>Xerox Alto. Photo via <a href="https://commons.wikimedia.org/wiki/File:Xerox_Alto.jpg">Wikimedia Commons</a>, CC BY-SA 2.5.</figcaption>
</figure>

## The great rivalry: Vi and Emacs (1976 onwards)

<figure class="post-figure">
  <img src="/images/blog/the-history-of-the-text-editor/emacs.webp" alt="A screenshot of GNU Emacs editing code" />
  <figcaption>GNU Emacs. Screenshot by tecosaur via <a href="https://commons.wikimedia.org/wiki/File:Writing_and_compiling_C%2B%2B_in_Emacs.png">Wikimedia Commons</a>, CC BY-SA 4.0.</figcaption>
</figure>

- The heart of the story: in **1976**, on opposite coasts, the two editors that still dominate serious programming were born, from opposite philosophies
- **Emacs** (MIT: Richard Stallman, with David Moon and Guy Steele): started as a set of **macros for TECO** ("Editor MACroS")
- Emacs's big idea: an editor should be endlessly **programmable and extensible** by its user. It's less a text editor than a Lisp environment you happen to edit text in
- Stallman rebuilt it as **GNU Emacs** in 1984, and it became a flagship of the free software movement
- **Vi** (Berkeley: Bill Joy, then a grad student, later co-founder of Sun): a full-screen **visual** mode built on top of ed's line-editing core

<figure class="post-figure">
  <img src="/images/blog/the-history-of-the-text-editor/vim.webp" alt="A screenshot of Vim editing code" />
  <figcaption>Vim, the most popular modern descendant of Vi. Screenshot by Carolinedmoreschi via <a href="https://commons.wikimedia.org/wiki/File:Dracula_Theme_being_used_on_Vim.png">Wikimedia Commons</a>, CC BY-SA 4.0.</figcaption>
</figure>

- Vi was designed under brutal constraints: it had to be usable over a **300-baud modem**, where every character sent to the screen counted
- That scarcity produced Vi's genius: **modal editing**, where keystrokes are a compact command language for moving and transforming text
- **Vim** ("Vi IMproved", 1991) added multi-level undo, syntax highlighting and plugins. **Neovim** later modernised it further
- The **"editor war"** between the two camps is the oldest rivalry in software, and it's really a philosophical split: Emacs (maximal, programmable, do-everything environment) versus Vi (minimal, modal, ruthlessly efficient)
- Both are still in daily use nearly 50 years later, which is astonishing for any software

## Editors for the rest of us: BBEdit, TextMate, Sublime (1992-2008)

- As graphical operating systems matured, a new class of editors appeared for developers who wanted a native GUI, not a terminal
- **BBEdit** (1992, Mac): the long-lived "it doesn't suck" editor
- **TextMate** (2004, Mac): hugely influential during the **Ruby on Rails** boom. Its "bundle" and snippet system, and its grammar format for syntax highlighting, became a de facto standard that VS Code still uses today
- **Sublime Text** (2008): fast, cross-platform, minimal. It introduced things everyone copied, like the minimap, multiple cursors, and a fuzzy command palette
- Sublime proved there was a huge market sitting between "terminal editor" and "heavyweight IDE"

## The web-tech era: Atom and VS Code (2014-2015)

<figure class="post-figure">
  <img src="/images/blog/the-history-of-the-text-editor/vscode.webp" alt="A screenshot of VSCodium, the open-source build of VS Code" />
  <figcaption>VSCodium, the fully open-source build of VS Code (visually identical to Microsoft's release, but MIT-licensed so it can be shown here). Screenshot via <a href="https://commons.wikimedia.org/wiki/File:VSCodium_official_screenshot.png">Wikimedia Commons</a>, MIT.</figcaption>
</figure>

- **Atom** (GitHub, 2014): "a hackable text editor for the 21st century", built with web tech (HTML, JS, Node) via what became **Electron**. Hackable like Emacs, but slow. GitHub retired it in December 2022
- **VS Code** (Microsoft, 2015): also Electron-based, but faster and batteries-included (autocomplete, debugging, Git built in). It won decisively and now dominates
- VS Code's most important structural idea was the **Language Server Protocol (LSP)**
- Before LSP, every editor had to re-implement "understanding" of every language (autocomplete, go-to-definition, error checking) from scratch
- With LSP, a language ships one "server" that any editor can talk to. It decoupled language intelligence from the editor, and it's now an industry standard

## The AI era: editors that write with you (2021 onwards)

- The newest chapter shifts the editor from a tool you manipulate text with, to a **collaborator**
- **GitHub Copilot** (2021): inline AI autocomplete, later exposed via its own language server so any editor can plug in
- **Cursor** and **Windsurf**: forks of VS Code that rebuild the editing loop around AI (multi-file edits, chat, agents) while keeping VS Code's extensions
- **Zed** (Rust, open-sourced 2024): a from-scratch, GPU-accelerated editor built for speed, collaboration and AI
- **Agentic tools** (like Claude Code): where the "editor" increasingly drives itself, and the human reviews and directs rather than types
- Interestingly, LSP is being repurposed again, this time to give AI agents precise code intelligence instead of text-search guesses

## The end of an era? (today)

- Every era of this story compressed the gap between having an idea and seeing it run: batch cards (hours), to line editors (a line at a time), to full-screen editors (the whole file), to IDE intelligence (the editor understands your code), to AI (the editor writes with you)
- And yet the two 1976 editors, Vi and Emacs, are still here. The fundamental ideas (modal efficiency, programmable extensibility) outlasted every wave of hardware
- For 50 years, learning your editor was a rite of passage. That might be changing
- [Jiki tie-in / closing thought to go here]
- Thanks for reading
