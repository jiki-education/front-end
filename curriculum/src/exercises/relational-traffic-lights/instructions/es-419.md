---
title: "Semáforos relativos"
description: "Reconstruye tu semáforo para que todo escale junto."
en_md5: d54633094a8d14f73b298fe4827504c4
---

¡Ya regresaste a los semáforos! Esta vez seguiremos el patrón de los dos últimos ejercicios y los construiremos de manera que, al cambiar el radio, todo se ajuste correctamente. Para lograrlo, tenemos una serie de variables que podemos hacer relativas a `center` (centro) y/o `radius` (radio).

<img src="/static/images/exercise-assets/relational-traffic-lights/target.webp" alt="Semáforo objetivo" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Cómo funciona

- La esquina superior izquierda del lienzo es `0,0`. La esquina inferior derecha es `100,100`.
- Las variables de color y `center` ya están definidas para ti. `radius` está predefinido en 10, pero puedes experimentar cambiándolo.
- Necesitas derivar todas las variables de posición y tamaño como alguna combinación de `radius` y/o `center`.
- La caja es un rectángulo que rodea las tres luces con un relleno. El relleno es igual al radio.
- Las tres luces están uniformemente espaciadas en vertical dentro de la caja y la caja está en el centro de la imagen. (Por lo tanto, el centro del círculo amarillo coincide con el centro de la imagen.)

### Variables para derivar

Todas estas variables deben usar `radius` o `center` (o ambos). Por ejemplo, alguna fórmula como `radius * 7` o `center - (radius * 2)`.

- `redY` (coordenada Y del centro de la luz roja), `yellowY` (coordenada Y del centro de la luz amarilla) y `greenY` (coordenada Y del centro de la luz verde): los centros verticales de cada luz.
- `housingX` (coordenada X de la esquina superior izquierda de la caja), `housingY` (coordenada Y de la esquina superior izquierda de la caja): la esquina superior izquierda del rectángulo de la caja.
- `housingWidth` (ancho de la caja), `housingHeight` (alto de la caja): el tamaño del rectángulo de la caja.

### Probando que todo se ajusta correctamente

Mientras trabajas, puedes cambiar el radio de `2` a `12` para ver si todo escala correctamente. Si tu código es correcto, ¡deberías ver cómo todo se escala de forma uniforme alrededor del centro de la imagen!
