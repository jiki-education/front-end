---
title: "Usando funções"
description: "Peça ao Jiki para usar uma das maquininhas dele escrevendo o nome dela seguido de dois parênteses."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Quando você escreve código, o que você está fazendo de verdade é comunicar o que você quer que aconteça, numa linguagem que o computador entende. Existem muitas linguagens de programação diferentes, e muitos intérpretes diferentes que pegam o que você escreve e transformam nos uns e zeros que o computador consegue entender. Neste curso, o seu intérprete é o Jiki. O curso todo leva o nome dele. Este é o Jiki. Ele vai ser seu amigo nessa jornada de programação. O trabalho dele é interpretar o código que você escreve e transformar nos uns e zeros com os quais o computador realmente consegue trabalhar.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, o intérprete simpático que vai te guiar por este curso"
  width="421"
  height="400"
/>

A essência da programação é dar as instruções certas ao intérprete, no caso o Jiki. E existem muitas instruções diferentes que você pode dar para ele, muita coisa que ele entende. Ele consegue juntar coisas, consegue fazer algo várias vezes, consegue dizer: “Se isso acontecer, então eu preciso fazer aquilo.” Ele consegue guardar coisas e usar de novo mais tarde. E, se algo não estiver certo, ele pode te dar um erro. Vamos ver todas essas coisas ao longo do curso. Mas o mais importante de entender é que tudo o que você vai fazer é escrever instruções num quadro para o Jiki chegar e seguir.

Quando eu aprendi a programar, 34 anos atrás, foi esse o modelo mental que eu construí, e é o mesmo que eu tenho até hoje. Eu entendo como o computador funciona até o nível dos uns e zeros, mas, sinceramente, nunca penso nisso. Na minha cabeça, tem um homenzinho morando dentro do computador, e eu digo para ele o que fazer. Então venha comigo nessa. É um modelo mental poderoso, que você também pode construir. Se você começar a pensar de um jeito bem visual no que essa pessoa dentro do computador está fazendo, isso vai te ajudar muito enquanto você aprende a programar.

Então vamos começar olhando um dos conceitos fundamentais da programação: as funções (_functions_ em inglês). Funções são como maquininhas que você pode pedir para o Jiki usar. E se a gente der uma olhada no galpão do Jiki, que é onde ele fica, você vai ver que ele tem uma prateleira com três máquinas diferentes: `move` (mover), `turnLeft` (virar à esquerda) e `turnRight` (virar à direita).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Uma prateleira no galpão do Jiki com três máquinas: move, turnLeft e turnRight"
  width="500"
  height="371"
/>

Quando você escreveu `move` e depois aqueles dois parênteses, o que você fez foi dizer ao Jiki para pegar a máquina `move` na prateleira, girar a manivela, ligar e usar.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="O Jiki tirando a máquina move da prateleira para usar"
  width="439"
  height="400"
/>

Quando você escreveu `turnLeft` e depois os parênteses, você estava dizendo ao Jiki para pegar a máquina `turnLeft` na prateleira e usar. E esse é o padrão que você vai repetir de novo e de novo. Sempre que você quiser usar uma máquina, escreva o nome dela e depois os parênteses. Isso diz ao Jiki para ir buscar a máquina e usar:

```javascript
move()
turnLeft()
```

Agora, como essa máquina funciona de verdade, o que acontece dentro dela, não precisamos nos preocupar com isso por enquanto. Vamos ver isso com muito mais detalhe mais para frente. Na verdade, não vai demorar muito para você conseguir construir suas próprias máquinas também. Mas, por enquanto, não se preocupe com isso. Em cada exercício, você vai saber quais máquinas estão na prateleira do Jiki. Elas mudam de exercício para exercício, e você vai usar essas máquinas para resolver os exercícios.
