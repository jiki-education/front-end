---
title: "Nyckelordet `and`"
description: "Kombinera två villkor med `&&` så att hela villkoret bara är sant när båda delarna är sanna."
en_md5: 6ea0de65a81d8e5c8d2eb89f3db29705
---

Om jag bad dig att bara öppna dörren om någon är över 20 år skulle du nog veta precis vad du skulle göra. Men om du i stället behövde kolla om någon är över 20 _och_ har rätt outfit på sig? Då behöver du kolla två olika villkor på en gång. Hur skulle du göra det?

Du skulle kanske kunna använda en nästlad `if`-sats (_nested if statement_ på engelska), lite som när vi hade nästlade loopar tidigare. Då skulle du kunna säga: om `age` är större än `20` går vi in i det här blocket, och där inne en ny `if` som kollar om `outfit` är lika med `"disco"`, med ännu en klammerparentes och ett nytt block. Det skulle funka, men det blir ganska rörigt, särskilt när du vill ha många villkor.

Som tur är finns det ett enklare sätt, nämligen villkor som består av flera delar. I stället för att bara kolla en sak i villkoret kan vi kolla två, tre eller ännu fler saker. För att göra det använder vi nyckelordet `and`. I JavaScript är nyckelordet tyvärr inte själva ordet _and_, som det är i en del andra språk. I stället skriver du två och-tecken (`&`) bredvid varandra. Det får du helt enkelt komma ihåg. Det är lite irriterande, men det är som det är, och du vänjer dig snart.

Det här kan vi använda för att bygga ett mer komplext villkor. Vi kan säga: om `age` är större än `20` och `outfit` är `"disco"`, då fortsätter vi. Om `age` är mindre än `20`, eller om `outfit` inte är `"disco"`, då är hela satsen, hela villkoret, falskt. Har du någon gång pluggat logik, kanske byggt lite elektronik eller läst lite mer avancerad matte, då kommer det här att kännas helt naturligt. Om inte kommer du snabbt att få kläm på det.

```javascript
if (age > 20 && outfit === "disco") {
  openDoor()
}
```

En sak som brukar ställa till det för folk, med både `and` och `or`, är att varje sida av `and`/`or` (och/eller) måste vara en fullständig jämförelse. Även om du jämför samma variabel på båda sidorna måste du alltså upprepa den. Du kan inte skriva `if age is greater than 13 and less than 20`. Du måste skriva `if age is greater than 13 and age is less than 20`. Båda sidorna måste vara fullständiga jämförelser.

```javascript
if (age > 13 && age < 20)
```
