---
title: "Símbolos do tempo"
description: "Desenhe uma previsão do tempo de seis dias a partir de uma lista de descrições."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

Pediram para você montar uma previsão do tempo de seis dias. Mas, em vez de receber dados meteorológicos tradicionais, o seu chefe descreve o tempo de acordo com o que ele sente a respeito (por exemplo, "Snowboarding time! 🏂" ou "Miserable 😩").

Você recebe um _Array_ (_vetor_) com seis descrições do tempo, uma por dia, e o seu trabalho é desenhar o tempo de cada dia na sua própria caixa.

A previsão aparece como uma grade de seis caixas, uma para cada dia da semana, de segunda a sábado. As descrições seguem a mesma ordem: a primeira (caixa `0`) é o tempo de segunda-feira, a segunda (caixa `1`) é o de terça, e assim por diante até sábado (caixa `5`). (O seu chefe não sai de casa aos domingos, então ele nem se importa com o tempo nesse dia, e a gente nunca consegue informar como ele vai ser...)

## Desenhando um dia

Demos a você uma função `draw` (desenhar) que faz todo o trabalho artístico. O seu trabalho é descobrir os elementos certos para colocar dentro dela.

```js
draw(box, day, elements)
```

- `box` é a caixa onde desenhar (`0` a `5`).
- `day` é o dia da semana que identifica a caixa, por exemplo `"Monday"`.
- `elements` é um Array com os símbolos do tempo a mostrar (veja os detalhes abaixo).

Os dias da semana, em ordem, são `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"` e `"Saturday"`.

Então, se o primeiro dia for `"Exciting 🤩"`, você escreveria:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## O que cada descrição significa

Cada descrição corresponde a um Array específico de símbolos:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## Sua tarefa

Percorra a lista `days` um dia de cada vez. Converta cada descrição na lista certa de símbolos e use `draw` para desenhar tudo na caixa daquele dia, identificada com o dia da semana correspondente.
