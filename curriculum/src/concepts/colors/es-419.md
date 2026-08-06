---
title: "Colores"
description: "Dos maneras de especificar cualquier color que quieras. RGB mezcla luz roja, verde y azul. HSL usa tono, saturación y luminosidad."
en_md5: a0eea0481b975e45f75774d83966a4a7
---

Si alguna vez haces algo visual con código (e incluso si quieres convertirte en científico de datos y piensas que todo lo de dibujar es un poco aburrido, comunicar datos mediante visualizaciones es una habilidad clave), existen dos formas distintas de expresar colores. Ya has estado usando colores por sus nombres, como red o yellow, como el último argumento en tus funciones de dibujo, y ha sido una manera cómoda de usar colores rápidamente, pero es bastante limitante. Solo hay un puñado de colores con nombre que podemos usar. Así que ahora vamos a ver dos maneras de expresar cualquier color que quieras, y esas dos se llaman RGB y HSL.

RGB nos permite pensar en los colores como una mezcla de rojo, verde y azul. Eso es lo que significa RGB: rojo (_red (R)_ en inglés), verde (_green (G)_ en inglés), azul (_blue (B)_ en inglés). Si recuerdas mezclar pinturas en la escuela, es una idea similar, pero en lugar de pintura, mezclamos luz.

En muchos ejercicios, vas a tener una función llamada `rgb` que recibe tres números como argumentos, uno para rojo, uno para verde, uno para azul, y devuelve un color.

Los números que puedes usar como argumentos van de cero a `255`. Cero significa que no quiero nada de ese color, y `255` significa mezcla la mayor cantidad posible de ese color. Así que si usamos la función `rgb` con `255`, cero y cero como argumentos, lo que estamos diciendo es: quiero todo el rojo. Recuerda que `255` es el número más grande que puedes poner ahí. Pero no queremos nada de verde ni de azul, así que ambos son cero. Entonces obtenemos rojo, y podemos guardar ese rojo en una variable y luego usarlo en la función `circle`, exactamente como hacíamos hasta ahora con los strings con nombre. ¿Y si usamos la función `rgb` con cero, `255`, cero? Ahora decimos: nada de rojo, todo el verde, nada de azul. Así obtenemos un círculo verde. ¿Y si queremos amarillo? El amarillo es una mezcla de rojo y verde. Así que podemos decir: dame todo el rojo, todo el verde y nada de azul, y eso nos dará amarillo. Y podemos usar números más pequeños. Si queremos algo de rojo, nada de verde y mucho azul, obtendremos púrpura. Y mucho rojo, un poco de verde, un poco más de azul, nos da un rosa. Así es RGB. Mezclamos rojo, verde y azul para obtener diferentes combinaciones.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/rgb-intro.webp"
  alt="Tres círculos superpuestos de luz roja, verde y azul que se mezclan para crear amarillo, magenta, cian y blanco"
  width="500"
  height="390"
/>

```javascript
let red = rgb(255, 0, 0)
let green = rgb(0, 255, 0)
let yellow = rgb(255, 255, 0)
let pink = rgb(230, 50, 170)
```

Ahora veamos HSL, que nos da una forma completamente distinta de pensar en los colores. HSL significa tono (_hue (H)_ en inglés), saturación (_saturation (S)_ en inglés) y luminosidad (_lightness (L)_ en inglés). Y de manera similar a RGB, tienes una función llamada `hsl` que recibe tres números, uno para tono, uno para saturación y uno para luminosidad, y devuelve un color. Vamos a desglosar qué significan esas tres palabras.

El tono es el matiz (_shade_ en inglés) de color que quieres, y va de cero hasta 360. Quizá imagina un arcoíris. Así es como yo lo pienso. A la izquierda tenemos rojo, luego naranja, amarillo, verde, azul, púrpura, y de hecho, volvemos todo el camino hasta el rojo otra vez. Así que si dices cero, empiezas en la izquierda y eso es rojo. Si dices `120`, estás pidiendo verde. `230` es azul. También puedes pensar en esto como un círculo cromático (_color wheel_ en inglés), que es lo que realmente representa el 360. Es el número de grados de un círculo. Yo siempre busco los números que quiero, así que no te preocupes demasiado por tratar de memorizar esto, pero está bien saber lo que pasa. Así que eso es el tono, que es el matiz. Ahora tenemos la saturación, que es qué tan vivido es el color. Va de cero a 100. En cero, obtienes simplemente gris. No hay color, no hay tono en absoluto. En 100, obtienes color completo, vivido y vibrante. Y luego tenemos la luminosidad. La luminosidad es qué tan brillante es el color, y también va de cero a 100. En cero, obtienes negro. Sin importar el tono que hayas elegido, obtienes negro. No tiene luz. Y en 100, obtienes blanco. Sin importar lo demás, está lleno de luz, así que es blanco. 50 está justo en el medio, el color normal. Así que puedes pensar en esto como una barra deslizante (_slider_ en inglés) para hacer el color más claro o más oscuro.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/hsl-intro.webp"
  alt="Un arcoíris y un círculo cromático que muestran el tono yendo de 0 (rojo) a 120 (verde) hasta 240 (azul)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/saturation-slider.webp"
  alt="Barra deslizante de saturación de 0 (gris) pasando por 50 hasta 100 (magenta vivido)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/lightness-slider.webp"
  alt="Barra deslizante de luminosidad de 0 (negro) pasando por 50 (color completo) hasta 100 (blanco)"
  width="500"
  height="398"
/>

Así que si queremos un círculo rojo normal, que en RGB habríamos escrito como 255, cero, cero (todo el rojo, nada de verde, nada de azul), aquí usaríamos cero, 100, 50. Cero para el tono rojo, 100 de saturación, color completo, y 50 de luminosidad, que es un nivel normal de brillo. Si queremos convertirlo en un círculo verde, solo cambiamos ese tono a `120`. Si queremos hacerlo un verde más oscuro, podemos reducir la luminosidad a `25`.

Si queremos un verde más apagado, podemos quitarle algo de color, algo de saturación, digamos bajarla a `30`.

Si quieres un rosa fuerte y vibrante, un tono de alrededor de 300 es rosa, y luego subimos la saturación a 100 para que sea muy vivido, y también aumentamos la luminosidad a alrededor de 60.

```javascript
let red = hsl(0, 100, 50)
let green = hsl(120, 100, 50)
let darkGreen = hsl(120, 100, 25)
let dullGreen = hsl(120, 30, 50)
let hotPink = hsl(300, 100, 60)
```

Así que tenemos dos formas diferentes de expresar color, y cada una es útil en distintas situaciones. RGB es genial cuando quieres ajustar un componente específico, cuánto rojo, cuánto verde, cuánto azul. HSL es genial cuando quieres recorrer colores. Si quieres un arcoíris, solo tienes que seguir aumentando el tono.
