---
title: "Colores HSL"
description: "Crear colores a partir del tono, la saturación y la luminosidad."
en_md5: d751e07ccf6b5a58a11d3d2af1026b93
---

HSL nos da una forma completamente diferente de pensar en los colores que RGB. HSL significa tono (_hue (H)_ en inglés), saturación (_saturation (S)_ en inglés) y luminosidad (_lightness (L)_ en inglés). Tienes una función llamada `hsl` que recibe tres números: uno para el tono, uno para la saturación y uno para la luminosidad, y devuelve un color. Ahora vamos a desglosar qué significan esas tres palabras.

```javascript
hsl(hue, saturation, lightness)
```

El tono es la tonalidad del color que quieres, y va de cero hasta 360. Tal vez te imagines un arcoíris. Así es como yo lo pienso. A la izquierda tenemos rojo, luego naranja, amarillo, verde, azul, morado y, de hecho, volvemos otra vez al rojo. Así que si pones cero, empiezas por la izquierda y ese es el rojo. Si pones `120`, estás pidiendo el verde. `230` es el azul. También puedes pensar en esto como un círculo cromático, que es lo que realmente es el 360: la cantidad de grados del círculo. Yo siempre simplemente busco los números que necesito, así que no te preocupes demasiado por tratar de memorizarlos, pero está bien entender qué está pasando. Ese es el tono, que es la tonalidad. Ahora, tenemos la saturación, que es qué tan intenso es el color. Va de cero a 100. En cero, obtienes gris. No hay color ni tonalidad alguna. En 100, obtienes un color completo, intenso y vibrante. Y luego tenemos la luminosidad. La luminosidad es qué tan brillante es el color, y también va de cero a 100. En cero, obtienes negro. Sin importar el tono que hayas elegido, obtienes negro. No tiene nada de luz. Y en 100, obtienes blanco. Sin importar lo demás, está lleno de luz, así que es blanco. 50 está justo en el medio, el color normal. Así que puedes imaginar esto como un deslizador para hacer el color más claro o más oscuro.

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/hsl-hue-wheel.webp"
  alt="Un círculo cromático y un arcoíris que muestran que 0 es rojo, 120 es verde y 240 es azul"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/saturation-slider.webp"
  alt="Un deslizador de saturación de 0 (gris) pasando por 50 hasta 100 (color intenso y vibrante)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/lightness-slider.webp"
  alt="Un deslizador de luminosidad de 0 (negro) pasando por 50 hasta 100 (blanco)"
  width="500"
  height="398"
/>

Así que si queremos un círculo rojo normal, que con RGB escribiríamos como 255, 0, 0 (todo el rojo, nada de verde ni azul), aquí usaríamos 0, 100, 50. Cero para el tono rojo, 100 para la saturación (color completo) y 50 para la luminosidad, que es un nivel normal de luminosidad. Si queremos que sea un círculo verde, solo cambiamos el tono a `120`. Si queremos un verde más oscuro, reducimos la luminosidad a `25`.

```javascript
hsl(0, 100, 50) // red
hsl(120, 100, 50) // green
hsl(120, 100, 25) // dark green
```

Si queremos un verde más apagado, podemos quitarle algo de color, algo de saturación, por ejemplo bajarla a `30`.

Si quieres un rosa fuerte y brillante, un tono de unos 300 es rosa, y entonces subimos la saturación a 100 para que quede muy intenso, y también subimos la luminosidad a unos 60.

HSL es genial cuando quieres recorrer una gama de colores. Si quieres un arcoíris, solo tienes que ir aumentando el tono.
