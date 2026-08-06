---
title: "Alfanumerico"
description: "Crea funzioni per classificare il testo come lettere, numeri o entrambi."
en_md5: 4a99adb1b883c6f6710a3494a8961cc2
---

In questo esercizio, il tuo compito è creare funzioni che verifichino se una stringa contiene lettere e/o numeri.

Dovrai scrivere tre funzioni di supporto:

- `isAlpha(string)` (verifica se la stringa contiene solo lettere ASCII): determina se una stringa è composta solo da lettere ASCII (ad es. "A", "a", "Hello")
- `isNumeric(string)` (verifica se la stringa contiene solo numeri): determina se una stringa è composta solo da caratteri numerici (ad es. "0", "1", "456")
- `isAlphanumeric(string)` (verifica se la stringa contiene solo lettere o numeri): determina se una stringa è composta solo da lettere ASCII o numeri (ad es. "Hello", "42", "Hello42")

Per qualsiasi altro simbolo (ad es. "! ?") o carattere non ASCII (ad es. "じき", "正直"), tutte e tre le funzioni devono restituire false.

Poi scrivi una funzione `whatAmI(string)` (cosa sono) che utilizzi quelle funzioni di supporto per classificare una stringa:

- Le stringhe composte solo da lettere devono restituire `"Alpha"`
- Le stringhe composte solo da numeri devono restituire `"Numeric"`
- Le stringhe composte sia da lettere che da numeri devono restituire `"Alphanumeric"`
- Tutto il resto deve restituire `"Unknown"`

### Usare ciò che hai appena imparato

Anche se ci sono molti modi validi per risolvere questo esercizio, la soluzione che ti chiediamo di trovare utilizza un'istruzione `continue` e le tre funzioni precedenti.

L'esercizio ti sfida anche a risolvere tutto in 42 righe di codice o meno. Quel limite non è necessariamente la soluzione più adatta alla produzione. Un paio di righe in più probabilmente danno una soluzione più elegante, e ci sono anche soluzioni più brevi. Ma è un buon obiettivo per spingere le tue capacità.

Buon divertimento!
