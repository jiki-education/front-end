---
title: "Rascacielos"
description: "Construye un rascacielos en la cuadrícula de la ciudad."
en_md5: 901851ded0ac8a0ef6cb80db60e59998
---

Este es el primero de dos ejercicios en los que vas a construir rascacielos.

En este ejercicio, tu trabajo es construir un solo rascacielos en el centro de la escena. En cada escenario, la altura del rascacielos varía.

Para determinar cuántos pisos construir, tienes una función `numFloors()` (número de pisos) que devuelve la altura total del edificio.

Hay tres componentes diferentes que puedes usar: muro (`W`), vidrio (`G`) y entrada (`E`). Revisa las funciones de abajo para ver cómo crearlos.

El piso más cercano al suelo (ya sea la «planta baja» o el «primer piso», según tu región) siempre tiene una entrada entre dos segmentos de vidrio y dos segmentos de muro en los extremos (`WGEGW`). Los otros pisos tienen tres vidrios entre muros (`WGGGW`). Y encima de los pisos hay un techo (`WWWWW`).

Así que un rascacielos de 5 pisos tiene un piso de entrada, 4 pisos de vidrio y un techo. Debería verse así:

```
WWWWW
WGGGW
WGGGW
WGGGW
WGGGW
WGEGW
```

El centro del rascacielos debe estar en la columna `19`. La planta baja comienza en `2` (justo encima del piso de concreto) y va hacia arriba (así que en nuestro ejemplo anterior, eso sería un piso de entrada en `2` y un techo en `7`).

Una regla clave en este ejercicio es que todos los valores que ingresas en las funciones deben ser variables o fórmulas. No puedes simplemente ingresar un número como `20`.

Una vez que termines este ejercicio, desbloquearás un Proyecto donde construirás horizontes urbanos completos con diferentes cantidades de edificios de diferentes anchos.
