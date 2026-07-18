---
title: "Sieve of Eratosthenes"
description: ""
---

You bought a big box of random computer parts at a garage sale. You've started putting the parts together to build custom computers.

You want to test the performance of different combinations of parts, and decide to create your own benchmarking program to see how your computers compare. You choose the famous "Sieve of Eratosthenes" algorithm, an ancient algorithm, but one that should push your computers to the limits.

A prime number is a number larger than 1 that is only divisible by 1 and itself. For example, 2, 3, 5, 7, 11, and 13 are prime numbers. By contrast, 6 is not a prime number as it is not only divisible by 1 and itself, but also by 2 and 3.

To use the Sieve of Eratosthenes, first, write out all the numbers from 2 up to and including your given number. Then, follow these steps:

1. Find the next unmarked number (skipping over marked numbers). This is a prime number.
2. Mark all the multiples of that prime number as not prime.

Repeat the steps until you've gone through every number. At the end, all the unmarked numbers are prime.

Note: The Sieve of Eratosthenes marks off multiples of each prime using addition (repeatedly adding the prime) or multiplication (directly computing its multiples), rather than checking each number for divisibility.

Create a function called `sieve` that takes a number as its input, and returns a list of all the prime numbers less than or equal to that number.
