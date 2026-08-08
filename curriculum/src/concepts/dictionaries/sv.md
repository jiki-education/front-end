---
title: "Uppslagstabeller"
description: "Ett blad ur ett spiralblock där varje rad har en nyckel till vänster och sitt värde till höger, så att du får data med etiketter i stället för en lista."
en_md5: b8a26ad63301df1d00ce08e1e429cf05
---

Arrayer är vårt förstahandsval när vi har en lista med någonting: en lista med mentorer, en lista med poäng, en lista med ingredienser. Så fort du har en lista vill du använda en array.

Men det finns en annan datastruktur som också är väldigt vanlig, för när du vill ha något lite mer komplext än en lista.

Tänk dig att vi vill lagra lite information om mig: mitt namn, min ålder, var jag föddes. Du skulle kunna använda en array, men då är det inte särskilt tydligt vad som pågår.

Är England där jag föddes eller där jag bor? Är 42 min ålder eller något annat?

Och om jag vill använda det här måste jag komma ihåg att första positionen är namnet, den andra är åldern och den tredje är födelseorten. Det blir lite rörigt, och det blir rörigt för att det här egentligen inte är en lista med saker. Det är mer komplext än så. Och det är där uppslagstabeller (_dictionaries_ på engelska) kommer in. En uppslagstabell är en ny typ av datastruktur. Det är din femte. Du har strängar, tal, booleska värden, arrayer och nu uppslagstabeller.

Och jag vill att du tänker på en uppslagstabell som ett blad ur ett spiralblock.

Till vänster har du rubrikerna, orden `"name"`, `"age"`, `"birthplace"`, och dem kallar vi nycklar (_keys_ på engelska).

Och till höger, bredvid varje rubrik, har du själva datan, `"Jeremy"`, `42`, `"England"`, och dem kallar vi värden (_values_ på engelska).

Precis som en array är en uppslagstabell en enda sak. Den är ett blad ur ett spiralblock. Och precis som med arrayer kan Jiki lägga den i en variabel, i en låda, eller använda den som indata till en funktion, eller få ut en uppslagstabell ur rutschkanan. Så här ser en uppslagstabell ut i kod. Vi använder klammerparenteser (`{}`) för att visa var den börjar och slutar, och inuti har du par: en nyckel till vänster, ett kolon och sedan värdet till höger. Och mellan varje par sätter vi ett kommatecken. Så när Jiki ser det här tar han fram sitt spiralblock. Han skriver `name`, `"Jeremy"`, `age`, `42`, och så vidare för varje par.

Och när han är klar river han av bladet och lägger det i en låda med etiketten `person`.

Det finns några regler att känna till. Nycklar är alltid strängar. De måste ha citattecken runt sig, och varje nyckel måste vara unik. Du kan inte ha två nycklar som heter `name` i samma uppslagstabell.

Värdena får vara likadana om du vill, men nycklarna måste vara olika.

Och värdena kan vara vad som helst. De kan vara strängar, tal, booleska värden, arrayer eller till och med andra uppslagstabeller.

Du kan också ha en tom uppslagstabell, precis som vi hade en tom array, och du kan börja med den och bygga vidare på den senare.

Så nu har du en uppslagstabell, men hur får du ut något ur den igen?

Vi använder samma syntax med hakparenteser (`[]`) som med arrayer och strängar, men i stället för ett positionstal skriver vi in en nyckel. Så om vi vill hämta ut någons namn ur en uppslagstabell skriver vi:

```javascript
person["name"] // "Jeremy"
```

Och det säger åt Jiki att titta i uppslagstabellen `person`, hitta nyckeln `"name"` och hämta ut dess värde. Jiki går till lådan `person`, tar ut bladet ur spiralblocket, letar igenom alla nycklar tills han hittar `"name"`, läser av värdet, `"Jeremy"`, och lägger det i en ny låda som heter `name`.

Hakparenteser betyder alltid samma sak. Du sträcker dig in i någonting och hämtar ut någonting. Med arrayer och strängar använder du ett tal för att säga vilken position du vill hämta från. Med uppslagstabeller använder du en sträng, nyckeln.

Det är samma idé, bara lite annorlunda syntax.
