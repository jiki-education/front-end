---
title: "Muñeco de nieve relacional"
description: "Reconstruye tu muñeco de nieve para que todos los tamaños se escalen a partir de una sola variable."
en_md5: 1753f8d873e9a5b58885cc1daee5ea5d
---

En este ejercicio vamos a construir otro muñeco de nieve, pero, igual que en el ejercicio anterior, lo hacemos de manera que todo se pueda obtener a partir de una sola variable `size` (tamaño) usando aritmética.

Dependiendo del valor de `size` que elijas, el muñeco de nieve debe crecer.

<img
  src="/static/images/exercise-assets/relational-snowman/sizes.webp"
  alt="Muñeco de nieve con tamaños del 1 al 5"
  style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>

### Cómo funciona

- La esquina superior izquierda del lienzo de dibujo es `0,0`. La esquina inferior derecha es `100,100`.
- Tienes una variable predefinida `snowmanX` (coordenada X del centro del muñeco de nieve) para el centro de la imagen y una variable `size` que puedes cambiar entre `1` y `5` para hacer crecer el muñeco de nieve.
- Necesitas obtener todas las demás variables usando expresiones aritméticas.
- El radio de la cabeza es `size * 2`, el radio del cuerpo es `size * 3` y el radio de la base es `size * 4`.
- Los círculos deben tocarse entre sí: el cuerpo se coloca directamente encima de la base y la cabeza directamente encima del cuerpo. (Nuestro muñeco de nieve está un poco más en precario que en ejercicios anteriores: cada bola de nieve se coloca exactamente sobre la de abajo sin que se derritan entre sí. ¡Debe ser un día bien helado!)
- La parte inferior del círculo de la base queda a una distancia `size` del borde inferior.
- Necesitas calcular los centros de las tres bolas de nieve.

### Variables

Tu tarea consiste en asignar estas variables a partir de las instrucciones anteriores.

- `headRadius` (radio de la cabeza): se obtiene a partir de `size`
- `bodyRadius` (radio del cuerpo): se obtiene a partir de `size`
- `baseRadius` (radio de la base): se obtiene a partir de `size`
- `baseY` (coordenada Y de la base): se obtiene a partir de `size` y `baseRadius` (la base está apoyada en el suelo)
- `bodyY` (coordenada Y del cuerpo): se obtiene a partir de `baseY`, `baseRadius` y `bodyRadius`
- `headY` (coordenada Y de la cabeza): se obtiene a partir de `bodyY`, `bodyRadius` y `headRadius`

### Juega con el tamaño

Puedes cambiar el valor de `size` entre `1` y `5` y el muñeco de nieve debería crecer. Recuerda presionar «Ejecutar código» después de cambiarlo.
