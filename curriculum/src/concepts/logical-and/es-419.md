---
title: "La palabra clave `and`"
description: "Combina dos condiciones con `&&` para que toda la condición sea verdadera solo cuando ambas partes lo son."
en_md5: 6ea0de65a81d8e5c8d2eb89f3db29705
---

Si te pidiera que abras la puerta solo si la persona tiene más de 20 años, seguramente sabrías qué hacer. Pero ¿y si necesitaras comprobar si alguien tiene más de 20 _y_ lleva el atuendo correcto? Entonces necesitas revisar dos condiciones distintas al mismo tiempo. ¿Cómo lo harías?

Tal vez podrías usar un condicional `if` anidado (_nested_ en inglés), parecido a los bucles anidados que vimos antes. Podrías decir: si `age` es mayor que `20`, entramos a este bloque de código, y luego otro `if` para ver si `outfit` es igual a `"disco"`, otra llave y un nuevo bloque de código. Funcionaría, pero se vuelve bastante enredado, sobre todo si quieres tener muchos condicionales.

Por suerte, hay una forma más fácil: tener condiciones con varias partes. En lugar de revisar una sola cosa en la condición, podemos revisar dos, tres o más cosas. Y para hacerlo necesitamos la palabra clave `and`. Lamentablemente, en JavaScript la palabra clave `and` no es la palabra "and", como sí ocurre en otros lenguajes. En su lugar tienes que poner dos ampersands uno al lado del otro. Vas a tener que recordarlo. Es molesto, pero así es, y te acostumbrarás.

Así que podemos usar esto para armar una condición más compleja. Podemos decir: si `age` es mayor que `20` y el `outfit` es `"disco"`, entonces seguimos. Si `age` es menor que `20` o el `outfit` no es `"disco"`, toda la sentencia, toda la condición es falsa. Si alguna vez estudiaste lógica, hiciste algo de electrónica o matemática más avanzada, esto te va a resultar muy natural. Si no, lo entenderás rápido.

```javascript
if (age > 20 && outfit === "disco") {
  openDoor()
}
```

Hay algo que suele confundir a la gente tanto con `and` como con `or`: cada lado del y/o (_and/or_ en inglés) debe ser una comparación completa. Así que, aunque estés comparando la misma variable en ambos lados, tienes que repetirla. No puedes escribir «si `age` es mayor que 13 y menor que 20». Tienes que escribir «si `age` es mayor que 13 y `age` es menor que 20». Necesitas que ambos lados sean comparaciones completas.

```javascript
if (age > 13 && age < 20)
```
