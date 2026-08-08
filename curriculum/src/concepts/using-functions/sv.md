---
title: "Att använda funktioner"
description: "Du säger åt Jiki att köra en av sina små maskiner genom att skriva maskinens namn och två parenteser efter."
en_md5: fc671310093a081113a8f301b6ff53fe
---

När du skriver kod är det du egentligen gör att berätta vad du vill ska hända, på ett programmeringsspråk som en dator förstår. Det finns massor av olika programmeringsspråk, och det finns massor av olika tolkar (_interpreters_ på engelska) som tar det du skriver och gör om det till ettorna och nollorna som en dator förstår. I den här kursen är Jiki din tolk. Hela kursen är uppkallad efter honom. Det här är Jiki. Jiki blir din kompis på den här programmeringsresan. Det är hans jobb att tolka koden du skriver och göra om den till ettorna och nollorna som datorn faktiskt kan göra något med.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, den vänliga tolken som guidar dig genom kursen"
  width="421"
  height="400"
/>

Hela poängen med programmering är att ge tolken, i det här fallet Jiki, rätt instruktioner. Det finns massor av olika instruktioner du kan ge Jiki, massor som han förstår. Han kan sätta ihop saker, han kan göra något många gånger och han kan säga: ”Om det här händer, då behöver jag göra det här.” Han kan komma ihåg saker och sedan använda dem igen senare. Han kan ge dig ett fel (_error_ på engelska) om något inte stämmer. Allt det här går vi igenom i den här kursen. Men det viktigaste att förstå är att allt du kommer att göra går ut på att skriva upp instruktioner på en tavla som Jiki sedan kommer och följer.

När jag lärde mig programmera för 34 år sedan var det här tankemodellen jag byggde upp, och det är den jag har än i dag. Jag förstår hur datorer fungerar hela vägen ner till ettorna och nollorna, men ärligt talat tänker jag aldrig på det. I mitt huvud bor det en liten gubbe inne i datorn, och jag talar om för honom vad han ska göra. Så häng med mig på det här. Det är en kraftfull tankemodell att bygga upp, och om du börjar tänka så här bildligt kring vad personen inne i datorn gör, kommer det att hjälpa dig långt när du lär dig programmera.

Nu ska vi börja med att titta på ett av de mest grundläggande begreppen inom programmering: funktioner (_functions_ på engelska). Funktioner är som små maskiner som du kan säga åt Jiki att använda. Om vi tittar in i Jikis lager, det är där han håller till, ser du att han har en hylla med tre olika maskiner på: `move` (flytta), `turnLeft` (sväng vänster) och `turnRight` (sväng höger).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="En hylla i Jikis lager med tre maskiner märkta move, turnLeft och turnRight"
  width="500"
  height="371"
/>

När du skrev `move` och sedan de två parenteserna sa du åt Jiki att hämta `move`-maskinen från hyllan, veva på handtaget, dra igång den och använda den.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki rullar ner move-maskinen från hyllan för att använda den"
  width="439"
  height="400"
/>

När du skrev `turnLeft` och sedan parenteserna sa du åt Jiki att hämta `turnLeft`-maskinen från hyllan och använda den. Det är det här mönstret du kommer att använda om och om igen. När du vill använda en maskin skriver du dess namn och sedan parenteserna, och det säger åt Jiki att hämta maskinen och använda den:

```javascript
move()
turnLeft()
```

Hur maskinen egentligen fungerar, vad som händer inuti den, behöver vi inte bry oss om just nu. Det tittar vi på mycket mer i detalj längre fram. Det dröjer faktiskt inte länge förrän du kan bygga egna maskiner också. Men just nu behöver du inte tänka på det. I varje övning får du veta vilka maskiner som står på Jikis hylla. Det är olika maskiner i olika övningar, och du använder dem för att lösa övningarna.
