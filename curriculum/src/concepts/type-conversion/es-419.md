---
title: "Conversión de tipos"
description: "Convertir un string de dígitos en un número con `Number()`, o un número en un string con `String()`."
en_md5: 8d85e3d274a6cdfdb74bd0488b685f18
---

Cada valor en nuestros programas tiene un tipo. `"7"` es un string y `7` es un número. Puede que se parezcan mucho, pero Jiki los trata de manera muy distinta. No puedes sumar el string `"7"` al número `3` y obtener `10`, porque uno es un fragmento de texto y el otro es una cantidad.

Con bastante frecuencia necesitamos mover un valor de un tipo a otro. Esto se llama conversión de tipos (_type conversion_ en inglés), y hay dos conversiones a las que recurrirás siempre.

### Convertir un string en un número

Cuando lees caracteres de un string, cada carácter es a su vez un string, incluso cuando parece un dígito. Antes de que puedas hacer operaciones aritméticas con él, necesitas convertirlo en un número de verdad. Eso se hace con `Number()`.

```javascript
Number("7")
// 7

Number("42")
// 42
```

Cuando ya tienes un número real, puedes sumarlo, multiplicarlo y todo lo demás.

```javascript
let digit = Number("7")
let doubled = digit * 2
// 14
```

Si le pasas a `Number()` algo que no sea un número válido, como `Number("cat")`, no obtendrás ningún número, así que conviene asegurarte de darle solo strings que realmente sean dígitos.

### Convertir un número en un string

La dirección opuesta es igual de útil. A veces tienes un número y quieres tratarlo como texto, tal vez para unirlo a otro string o para examinar sus dígitos uno por uno. Eso se hace con `String()`, la imagen especular de `Number()`.

```javascript
String(42)
// "42"

let count = 7
String(count)
// "7"
```

Ahora que es un string, puedes usar todas las herramientas habituales para strings, como leerlo carácter por carácter o revisar su longitud.
