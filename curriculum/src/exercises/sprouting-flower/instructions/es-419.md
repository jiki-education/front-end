---
title: "Flor que brota"
description: "Usa relaciones entre variables para animar una flor que brota del suelo."
en_md5: acd8f364af4cfdc8f76ced2b17539bbb
---

Tu tarea es crear una flor que crezca durante `60` iteraciones.

La animación debe verse más o menos así.

<img src="/static/images/exercise-assets/sprouting-flower/frames.webp" alt="Cuadros que muestran una flor creciendo desde el suelo a lo largo de 60 iteraciones" style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

La clave de este ejercicio es construir relaciones entre los distintos elementos. Esta es una habilidad fundamental en programación.

**Antes de seguir leyendo las instrucciones**, tómate unos minutos para pensar conceptualmente cómo lograrlo. Anota en un papel los pasos que crees que debes seguir.

**Cuando tengas una solución** con la que estés conforme (o te hayas rendido), **desplázate hacia abajo** para ver las instrucciones.

---

## Cómo resolverlo

El componente clave es el centro de la flor. Todo lo demás se puede calcular a partir de ese punto central. En cada iteración del bucle, el punto central debe subir `1` (antes de dibujar).

Estas son otras cosas que necesitas saber:

- La esquina superior izquierda del lienzo de dibujo es `0,0`. La esquina inferior derecha es `100,100`.
- El radio de la flor comienza en `0`. Debe aumentar `0.4` en cada iteración (antes de dibujar).
- El radio del pistilo (la parte amarilla del centro de la flor) comienza en `0`. Debe aumentar `0.1` en cada iteración (antes de dibujar).
- El tallo debe empezar en el centro de la flor y llegar hasta el suelo.
- El ancho del tallo es el 10% de la altura del tallo (es decir, `stemHeight / 10` (altura del tallo dividida entre 10)).
- Todo está centrado en el eje horizontal.
- Las hojas quedan pegadas al tallo por cada lado.
- Las hojas están a la mitad del tallo.
- El `radiusX` (radio en X) de las hojas es el 50% del radio de la flor.
- El `radiusY` (radio en Y) de las hojas es el 20% del radio de la flor.
- La cabeza de la flor puede ser `"red"` o `"pink"` según tu gusto. El pistilo (el centro de la flor) debe ser `"yellow"`. El pasto debe ser `"green"`. El fondo debe ser `"skyblue"`.

Es **esencial** trabajar en una sola cosa a la vez:

- Empieza dibujando la flor rosa y haz que suba.
- Luego haz que crezca.
- Agrega el centro amarillo más pequeño.
- Agrega el tallo.
- Agrega la hoja izquierda.
- Agrega la hoja derecha.

Usa la barra scrubber para recorrer el código y ver dónde están los errores.

### Este es un ejercicio difícil

Este es un ejercicio complejo. Tómate tu tiempo. Si de verdad te atascas, pide ayuda, y recuerda darnos mucha información sobre qué no funciona y por qué crees que ocurre.

Usa el scrubber (la barra de reproducción, abajo a la izquierda) para revisar el valor de tus variables si no tienes claro qué está pasando. Haz clic en el pequeño botón de alternancia para ver información de cada línea.

Recuerda, el aprendizaje está en la lucha. Cada vez que algo sale mal y lo resuelves, te estás convirtiendo en programador. Al final te parecerá fácil. Sigue adelante.
