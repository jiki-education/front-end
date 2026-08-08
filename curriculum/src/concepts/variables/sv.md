---
title: "Skapa och använda variabler"
description: "Lådor på Jikis hyllor som lagrar ett värde med en etikett så att du kan hämta ut det senare i din kod."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

Variabler är det som låter oss lagra information. När vi programmerar behöver vi ofta spara ett tal eller en sträng för att använda senare, och det är precis det variabler är till för. Så nu zoomar vi ut lite i Jikis lager, och då ser du att han har ännu en hylla. Den första hyllan känner vi redan till, den med funktionerna på, de här små maskinerna som `move` och `rectangle`. Men på den andra hyllan står det inga maskiner, utan massor av lådor, och de här lådorna är det vi kallar variabler. Du kan be Jiki att lägga vad som helst i lådorna och sedan be honom hämta ut det igen senare. Varje låda har ett namn, precis som funktioner har namn, och varje låda innehåller bara en enda sak. Än så länge antingen ett tal eller en sträng. Men längre fram i kursen ska vi titta på hur du lagrar mer komplexa saker i dem.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Två hyllor i Jikis lager: en med etiketten funktioner där maskinerna står, och en med etiketten variabler där lådorna står"
  width="500"
  height="173"
/>

Så hur säger vi åt Jiki att göra en låda och lägga något i den? Vi använder nyckelordet `let` (låta). Nyckelordet `let` talar om för Jiki att han behöver göra en ny låda. Du kan föreställa dig hur han packar upp en kartong ur sitt emballage och viker ihop den, och sedan tittar han på vad som står efter ordet `let`. Det är etiketten han sätter på lådan, i det här fallet `name` (namn). Så han tar fram sin penna och skriver `name` på etiketten. Sedan tittar han på vad som står efter likhetstecknet (_equal sign_ på engelska). I det här fallet är det mitt namn, `"Jeremy"`, och eftersom `"Jeremy"` är en sträng tar han en lapp och skriver `"Jeremy"` på den. Det är bara en sträng, precis samma sak som färgerna du har jobbat med, och sedan lägger han lappen i lådan.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki håller en lapp med strängen Jeremy på, redo att lägga den i lådan"
  width="373"
  height="400"
/>

Vi har alltså sagt åt honom att göra en låda, sätta en etikett på den och lägga något i den, och nu går han och ställer lådan på hyllan. Sedan kan Jiki när som helst i ditt program gå och hämta lådan från hyllan och titta vad som ligger i den. Börja bygga upp den här tankemodellen. Jag har programmerat i hela mitt liv, och jag föreställer mig fortfarande, när jag skriver kod, att jag lägger något i en låda som jag ska hämta ut senare. När du ser nyckelordet `let`, tänk verkligen: ”Okej, det betyder att jag gör en ny låda.”

Några ord om variablernas namn, alltså etiketterna på lådorna. Där har vi några regler. För det första får variabelnamn inte innehålla mellanslag. Om du vill använda flera ord som etikett på en låda trycker vi ihop orden mot varandra och gör om första bokstaven i varje nytt ord till en stor bokstav. Det här kallas _camel case_ (kamelnotation). Föreställ dig pucklarna på en kamel som knuffar upp första bokstaven i varje nytt ord så att den blir stor. Så om du vill ha en etikett som är mitt namn skriver vi det inte som två ord med mellanslag, utan som ett enda ord med stort N: `myName`.

Dessutom måste varje variabelnamn vara unikt. Du kan inte ha två lådor med samma etikett, och variabler kan inte heller heta samma sak som funktioner. Om du glömmer det blir Jiki förvirrad och ger dig ett felmeddelande.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki tittar förvirrat på två lådor som båda har etiketten name"
  width="485"
  height="400"
/>

Nu ska vi titta på var vi kan ha nytta av en variabel. Säg att vi ritar en sol på himlen. Vi vet att vi kan använda funktionen `circle` (cirkel) och ge den fyra indata: `left` (vänster), `top` (överkant), `radius` (radie) och `color` (färg). Men när vi ritar många saker och har alla de här talen utspridda i koden kan det bli riktigt svårt att hålla reda på och läsa den. Så i stället kan vi skapa varsin variabel för left, top, `radius` och `color` och sedan hänvisa till variablerna senare. Målet här är alltså att kunna använda funktionen `circle` och ange fina, läsbara namn på lådor, och när Jiki ser namnen vet han att han ska hämta lådorna från hyllorna och använda det som ligger i dem.

Nu skapar vi några variabler för det här. Vi börjar med solens vänsterposition. Vi använder nyckelordet `let` för att säga åt Jiki att skapa en ny låda som heter `leftPosition` (vänsterposition). Lägg märke till camel case där, med stort P. Och vi talar om för Jiki vilket tal som ska ligga i lådan. Han ställer den på hyllan och gör sedan samma sak för `topPosition` (topposition), `radius` och `color`.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Lådor med etiketter på variabelhyllan, var och en med ett värde som Jiki kan hämta senare"
  width="500"
  height="378"
/>

När som helst i koden kan vi hänvisa tillbaka till de här variablerna, och då hämtar Jiki ut värdena (_values_ på engelska) och stoppar dem i en maskin. Det andra fina med variabler är att varje gång vi vill rita något på samma position som solen kan vi återanvända samma `leftPosition`- och `topPosition`-variabler. Ta ett annat exempel. Tänk dig att du bygger en mur med 30 tegelstenar, och du vill att alla tegelstenarna ska ha samma bredd och samma höjd. Då är det mycket bättre att skapa variabler för bredden och höjden i början av koden och sedan hänvisa tillbaka till dem i resten av koden. För om du sedan vill ändra bredden eller höjden behöver du bara ändra på ett ställe, så uppdateras allt annat.
