---
title: "Cifrario di Cesare"
description: "Cifra un messaggio segreto utilizzando un antico cifrario romano."
en_md5: 029bbd7050127405f5e67a3a20353139
---

Il cifrario di Cesare è una delle tecniche di cifratura più antiche e semplici. Fu usato da Giulio Cesare per inviare messaggi segreti ai suoi generali.

Il cifrario funziona spostando ciascuna lettera del messaggio di un numero fisso di posizioni dell'alfabeto. Ad esempio, con uno spostamento di 3, 'a' diventa 'd', 'b' diventa 'e' e così via. Se lo spostamento supera la 'z', ricomincia dall'inizio dell'alfabeto.

Gli spazi devono rimanere spazi (non vengono spostati).

Crea una funzione chiamata `encode(message, shift)` (codifica un messaggio con uno spostamento) che prende un messaggio in minuscolo e un valore di spostamento, e restituisce il messaggio codificato.

Per esempio:

- `encode("abc", 1)` restituisce `"bcd"`
- `encode("xyz", 3)` restituisce `"abc"` (ricomincia dall'inizio)
- `encode("hello world", 5)` restituisce `"mjqqt btwqi"`

Suggerimento: conviene suddividere il problema in funzioni ausiliarie più piccole!

### Curiosità

Una volta facevo da presentatore a una conferenza tech a Braga, in Portogallo. Cinque minuti prima di salire sul palco, gli organizzatori si avvicinarono e, un po' imbarazzati, mi chiesero se mi dispiacesse vestirmi da Giulio Cesare per la prima parte della giornata, per celebrare l'eredità romana di Braga. Ce l'ho fatta...?

<img
  src="/static/images/exercise-assets/caesar-cipher/jeremy-as-caesar.webp"
  alt="Jeremy vestito da Cesare"
  style="width: 100%; max-width: 300px; border: 5px solid var(--color-purple-500); padding: 4px; border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>
