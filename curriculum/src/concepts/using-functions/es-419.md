---
title: "Usar funciones"
description: "Dile a Jiki que use una de sus pequeñas máquinas: escribe su nombre y después dos paréntesis."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Cuando escribes código, lo que en realidad haces es comunicar lo que quieres que pase, en un lenguaje que la computadora entiende. Existen muchísimos lenguajes de programación, y también muchísimos intérpretes (_interpreters_ en inglés) que toman lo que escribes y lo convierten en los unos y ceros que la computadora puede entender. En este curso, tu intérprete es Jiki. Todo el curso lleva su nombre. Él es Jiki. Jiki va a ser tu amigo en este viaje por la programación. Su trabajo es interpretar el código que escribes y convertirlo en los unos y ceros con los que la computadora realmente puede trabajar.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, el intérprete amigable que te acompañará durante este curso"
  width="421"
  height="400"
/>

Programar consiste en darle al intérprete (Jiki) las instrucciones correctas. Y hay muchísimas instrucciones distintas que le puedes dar, muchas que él entiende. Puede pegar cosas entre sí, puede hacer algo muchas veces, puede decir: "Si pasa esto, entonces tengo que hacer esto otro". Puede recordar cosas y volver a usarlas más adelante. Y si algo no está bien, te puede dar un error. Vamos a ver todo esto a lo largo del curso. Pero lo más importante es entender que todo lo que vas a hacer es escribir instrucciones en un pizarrón, para que Jiki venga y las siga.

Cuando aprendí a programar, hace 34 años, este fue el modelo mental que construí, y es el mismo que tengo hoy. Entiendo cómo funcionan las computadoras hasta el nivel de los unos y los ceros, pero, sinceramente, nunca pienso en eso. En mi cabeza hay un hombrecito que vive dentro de la computadora, y yo le digo qué hacer. Así que acompáñame en esta idea. Este modelo mental es poderoso, y si empiezas a pensar de esta forma tan visual en que hace esa personita dentro de la computadora, te servirá mucho mientras aprendes a programar.

Entonces, empecemos con uno de los conceptos fundamentales de la programación: las funciones (_functions_ en inglés). Las funciones son como pequeñas máquinas que le puedes pedir a Jiki que use. Y si miramos dentro del almacén de Jiki, que es donde él pasa el rato, vas a ver que tiene un estante con tres máquinas distintas: `move` (mover), `turnLeft` (girar a la izquierda) y `turnRight` (girar a la derecha).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Un estante en el almacén de Jiki con tres máquinas: move, turnLeft y turnRight"
  width="500"
  height="371"
/>

Cuando escribiste `move` y después esos dos paréntesis, lo que hiciste fue decirle a Jiki que bajara la máquina `move` del estante, que girara la manivela, la encendiera y la usara.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki bajando la máquina move del estante para usarla"
  width="439"
  height="400"
/>

Cuando escribiste `turnLeft` y después los paréntesis, le estabas diciendo a Jiki que bajara la máquina `turnLeft` del estante y la usara. Y este es el patrón que vas a usar una y otra vez: cuando quieras usar una máquina, escribes su nombre y después esos paréntesis, y eso le dice a Jiki que vaya por la máquina y la use:

```javascript
move()
turnLeft()
```

Ahora, cómo funciona esa máquina en su interior, qué pasa dentro de ella, no nos tiene que preocupar por el momento. Lo vamos a ver con mucho más detalle más adelante. De hecho, no falta mucho para que puedas construir tus propias máquinas. Pero por ahora no te preocupes por eso. En cada ejercicio se te va a decir qué máquinas hay en el estante de Jiki. Van a ser distintas en cada ejercicio, y vas a poder usarlas para resolver los ejercicios.
