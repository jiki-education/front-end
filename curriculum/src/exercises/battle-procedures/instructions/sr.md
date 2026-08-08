---
title: "Borbene procedure"
description: "Izdvoji logiku pucanja u ponovno iskoristivu funkciju."
en_md5: 3f2bb9c8622396d8ee591087d949c3de
---

Na prethodnom nivou, shvataš kako da pomeraš laserski top napred-nazad i obaraš vanzemaljce. Doneli smo tvoje rešenje ovde da možeš da nastaviš.

Prethodni kod je radio, ali je logika pucanja bila pomešana sa svim ostalim. Kako postaješ bolji u programiranju, jedna od stvari koje će ti pomoći da uspeš jeste razbijanje koda na male celine od kojih svaka radi jednu stvar.

U ovoj vežbi, treba da izdvojiš logiku pucanja u zasebnu funkciju pod imenom `shootIfAlienAbove` (pucaj ako ima vanzemaljca iznad). Ova funkcija ima zadatak da proveri da li se iznad laserskog topa nalazi vanzemaljac i, ako je tako, da ga obori.

Ostatak logike igre (praćenje pozicije, promena smera na granicama, pomeranje lasera) ostaje u petlji kao i ranije.

Kreiraj svoju funkciju `shootIfAlienAbove`, a zatim je koristi unutar petlje, zajedno sa logikom kretanja.
