---
title: "Nucleotide"
description: "Conta quante volte un nucleotide specifico compare in un filamento di DNA."
en_md5: 7ab4068481d406fdfb6f598fabd042c1
---

Il DNA è una lunga catena di altre sostanze chimiche e le più importanti sono i quattro nucleotidi: adenina, citosina, guanina e timina. Un singolo filamento di DNA può contenere miliardi di questi quattro nucleotidi e l'ordine in cui compaiono è importante! Rappresentiamo una sequenza di DNA come una stringa di caratteri, ad esempio "ATTACG". 'A' per adenina, 'C' per citosina, 'G' per guanina e 'T' per timina.

Crea una funzione chiamata `countNucleotide` (conta il nucleotide) che prende un filamento di DNA e un singolo carattere di nucleotide, e restituisce quante volte quel nucleotide compare nel filamento.

Se il carattere del nucleotide non è valido (non è una tra A, C, G, T), restituisci `-1`.
Se il filamento contiene caratteri non validi, restituisci comunque `-1`.

Ad esempio:

- `countNucleotide("GATTACA", "A")` restituisce `3`
- `countNucleotide("GATTACA", "T")` restituisce `2`
- `countNucleotide("GATTACA", "X")` restituisce `-1`

Se ti serve, puoi usare `"...".includes(someString)`.
