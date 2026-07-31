---
title: "Arco-íris"
description: "Pinte um arco-íris com 100 barras verticais coloridas."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Sua tarefa é criar um lindo arco-íris formado por 100 barras verticais. Ele deve ficar assim:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Arco-íris" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

O arco-íris é formado por `100` barras, cada uma indo de cima até embaixo com largura de `1`. A primeira barra deve ter um `x` (a posição horizontal) de `0`, e a última barra deve ter um `x` de `99`.

Para definir a cor, use a função `hsl(...)` (matiz, saturação e luminosidade). Ela retorna (_returns_ em inglês) uma string de cor que você pode usar como a última entrada em `rectangle(...)` (retângulo). Definir os valores de saturação (_saturation_ em inglês) e luminosidade (_lightness_ em inglês) em torno de `50` provavelmente funciona melhor. A primeira barra deve ter um **matiz** (_hue_ em inglês) de `0`. O matiz deve aumentar a cada barra e terminar perto de 300.
