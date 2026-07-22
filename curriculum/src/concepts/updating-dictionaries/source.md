---
title: "Changing Dictionaries"
description: "Using `dict[key] = value` to update existing entries or add new ones, plus the `has` method for checking keys."
---

You know how to create a dictionary and get values out of it. But what happens if the data changes? At some point, I'm gonna get older. I'm not gonna be 42, I'm gonna be 43.

How do we update the dictionary? Well, we use a very similar method to how we find something. You know that we find something using square brackets to get the value out. Well, we can also use square brackets followed by an equal sign to update the dictionary. Jiki goes to the person box, takes out the notebook page, finds the age key, and then rubs out the 42 that was there and writes 43 in its place, and then the page from the notebook goes back in the box. This is changing the dictionary itself.

```javascript
person["age"] = 43
```

Jiki isn't making a new dictionary, he's changing the notepad that was already in the box.

What about if you want to add information that wasn't there before? Well, you can do exactly the same thing.

If you specify a key that doesn't exist, Jiki will just add a new key to the bottom with that value.

So in this case, he'll open the notepad, look for country, see it's not there, and then add a new line at the bottom, country on the left, England on the right.

```javascript
person["country"] = "England"
```

So exactly the same syntax as changing a value. Jiki handles both automatically. If the key exists, he updates it. If it doesn't, he adds it. You don't need to do anything special.

And just like you can start with an empty array and push things in, you can start with an empty dictionary and add keys one by one. Again, that's a very common pattern. You'll see it all the time.

One common use of dictionaries is to keep counts of things. You can specify the keys as the things we want to keep count of and the values as their counts. So imagine you're bird watching and you wanna keep track of how many of each bird you've seen. Every time you see a bird, you set its count to one, and then every other time you see it, you get its current value and increase it by one. For this pattern to work, we need a way of checking whether the dictionary already has that key, in which case we'll add one to it, or if it doesn't have that key, we need to start it off at one.

And to do that, we have a method on dictionaries, the <define>`has`</define> method.

You specify a key you're interested in, and Jiki will check whether the dictionary has that key or not, and then return true or false accordingly.

```javascript
person.has("age")
```

Putting that together, the counting pattern looks like this:

```javascript
if (counts.has(letter)) {
  counts[letter] = counts[letter] + 1
} else {
  counts[letter] = 1
}
```
