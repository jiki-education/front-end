---
title: "Sole relazionale"
description: "Posiziona un sole dove tutto è calcolato a partire da variabili."
en_md5: d8de4704a25f3733ddaaea16f0232005
---

In questo esercizio, il tuo compito è posizionare un sole nell'angolo in alto a destra del cielo usando aritmetica e variabili. Il vincolo principale è che il bordo del sole deve rimanere sempre ad una distanza fissa dal bordo dell'area di disegno, indipendentemente dalla dimensione del sole.

Abbiamo preimpostato quattro variabili per te all'inizio del file:

- `canvasSize` (dimensione del canvas): la dimensione dell'area di disegno, che è `100`.
- `color` (colore): impostato su `"yellow"`.
- `gap` (distanza): quanto il bordo del sole dista dal bordo superiore e destro dell'area di disegno.
- `radius` (raggio): il raggio del sole.

### Un processo in due passi

Per risolvere l'esercizio, fai due cose:

#### 1. Definisci le variabili derivate

Definisci le variabili `sunX` (coordinata X del sole) e `sunY` (coordinata Y del sole) che utilizzano `gap`, `radius` e `canvasSize` per posizionare il centro del sole nell'angolo in alto a destra.

#### 2. Disegna il cerchio

Disegna un cerchio usando `sunX`, `sunY`, `radius` e `color`.

## Flessibilità

Il `gap` è impostato a 10 e il `radius` a 15 per impostazione predefinita. Risolvi l'esercizio usando prima questi valori, così puoi usare lo sfondo per allineare gli elementi. Quando il tuo codice è corretto, vedrai il cerchio apparire nella posizione corretta sulla pagina.

Tuttavia, per superare l'esercizio non puoi semplicemente "scrivere un valore fisso" (cioè impostarlo su un numero singolo): `sunX` e `sunY` devono essere calcoli coinvolgendo altre variabili.

Una volta superato l'esercizio, premi "Riordina il codice" e prova a cambiare i valori di `gap` e `radius` all'inizio del file, quindi esegui di nuovo il codice per vedere il sole ingrandirsi o spostarsi rimanendo però nell'angolo.

Quando hai finito, puoi premere "Dashboard" in alto a destra per continuare normalmente.
