---
title: "Strings"
description: "Fragmentos de texto entre comillas (una letra, una palabra, una oración o un párrafo entero) que Jiki escribe en un papel."
en_md5: 89b04f3849f9388a46734924f35c913c
---

Cuando quieres usar un número, literalmente puedes escribirlo y Jiki entiende lo que quieres decir. Pero ¿qué pasa si quieres usar una letra, una palabra o una oración? Por ejemplo, con la función `rectangle` (rectángulo) o la función `circle` (círculo), ¿qué pasaría si tuvieras un argumento extra donde especificaras el color? ¿Cómo escribiríamos el color para meterlo en la máquina? Si simplemente escribimos la palabra verde (_green_ en inglés) o azul (_blue_ en inglés), Jiki va a pensar que nos referimos a una máquina en los estantes y dirá: «No hay ninguna máquina que se llame verde. No sé qué hacer.»

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki de pie, confundido, junto a la máquina del rectángulo, con signos de interrogación sobre su cabeza"
  width="446"
  height="400"
/>

Así que tenemos una regla: cada vez que necesitemos usar texto, tenemos que ponerlo entre comillas, entre comillas dobles. Y cuando pones algo entre comillas así, Jiki saca un papel y escribe lo que pusiste entre las comillas en ese papel. A estos papeles los llamamos _strings_ (cadenas).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki escribiendo la palabra green en un papel, que se convierte en un string"
  width="398"
  height="400"
/>

Los strings pueden ser letras sueltas, palabras, oraciones, párrafos e incluso libros. La regla es: si es texto, lo ponemos entre comillas y se convierte en un string.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Un pizarrón que muestra strings de distintos tamaños entre comillas: una sola letra, una palabra, una oración y una dirección de varias líneas"
  width="500"
  height="398"
/>

Entonces, si queremos un rectángulo azul, escribimos el número de su posición izquierda, su posición superior, su ancho y su altura. Pero para el quinto argumento, vamos a escribir `"blue"` entre comillas.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki tomaría la máquina del estante, pondría unas monedas en las primeras cuatro ranuras. Luego escribiría blue en un papel y pondría ese papel en la quinta ranura y después ejecutaría la máquina.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki metiendo el papel azul en la quinta ranura de la máquina del rectángulo, con las monedas 10, 20, 30, 40 en las primeras cuatro ranuras"
  width="500"
  height="392"
/>

Strings es una de esas palabras técnicas que al principio intimidan un poco, pero en realidad solo significa texto. Te acostumbrarás muy rápido. No tiene nada de mágico.
