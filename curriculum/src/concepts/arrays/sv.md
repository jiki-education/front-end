---
title: "Arrayer"
description: "En ordnad kedja av element (strängar, tal, booleska värden eller vad som helst) som hålls ihop som ett enda värde som Jiki kan skicka runt."
en_md5: d26ccb9e04fbc77129f3199d63a95017
---

Du har använt tal och strängar och booleska värden, det fina ordet för sant och falskt, och de här olika sorterna kallar vi datatyper (_data types_ på engelska). Nu ska vi lägga till vår första sammansatta datatyp (_compound data type_ på engelska).

Det är en datatyp som kan innehålla flera saker, inte bara en enda sak, och den här datatypen kallas array.

När du hör ordet array vill jag att du tänker på en fysisk kedja som håller ihop en massa saker.

Sakerna som den håller ihop kan vara vad som helst: strängar, tal, booleska värden, till och med andra arrayer, till och med saker du inte har lärt dig om än, men det bryr vi oss inte om just nu.

Allt i den här kedjan ligger i ordning, i den ordning som sakerna är hopkedjade.

En array innehåller alltså en massa saker, men den är ett enda helt element, en enda hel sak, en array med många element inuti.

Jiki kan ta den där arrayen, den där kedjan, och lägga den i en låda, precis som han kan lägga en sträng i en låda eller ett tal i en låda.

Han kan stoppa den i inkastet på en maskin. Han kan dra ut den ur en rutschkana. Den här arrayen är en enda sak, och Jiki jobbar med den på precis samma sätt som han jobbar med strängar, tal och allt annat du har sett hittills.

I kod ser en array faktiskt också lite ut som en kedja. Den har hakparenteser (`[]`) i ändarna och sedan en massa saker som är hopkedjade, åtskilda med kommatecken.

Om vi till exempel vill skapa en array med namnen på några av våra mentorer kan vi göra i ordning en låda som heter `mentors` (mentorer) och lägga kedjan i den.

Vi skriver `let mentors =`, precis som med vilken annan låda som helst, och sedan en inledande hakparentes, en massa element, namnen åtskilda med kommatecken, och till sist en avslutande hakparentes. När Jiki ser det här går han och hämtar fyra lappar, en för varje namn, sedan tar han fram en ny kedja och kedjar ihop dem allihop, och så lägger han kedjan i lådan `mentors`.

Du kan lägga vad som helst i en array: strängar, tal, booleska värden, till och med en blandning av saker.

De här är alla olika exempel på helt giltiga arrayer.

Du kan också skapa en tom array. Det är bara en kedja utan element. Den är fortfarande en riktig sak. Den har fortfarande båda sina ändar. Den är fortfarande en kedja. Det är bara det att den inte har några saker i sig. Men du kan ändå lägga den tomma arrayen i en låda, hämta ut den och använda den senare.

Du kan alltså skapa en array med hakparentessyntaxen, men hur använder vi dem egentligen? Hur kollar vi vad som finns i dem och hämtar ut saker? Jo, på precis samma sätt som när vi ville hämta ut bokstäver ur en sträng. Vi kan använda hakparentessyntaxen med tal inuti.

Nu går vi tillbaka till våra mentorer. Om vi vill hämta ut den första skriver vi `mentors[0]`. Kom ihåg att vi räknar från noll i JavaScript.

Och vi kan också loopa igenom en array på precis samma sätt som vi loopade igenom strängar tidigare, med `for-of`.

Arrayer fungerar på precis samma sätt. Den enda skillnaden är att vi den här gången inte får ut en bokstav, utan det som låg på den platsen i arrayen. I det här exemplet namnet på mentorn.

Så första gången vi tackar någon tackar vi `"DJ"`. Andra gången tackar vi `"Becky"`, och så vidare.

Vi kan också använda egenskapen `length` på arrayer, precis som vi lärde oss på strängar. Om vi har en array med fyra strängar i lådan `mentors` och skriver `mentors.length`, så returnerar det fyra.

Och vi kan använda `includes` på precis samma sätt på arrayer också. Vi kan skriva `mentors.includes("DJ")`, och då returnerar det `true`. Men om vi skriver `mentors.includes("Frank")` returnerar det `false`.

Allt fungerar precis som med strängar. Det är bara det att vi jobbar med elementen i en array, inte bokstäverna i en sträng.
