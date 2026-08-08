---
title: "Cena formal"
description: "Busca la mesa de un invitado a partir del plan de asientos."
en_md5: b93bf1949411dbc2a19e5b48c3ae869a
---

Estás de vuelta en tu trabajo extra como portero. Es la noche después de la «After Party», y hay otra fiesta más. Esta vez es una cena formal, así que esta noche eres menos «hombre grandote en la puerta» y más «persona con un portapapeles y un chaleco bonito».

Aquí definitivamente no es el lugar para usar **solo** tu primer nombre. De hecho, no es lugar para usar tu primer nombre para nada. Aquí, todo el mundo usa un tratamiento honorífico (_honorific_ en inglés) (señorita, señor, doctor, etc.) y su apellido.

Los organizadores te han entregado el plan de asientos como dos arrays separados. Uno contiene los nombres completos de los invitados. El otro contiene el nombre de la mesa en la que está sentado cada invitado (con nombres de árboles y flores). Al igual que con «After Party», los dos arrays se alinean: el invitado en la posición 3 del primer array está sentado en la mesa en la posición 3 del segundo array.

Así que cuando el señor Pitt entra con elegancia, debes deducir que este es el «Brad Pitt» en tu lista, y luego decirle en qué mesa está.

Escribe una función llamada `tableFor` (busca la mesa en la que está sentado un invitado). La función recibe tres argumentos:

- El primero es el array de los nombres completos de los invitados, como strings
- El segundo es el array de los nombres de las mesas, en el mismo orden que los invitados
- El tercero es el invitado que llega, formateado como un tratamiento honorífico seguido de su apellido (por ejemplo, «Mr Pitt»)

Devuelve el nombre de la mesa en la que está sentado el invitado. Si no está en el plan de asientos en absoluto, devuelve la cadena `"No table found"` en su lugar (¡aquí no hay colados!).

El tratamiento honorífico siempre es exactamente una palabra, y todo lo que va después es el apellido del invitado. La mayoría de los apellidos son una palabra, pero algunos ilustres tienen dos.

Sin embargo, ten cuidado. Muchos apellidos se parecen mucho a otros.

### Métodos y propiedades de strings y arrays

Además de la propiedad `.length` que aprendiste en el ejercicio anterior, hay cuatro métodos que te pueden ser útiles. Hay muchas formas de resolver este ejercicio, pero estos te llevarán a la solución más corta posible.

`"...".split(substring)` divide un string usando otro string. Por ejemplo:

```js
`"Jeremy".split("e")`
// ["J", "r", "my"]
```

`[...].slice(start)` captura una parte de un array, empezando en el índice `start` y continuando hasta el final del array. Los elementos capturados se copian en un array NUEVO, que se te devuelve. De hecho, esto descarta los primeros `start` elementos. Por ejemplo:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].slice(2)
// ["Aron", "DJ", "Glenn", "Isaac", "Bethany"]
```

`[...].join(string)` une los elementos de un array con el string que le des. Por ejemplo:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].join(" likes ")
// Jeremy likes Erik likes Aron likes DJ likes Glenn likes Isaac likes Bethany
```

`"...".endsWith(string)` te dice si un string termina con otro string. Por ejemplo:

```js
"Jeremy".endsWith("emy")
// true

"Jeremy".endsWith("Jer")
// false
```
