---
title: "Usar funciones"
description: "Decirle a Jiki que ponga en marcha una de sus pequeñas máquinas escribiendo su nombre seguido de dos paréntesis."
en_md5: 007a425ced42fd3550bfdf9fe6f7b391
---

Cuando escribes código, lo que en realidad estás haciendo es comunicar lo que quieres que ocurra en un lenguaje que el ordenador entiende. Existen muchos lenguajes de programación distintos, y también muchos intérpretes (_interpreters_ en inglés) distintos que toman lo que escribes y lo convierten en los unos y ceros que el ordenador puede entender. En este curso, tu intérprete es Jiki. Todo el curso lleva su nombre. Este es Jiki. Jiki va a ser tu amigo en este viaje por la programación. Su trabajo es interpretar el código que escribes y convertirlo en los unos y ceros con los que el ordenador puede trabajar de verdad.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, el intérprete amable que te acompañará a lo largo de este curso"
  width="421"
  height="400"
/>

Todo el sentido de programar está en darle al intérprete, a Jiki en este caso, las instrucciones correctas. Hay muchísimas instrucciones distintas que puedes darle a Jiki, muchas cosas que él entiende. Puede pegar cosas unas con otras, puede hacer algo muchas veces, puede decir: «Si pasa esto, entonces tengo que hacer esto otro». Puede recordar cosas y volver a usarlas más adelante. Y si algo no está bien, puede darte un error. Vamos a ver todas estas cosas a lo largo del curso. Pero lo fundamental que hay que entender es que todo lo que vas a hacer consiste en escribir instrucciones en una pizarra para que Jiki venga y las siga.

Cuando aprendí a programar hace 34 años, este fue el modelo mental que construí, y es el que sigo teniendo hoy. Entiendo cómo funcionan los ordenadores hasta el nivel de los unos y los ceros, pero, sinceramente, nunca pienso en eso. En mi cabeza hay un hombrecillo que vive dentro del ordenador, y yo le digo lo que tiene que hacer. Así que sígueme el juego con esto. Es un modelo mental muy potente que puedes construir, y si empiezas a pensar de esta forma tan visual en lo que está haciendo la persona que vive dentro del ordenador, te vendrá muy bien mientras aprendes a programar.

Así que vamos a empezar mirando uno de los conceptos fundamentales de la programación: las funciones (_functions_ en inglés). Las funciones son como pequeñas máquinas que puedes pedirle a Jiki que use, y si echamos un vistazo dentro del almacén de Jiki, que es donde él pasa el rato, verás que tiene una estantería con tres máquinas distintas: `move` (mover), `turnLeft` (girar a la izquierda) y `turnRight` (girar a la derecha).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Una estantería en el almacén de Jiki con tres máquinas etiquetadas move, turnLeft y turnRight"
  width="500"
  height="371"
/>

Cuando escribiste `move` y luego esos dos paréntesis, lo que estabas haciendo era decirle a Jiki que fuera a por la máquina `move` a la estantería, que girara la manivela, la pusiera en marcha y la usara.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki sacando rodando la máquina move de la estantería para usarla"
  width="439"
  height="400"
/>

Cuando escribiste `turnLeft` y luego los paréntesis, le estabas diciendo a Jiki que cogiera la máquina `turnLeft` de la estantería y la usara. Y este es el patrón que vas a usar una y otra vez. Siempre que quieras usar una máquina, escribirás su nombre y luego esos paréntesis, y eso le dice a Jiki que vaya a por la máquina y la use:

```javascript
move()
turnLeft()
```

Ahora, cómo funciona esa máquina por dentro, qué ocurre dentro de ella, no nos hace falta preocuparnos por eso todavía. Lo veremos con mucho más detalle más adelante. De hecho, no pasará mucho tiempo hasta que puedas construir tus propias máquinas. Pero por ahora, no te preocupes por eso. En cada ejercicio te diremos qué máquinas hay en la estantería de Jiki. Serán distintas en cada ejercicio, y podrás usarlas para resolver los ejercicios.
