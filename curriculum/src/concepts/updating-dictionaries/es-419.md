---
title: "Cambiar diccionarios"
description: "Usar `dict[key] = value` para actualizar entradas existentes o agregar nuevas, más el método `has` para comprobar claves."
en_md5: 254912c3c672aec40b2729cd005fb1a7
---

Ya sabes cómo crear un diccionario y sacar valores de él. Pero ¿qué pasa si los datos cambian? En algún momento, yo voy a cumplir años. No voy a tener `42`, voy a tener `43`.

¿Cómo actualizamos el diccionario? Bueno, usamos un método muy parecido al que usamos para buscar algo. Sabes que encontramos algo usando corchetes para sacar el valor. Pues también podemos usar corchetes seguidos de un signo igual para actualizar el diccionario. Jiki va a la caja de person, saca la página de la libreta, encuentra la clave `"age"`, borra el `42` que estaba ahí y escribe `43` en su lugar, y luego la página de la libreta vuelve a la caja. Esto es cambiar el diccionario en sí.

```javascript
person["age"] = 43
```

Jiki no está creando un diccionario nuevo, está cambiando la libreta que ya estaba dentro de la caja.

¿Y si quieres agregar información que no estaba antes? Bueno, puedes hacer exactamente lo mismo.

Si especificas una clave que no existe, Jiki simplemente añadirá una clave nueva al final con ese valor.

Entonces, en este caso, abrirá la libreta, buscará `"country"`, verá que no está y agregará una línea nueva al final: `"country"` a la izquierda, `"England"` a la derecha.

```javascript
person["country"] = "England"
```

O sea, la misma sintaxis exactamente que para cambiar un valor. Jiki se encarga de ambas cosas automáticamente. Si la clave existe, la actualiza. Si no existe, la agrega. No necesitas hacer nada especial.

Y tal como puedes empezar con un array vacío e ir agregándole cosas, puedes empezar con un diccionario vacío e ir añadiendo claves una por una. De nuevo, es un patrón muy común. Lo vas a ver todo el tiempo.

Uno de los usos más comunes de los diccionarios es llevar la cuenta de cosas. Puedes poner como claves las cosas de las que quieres llevar la cuenta y como valores las cuentas. Así que imagina que estás observando aves y quieres llevar registro de cuántas has visto de cada una. Cada vez que ves un ave, pones su cuenta en uno, y cada vez siguiente que la ves, obtienes su valor actual y lo aumentas en uno. Para que este patrón funcione, necesitamos una forma de comprobar si el diccionario ya tiene esa clave, en cuyo caso le sumamos uno, y si no la tiene, necesitamos empezarla en uno.

Y para eso tenemos un método en los diccionarios, el método `has` (verifica si la clave existe).

Especificas una clave que te interesa, y Jiki comprobará si el diccionario tiene esa clave o no, y devolverá `true` o `false` según corresponda.

```javascript
person.has("age") // true
```

Juntando todo, el patrón de conteo queda así:

```javascript
if (counts.has(letter)) {
  counts[letter] = counts[letter] + 1
} else {
  counts[letter] = 1
}
```
