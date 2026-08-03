---
title: "Skriv dina egna funktioner"
description: "Använd nyckelordet function för att bygga egna maskiner som Jiki kan ställa på sina hyllor och återanvända."
en_md5: 93286a30a373b5604b60b3c109ad00a3
---

Hittills har du använt funktioner som redan har byggts åt dig, funktioner som `circle`, `rectangle`, `moveRight` och `shoot`. Alla de funktionerna har någon annan gjort och ställt på Jikis hyllor.

Men nu är det dags för dig att börja göra egna funktioner.

För att visa hur det går till ska vi bygga en ny funktion för labyrinten som heter `walk5` (gå 5 steg).

Den här funktionen ska alltid flytta figuren fem steg framåt. Det är kanske inte världens mest användbara funktion, men den är enkel och lagom att börja med.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/walk-grid.webp"
  alt="Figuren på labyrintens rutnät, redo att gå fem steg framåt"
  width="500"
  height="314"
/>

Om jag skulle be dig skriva kod som flyttar figuren fem steg framåt kan du alltså antingen skriva `move` (flytta dig) fem gånger, eller använda en repeat-loop. I det här exemplet håller vi det enkelt och skriver `move` fem gånger i rad.

```javascript
move()
move()
move()
move()
move()
```

Det är alltså det som ska finnas inuti vår funktion.

Lägg nu till en rad under som säger åt Jiki att använda den här funktionen. Det har du sett många gånger vid det här laget.

Sedan blir vårt jobb att bädda in de första fem raderna i en funktion, så att det är just de fem raderna som körs när Jiki använder `walk5`.

För att förvandla de här fem raderna, de fem flyttarna, till en funktion behöver vi ett nytt nyckelord, nämligen nyckelordet `function`.

När vi använder nyckelordet `function` behöver vi göra två saker. För det första ange funktionens namn, i det här fallet `walk5`. För det andra använda klammerparenteser (`{}`) för att rama in koden som säger ”det här är vad du ska göra inuti funktionen”. Vi kan lägga till det i vår kod, och nu säger vi åt Jiki att skapa en funktion som heter `walk5`, och att han ska köra de här fem raderna varje gång `walk5` används.

```javascript
function walk5() {
  move()
  move()
  move()
  move()
  move()
}
```

När Jiki ser nyckelordet `function` bygger han en ny maskin, skriver ner instruktionerna på en tavla inuti den och sätter en etikett på maskinen där det står `walk5`. Sedan ställer han maskinen på hyllorna bredvid alla andra som redan står där.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/jiki-machine-whiteboard.webp"
  alt="Jiki står bredvid en ny maskin med en tavla inuti där funktionens instruktioner skrivs ner"
  width="500"
  height="396"
/>

Det är faktiskt inget särskilt med den funktion du just har gjort jämfört med de inbyggda (_built-in_ på engelska). De står helt enkelt sida vid sida på hans hyllor.

Och när du använder funktionen, när du skriver `walk5()`, går Jiki bara och hämtar maskinen från hyllorna och använder den precis som han har gjort med alla andra funktioner. Du kan tänka dig att det bor en mini-Jiki inuti varje maskin. Mini-Jiki har alltid en cool hatt på sig. Och den där mini-Jiki jobbar på precis samma sätt som vanliga Jiki utanför och följer instruktioner på samma sätt.

En viktig sak att förstå här är att Jiki inte kör koden när han skapar funktionen. Han skriver bara ner koden för att kunna använda den senare.

Figuren i labyrinten flyttar sig alltså inte när du skriver nyckelordet `function`.

Jiki har byggt maskinen och ställt den på hyllorna. Det är först när du säger åt honom att använda maskinen, genom att skriva `walk5()`, som det faktiskt händer.
