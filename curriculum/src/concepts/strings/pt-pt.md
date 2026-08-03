---
title: "Strings"
description: "Pedaços de texto entre aspas (uma letra, uma palavra, uma frase ou um parágrafo inteiro) que o Jiki escreve em papel."
en_md5: 89b04f3849f9388a46734924f35c913c
---

Quando queres usar um número, basta escrevê-lo, e o Jiki percebe o que queres dizer. Mas e se quiseres usar uma letra, uma palavra ou uma frase? Por exemplo, com a função `rectangle` (retângulo) ou a função `circle` (círculo), e se houvesse um valor de entrada extra onde indicasses a cor? Como é que escreveríamos a cor para a pôr na máquina? Se escrevermos só a palavra `green` (verde) ou `blue` (azul), o Jiki vai pensar que nos estamos a referir a uma máquina das prateleiras, e vai dizer: "Não há nenhuma máquina chamada green. Não sei o que fazer."

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="O Jiki de pé, confuso, ao lado da máquina rectangle, com pontos de interrogação por cima da cabeça"
  width="446"
  height="400"
/>

Por isso temos uma regra: sempre que precisamos de usar texto, temos de o pôr entre aspas, aspas duplas. E quando pões algo entre aspas assim, o Jiki tira uma folha de papel e escreve nessa folha o que puseste entre as aspas. A estas folhas de papel chamamos _strings_ (cadeias de carateres).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="O Jiki a escrever a palavra green numa folha de papel, que se torna uma string"
  width="398"
  height="400"
/>

Uma string pode ser uma única letra, uma palavra, uma frase, um parágrafo, até um livro inteiro. A regra é esta: se é texto, pomos entre aspas, e passa a ser uma string.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Um quadro com strings de vários comprimentos entre aspas: uma única letra, uma palavra, uma frase e uma morada em várias linhas"
  width="500"
  height="398"
/>

Portanto, se quisermos um retângulo azul, escrevemos o número da posição à esquerda, da posição no topo, da largura e da altura. Mas no quinto valor de entrada vamos escrever `"blue"` entre aspas.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

O Jiki vai buscar a máquina à prateleira e põe moedas nas primeiras quatro fendas. Depois escreve blue numa folha de papel, põe essa folha na quinta fenda e põe a máquina a funcionar.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="O Jiki a inserir a folha com blue na quinta fenda da máquina rectangle, com as moedas 10, 20, 30 e 40 nas primeiras quatro fendas"
  width="500"
  height="392"
/>

String é uma daquelas palavras técnicas que ao início intimidam um bocadinho, mas na verdade quer dizer apenas texto. Vais habituar-te muito depressa. Não tem nada de mágico.
