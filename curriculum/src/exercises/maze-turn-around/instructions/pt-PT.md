---
title: "Dá meia-volta"
description: "Cria uma função de meia-volta para o labirinto."
en_md5: bbb03498f3b5ec9956af463e85fde414
---

No último exercício, descobriste como resolver o labirinto automaticamente. Bom trabalho!

Uma das coisas boas dessa solução é que o código se lê de forma muito natural. Está muito alinhado com o algoritmo. Exceto numa parte...

Achaste um pouco frustrante ter de usar `turnLeft()` (virar à esquerda) duas vezes sempre que querias inverter a direção, em vez de teres uma função `turnAround()` (dar meia-volta)?

Pois bem, esta é a tua oportunidade de resolver isso!

Cria uma nova função chamada `turnAround` no topo do teu código. Não tem parâmetros de entrada e não devolve nada. Deve simplesmente chamar `turnLeft()` duas vezes.

Depois, usa essa função na solução, no else final.

Tenta garantir que o teu programa final tem, no total, 17 linhas de código.
