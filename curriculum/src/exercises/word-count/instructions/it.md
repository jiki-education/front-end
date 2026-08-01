---
title: "Conta le parole"
description: "Conta quante volte ogni parola compare in una frase."
en_md5: f9b46f800337d7fff2aab88b6e368e3d
---

Insegni inglese come lingua straniera a studenti delle superiori. Hai deciso di basare l'intero programma delle lezioni su serie TV. Devi analizzare quali parole vengono usate e quanto spesso si ripetono.

Il tuo compito è contare quante volte ogni parola compare in un sottotitolo di una serie drammatica. I sottotitoli usano solo caratteri ASCII.

I personaggi parlano spesso in inglese colloquiale, usando contrazioni come _they're_ o _it's_. Anche se queste contrazioni nascono da due parole, la contrazione viene considerata una parola sola.

Le parole possono essere separate da qualsiasi segno di punteggiatura (per esempio ":", "!" o "?") o da spazi. L'unica punteggiatura che non separa le parole è l'apostrofo nelle contrazioni.

I numeri sono considerati parole. Se i sottotitoli dicono "It costs 100 dollars", allora "100" sarà una parola a sé.

Le parole non fanno distinzione tra maiuscole e minuscole. Per esempio, la parola "you" compare tre volte in: "You come back, you hear me? DO YOU HEAR ME?"

Crea una funzione chiamata `countWords` (conta le parole) che riceve una frase come input e restituisce un dizionario con le parole come chiavi e le loro frequenze come valori.
