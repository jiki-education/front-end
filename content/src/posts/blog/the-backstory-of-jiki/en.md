---
title: "The Backstory of Jiki"
excerpt: "Why we built Jiki. This is the backstory that led us from Exercism to creating something totally new for beginners, and where we hope the journey will lead!"
tags: ["jiki", "learn-to-code", "beginners", "story"]
seo:
  description: "The story behind Jiki - why I built a new learn-to-code platform after years of running Exercism, and my vision for helping beginners."
  keywords: ["jiki", "learn to code", "beginners", "exercism", "coding bootcamp"]
---

Hi everyone!

I've spent the last year building out **[Jiki](https://jiki.io)**, starting with an idea, running a bootcamp to test my thinking, and then building out a (what I hope is kickass) product with Aron and Nicole.

I wanted to tell you about the journey. Why Jiki exists, why we invested our time and energy into it, and where I hope it will lead.

## Before Jiki, there was Exercism

For those who don't know, I've spent the last decade building **[Exercism](https://exercism.org)**. Exercism is a platform that helps developers deepen their skills and learn new programming languages. It's been a huge collaborative effort with thousands of people committing code, hundreds of maintainers building out language tracks, and thousands of mentors supporting other developers. Millions of people have used it to level up their coding, and it's something I'm really proud of.

But while Exercism was designed for developers who already know how to code, **we kept attracting total beginners**. In fact, at last count, over **500 people a day** are signing up to Exercism who've never written a line of code before. And Exercism really doesn't work for them as it wasn't built for them, so we send them away.

And that sucks.

My motivation with Exercism has always been about **social mobility** - helping people who need that help the most. I believe that programming is a core skill that almost everyone should learn. For some it can be a career, but for everyone it teaches critical thinking, problem solving, and gives you a skillset that helps in almost any digital work. In short, I believe programming genuinely changes lives and opens doors that might otherwise stay closed. So watching these beginners arrive, full of enthusiasm, and then having to tell them "sorry, this isn't for you yet" felt like a failure on my part.

I started exploring the "learn to code" landscape to understand what was out there for them. I talked to lots of the beginners signing up and started to explore the resources out there. And as I tried those resources, I realised something was missing. Most of them don't get to the heart of what I believe programming actually is: **fun problem solving**.

Instead, they give you videos to watch, quizzes to take, maybe a little coding exercise, and a certificate at the end. They teach you syntax and theory, but they don't really get you **making** things. And I think that's why so many people give up. It's not that coding is too hard - it's that the way they're being taught doesn't feel like coding at all.

So I decided to do something about it.

## Jiki's Journey to fruition

### Basing Jiki on my experience

When I think about how I learned to code, it wasn't through courses or tutorials. I started at eight years old, long before I had the internet. I learned by **building games**. I'd turn whatever my childish mind was obsessed with at the time (there was lots of Star Trek and wizards) and turn it into some random game. Then as I got older I made websites and little tools for myself - whatever I found interesting. I didn't have a curriculum. I just made stuff, got stuck, figured it out, and made more stuff.

That experience has shaped everything about how I think about learning. I believe people learn to code by **coding** - not by watching someone else do it, not by answering multiple choice questions, not by writing a line of code to "finish" an exercise, but by actually writing real programs and solving problems.

That's why Jiki is built around **projects from day one**. You're not doing tiny five-line exercises for months on end. You're building things - games, animations, tools - and writing **dozens, then hundreds** of lines of code in your first couple of months. It's challenging, but it's the kind of challenge that makes you feel like you're actually becoming a programmer.

### The Bootcamp

In January 2025, I ran a Bootcamp for 1,000 students. They learned a programming language that I wrote specifically for the bootcamp (called JikiScript). Each week they had about 3 hours of live teaching, then had some exercises to solve, then had a 3 hour "Labs" session, where we looked through the exercises together, they asked questions etc.

It was a really fun experience and I learned tons from it. It was also wildly intense as I was writing a programming language, exercises and lessons plus doing 6 hours of live streaming and dozens of hours of support each week - a huge thank you to the volunteers who helped me out with it!!

Crucially what I learned is that the pace I created was way too fast. I made something I thought would be gentle and easy, and it was still waaaaaaay too fast and hard for people. So I've taken that into Jiki, slowing things down even more - adding more exercises that go at a slower pace. If you're finding it easy, you'll shoot through those extra exercises, but if you're struggling, they'll (hopefully) be life-savers!

### Removing the foot-guns

I strongly believe that learning to code is made a lot harder as you also have to learn a programming language at the same time. That probably sounds like quite a weird statement, but stick with me.

Programming languages are designed for professionals. They contain numerous "advanced" features that enable us as developers to work faster and more efficiently. They also tend to have tons of historic baggage (JavaScript in particular really suffers from this) - features that should have been ripped out the language a long time ago, but have to stick around for legacy support.

This means as you're learning, you're coming across stuff that's either very advanced or just plain weird. We call these foot-guns (things you can shoot yourself in the foot with). When I ran the bootcamp I decided to write a new language without the foot-guns (called JikiScript). However, one piece of feedback I received was that it was frustrating to learn a language you then couldn't use in the real world. So for Jiki, I've decided to teach through either JavaScript or Python (same syllabus - you choose the language).

But I've removed the foot-guns.

I've written custom interpreters for both languages that just strip the noise out. You can't use `var` in JavaScript any more. You can't use arrow-functions until you're really comfortable with normal functions. You can't write `[] + {}` and expect to get anything other than an error. If someone is likely to be doing something unintentionally at this point in their learning journey, it's disabled. And as you progress, we enable more features and more functionality. This has been a **TON** of work, but I think it's going to make a huge difference.

### i18n

Another key feature I knew I needed to add was making Jiki multilingual.

Most people don't speak English. Most programming resources are in English. This needed fixing.

So in building Jiki, we created it so that everything could be multilingual - the content, exercises, AI helper and videos. My plan is to launch with English for the beta, then release a handful of new languages each month, until we're covering 95% of the world by the end of the year.

### Freemium

The final decision I had to make was pricing.

I 100% knew I wanted Jiki to be free. The whole point is to help people who need help. But I've also learnt from Exercism that it's really hard to run something when there's not enough money coming in to fund it (**THANK YOU** to everyone who donates to Exercism - you've made Jiki possible!!)

So I decided to take a Freemium approach. The core of Jiki is free - the videos and exercises are all available to everyone. But there are some nice extra features (AI support, some bonus projects, live-streams, behind-the-scenes content, etc) that people can access for a small monthly fee ($3.99). That's an amount that is affordable to most people in the world, so if people want to either support what we're doing, or want access to those features, that's a great way to start.

## What Jiki is and where I want it to go

Jiki is a learn-to-code platform, designed to be highly interactive and fun. It's made for beginners - people who have been coding for less than a year and want to get really solid foundations in place. You learn by building projects in a custom environment designed specifically to help you understand what's happening.

Things are structured in levels. In each, you'll watch a short video that teaches a new concept, then have a series of projects in which to use it. At the core of the learning is **Jiki**, a character that runs your code. Everything I teach is through the eyes of Jiki - how he sees your code, how he runs it. As you run your code, you can see exactly what Jiki is seeing - why he does what he does.

But more than the features, what I really care about is the philosophy behind it. Not everyone needs to become a software developer, but because understanding how to break down problems and build solutions is a skill that transfers to everything. And that's the key to the course - slowing down, and really thinking deeply about how to solve problems. That's really hard at first (we live in a dopamine-fueled era!) but it's an amazing skill when it clicks.

I don't have some grand aspirations for Jiki to replace any of the other platforms out there. I'm thoroughly not interested in competing with anyone else, and beyond the basics I believe there's lots of great content. What I want to see in the world is a platform that means as many people as possible can get **really solid fundamentals** and have a ton of fun learning them. Because when you have those fundamentals, learning everything else is **so** much easier. That's the aim of Jiki, and I'm really excited to be putting it into the world.

## Give it a try

I'd love you to **[try Jiki](https://jiki.io/auth/signup)** and see what you think.

If you're relatively new to coding (or a total beginner), then I hope you'll really enjoy learning from this. I'd love to know where you get stuck or frustrated - that feedback is invaluable for making it better.

If you're an existing developer, I should be upfront: this isn't designed for you. It'll probably feel quite basic and slow. But trust me, for newbies it feels fast and intense! I'd still love you to have a play and give me feedback. Your experienced eyes will no doubt spot things that beginners wouldn't think to mention. And if you know someone who's been thinking about learning to code, I'd really appreciate you sharing Jiki with them. That word-of-mouth support means everything!

If you believe in what we're doing and want to support the mission financially, then I'd be immensely grateful for your support. If you're an Exercism member, you can **[donate here](https://exercism.org/donate)**. If not, please use **[this Stripe donation page](https://donate.stripe.com/8x2fZh1jK7XD5O94fS8g11g)**. Building something like this takes a huge amount of time and resources, and every bit of support helps us keep going.

Thanks for reading 😁
