---
title: "Hamming"
description: "Cuenta las diferencias entre dos cadenas de ADN."
en_md5: 629f74899d402283c34d3bfbb17777b8
---

¡Este es un clásico ejercicio de Exercism sobre biología molecular!

Tu cuerpo está formado por células que contienen ADN. Esas células se desgastan regularmente y necesitan ser reemplazadas, lo cual logran dividiéndose en células hijas. De hecho, ¡el cuerpo humano promedio experimenta alrededor de 10 mil billones de divisiones celulares a lo largo de la vida!

Cuando las células se dividen, su ADN también se replica. A veces, durante este proceso ocurren errores y fragmentos individuales de ADN se codifican con información incorrecta. Si comparamos dos cadenas de ADN y contamos las diferencias entre ellas, podemos ver cuántos errores ocurrieron. A esto se le llama «distancia de Hamming».

La distancia de Hamming es útil en muchas áreas de la ciencia, no solo en biología, ¡así que es una buena expresión para conocer!

Tu tarea es calcular la distancia de Hamming entre dos cadenas de ADN. El ADN emplea las letras C, A, G y T. Dos cadenas podrían verse así:

    GAGCCTACTAACGGGAT
    CATCGTAATGACGGCCT
    ^ ^ ^  ^ ^    ^^

Tienen 7 diferencias, por lo que la distancia de Hamming es 7.

Crea una función llamada `hammingDistance` (distancia de Hamming) que tenga dos argumentos: las dos cadenas de ADN como strings. Debe devolver un número, la distancia.

Ambas cadenas de ADN siempre tendrán la misma longitud.
