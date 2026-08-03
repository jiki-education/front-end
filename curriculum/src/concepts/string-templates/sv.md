---
title: "Strängmallar"
description: "Så använder du backticks och platshållare med `${...}` för att stoppa in värden direkt i en sträng i stället för att sammanfoga delar med `+`."
en_md5: 7fd0e09ac3b32db5f159f8e772872104
---

Vi kan använda något som kallas _template literals_ för att stoppa in strängar i andra strängar.

I stället för att lägga ihop strängar kan vi alltså ha en sträng, eller en mall, med luckor för andra strängar inuti.

För att göra det använder vi _backticks_ (`` ` ``) i stället för citattecken.

Precis som namnet antyder är backticks bakåtlutade små streck, men du har kanske aldrig använt dem förut, så du kan behöva leta upp rätt tangent på tangentbordet.

Vi använder dem för att skapa en mall som kan innehålla andra strängar. För att sedan stoppa in en sträng i mallen använder vi ännu en lite märklig syntax med dollartecken och klammerparenteser. För att till exempel göra samma sak som `"hello " + name`, som vi nyss såg när vi sammanfogade strängar, kan vi skriva:

```javascript
`hello ${name}` // "hello Jeremy" or "hello Jiki"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/string-templates/jiki-name-box.webp"
  alt="Jiki håller en låda med etiketten name, värdet som stoppas in i mallen"
  width="207"
  height="400"
/>

Det gör precis samma sak som att lägga ihop strängarna.

Men när du har flera strängar som alla ska pusslas ihop på ett ställe kan det här vara mycket smidigare.

Det kan ta ett litet tag innan du vänjer dig vid den exakta syntaxen, men det är egentligen inget krångligt med den.
