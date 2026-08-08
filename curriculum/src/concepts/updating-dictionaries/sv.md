---
title: "Ändra uppslagstabeller"
description: "Använd `dict[key] = value` för att uppdatera befintliga poster eller lägga till nya, plus metoden `has` för att kolla nycklar."
en_md5: 254912c3c672aec40b2729cd005fb1a7
---

Du vet hur du skapar en uppslagstabell och hämtar värden ur den. Men vad händer om datan ändras? Någon gång blir jag ju äldre. Då är jag inte `42` längre, utan `43`.

Så hur uppdaterar vi uppslagstabellen? Jo, på ett sätt som är väldigt likt hur vi letar upp något. Du vet ju att vi hittar något genom att använda hakparenteser för att få ut värdet. Vi kan också använda hakparenteser följda av ett likhetstecken för att uppdatera uppslagstabellen. Jiki går till personlådan, tar ut bladet ur spiralblocket, hittar nyckeln `"age"`, suddar ut det `42` som stod där och skriver `43` i stället, och sedan åker bladet tillbaka ner i lådan. Det här ändrar själva uppslagstabellen.

```javascript
person["age"] = 43
```

Jiki gör alltså ingen ny uppslagstabell, han ändrar blocket som redan låg i lådan.

Och om du vill lägga till information som inte fanns där förut? Då gör du precis samma sak.

Om du anger en nyckel som inte finns lägger Jiki bara till en ny nyckel längst ner, med det värdet.

Så i det här fallet öppnar han blocket, letar efter `"country"`, ser att det inte finns där, och lägger sedan till en ny rad längst ner: `"country"` till vänster och `"England"` till höger.

```javascript
person["country"] = "England"
```

Alltså exakt samma syntax som när du ändrar ett värde. Jiki sköter båda delarna automatiskt. Om nyckeln finns uppdaterar han den. Om den inte finns lägger han till den. Du behöver inte göra något särskilt.

Och precis som du kan börja med en tom array och lägga in saker i den, kan du börja med en tom uppslagstabell och lägga till nycklar en i taget. Även det är ett väldigt vanligt mönster. Du kommer att se det hela tiden.

Ett vanligt sätt att använda uppslagstabeller är att hålla räkningen på saker. Du låter nycklarna vara de saker du vill räkna och värdena vara hur många gånger de har dykt upp. Tänk dig att du är ute och skådar fåglar och vill hålla koll på hur många du har sett av varje art. Första gången du ser en fågel sätter du dess räknare till ett, och varje gång du ser den igen hämtar du det aktuella värdet och ökar det med ett. För att det här mönstret ska fungera behöver vi ett sätt att kolla om uppslagstabellen redan har nyckeln. I så fall lägger vi till ett, och om den inte har nyckeln börjar vi på ett.

Och för det finns det en metod på uppslagstabeller: metoden `has` (har).

Du anger en nyckel du är intresserad av, och Jiki kollar om uppslagstabellen har den nyckeln eller inte, och returnerar sedan sant eller falskt.

```javascript
person.has("age") // true
```

Sätter vi ihop allt det här ser räknemönstret ut så här:

```javascript
if (counts.has(letter)) {
  counts[letter] = counts[letter] + 1
} else {
  counts[letter] = 1
}
```
