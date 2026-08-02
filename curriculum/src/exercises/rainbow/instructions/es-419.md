---
title: "Arcoíris"
description: "Pinta un arcoíris a partir de 100 barras verticales de colores."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Tu tarea es crear un hermoso patrón de arcoíris formado por 100 barras verticales. Debe verse así:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Arcoíris" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

El arcoíris está formado por `100` barras, cada una de arriba hacia abajo con un ancho de `1`. La primera barra debe tener un `x` (coordenada horizontal) de `0`, y la barra final debe tener un `x` de `99`.

Para definir el color, usa la función `hsl(...)` (especifica un color por tono, saturación y luminosidad). Esta devuelve (_returns_ en inglés) un string de color que luego puedes usar como el último argumento en `rectangle(...)` (dibuja un rectángulo). Ajustar los valores de saturación (_saturation_ en inglés) y luminosidad (_lightness_ en inglés) a aproximadamente `50` probablemente es lo mejor. La primera barra debe tener un **tono** (_hue_ en inglés) de `0`. El tono debe aumentar para cada barra y terminar cerca de 300.
