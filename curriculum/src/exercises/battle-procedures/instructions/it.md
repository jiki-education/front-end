---
title: "Tecniche di combattimento"
description: "Estrai la logica di sparo in una funzione riutilizzabile."
en_md5: 3f2bb9c8622396d8ee591087d949c3de
---

Nell'ultimo livello, hai capito come spostare un cannone laser avanti e indietro, colpendo gli alieni. Abbiamo portato qui la precedente soluzione per continuare.

Il codice precedente funzionava, ma la logica di sparo era mescolata con tutto il resto. Ciò che ti farà migliorare nella programmazione è dividere il codice in pezzi, ognuno dedicato a qualcosa.

In questo esercizio, devi estrarre la logica di sparo in una propria funzione chiamata `shootIfAlienAbove` (spara se c'è un alieno sopra). Questa funzione ha il compito di verificare se c'è un alieno al di sopra del cannone laser e, in tal caso, colpirlo.

Il resto della logica di gioco (tracciare la posizione, cambiare direzione ai bordi, spostare il laser) rimane nel ciclo come prima.

Crea la funzione `shootIfAlienAbove`, poi usala all'interno del ciclo insieme alla logica di movimento.
