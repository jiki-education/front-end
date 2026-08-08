---
title: "Símbolos meteorológicos"
description: "Desenha uma previsão do tempo para seis dias a partir de uma lista de descrições."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

Pediram-te para construir uma previsão do tempo para seis dias. No entanto, em vez de receberes dados meteorológicos tradicionais, o teu chefe dá-te descrições do tempo baseadas na forma como se sente em relação a ele (por exemplo, "Snowboarding time! 🏂" ou "Miserable 😩").

Recebes um _Array_ (_vetor_) de seis descrições do tempo, uma por dia, e o teu trabalho é desenhar o tempo de cada dia na sua própria caixa.

A previsão é mostrada como uma grelha de seis caixas, uma para cada dia da semana, de segunda-feira a sábado. As descrições seguem a mesma ordem: a primeira (caixa `0`) é o tempo de segunda-feira, a segunda (caixa `1`) é o de terça-feira, e assim sucessivamente até sábado (caixa `5`). (O teu chefe não sai de casa aos domingos, por isso não quer saber do tempo, e assim nunca o podemos reportar...)

## Desenhar um dia

Demos-te uma função `draw` (desenhar) que faz todo o trabalho artístico por ti. O teu trabalho é descobrir os elementos certos para pôr lá dentro.

```js
draw(box, day, elements)
```

- `box` é a caixa onde desenhar (`0` a `5`).
- `day` é o dia da semana com que a caixa fica identificada, por exemplo `"Monday"`.
- `elements` é um Array de símbolos meteorológicos a mostrar (vê os detalhes mais abaixo).

Os dias da semana, por ordem, são `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"` e `"Saturday"`.

Portanto, se o primeiro dia for `"Exciting 🤩"`, escreverias:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## O que significa cada descrição

Cada descrição corresponde a um Array específico de símbolos:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## A tua tarefa

Percorre a lista `days` um dia de cada vez. Para cada descrição, transforma-a na lista certa de símbolos e usa `draw` para a desenhar na caixa desse dia, identificada com o dia da semana correspondente.
