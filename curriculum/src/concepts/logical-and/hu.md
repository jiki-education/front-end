---
title: "Az `and` kulcsszó"
description: "Két feltétel összekapcsolása a `&&` jellel, hogy a teljes feltétel csak akkor legyen igaz, ha mindkét fele igaz."
en_md5: e1541c5b23530ad11c293636e0b767e2
---

Ha azt kérném tőled, hogy csak akkor nyisd ki az ajtót, ha valaki elmúlt 20 éves, valószínűleg tudnád, mit kell tenned. De mi van akkor, ha azt is ellenőrizned kell, hogy az illető elmúlt-e 20, _és_ a megfelelő ruhát viseli-e? Ilyenkor két különböző feltételt kell egyszerre megvizsgálnod. Hogyan csinálnád?

Használhatnál például egymásba ágyazott elágazásokat (if statement), valahogy úgy, ahogy korábban az egymásba ágyazott ciklusoknál (loop) láttuk. Mondhatnád azt, hogy ha az életkor nagyobb, mint 20, akkor belépünk ebbe a kódblokkba, aztán jön egy újabb if, hogy a ruha diszkó-e, majd még egy kapcsos zárójel és egy újabb kódblokk. Ez működne, de elég átláthatatlanná válik, főleg ha sok feltételt szeretnél kezelni.

Szerencsére létezik egyszerűbb megoldás is, mégpedig az, hogy a feltétel több részből is állhat. Ahelyett, hogy csak egyetlen dolgot ellenőriznénk a feltételben, ellenőrizhetünk kettőt, hármat vagy akár többet is. Ehhez az `and` kulcsszót (keyword) kell használnunk. Sajnos a JavaScriptben az and kulcsszó valójában nem az „and" szóval írandó, pedig néhány más nyelvben igen. Ehelyett két és-jelet (`&`) kell egymás mellé írnod. Ezt egyszerűen meg kell jegyezned. Bosszantó, de ez van, és hamar megszokod majd.

Ezzel tehát összetettebb feltételt is írhatunk. Mondhatjuk azt, hogy ha az életkor nagyobb, mint 20, és a ruha diszkó, akkor továbbmegyünk. Ha az életkor kisebb, mint 20, vagy a ruha nem diszkó, akkor az egész állítás, vagyis az egész feltétel hamis. Ha tanultál valaha logikát, esetleg foglalkoztál elektronikával vagy haladóbb matematikával, ez nagyon természetes lesz számodra. Ha nem, akkor is gyorsan bele fogsz jönni.

```javascript
if (age > 20 && outfit === "disco") {
  openDoor()
}
```

Van egy dolog, ami az `and` és az `or` használatánál is sokakat megzavar, mégpedig az, hogy az és/vagy mindkét oldalán teljes összehasonlításnak kell állnia. Még ha ugyanazt a változót (variable) hasonlítod is össze mindkét oldalon, akkor is meg kell ismételned. Nem írhatod azt, hogy `if age is greater than 13 and less than 20`. Azt kell írnod, hogy `if age is greater than 13 and age is less than 20`. Mindkét oldalnak teljes összehasonlításnak kell lennie.

```javascript
if (age > 13 && age < 20)
```
