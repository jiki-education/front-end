---
title: "Usar funções"
description: "Dizer ao Jiki para correr uma das suas pequenas máquinas: escreves o nome dela seguido de dois parênteses."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Quando escreves código, aquilo que estás realmente a fazer é comunicar o que queres que aconteça, numa linguagem que o computador entende. Existem muitas linguagens de programação diferentes e existem muitos intérpretes (_interpreters_ em inglês) diferentes, que pegam naquilo que escreves e o transformam nos uns e zeros que um computador consegue entender. Neste curso, o teu intérprete é o Jiki. O curso todo tem o nome dele. Este é o Jiki. O Jiki vai ser o teu amigo nesta viagem pela programação. O trabalho dele é interpretar o código que escreves e transformá-lo nos uns e zeros sobre os quais o computador consegue realmente agir.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, o intérprete simpático que te vai acompanhar ao longo deste curso"
  width="421"
  height="400"
/>

O objetivo da programação é dar ao intérprete, neste caso o Jiki, as instruções certas. E há muitas instruções diferentes que lhe podes dar, muitas que ele entende. Ele consegue juntar coisas, consegue fazer algo muitas vezes, consegue dizer: «Se isto acontecer, então tenho de fazer aquilo.» Consegue guardar coisas e usá-las outra vez mais tarde. Consegue dar-te um erro (_error_ em inglês) se algo não estiver certo. Vamos ver tudo isto ao longo do curso. Mas o mais importante é entenderes que tudo o que vais fazer é escrever instruções num quadro, para o Jiki vir depois segui-las.

Quando aprendi a programar, há 34 anos, foi este o modelo mental que construí, e é o que ainda tenho hoje. Entendo como os computadores funcionam até ao nível dos uns e dos zeros, mas, sinceramente, nunca penso nisso. Na minha cabeça, vive um homenzinho dentro do computador e eu digo-lhe o que fazer. Por isso, acompanha-me neste raciocínio. É um modelo mental poderoso, que também podes construir, e se começares a pensar de forma muito visual naquilo que a pessoa dentro do computador está a fazer, isso vai dar-te uma boa base enquanto aprendes a programar.

Vamos então começar por olhar para um dos conceitos fundamentais da programação: as funções (_functions_ em inglês). As funções são como pequenas máquinas que podes pedir ao Jiki para usar e, se olharmos para dentro do armazém do Jiki, que é onde ele passa o tempo, vais ver que ele tem uma prateleira com três máquinas diferentes: `move` (mover), `turnLeft` (virar à esquerda) e `turnRight` (virar à direita).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Uma prateleira no armazém do Jiki com três máquinas identificadas como move, turnLeft e turnRight"
  width="500"
  height="371"
/>

Quando escreveste `move` e depois aqueles dois parênteses, o que estavas a fazer era dizer ao Jiki para ir buscar a máquina `move` à prateleira, rodar a manivela, ligá-la e usá-la.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="O Jiki a tirar a máquina move da prateleira para a usar"
  width="439"
  height="400"
/>

Quando escreveste `turnLeft` e depois os parênteses, estavas a dizer ao Jiki para tirar a máquina `turnLeft` da prateleira e usá-la. E este é o padrão que vais usar uma e outra vez. Sempre que quiseres usar uma máquina, escreves o nome dela e depois aqueles parênteses, e isso diz ao Jiki para ir buscar a máquina e usá-la:

```javascript
move()
turnLeft()
```

Agora, como a máquina funciona por dentro, o que acontece lá dentro, não precisamos de nos preocupar com isso por agora. Vamos ver isso com muito mais detalhe mais tarde. Na verdade, não vai demorar muito até conseguires construir as tuas próprias máquinas. Mas, por agora, não te preocupes com isso. Em cada exercício, vais saber quais são as máquinas que estão na prateleira do Jiki. Serão diferentes em cada exercício, e vais poder usá-las para resolver os exercícios.
