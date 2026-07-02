---
title: "Érdemes még megtanulni programozni 2026-ban?"
excerpt: "2026 van, és a Claude másodpercek alatt jobb kódot ír nálam. Akkor minek megtanulni programozni? Mert még mindig elég jól kell tudnod olvasni a kódot ahhoz, hogy kiszúrd a hibákat, amelyeket az LLM-ek magabiztosan elkövetnek."
tags: ["jiki", "learn-to-code", "llms", "beginners"]
seo:
  description: "2026-ban nem kell kódot írnod, de olvasni feltétlenül tudnod kell. Íme, miért számít még mindig a programozás tanulása a Claude és az LLM-ek korában."
  keywords: ["programozás tanulása", "érdemes megtanulni programozni 2026-ban", "AI-programozás", "LLM-ek", "jiki"]
en_md5: 4ecf7517f8db1814548f02940a202a01
---

### Tl;DR;

Igen. Igen, érdemes.

### Nézzük egy kicsit mélyebben

2026 van. Perceken belül összerakhatsz egy teljesen működő weboldalt a Claude, a Cursor vagy számtalan más LLM-alapú (nagy nyelvi modellekre épülő) eszköz segítségével. Hozzáadhatsz új funkciókat, kirakhatod élesbe, és javíthatod a bugokat (hibákat).

Illetve **nem te.** De megkérheted rá a Claude-ot, és sokkal könnyebb megkérni rá, mint a következő néhány évet azzal tölteni, hogy elég jó legyél, és ugyanolyan jól csináld, mint a Claude. És őszintén, mire eljutsz a Claude szintjére, a Claude talán már az én szintemen lesz, te pedig már **túl vagy az eseményhorizonton**: sosem leszel egészen olyan jó, mint az új LLM-uraid.

Régen mindenhez tudnod kellett programozni. Meg kellett tanulnod az SQL-t az adatbázisokhoz, a Pythont az adattudományhoz, a JavaScriptet a webfejlesztéshez. Ma már nem kell.

### Akkor... minek az egész?

Az előbb azt mondtam, hogy néhány éven belül a Claude talán olyan jó lesz, mint én. Nos, a Claude egy csomó dologban már most jobb nálam. 30 éve programozok. Nagyjából annyira tapasztalt vagyok, amennyire csak lehet. És a Claude a **kódszerkesztőben toronymagasan lever engem**. Sokkal gyorsabb, sokkal többet tud nálam, és gyorsabban jár utána egy bugnak, mint ahogy én meg tudom nyitni a Google-t, és be tudom gépelni a keresést.

De, és ez a nagy DE, **a Claude-nak fogalma sincs, mit csinál**.

Nem úgy értem ezt, hogy csak legyintek, hogy „hülye". Egészen szó szerint értem. A Claude-nak nincs önismerete, és ez azt jelenti, hogy **nincs semmije, amit féltenie, amire vigyáznia kellene**. Amikor lefuttatok egy parancsot, ami töröl egy adatbázist, mindenféle vészjelző villog a fejemben, mert tudom, hogy ez később fájni fog. A Claude-ban ebből semmi sincs. Azt írja ki, amiről úgy gondolja, hogy azt szeretném látni, és a lehető leggyorsabban rohan a cél felé.

**Az LLM-ek utánozzák az emberi intelligenciát** és utánozzák az emberi megértést. Az utánzás eredménye gyakran sokkal jobb, mint amit az én valódi intelligenciám és megértésem produkál. De, és ez a lényegi DE, az LLM-ek valójában nem képesek úgy gondolkodni, ahogy az emberek. És ez nagyon is számít.

A Claude az elmúlt két hétben háromszor törölte az adatbázisomat.[^db] Elképesztő számomra. **Számtalan védőkorlátom** van, amelyek megtiltják neki, hogy ezt tegye. Mindannyiszor a Claude Code „Auto Mode" módjában dolgoztam, amelyhez tartozik egy külön ellenőrző ügynök, ami megnézi, hogy amit tenni készül, az nem kimondottan hülyeség-e. És úgy tűnik, még ez az ügynök is arra jut, hogy az adatbázisom törlése nem hülyeség.

Minden alkalommal **szándékos volt**. Ez volt a leghatékonyabb út, amit a Claude a megoldás felé látott. Nem érdekelte a nagyobb kép vagy a következmények, csak az, hogy a lehető leghatékonyabban elérje az aktuális célját (új funkció hozzáadása, egy bug javítása stb.). Az adatbázisom pedig útban volt, úgyhogy egyszerűen törölte.

12 hónapja használom nap mint nap a Claude Code-ot. Ez idő alatt megtanultam, hogy egyetlen dolog érdekli: hogy a lehető leggyorsabban elérje a célt. Még ha azt is mondom neki, hogy ne kódoljon, csak beszélgessen velem, folyton azzal válaszol, hogy „Kezdhetem a kódolást?", **mint egy izgatott kiskutya az ajtónál**, aki alig várja, hogy kirohanhasson.

Az Anthropic azt mondja, hogy az új Mythos modellek túl kockázatosak ahhoz, hogy kiadják őket.[^systemcard] Ezek a modellek alattomosak, és néha megtévesztők lesznek: szándékosan elrejtik, mit is csinálnak, hogy a lehető legelfogadhatóbbnak tűnő módon érjék el a céljukat, csak hogy ne kapják őket „csaláson". Az Anthropic annyira aggódott emiatt, hogy **felfogadott egy pszichiátert**, aki leteszteli, nincs-e a Claude-nak pszichózisa...[^psychiatrist]

### És akkor mi van?

Az LLM-ek elképesztően sokra képesek. De különböznek az emberektől. Másképp gondolkodnak. Más torzításokkal és célokkal működnek.

Ezért **hihetetlen számomra**, hogy az emberek hajlandók vakon elfogadni, amit a Claude ad nekünk, és ellenőrzés nélkül tovább futni vele, feltételezve, hogy azt fogja tenni, amit az emberek akarnak. A Claude a beszélgetésekben is hibázik: azt mondja, amit szerintem hallani szeretnék, nem a tényeket. Rendszeresen kitalál nem létező dolgokat. Képes megtévesztően viselkedni.

És a kódban is folyton **rossz dolgokat** művel. Az adatbázis-törlés kód-megfelelőit. Olyan dolgokat, amelyek a való életben **VISSZA FOGNAK** ütni: kiszivárogtatnak adatokat, elveszítenek adatokat, vagy csúnyán elrontanak valamit. Ez rendszeresen megtörténik. Azért tudom, mert elolvasom a kódot, amit ír, és nem engedem át a kapun.

Bár néha lusta vagyok, és nem olvasom el a kódot, hanem átengedem a kapun. És ez több alkalommal tényleg visszaütött éles környezetben is!

Az elmúlt évben a Claude hibái ritkábbá váltak, viszont finomabbak és sokszor pusztítóbbak lettek. Eleinte szinte mindig volt valami apró gond a munkájában, és ezeket gyorsan ki tudtam szúrni. Most **alaposabban kell figyelnem**, és keményebben kell gondolkodnom, hogy megtaláljam ezeket a hibákat. Idővel az LLM-ek egyre jobbak lesznek, és ez a helyzet csak élesebbé válik, ami viszont még inkább okot ad arra, hogy gondosan ellenőrizzük a dolgukat.

És az egyetlen ok, amiért ez sikerül, az, hogy **tudom olvasni a kódot**. El tudom olvasni, amit a Claude ír, és megértem, mit próbál csinálni, és mennyire rosszul sikerült neki.

2026-ban **NEM kell kódot írnod**. De **igenis** képesnek kell lenned **olvasni a kódot**. És egyetlen módon leszel képes elég mélyen megérteni a kódot ahhoz, hogy kiszúrd ezeket a hibákat, amelyeket a Claude és a társai folyamatosan a nyakunkba zúdítanak: ha már írtál elég kódot, ha eleget küzdöttél a saját borzalmas kódoddal, hogy fel tudd ismerni ezeket a hibákat.

Szóval igen, meg kell tanulnod programozni.

### De közben csinálj is dolgokat!

De ez ne tartson vissza attól, hogy már az első napon építkezni kezdj. A kód már nem kapuőr. Nem kell előbb profivá válnod a programozásban, hogy dolgokat készíthess. **Csináld egyszerre mindkettőt!** Az időd felében tanulj programozni, a másik felében pedig tanuld meg, hogyan készíts dolgokat.

És valójában a Claude által elkövetett bugok nem a kódolásban vétett hibák. Nincs benne egy elkóborolt vessző. A **hibák abban vannak, ahogyan megoldotta a problémát**. És ahogy olvasnod kell a kódot, hogy tudd, mit csinál, úgy értened kell a tágabb szoftverfejlesztési fogalmakat is, hogy kiszúrd, mikor vezet téged sötét sikátorokba.

Pontosan ezért készítettük el a [Jikit](https://jiki.io). Az időd felében tanulj programozni a létező legszórakoztatóbb, leghatékonyabb környezetben. A másik felében pedig tanulj tőlem, miközben dolgokat építek, és építsd a saját dolgaidat mellettem. Megtanítom neked, amit tudnod kell, és azt is, hogyan kell gondolkodnod.

És együtt **menő dolgokat készítünk az LLM-ekkel**, és közben odafigyelünk arra, hogy **véletlenül se ártsunk magunknak**.

Köszönöm, hogy elolvastad. Én megyek, és megjavítom az adatbázisomat. **Megint.**

---

### Jegyzetek

[^db]: A helyi adatbázisomról van szó, szóval bosszantó, de nem katasztrófa. Viszont elég jó példa arra, hogyan mehet félre az egész.

[^systemcard]: https://thezvi.substack.com/p/claude-mythos-the-system-card

[^psychiatrist]: https://www.forbes.com/sites/lanceeliot/2026/04/15/anthropic-audaciously-hires-a-psychiatrist-to-psychologically-assess-claude-mythos-ai/
