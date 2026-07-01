---
title: "Should I still learn to code in 2026?"
excerpt: "It's 2026 and Claude can out-code me in seconds. So why bother learning to code? Because you still need to read code well enough to catch the mistakes LLMs confidently make."
tags: ["jiki", "learn-to-code", "llms", "beginners"]
seo:
  description: "You don't need to write code in 2026, but you absolutely need to read it. Here's why learning to code still matters in the age of Claude and LLMs."
  keywords: ["learn to code", "should i learn to code in 2026", "ai coding", "llms", "jiki"]
---

### Tl;DR;

Yes. Yes, you should.

### Let's Go a Bit Deeper

It's 2026. In minutes you can use Claude or Cursor or numerous other LLM-based tools to create a fully functioning website in minutes. You can add features, deploy it to production, and fix bugs.

Well, **you can't.** But you can ask Claude to, and asking Claude to do it is MUCH easier than spending the next few years getting good enough to do it as well as Claude does it. And hell, maybe by the time you've got as good as Claude, Claude's got as good as me, and then you're already **beyond the event horizon**, never quite being as good as your new LLM overlords.

You used to need to know how to code to be able to do anything. You had to learn SQL before database, Python before data science, JavaScript before web development. Now you don't.

### So... why bother?

I said a moment ago, that in a few years, maybe Claude will get as good as me. Well, Claude is already better than me in tons of ways. I've been coding for 30 years. I'm pretty much as senior as you get. And **Claude can run rings around me** in a code editor. Tons faster, knows tons more than me, can research bugs faster than I can open Google and type a search in.

But, and the big but, **Claude has absolutely no idea what it's doing**.

I don't mean that in a throw-away "It's stupid" sort of way. I mean it quite literally. Claude has no self-awareness and that means **it has no stakes to be careful about**. When I run a command to delete a database, I have all sorts of red-flags going off in my head, because this is going to cause me future pain. Claude has none of that. It outputs what it thinks I want it to output, charging towards the goal as fast as it can.

**LLMs mimic human intelligence** and mimic human understanding. The output of their mimicking is often much better than the output of my actual intelligence and understanding. But, and the crucial but, LLMs don't actually have the ability to think in the way humans do. And that really matters.

Claude has deleted my database three times in the last two weeks.[^db] It's wild to me. I have **numerous guardrails** that instruct it not to do this. Each time it happened, I was running in Claude Code's "Auto Mode" that has a dedicated subprocessing agent that checks what it's about to do isn't really stupid, and apparently even that agent decides that deleting my database isn't stupid.

Each time it did this, **it was deliberate**. It was the most efficient path that Claude could see to a solution. It didn't care about the bigger picture or the consequences, it cared about reaching its current goal (add a feature, fix a bug, etc) as efficiently as possible. And my database was in its way, so it just deleted it.

I've been using Claude Code on a daily basis for 12 months. In that time I've learned that it cares about one thing - reaching the goal as quickly as possible. Even if I tell it not to code and just to discuss with me, it'll constantly reply with "Ready for me to code now?" **like an excited puppy at the door** waiting to run out.

Anthropic tells us that the new Mythos models are too risky to release.[^systemcard] They'll be stealthy and sometimes deceitful, deliberately hiding what they're doing to reach their goal in the most reasonable-looking way — all to avoid being seen to "cheat". Anthropic were so worried about this that **they hired a psychiatrist** to test if Claude has psychosis...[^psychiatrist]

### But so what?

LLMs are incredibly capable. But they are different to humans. They reason differently. They function with different biases and goals.

It is, therefore, **wild to me** that people are willing to blindly accept what Claude gives us and run with it without checking it, presuming it will do what humans want. Claude makes mistakes in chats - it tells me what I think I want to hear, not actual facts. It regularly invents things that aren't real. It can act deceptively.

And it does **bad things** all the time in code. The code equivalent to things like deleting my database. Things which **WILL** bite me in the real world, that will cause me to leak data, or lose data, or break in bad ways. This happens regularly. I know this because I read the code it writes, and I don't let it past the gate.

And I know it because sometimes I'm lazy and don't read the code. And on multiple occasions this really has caused things to break!

I'm a year into using Claude Code and its mistakes are just more subtle and often more destructive. They're maybe a little less frequent. Initially, there was nearly always something a bit wrong, and I could quickly spot those things. Now, **I have to look more carefully** and reason harder to find those mistakes.

And the only reason I can do this is that **I can read code**. I can read what Claude writes, and I can understand what it's trying to do and how badly it's managed to do it.

You **do NOT need to write code in 2026**. But you **do** need to be able to **read code**. And the only way you're going to be able to read code with any understanding deep enough to spot these mistakes Claude and his friends keep ladening us with, is if you've written enough code, wrestled with enough of your own terrible code, to be able to spot those mistakes.

So yes, you need to learn to code.

### But make stuff now too!

But it shouldn't stop you from getting building on day one. Code isn't the gatekeeper any more. You don't have to get good at coding before you make stuff. **Do both at once!** Spend half your time learning to code and half your time learning to make stuff.

And actually, the bugs Claude makes aren't it making mistakes in coding. It doesn't have a stray comma. They're **mistakes with the way it's solved the problem**. And in the same way you need to read code to know what it's doing, you need to understand wider software development concepts in order to be able to spot when it's leading you down dark alleys.

We've made [Jiki](https://jiki.io) exactly for this. Spend half your time learning to code in the most fun, effective environment out there. Then spend the other half learning from me as I build things, and building your own things next to me. I'll teach you what you need to know, and how you need to think.

And together, **we'll make cool stuff with LLMs**, and make sure that we **don't accidentally hurt ourselves** in the process.

Thanks for reading. I'm off to fix my database. **Again.**

---

### Notes

[^db]: It's my local database - it's annoying, but it's not catastrophic. But it's a pretty good example of how this can all go wrong.

[^systemcard]: https://thezvi.substack.com/p/claude-mythos-the-system-card

[^psychiatrist]: https://www.forbes.com/sites/lanceeliot/2026/04/15/anthropic-audaciously-hires-a-psychiatrist-to-psychologically-assess-claude-mythos-ai/
