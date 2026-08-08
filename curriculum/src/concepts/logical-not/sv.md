---
title: "Operatorn `not`"
description: "Så använder du `!` för att vända ett booleskt värde: sant blir falskt och falskt blir sant, praktiskt när du vill växla något eller vända på en kontroll."
en_md5: 842c4a4e9cb1fd11c4318a1508296e27
---

Hittills har vi använt tre likhetstecken när vi har jämfört saker för att se om de är lika. Men ibland vill vi i stället kolla om saker _inte_ är lika, och då använder vi ett utropstecken följt av två likhetstecken. Inom programmering betyder ett utropstecken (eller _bang_, som jag tror att våra amerikanska vänner kallar det) i allmänhet ”inte”. Så tänk dig att du jobbar i en butik och att ledningen har bestämt att inga discokläder släpps in.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/shop-bouncer.webp"
  alt="En dörrvakt vid entrén till en butik som kollar kläderna på människorna i kön"
  width="451"
  height="400"
/>

Vi kan säga: ”Om outfiten inte är disco, öppna dörren.” `if`-satsen fungerar precis likadant.

```javascript
if (outfit !== "disco") {
  openDoor()
}
```

Skillnaden är bara att villkoret returnerar sant om sakerna är olika, och falskt om de är likadana. Vi hade alltså kunnat skriva samma sak som ”Om outfiten är disco, gör ingenting. Annars, öppna dörren.” Men oftast är det enklare och snyggare att använda operatorn `not`, så att du verkligen säger precis det du menar.

En sak till som hör ihop med det här. Ibland har du en variabel som är sann och vill vända den till falsk, eller något som är falskt som du vill vända till sant, och det kan vi använda för att hålla koll på saker. Tänk dig att vi har något som studsar fram och tillbaka mellan vänster och höger, och att vi har en variabel som heter `movingRight` (rör sig åt höger), som är sann när det ska röra sig åt höger. Men när det träffar högerkanten vill du växla (_toggle_ på engelska) den till falsk.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/pong-court.webp"
  alt="En Pong-liknande spelplan med racketar och en boll som studsar fram och tillbaka, som illustrerar hur variabeln movingRight växlas"
  width="500"
  height="352"
/>

Vi skulle kunna göra det genom att säga: ”Om `movingRight` är sant, sätt `movingRight` till falskt. Annars, sätt `movingRight` till sant.” Det är ett sätt att växla variabeln. Jiki tittar då på `movingRight` för att se om den är sann eller falsk, listar ut motsatsen och lägger tillbaka det värdet i lådan.

```javascript
if (movingRight === true) {
  movingRight = false
} else {
  movingRight = true
}
```

Men det finns ett smidigare sätt att göra det, och det är att använda samma utropstecken igen:

```javascript
movingRight = !movingRight
```

Och det vänder på värdet. `!movingRight` betyder motsatsen till vad det var innan.

Så om `movingRight` var sant är det nu falskt. Om det var falskt är det nu sant. Jiki hämtar det som ligger i lådan just nu,

och utropstecknet säger åt honom att ta fram motsatsen. Motsatsen till sant är falskt. Motsatsen till falskt är sant, och sedan lägger han tillbaka det i lådan. Det här gör exakt samma sak som den längre `if`/`else`-satsen, men det är mycket smidigare och kortare att skriva.
