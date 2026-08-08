---
title: "Arrays"
description: "Een geordende ketting van elementen (strings, getallen, booleans of wat dan ook) die als één waarde bij elkaar gehouden wordt en die Jiki kan doorgeven."
en_md5: d26ccb9e04fbc77129f3199d63a95017
---

Je hebt al met getallen, strings en booleans gewerkt (het chique woord voor waar en onwaar). Die verschillende soorten noemen we datatypes. Nu komt daar ons eerste samengestelde datatype (_compound data type_ in het Engels) bij.

Dat is een datatype dat meerdere dingen kan bevatten, niet maar één ding. En dit datatype heet een _array_ (reeks).

Als je het woord array hoort, wil ik dat je denkt aan een echte ketting die een heleboel dingen bij elkaar houdt.

Die dingen kunnen van alles zijn: strings, getallen, booleans, zelfs andere arrays, zelfs dingen die je nog niet kent. Maar daar hoeven we ons nu nog geen zorgen over te maken.

Alles in deze ketting heeft een vaste volgorde: de volgorde waarin de dingen aan elkaar vastzitten.

Een array bevat dus een heleboel dingen, maar het is zelf één vast element, één vast ding: één array met een heleboel elementen erin.

Jiki kan die array, die ketting, oppakken en in een doos stoppen, net zoals hij een string of een getal in een doos kan stoppen.

Hij kan hem in de invoergleuf van een machine stoppen. Hij kan hem uit een resultaatglijbaan halen. Deze array is één ding, en Jiki werkt er precies zo mee als met strings, getallen en alles wat je tot nu toe hebt gezien.

In code ziet een array er trouwens ook een beetje uit als een ketting. Hij heeft aan beide uiteinden een vierkant haakje (`[]`) en daartussen een heleboel items die aan elkaar vastzitten, gescheiden door komma's.

Als we bijvoorbeeld een array willen maken met de namen van een paar van onze bootcampleden, dan maken we een doos genaamd `mentors` (mentoren) en stoppen we die ketting erin.

We schrijven `let mentors =`, precies zoals bij elke andere doos, en daarna een openend vierkant haakje, een heleboel elementen (de namen, gescheiden door komma's) en dan een sluitend vierkant haakje. Als Jiki dit ziet, pakt hij vier stukjes papier, één voor elke naam. Dan pakt hij een nieuwe ketting, maakt hij ze er allemaal aan vast en stopt hij die ketting in de doos `mentors`.

Je kunt van alles in een array stoppen: strings, getallen, booleans, zelfs een mix van dingen.

Dit zijn allemaal voorbeelden van volledig geldige arrays.

Je kunt ook een lege array maken. Dat is gewoon een ketting zonder elementen, dit is nog steeds volledig correct. Hij heeft nog steeds zijn beide uiteinden. Het is nog steeds een ketting, alleen zitten er geen items in. Maar je kunt deze lege array gewoon in een doos stoppen, er later weer uithalen en gebruiken.

Je kunt dus een array maken met de vierkante haakjes, maar hoe gebruik je ze eigenlijk? Hoe kijk je wat erin zit en haal je er dingen uit? Nou, precies zoals we letters uit een string haalden: met de vierkante haakjes, met een getal ertussen.

Laten we teruggaan naar onze lijst met mentoren. Als we de eerste eruit willen halen, schrijven we `mentors[0]`. Onthoud dat we in JavaScript vanaf nul tellen.

We kunnen ook door een array heen lopen, precies zoals we eerder door strings liepen: met `for-of`.

Arrays werken precies hetzelfde. Het enige verschil is dat we deze keer geen letter eruit halen, maar het item dat in de array zit. In dit voorbeeld: de naam van de mentor.

De eerste keer dat we iemand bedanken, bedanken we `"DJ"`. De tweede keer bedanken we `"Becky"`, enzovoort.

We kunnen op arrays ook de eigenschap `length` gebruiken, net zoals we bij strings hebben geleerd. Als er een array met vier strings in de doos `mentors` zit en we `mentors.length` schrijven, dan geeft dat vier terug.

En ook `includes` werkt op arrays precies hetzelfde. We kunnen `mentors.includes("DJ")` schrijven, en dat geeft `true` terug. Maar schrijven we `mentors.includes("Frank")`, dan geeft dat `false` terug.

Alles werkt precies hetzelfde als bij strings. Alleen werken we nu met de elementen van een array in plaats van met de letters van een string.
