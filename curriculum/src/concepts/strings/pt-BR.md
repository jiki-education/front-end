---
title: "Strings"
description: "Pedaços de texto entre aspas (uma letra, uma palavra, uma frase ou um parágrafo inteiro) que o Jiki escreve em papel."
en_md5: 89b04f3849f9388a46734924f35c913c
---

Quando você quer usar um número, basta literalmente escrever esse número, e o Jiki entende o que você quer dizer. Mas e se você quiser usar uma letra, uma palavra ou uma frase? Por exemplo, com a função `rectangle` (retângulo) ou a função `circle` (círculo), e se existisse uma entrada extra onde você especificasse a cor? Como escreveríamos a cor para colocá-la na máquina? Se escrevermos só a palavra `green` (verde) ou `blue` (azul), o Jiki vai achar que estamos falando de uma máquina nas prateleiras, e vai dizer: "Não existe nenhuma máquina chamada green. Não sei o que fazer."

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki parado, confuso, ao lado da máquina rectangle, com pontos de interrogação sobre a cabeça"
  width="446"
  height="400"
/>

Então temos uma regra: sempre que precisamos usar texto, precisamos colocá-lo entre aspas, aspas duplas. E quando você faz a citação de algo desse jeito, o Jiki pega um pedaço de papel e escreve nele o que estiver entre as aspas. Esses pedaços de papel são o que chamamos de _strings_ (cadeias de caracteres).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki escrevendo a palavra green em um pedaço de papel, que se torna uma string"
  width="398"
  height="400"
/>

Strings podem ser desde letras isoladas, palavras, frases, parágrafos, até livros inteiros. A regra é: se é texto, colocamos entre aspas, e vira uma string.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Um quadro mostrando strings de diferentes tamanhos entre aspas: uma letra, uma palavra, uma frase e um endereço de várias linhas"
  width="500"
  height="398"
/>

Então, se quisermos um retângulo azul, escrevemos o número da posição esquerda, da posição do topo, da largura e da altura. Mas no quinto valor de entrada vamos escrever `"blue"` entre aspas.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

O Jiki vai pegar a máquina na prateleira e colocar algumas moedas nas quatro primeiras fendas. Depois, vai escrever blue em um pedaço de papel, colocar esse papel na quinta fenda e girar a manivela.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki colocando o papel com blue na quinta fenda da máquina rectangle, com as moedas 10, 20, 30 e 40 nas quatro primeiras fendas"
  width="500"
  height="392"
/>

String é uma daquelas palavras técnicas que assustam um pouco no começo, mas, na verdade, significa apenas texto. Você vai se acostumar rapidinho. Não tem nada de mágico nisso.
