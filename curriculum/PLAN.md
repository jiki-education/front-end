# Curriculum Completion Plan

## How to Use This Plan

This is a large, multi-step process. **Work through it one step at a time.** Don't try to do everything at once.

The process has two passes:

1. **Pass 1 — Scaffolding:** Get everything into the right place with the right structure. Create all levels, stub out all exercises, fix slugs, wire up registrations. The goal is for every level and exercise to exist and pass tests, even if the exercise content is placeholder. Don't get bogged down perfecting individual exercises during this pass.

2. **Pass 2 — Refinement:** Go through each exercise and level one by one, refining content, polishing scenarios, improving solutions and stubs, and ensuring quality. This is where you make things good.

Focus on completing each phase below before moving to the next. Commit after each meaningful unit of work. **After each step, stop and discuss the results with the user. Only do work you're explicitly instructed to do — don't move ahead to the next step without being told to.**

## Goal

Align this repository with:

1. **The curriculum plan** at `/Users/iHiD/Code/jiki/scripts/curriculum.md` — source of truth for what levels and exercises should exist
2. **The API seed data** at `/Users/iHiD/Code/jiki/api/db/seeds/curriculum.json` — defines the level/lesson structure the app uses, with exercise slugs that must match exactly
3. **The API projects seed** at `/Users/iHiD/Code/jiki/api/db/seeds/projects.json` — defines capstone projects

The aim is to ensure:

- All levels from the curriculum exist here with correct language features
- All exercises exist, work, and are assigned to their correct levels
- Exercise slugs match exactly between this repo and the API seed data
- The API seed data includes all levels and exercises from the curriculum plan
- All tests pass

## Available Skills

You can use these slash commands to do the work:

- **`/add-level [description]`** — Add a new level. Reads existing levels, discusses with the user, creates the level file and registers it.
- **`/add-exercise [description or path]`** — Add a new exercise. Explores base classes, discusses with the user, creates all 11 required files and registers it.
- **`/migrate-exercise [exercise-slug]`** — Migrate an exercise from Bootcamp (in `/Users/iHiD/Code/exercism/website/bootcamp_content`). Copies existing content with minimal changes.

Use `/migrate-exercise` when the exercise exists in the Bootcamp. Use `/add-exercise` when creating something new or when the reference is in the planning repo.

## Status

### Fully Checked

- `maze-solve-basic` - Basic manual maze solving using only move() turn_left() turn_right()
- `space-invaders-solve-basic` - Basic Space Invaders using sequential move() and shoot() calls
- `maze-solve-walk` - Walk Through a Maze: use walk(steps) with arguments to navigate a maze (Using Functions level)
- `fix-wall` - Fix the Wall: draw rectangles to fill holes in a wall (Using Functions level)
- `cloud-rain-sun` - Cloud, Rain & Sun: combine rectangle, circle, and ellipse (Strings and Colors level)
- `snowman-basic` - Snowman Basic: build a snowman from three circles (Using Functions level)
- `jumbled-house` - Jumbled House: rearrange shapes to build a house (Strings and Colors level)
- `maze-solve-repeat` - Maze Solve Repeat: refactor a maze solution using repeat loops (Repeat Loop level)

### Needs Changes

- `foxy-face` - Foxy Face: draw triangles to build a geometric fox face (Strings and Colors level)
- `penguin` - Penguin: draw shapes with colors to build a penguin (Strings and Colors level)

#### Foxy Fox

- [ ] Add triangle diagram and instructions

#### Penguin

- [ ] Add ellipse diagram and instructions

### Implemented

- `golf-rolling-ball-loop` - Golf Rolling Ball Loop: use repeat loop to roll ball 60 times (Repeat Loop level)
- `space-invaders-repeat` - Space Invaders Repeat: repeat loop version of space invaders (Repeat Loop level)
- `snowman` - Snowman: use variables to position snowman parts (Variables level)
- `traffic-lights` - Traffic Lights: use variables to draw traffic light (Variables level)
- `relational-sun` - Relational Sun: use arithmetic to position sun rays (Variables level)
- `relational-snowman` - Relational Snowman: use arithmetic for snowman proportions (Variables level)
- `relational-traffic-lights` - Relational Traffic Lights: use arithmetic for traffic light positioning (Variables level)
- `plant-the-flowers` - Plant the Flowers: track position variable and plant 9 flowers using repeat loop (Basic State level)
- `golf-rolling-ball-state` - Golf Rolling Ball State: track x variable and use move_ball_to(x) in a loop (Basic State level)
- `finish-wall` - Finish the Wall: use repeat loop to add top layer of bricks (Basic State level)
- `dnd-roll` - D&D Roll: store return values from roll() and use them in announce() and strike() (Functions That Return Things level)
- `gold-panning` - Gold Panning: use return value from pan() in a loop with an accumulator, then sell total (Functions That Return Things level)
- `rainbow` - Rainbow: use HSL colors to draw rainbow arcs (Functions That Return Things level)
- `sunset` - Sunset: animate sky color changes with state (Functions That Return Things level)
- `random-salad` - Random Salad: toss together a random salad from different ingredients (Functions That Return Things level)
- `rainbow-splodges` - Rainbow Splodges: use return values to get colors (Functions That Return Things level)
- `stock-market` - Stock Market: track investment as market randomly rises and falls (Functions That Return Things level)
- `golf-scenarios` - Golf Scenarios: roll a ball to the correct spot (Functions That Return Things level)
- `plant-the-flowers-scenarios` - Plant the Flowers Scenarios: multi-scenario version (Functions That Return Things level)
- `cityscape-skyscraper` - Skyscraper: use return values to build skyscraper (Functions That Return Things level)
- `space-invaders-nested-repeat` - Space Invaders Nested Repeat: nested repeat loops to shoot 4 rows of aliens (Functions That Return Things level)
- `cityscape-skyline` - Skyline: nested loops to build a city skyline (Functions That Return Things level)
- `bouncer` - Bouncer: use if statements to check age (Conditionals level)
- `space-invaders-conditional` - Space Invaders Conditional: use conditionals to shoot aliens (Conditionals level)
- `bouncer-wristbands` - Bouncer Wristbands: use else/else-if for wristband colors (Conditionals level)
- `digital-clock` - Digital Clock: use conditionals to display time (Conditionals level)
- `bouncer-dress-code` - Bouncer Dress Code: use and/or for complex conditions (Complex Conditionals level)
- `golf-shot-checker` - Shot Checker: use complex conditionals to validate golf shots (Complex Conditionals level)
- `rock-paper-scissors-determine-winner` - Rock Paper Scissors: determine winner using complex conditionals (Complex Conditionals level)
- `maze-automated-solve` - Programmatically Solve a Maze: left-hand rule algorithm with sensing functions (Complex Conditionals level)
- `build-wall` - Build the Wall: nested loops to build a full brick wall with alternating rows (Conditionals and State level)
- `scroll-and-shoot` - Scroll and Shoot: move laser back and forth shooting aliens with state tracking (Conditionals and State level)
- `maze-turn-around` - Turn Around: define a turn_around() function for maze solving (Make Your Own Functions level)
- `battle-procedures` - Battle Procedures: refactor scroll-and-shoot logic into three named functions (Make Your Own Functions level)
- `maze-walk` - Walk: define a walk(steps) function with a parameter to move multiple steps (Make Your Own Functions level)
- `even-or-odd` - Even or Odd: determine if a number is even or odd using remainder operator (Adding Returns to Your Functions level)
- `triangle` - Triangle: determine if a triangle is valid and classify as equilateral, isosceles, or scalene (Adding Returns to Your Functions level)
- `leap` - Leap Years: determine if a year is a leap year using remainder and logical operators (Make Your Own Functions level)
- `collatz-conjecture` - Collatz Conjecture: calculate steps to reach 1 in the Collatz sequence (Adding Returns to Your Functions level)
- `look-around` - Look Around: implement canTurnLeft/canTurnRight/canMove sensing functions using look(direction) (Make Your Own Functions level)
- `hello` - Hello: greet a person by name using string concatenation (String Manipulation level)
- `two-fer` - Two-Fer: greet someone with a cookie offer using concatenation (String Manipulation level)
- `raindrops` - Raindrop Sounds: convert number to raindrop sounds based on divisibility (String Manipulation level)
- `three-letter-acronym` - Three Letter Acronym: build a 3-letter acronym from first letters of 3 words using string indexing and concatenate (String Iteration level)
- `tile-search` - Tile Search: search through a rack of tiles to find a specific letter (String Iteration level)
- `tile-rack` - Tile Rack: find position of a letter tile in a Scrabble rack using string iteration and index tracking (String Iteration level)
- `sign-price` - Sign Price: calculate price of a sign by counting non-space characters and multiplying by 12 (String Iteration level)
- `reverse-string` - Reverse String: reverse a string character by character (String Iteration level)
- `driving-test` - Driving Test: evaluate driving test results by iterating through marks (String Iteration level)
- `hamming` - Hamming: calculate Hamming distance between two DNA strands (String Iteration level)
- `niche-named-party` - Niche Named Party: check if a person's name starts with the required prefix (Multiple Functions level)
- `lower-pangram` - Lower Pangram: check if a lowercase sentence is a pangram using an includes helper function (Multiple Functions level)
- `alphanumeric` - Alphanumeric: classify strings as alpha, numeric, alphanumeric, or unknown using multiple helper functions (Multiple Functions level)
- `pangram` - Pangram: check if a sentence uses every letter of the alphabet (Methods and Properties level)
- `nucleotide` - Nucleotide: count occurrences of a specific nucleotide in a DNA strand (Methods and Properties level)
- `isbn-verifier` - ISBN Verifier: validate ISBN-10 numbers (Advanced Loops level)
- `weather-symbols-part-1` - Weather Symbols (Part 1): map weather descriptions to lists of drawing components using if/else if (Lists level)
- `weather-symbols-part-2` - Weather Symbols (Part 2): draw weather scenes from a list of element types using conditionals and helper functions (Lists level)
- `guest-list` - Guest List: check if someone is on the guest list (Lists level)
- `after-party` - After Party: check VIP list when celebrities only give first name (Lists level)
- `formal-dinner` - Formal Dinner: match guests to dinner list using honorific and surname (Lists level)
- `lunchbox` - Lunchbox: pack a lunchbox using lists and push with conditional milkshake exclusion (Lists level)
- `stars` - Stars: build a list of star strings with increasing length using repeat, concatenate, and push (Lists level)
- `meal-prep` - Meal Prep: compare fridge contents to recipe ingredients (Lists level)
- `wordle-process-guess` - Wordle Process Guess: process a Wordle guess and color the row (Lists level)
- `extract-words` - Extract Words: extract words from a sentence into a list, splitting on spaces and skipping periods (Lists level)
- `chop-shop` - Chop Shop: work out if the barber has time for one more customer (Lists level)
- `wordle-process-game` - Wordle Process Game: process a whole Wordle game, colouring each guess row by row (Lists level)
- `lookup-time` - Lookup Time: look up the current time for a city (Dictionaries level)
- `scrabble-score` - Scrabble Score: calculate the score for a Scrabble word (Dictionaries level)
- `rna-transcription` - RNA Transcription: convert DNA to RNA using multiple helper functions (Dictionaries level)
- `protein-translation` - Protein Translation: translate RNA sequences into proteins (Dictionaries level)
- `spotify` - Spotify Data: fetch and format favorite artists from a mock Spotify API using chained fetch calls (Dictionaries level)
- `word-count` - Word Count: count word frequencies in a sentence using dictionaries and has_key (Dictionaries level)
- `llm-response` - LLM Response: fetch and parse mock LLM API response, selecting best answer by certainty and formatting with unit conversions (Dictionaries level)
- `nucleotide-count` - Nucleotide Count: count all different nucleotides in a DNA strand (Dictionaries level)

### Implemented Projects (not in curriculum.json, in projects.json)

- `structured-house` - Structured House: capstone project using variables (Variables level)
- `sprouting-flower` - Sprouting Flower: capstone project using state (Functions That Return Things level)
- `rainbow-ball` - Rainbow Ball: bouncing ball with rainbow trail using conditionals and state (Conditionals and State level)
- `caesar-cipher` - Caesar Cipher: encode messages by shifting letters in the alphabet (Multiple Functions level)
- `acronym` - Acronym: convert a phrase to its acronym (Advanced Loops level)
- `alien-detector` - Alien Detector: track and shoot aliens using list data (Lists level)
- `tic-tac-toe` - Tic Tac Toe: build a complete tic-tac-toe game (Dictionaries level)
- `sieve` - Sieve of Eratosthenes: find all prime numbers up to a given limit (Dictionaries level)
- `emoji-collector` - Emoji Collector: navigate maze collecting emojis into a dictionary (Dictionaries level)
- `matching-socks` - Matching Socks: find matching pairs of socks across two laundry baskets (Lists level)

### Implemented (Objects level — not yet in curriculum.json)

- `boundaried-ball` - Boundaried Ball: create a Ball instance and bounce it off walls (Objects level)
- `smashing-blocks` - Smashing Blocks: add blocks to the breakout game and smash them with the bouncing ball (Objects level)
