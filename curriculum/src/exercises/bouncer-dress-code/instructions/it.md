---
title: "Buttafuori: dress code"
description: "Combina l'abbigliamento, l'età e la presenza sulla lista degli invitati per decidere chi può entrare."
en_md5: 3e9f98d0b80d6bf0865cd0439005807b
---

Sei tornato al tuo lavoro occasionale come buttafuori, e stasera lavori in un locale con un dress code rigoroso.

Il tuo compito è controllare che cosa indossa la persona, insieme alla sua età, e decidere che cosa fare. Questa volta le regole da seguire sono un po' più "interessanti".

### Le regole

- **Chiunque** sia in abiti **formali** o **eleganti** viene fatto entrare (che sia o meno sulla lista degli invitati) e riceve dei canapè.
- Gli **adulti** (18 anni o più) in abiti **formali** ricevono **anche** una coppa di champagne.
- I **minorenni** (sotto i 18 anni) con qualsiasi altro abbigliamento possono entrare **solo se** sono sulla lista degli invitati.
- Tutti gli altri vengono mandati via.

Le categorie del dress code:

- **Formale** significa `"ballgown"` o `"tuxedo"`
- **Elegante** significa `"suit"` o `"dress"`

### Le tue abilità

Hai tre funzioni per ottenere informazioni:

- `getOutfit()` (ottieni l'abbigliamento) restituisce il nome dell'abito che la persona indossa (es. `"ballgown"`, `"suit"`, `"denim"`)
- `getAge()` (ottieni l'età) restituisce la sua età.
- `onGuestList()` (è sulla lista degli invitati) restituisce un valore che indica se la persona è sulla lista degli invitati.

Puoi usare ciascuna delle funzioni che "ottengono informazioni" solo una volta nella soluzione (altrimenti la gente comincia a spazientirsi, se continui a chiedere il nome e così via!)

Poi hai alcune azioni che puoi compiere:

- `offerChampagne()` (offri champagne) offre alla persona una coppa di champagne
- `offerCanapes()` (offri canapè) offre alla persona dei canapè (tartare di salmone)
- `letIn()` (fai entrare) fa entrare la persona nel locale
- `turnAway()` (manda via) manda via la persona

### Programmare in modo efficiente

Ci sono tanti modi possibili per risolvere questo esercizio. Il tuo obiettivo è mettere insieme tutte queste regole in modo che il codice sia **chiaro da leggere**. Riduci al minimo le ripetizioni dove possibile.

Divertiti e buona fortuna!
