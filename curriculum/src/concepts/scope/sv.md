---
title: "Scope"
description: "Förstå hur klammerparenteser skapar sina egna hyllor, så att variabler bara lever så länge som deras block gör."
en_md5: 4d5fc2d1d304725660102e9aaceea4c3
---

Tänk dig kod som ritar en cirkel på ett nytt ställe varje gång den körs, och att vi vill rita 10 cirklar på olika ställen. Det skulle vi kunna kombinera med en loop. Men om du har varit riktigt uppmärksam har du kanske lagt märke till något konstigt här.

```javascript
repeat(10) {
  let left = Math.randomInt(0, 100)
  let top = Math.randomInt(0, 100)
  circle(left, top, 5, "blue")
}
```

Tidigare sa jag att det finns en regel om att lådorna på Jikis hyllor måste ha unika namn,

och att nyckelordet `let` skapar en ny låda varje gång du använder det.

Men eftersom `let` står i en loop kommer Jiki att skapa en ny låda varje gång loopen körs.

Så är koden fel, eller är det något annat konstigt som händer här?

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/thinking-jiki.webp"
  alt="Jiki ser fundersam ut och undrar om koden är fel"
  width="384"
  height="400"
/>

Det visar sig att koden är helt okej. Det här är helt giltig JavaScript-kod, och det fungerar tack vare ett begrepp som kallas _scope_ (räckvidd), eller scoping.

Scope är något som nog känns ganska enkelt till en början, men jag kan garantera att det kommer att ställa till det för dig under resten av din karriär. Även de mest erfarna utvecklarna får problem med scope, och JavaScript är ett av de krångligaste språken på den punkten. Jag berättar det här för att du inte ska känna dig dum när du själv stöter på problem med scope. Men var också extra uppmärksam nu, för det här är viktigt.

När det dyker upp en klammerparentes i koden skapas det som kallas ett nytt scope. Vad betyder det? Jo, du kan tänka dig att Jiki ställer fram en ny liten hylla i sin verkstad varje gång han ser en klammerparentes. Och alla lådor han skapar medan han jobbar, medan han kör koden inuti klammerparenteserna, de lådorna, de nya lådorna, hamnar på den lilla nya hyllan, inte på de vanliga.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves.webp"
  alt="Jikis stora hylla bredvid en ny mindre hylla som skapats av en klammerparentes"
  width="500"
  height="205"
/>

Och när Jiki kommer fram till den matchande avslutande klammerparentesen slänger han alla lådor som står på den där extra hyllan.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves-loop-end.webp"
  alt="Jiki slänger lådorna från den extra hyllan i en soptunna när han når den avslutande klammerparentesen"
  width="500"
  height="237"
/>

Så varje gång vi har en loop som den här kan vi skapa lådor som bara finns kvar under ett varv av loopen. Lådorna `left` (vänster) och `top` (överst) som du ser här finns bara tills vi når den avslutande klammerparentesen, och sedan slängs de. Och Jiki når den avslutande klammerparentesen varje gång loopen körs. Alltså 10 gånger i det här programmet. Så 10 gånger skapar han en låda som heter `left`, och slänger den igen.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/left-top-boxes-color.webp"
  alt="Två lådor med etiketterna left och top som bara finns kvar under ett varv av loopen"
  width="500"
  height="187"
/>

Så när du skapar en variabel måste du bestämma hur länge du vill att den ska finnas kvar. Om du vill att den ska leva länge behöver den stå utanför alla klammerparenteser. Om du vill att den bara ska finnas under en iteration, ett varv av loopen, kan du sätta den innanför klammerparenteserna. Ser du hur det här kan bli lite förvirrande? En bra tumregel när du är ny är därför att hålla alla dina variabler nära toppen av koden, utanför klammerparenteserna, och bara uppdatera dem inuti parenteserna. Vi skulle till exempel kunna skriva koden ovan med bara en `left`-låda och en `top`-låda som sätts till noll i början och sedan uppdateras varje varv i loopen. Det är också helt okej. Inget av sätten är rätt eller fel. Det finns rekommenderade sätt att göra det här på, men dem lär vi oss om senare. Experimentera så länge, ha kul, känn efter vad som passar dig bäst, och försök att inte oroa dig för mycket över det här.
