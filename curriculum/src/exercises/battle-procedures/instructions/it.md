---
title: "Procedure di battaglia"
description: "Estrai la logica di sparo in una funzione riutilizzabile."
en_md5: 3f2bb9c8622396d8ee591087d949c3de
---

Nell'ultimo livello, hai capito come spostare un cannone laser avanti e indietro, abbattendo gli alieni. Abbiamo portato qui la tua soluzione per farti continuare.

Il codice precedente funzionava, ma la logica di sparo era mescolata con tutto il resto. Man mano che migliori a programmare, una delle cose che ti farà avere successo è suddividere il codice in piccoli pezzi che fanno una cosa ciascuno.

In questo esercizio, devi estrarre la logica di sparo in una propria funzione chiamata `shootIfAlienAbove` (spara se c'è un alieno sopra). Questa funzione ha il compito di verificare se c'è un alieno sopra il cannone laser e, in tal caso, abbatterlo.

Il resto della logica di gioco (tracciare la posizione, cambiare direzione ai bordi, spostare il laser) rimane nel ciclo come prima.

Crea la tua funzione `shootIfAlienAbove`, quindi usala all'interno del ciclo insieme alla logica di movimento.
