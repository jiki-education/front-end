---
title: "Rostro de zorro"
description: "Construye un rostro de zorro geométrico con triángulos de colores."
en_md5: 095833a5b2117c2d26500103216bf247
---

Este ejercicio te presenta la función `triangle` (triángulo). La usas con 7 argumentos. Los primeros 6 argumentos son pares de coordenadas para las tres esquinas. El último argumento es el `color`:

- `x1` (coordenada x), `y1` (coordenada y): el primer punto de la esquina
- `x2` (coordenada x), `y2` (coordenada y): el segundo punto de la esquina
- `x3` (coordenada x), `y3` (coordenada y): el tercer punto de la esquina
- `color`: el color del triángulo (por ejemplo, `"orange"`)

<img src="/static/images/exercise-assets/foxy-face/intro-triangle.webp" alt="Diagrama de la función triángulo" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Cómo dibujar un rostro de zorro

Tu tarea es usar triángulos para construir un rostro de zorro geométrico:

<img src="/static/images/exercise-assets/foxy-face/example.svg" alt="Rostro de zorro" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

El rostro es simétrico horizontalmente (el lado izquierdo es idéntico al derecho). Y tiene 8 triángulos en total:

- Dos mejillas `"white"`
- Dos orejas `"brown"`
- Dos mitades del rostro `"orange"`
- Una nariz `"charcoal"` (dos triángulos)

(¡Asegúrate de usar esos colores al dibujar los triángulos y no te olvides de escribirlos como _strings_ (cadenas de caracteres)!)

Ya dibujamos los contornos de algunas partes para ayudarte a empezar. Si sigues el orden que aparece en los comentarios, verás que te resulta un poco más fácil.

Además, para facilitarte aún más las cosas, todos los números que se usan son divisibles por 5 (por ejemplo, `5`, `10`, `15`, etc. son válidos, pero `1`, `2`, `3`, `4`, `6`, `7`, `8`, `9`, `11`, etc. no lo son). Verás este patrón con frecuencia en los siguientes ejercicios.

Una última cosa. Puedes pasar el cursor sobre el espacio para encontrar las coordenadas. Eso funciona bien para el lado izquierdo, pero como el lado derecho es simétrico, ¿puedes resolverlo sin necesidad de pasar el cursor?

¡Buena suerte!
