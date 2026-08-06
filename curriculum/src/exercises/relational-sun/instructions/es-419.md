---
title: "Sol relacional"
description: "Posiciona un sol donde todo se calcula a partir de variables."
en_md5: d8de4704a25f3733ddaaea16f0232005
---

En este ejercicio, tu tarea es posicionar un sol en la esquina superior derecha del cielo usando aritmética y variables. La restricción clave es que el borde del sol siempre debe estar a una **separación** fija del borde del lienzo, sin importar el tamaño del sol.

Hemos predefinido cuatro variables para ti al inicio del archivo:

- `canvasSize` (tamaño del lienzo): el tamaño del lienzo, que es `100`.
- `color`: configurado en `"yellow"`.
- `gap` (separación): qué tan lejos queda el borde del sol de los bordes superior y derecho del lienzo.
- `radius` (radio): el radio del sol.

### Un proceso de dos pasos

Para resolver este ejercicio, haz dos cosas:

#### 1. Define las variables derivadas

Define las variables `sunX` (coordenada X del sol) y `sunY` (coordenada Y del sol) que usen `gap`, `radius` y `canvasSize` para establecer el centro del sol en la esquina superior derecha.

#### 2. Dibuja el círculo

Dibuja un círculo usando `sunX`, `sunY`, `radius` y `color`.

## Flexibilidad

El `gap` está configurado en 10 y el `radius` en 15 por defecto. Resuelve el ejercicio usando esos valores primero para que puedas usar el fondo para alinear las cosas. Cuando tu código sea correcto, verás el círculo aparecer en el lugar correcto de la página.

Sin embargo, para superar el ejercicio no puedes simplemente «hardcodear» el valor (es decir, asignarle un número fijo); `sunX` y `sunY` deben ser cálculos que involucren otras variables.

Una vez que hayas superado el ejercicio, haz clic en «Limpiar mi código» e intenta cambiar los valores de `gap` y `radius` al inicio del archivo, y vuelve a ejecutar tu código para ver cómo el sol crece o se mueve pero se mantiene en la esquina.

Cuando termines, puedes hacer clic en «Panel de control» en la esquina superior derecha para continuar como de costumbre.
