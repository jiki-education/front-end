---
title: "Harci eljárások"
description: "Vond ki a lövési logikádat egy újrahasználható függvénybe."
en_md5: 3f2bb9c8622396d8ee591087d949c3de
---

Az előző szinten rájöttél, hogyan mozgasd a lézerágyút ide-oda, lelőve az űrlényeket. Áthoztuk a megoldásodat, hogy folytathasd;

Az előző kód működött, de a lövési logika össze volt keverve minden mással. Ahogy egyre jobb leszel a programozásban, a siker egyik kulcsa, hogy a kódodat kis, egy-egy dolgot csináló darabokra bontod.

Ebben a feladatban ki kell szervezned a lövési logikát egy saját függvénybe, amit így hívunk: `shootIfAlienAbove` (lőj, ha űrlény van fölötte). Ennek a függvénynek az a feladata, hogy ellenőrizze, van-e űrlény a lézerágyú fölött, és ha igen, lője le.

A játéklogika többi része (a pozíció követése, irányváltás a széleken, a lézer mozgatása) ugyanúgy a ciklusban marad, mint eddig.

Hozd létre a `shootIfAlienAbove` függvényt, majd használd a ciklusban a mozgatási logikával együtt.
