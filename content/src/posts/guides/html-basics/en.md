---
title: "HTML Basics"
excerpt: "What a web page actually is, how it's put together, and the tags you'll use to structure everything you ever make on the web."
tags: ["front-end-basics"]
seo:
  description: "A beginner's guide to HTML. Learn what HTML is, how a web page is structured with a head and a body, and the most important tags to know."
  keywords: ["html", "html basics", "learn html", "html tags", "web page structure", "beginners"]
---

## Introduction

In this guide I want to talk a little bit about what a web page actually is and how it works. We're going to keep to the most basic things. If you already know some HTML, this is probably going to feel really basic. If you don't, this should be a good primer for everything that comes next.

## What a web page really is

A web page is just a text file. When you visit a website, your browser is sent an HTML file, which it reads and draws out to create the page you see.

You can prove this to yourself right now. Go to any website, right click anywhere on the page, and choose **View Page Source**. That's the HTML. On a big site it'll look overwhelming, a whole load of stuff, but it's all made from the same handful of building blocks we're going to look at below.

HTML stands for **HyperText Markup Language**. "Markup" just means we take some text and mark it up with extra information about what each bit is. The browser, whether that's Chrome or anything else, reads those markings and uses them to decide how to put everything on the screen.

## Tags

HTML is famous for having **tags**, which have a `<` at the start and a `>` at the end. In between those angled brackets we have the thing that the tag is about. Then we have some content, and then a closing tag, which is the same as the opening one, but with a forward slash.

Let's look at an example:

```html
<p>Hello there.</p>
```

The `p` stands for paragraph. By writing this, we're telling the browser that we want it to render a paragraph on the screen, and that the text in that paragraph is "Hello there."

Tags can also carry extra bits of information called **attributes**, which live inside the opening tag. A link is a good example:

```html
<a href="https://jiki.io">Visit Jiki</a>
```

To create a link we use the `a` tag (which stands for anchor, for [slightly odd historical reasons](https://thehistoryoftheweb.com/brief-history-hypertext/)). A link normally has a `href` attribute, which states where the link goes, and the text between the tags is the bit you click on.

A few tags don't wrap any content, so they don't have a closing tag. An image is the classic example:

```html
<img src="photo.jpg" alt="A photo of me on a mountain" />
```

The `img` stands for image. The `src` attribute points at the image file, and the `alt` attribute describes the image for people using screen readers. It's also what gets shown if the image fails to load.

## The anatomy of a page

Every single web page has the same skeleton, the same bones. Here's the most barebones **valid** page you can make (you can make invalid pages with less HTML, which the browser will render, but let's start how we mean to carry on by behaving as responsible developers!):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Jeremy Walker</title>
  </head>
  <body>
    <h1>Jeremy Walker</h1>
    <p>I build things on the web.</p>
  </body>
</html>
```

Let's read through it from the top.

The `<!doctype html>` line tells the browser that this is a modern HTML document. It's a required bit of boilerplate. Write it once at the top and forget about it.

The `html` tag is the root element that wraps the whole document. The `lang="en"` attribute tells browsers and search engines that the page is written in English.

Inside that, we have two parts: the **head** and the **body**.

### The head

The head is everything that **doesn't** appear on screen. It's metadata, and metadata just means data about the page rather than stuff you see. In our example there are two things in it:

- `<meta charset="UTF-8" />` says which set of characters the page uses. UTF-8 is the standard character set, and it covers pretty much everything: Latin letters, accented characters, other alphabets, even emoji. If you paste an emoji into your HTML, this is the line that makes it display properly. Always include it.
- `<title>` sets the text that appears at the top of the browser tab. It's also what search engines use as the headline for your page. One thing you'll find yourself thinking about lots as you code is what you want up there when someone has twenty tabs open.

You'll often see one more line in the head, which is worth recognising:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

This tells phones to display the page at a sensible size rather than zoomed right out. We don't need to worry about it beyond that for now. Include it and move on.

### The body

The body is everything you actually see, everything in the big square space below the tabs and the address bar. Every heading, paragraph, image and link lives inside the body. The rest of this guide is about the tags that go in there.

## index.html

Before we get to the tags, there's one more thing worth knowing. There's a very longstanding convention that a file called `index.html` is the first page of a website. If you go to a domain without putting anything after it, the website looks to see if there's a file called `index.html`, and if there is, it just shows you its contents. There's nothing magical about the file itself. It's just a standard that nearly every website follows, so your homepage should live in a file with that name.

## The tags you'll use first

You can build a genuinely useful page with fewer than ten tags. Let's have a look at them, roughly in the order you'll reach for them.

### Headings

Headings come in six levels, from `h1` down to `h6`:

```html
<h1>Jeremy Walker</h1>
<h2>About me</h2>
<h3>My photography</h3>
```

The `h1` is the main heading of the page, and there should normally only be one. Use `h2` for section headings, `h3` for subsections inside those, and so on. Because an `h1` is a level one heading, the browser knows to make it a bit bigger and a bit bolder.

Choose your heading levels by meaning, not by size. They give your page an outline, a bit like chapters and sections in a book.

### Paragraphs

The `p` tag marks a paragraph of text, and almost all of the words on any page live inside one:

```html
<p>I have been building things on the web for thirty years.</p>
<p>These days I spend most of my time working on Jiki.</p>
```

Each paragraph gets its own tag, and the browser adds space between them automatically.

### Lists

There are two kinds of list. An **unordered list** (`ul`) gives you bullet points, and an **ordered list** (`ol`) gives you numbers. Inside either one, each entry is a **list item** (`li`):

```html
<ul>
  <li>Photography</li>
  <li>Podcasting</li>
  <li>Teaching people to code</li>
</ul>
```

Swap the `ul` for an `ol` and the bullets become 1, 2, 3.

### Links

Links are the thing that makes the web a web. The `a` tag turns anything into something clickable:

```html
<p>You can find my code on <a href="https://github.com/ihid">GitHub</a>.</p>
```

Links can point at other websites, or at other pages on your own site. If you've got a `resume.html` sitting next to your `index.html`, you can link to it with `<a href="resume.html">My resume</a>`.

### Images

The `img` tag puts an image on the page:

```html
<img src="images/me.jpg" alt="Jeremy standing on a hill in the Lake District" />
```

The `src` can be a file on your own site or a full web address. Always fill in the `alt` text with a genuine description of the image.

### Emphasis

Two little tags let you emphasise words within your text. `strong` marks something as important, and browsers show it bold. `em` marks stress emphasis, and browsers show it italic:

```html
<p>The struggle is where the <strong>learning</strong> happens, so <em>write your own solutions</em>.</p>
```

## Giving your page structure

The tags we've looked at so far describe individual bits of content. There's a second family of tags that describe the regions of a page. These are often called **semantic tags**, because they give meaning to each area rather than changing how anything looks:

- `header` wraps the top area of the page, typically your site name and logo.
- `nav` wraps your navigation, the set of links to the other pages on your site.
- `main` wraps the main content of the page. There should only be one.
- `section` groups a distinct chunk of content, usually with its own heading.
- `article` wraps a self-contained piece, like a blog post or a news story.
- `footer` wraps the bottom area, typically copyright and contact links.

A personal homepage using these might be shaped like this:

```html
<body>
  <header>
    <h1>Jeremy Walker</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="resume.html">Resume</a>
      <a href="portfolio.html">Portfolio</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>About me</h2>
      <p>...</p>
    </section>
    <section>
      <h2>My projects</h2>
      <p>...</p>
    </section>
  </main>
  <footer>
    <p>Get in touch at jeremy@example.com.</p>
  </footer>
</body>
```

None of these tags change the appearance of your page much on their own. So why bother? Because structure with meaning helps everything that reads your page that isn't a human looking at a screen. Screen readers use these tags to let blind users jump straight to the navigation or the main content. Search engines use them to understand what your page is about. And when you come to style your page later, having it well organised makes everything a lot easier.

If a chunk of the page doesn't fit any of those meanings, there are two generic containers: `div` for a block of content and `span` for a few words within some text. They mean nothing at all, which is exactly why you should reach for the meaningful tags first.

## More tags to recognise

You don't need to memorise these, but you'll bump into them as you look at other people's pages, so it's worth knowing they exist:

- `blockquote` for a quotation from somewhere else.
- `code` for a snippet of code within text, and `pre` for a block of preformatted text.
- `table`, with `tr` for each row and `td` for each cell, for genuinely tabular data.
- `form`, `input`, `label` and `button` for collecting input from visitors.
- `video` and `audio` for embedding media.
- `br` for a line break within text. Use it rarely. If you want a new paragraph, use a new `p`.

There are over a hundred tags in total, but the ones in this guide cover the vast majority of what you'll see and write. When you meet one you don't recognise, look it up on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element), which is the reference professionals use.

## Where to go next

The best way to make all this stick is to build something. Create an `index.html`, give it the skeleton from this guide, and structure a page about yourself with headings, paragraphs, lists and links. Then open it in your browser and have a look at what you've made.

Once you're comfortable, get into the habit of viewing the source of websites you visit. You'll start recognising the tags everywhere, and you'll see that even the most sophisticated sites are built from exactly the same pieces you've just learned.

Your page is going to look really plain for now, and that's fine. HTML gives a page its structure. Making it look good is the job of CSS, which is where we're heading next.
