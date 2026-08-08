---
title: "Semplice pangramma"
description: "Verifica se una frase utilizza tutte le lettere dell'alfabeto."
en_md5: 50b09bb1fbd35081cb842c55fc40e313
---

Un pangramma è una frase che utilizza **ogni lettera dell'alfabeto almeno una volta**. Il pangramma inglese più noto è «the quick brown fox jumps over the lazy dog»!

I prossimi tre esercizi saranno tutti dedicati a stabilire se una frase è un pangramma.

In questo primo esercizio, devi solo gestire le lettere minuscole. L'input conterrà solo lettere minuscole e altri caratteri come spazi, numeri o punteggiatura, ma nessuna lettera maiuscola.

Il tuo compito è scrivere `isPangram(sentence)` (una funzione che verifica se una frase è un pangramma), che riceve una frase come input e restituisce `true` se contiene ogni lettera dalla «a» alla «z» almeno una volta, oppure `false` altrimenti.

### Funzioni helper

Per superare l'esercizio, non ti è consentito usare cicli annidati. Invece, come nell'esercizio precedente, la chiave è creare una **funzione helper** che `isPangram(...)` utilizza.

Questa funzione helper ti aiuterà a determinare se una stringa ne contiene un'altra. Ti consigliamo di chiamare questa funzione `includes` e i suoi input `haystack` (il pagliaio) e `needle` (l'ago). L'idea è che vogliamo «trovare l'ago nel pagliaio», un vecchio detto inglese.

Se creare più funzioni ti sembra opprimente, potresti risolvere l'esercizio prima senza la funzione helper, usando un ciclo annidato, e poi pensare a come suddividerlo in una funzione helper in un secondo momento.

Divertiti!
