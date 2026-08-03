---
title: "Bygga arrayer"
description: "Börja med en tom array och använd `push` för att lägga till saker en i taget medan du loopar igenom data."
en_md5: c3358ca032f965cf058bb72df37ffbd4
---

Hittills har du jobbat med arrayer där värdet sätts i början och sedan är fast. Men tänk om du vill lägga till saker i en array efter hand? För det har arrayer en metod som heter `push` (trycka in).

Push har en indata: det du vill fästa längst bak i arrayen. I det här fallet vill vi alltså trycka in ordet `"Isaac"` i slutet av en array som redan innehåller `"DJ"` och `"Bethany"`.

För att göra det tar Jiki ut arrayen ur lådan, fäster `"Isaac"` längst bak i kedjan och lägger sedan tillbaka alltihop i lådan. Lägg märke till att det är annorlunda mot strängar: där skapade Jiki en ny sträng varje gång, men här ändrar han faktiskt själva arrayen.

Ett mönster du kommer att se ofta när du programmerar är att börja med en tom array och bygga upp den efter hand. Tänk dig att vi har en lång lista med namn som vi vill gå igenom. Varje gång vi hittar någon som är mentor lägger vi till den i vår array.

Det här mönstret, att loopa och lägga till, är något du kommer att använda ofta.
