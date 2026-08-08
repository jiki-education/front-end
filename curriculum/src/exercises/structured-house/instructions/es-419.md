---
title: "Casa estructurada"
description: "Genera el dibujo completo de una casa a partir de dos variables de tamaño."
en_md5: 783a94e5de5f4bd22cd634e07eabc131
---

Tu tarea es dibujar una casa, construyéndola por completo a partir de solo dos variables: `houseWidth` (ancho de la casa) y `houseHeight` (altura de la casa).

Nosotros ya configuramos los colores, el ancho del lienzo y esas dos variables. Todo lo demás (dónde se ubica la casa, el techo, las ventanas, la puerta y el pomo) debe derivarse de esas dos variables y de las reglas fijas que aparecen abajo.

**¡Piensa en relaciones!** Si lo haces bien, vas a poder cambiar únicamente `houseWidth` y `houseHeight` y la casa entera se redimensionará correctamente: permanecerá centrada horizontalmente, asentada sobre el césped y conservará sus proporciones. No escribas posiciones fijas que hayas calculado tú mismo. Construye cada parte a partir de las variables.

<img src="/static/images/exercise-assets/structured-house/structured-house-finished.webp" alt="La misma casa dibujada con tres anchos y alturas diferentes, cada una permanece centrada y asentada sobre el césped" style="width: 100%; box-sizing: border-box; padding: 16px; background: #fff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Especificaciones de la casa

- La esquina superior izquierda del lienzo es `0,0`. La esquina inferior derecha es `100,100`.
- El cielo ocupa todo el lienzo (de `0,0` a `100,100`).
- El césped ocupa todo el ancho y está en la parte inferior del lienzo, con una altura de `15`.
- La casa siempre está centrada horizontalmente en el lienzo.
- La base de la casa queda `5` por debajo del borde superior del césped, y la casa crece hacia arriba a partir de ese punto.
- El techo se apoya sobre el cuerpo de la casa. Sobresale hacia la izquierda y hacia la derecha del cuerpo una décima parte del ancho del cuerpo, su altura es la mitad de la altura del cuerpo y su pico queda centrado horizontalmente.
- Cada ventana tiene un ancho de un quinto del ancho del cuerpo y una altura de un tercio de la altura del cuerpo. Están ubicadas un octavo de la altura del cuerpo por debajo del borde superior del cuerpo, y separadas de cada lado del cuerpo por un séptimo del ancho del cuerpo.
- La puerta tiene un ancho de un quinto del ancho del cuerpo y una altura de la mitad de la altura del cuerpo, está centrada horizontalmente y su base coincide con la base de la casa.
- El radio del pomo es un décimo del ancho de la puerta. Entre el pomo y el borde derecho de la puerta hay un espacio de un décimo del ancho de la puerta. El pomo está centrado verticalmente en la puerta.

### ¡Verifica que funcione!

Prueba a cambiar las variables `houseWidth` y `houseHeight`. Si tu código es correcto, la casa se redimensionará manteniéndose centrada y asentada sobre el césped.
