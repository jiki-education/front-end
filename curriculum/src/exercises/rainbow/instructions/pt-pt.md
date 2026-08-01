---
title: "Arco-íris"
description: "Pinta um arco-íris com 100 barras verticais coloridas."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

A tua tarefa é criar um belo padrão de arco-íris composto por 100 barras verticais. Deve ficar assim:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Arco-íris" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

O arco-íris é composto por `100` barras, cada uma desenhada de cima a baixo com uma largura de `1`. A primeira barra deve ter um `x` (a posição horizontal) de `0`, e a última barra deve ter um `x` de `99`.

Para definir a cor, usa a função `hsl(...)` (matiz, saturação e luminosidade). Esta devolve (_returns_ em inglês) uma string de cor que podes depois usar como o último valor de entrada em `rectangle(...)` (retângulo). Definir os valores de saturação (_saturation_ em inglês) e de luminosidade (_lightness_ em inglês) à volta de `50` é provavelmente a melhor opção. A primeira barra deve ter um **matiz** (_hue_ em inglês) de `0`. O matiz deve aumentar de barra para barra e terminar perto de 300.
