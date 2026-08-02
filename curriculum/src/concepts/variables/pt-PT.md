---
title: "Criar e usar variáveis"
description: "Caixas nas prateleiras do Jiki que guardam um valor com uma etiqueta, para o poderes ir buscar mais tarde no teu código."
en_md5: 6fca9aed7a4f51de337288e739f8b44a
---

As variáveis (_variables_ em inglês) são o que nos permite guardar informação. Quando estamos a programar, muitas vezes precisamos de guardar um número ou uma string para usar mais tarde, e as variáveis são a forma de o fazer. Vamos então afastar-nos um pouco no armazém do Jiki, e vais ver que ele tem outro conjunto de prateleiras. Já conhecemos o primeiro conjunto de prateleiras, o que tem as funções, aquelas pequenas máquinas como `move` e `rectangle`. Mas neste segundo conjunto de prateleiras, em vez de máquinas, podes ver muitas caixas, e estas caixas são o que chamamos variáveis. Podes dizer ao Jiki para guardar qualquer coisa nestas caixas e, mais tarde, pedir-lhe que a vá buscar. Cada caixa tem um nome, exatamente como as funções têm um nome, e cada caixa contém apenas uma coisa. Por agora, um número ou uma string. Mas mais à frente no curso vamos ver como guardar nelas coisas mais complexas.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Dois conjuntos de prateleiras no armazém do Jiki: um com a etiqueta funções, com máquinas, e outro com a etiqueta variáveis, com caixas"
  width="500"
  height="173"
/>

Então, como dizemos ao Jiki para criar uma caixa e pôr algo lá dentro? Usamos a palavra-chave `let` (deixar). A palavra-chave `let` diz ao Jiki que precisa de criar uma caixa nova. Podes imaginá-lo a desembalar uma caixa de cartão, a montá-la, e depois ele olha para o que vem a seguir à palavra `let`, e essa é a etiqueta que ele cola na caixa, neste caso, `name` (nome). Então pega na caneta e escreve `name` na etiqueta. Depois olha para o que vem a seguir ao sinal de igual (_equal sign_ em inglês). Neste caso, é o meu nome, `"Jeremy"`, e como `"Jeremy"` é uma string, ele pega num pedaço de papel e escreve `"Jeremy"` nele. É apenas uma string, exatamente igual às cores com que tens estado a trabalhar, e depois ele põe esse pedaço de papel dentro da caixa.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="O Jiki a segurar um pedaço de papel com a string Jeremy escrita, pronto para o pôr dentro da caixa"
  width="373"
  height="400"
/>

Portanto, dissemos-lhe para criar uma caixa, pôr-lhe uma etiqueta e guardar algo lá dentro, e agora ele vai pôr a caixa na prateleira. E depois, em qualquer outro momento do teu programa, o Jiki pode ir buscar essa caixa à prateleira e ver o que está lá dentro. Começa a construir este modelo mental. Eu programo há uma eternidade e, ainda hoje, quando escrevo código, imagino que estou a pôr algo numa caixa e que o vou buscar mais tarde. Quando vires a palavra-chave `let`, pensa mesmo: "Ok, isto quer dizer que estou a criar uma caixa nova."

Uma palavra sobre os nomes das variáveis, as etiquetas destas caixas. Temos algumas regras sobre eles. Primeiro, os nomes das variáveis não podem ter espaços. Se quiseres usar várias palavras na etiqueta de uma caixa, juntamos as palavras umas às outras e mudamos a primeira letra de cada palavra para maiúscula. Chamamos a isto _camel case_. Imagina as bossas de um camelo a empurrar para cima a primeira letra de cada nova palavra, tornando-a maiúscula. Por isso, se quiseres uma etiqueta que seja "my name" (meu nome), em vez de escreveres duas palavras separadas por um espaço, escrevemos tudo numa só palavra com o N maiúsculo: `myName`.

Além disso, o nome de cada variável tem de ser único. Não podes ter duas caixas com a mesma etiqueta, e as variáveis também não podem ter o mesmo nome que as funções. Se te esqueceres, o Jiki fica confuso e dá-te uma mensagem de erro.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="O Jiki com ar confuso a olhar para duas caixas que têm ambas a etiqueta name"
  width="485"
  height="400"
/>

Vamos então ver onde podemos querer usar uma variável. Imagina que estamos a desenhar um sol no céu. Sabemos que podemos usar a função `circle` (círculo) e dar-lhe quatro parâmetros de entrada: `left` (esquerda), `top` (topo), `radius` (raio) e `color` (cor). Mas à medida que desenhamos muitas coisas e temos todos estes números espalhados pelo código, pode tornar-se muito difícil de acompanhar e de ler. Em vez disso, podemos criar variáveis para cada um destes valores, left, top, `radius` e `color`, e depois usar essas variáveis mais tarde. O nosso objetivo final é conseguir usar a função `circle` com nomes de caixas claros e legíveis, e, quando o Jiki vir esses nomes, sabe que tem de ir buscar as caixas às prateleiras e usar o que estiver lá dentro.

Vamos então criar algumas variáveis para isto. Começamos pela posição esquerda do sol. Usamos a palavra-chave `let` para dizer ao Jiki para criar uma caixa nova chamada `leftPosition` (posição esquerda). Repara ali no _camel case_, com o P maiúsculo. E dizemos ao Jiki que número vai dentro da caixa. Ele põe-na nas prateleiras e depois faz o mesmo para `topPosition` (posição do topo), `radius` (raio) e `color` (cor).

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Caixas etiquetadas nas prateleiras das variáveis, cada uma a guardar um valor para o Jiki ir buscar mais tarde"
  width="500"
  height="378"
/>

Em qualquer momento do nosso código, podemos voltar a chamar estas variáveis, e o Jiki vai buscar os valores (_values_ em inglês) e coloca-os numa máquina. A outra grande vantagem das variáveis é que, sempre que quisermos desenhar algo na mesma posição do sol, podemos reutilizar as mesmas variáveis `leftPosition` e `topPosition`. Vê um exemplo diferente. Imagina que estás a construir uma parede com 30 tijolos e queres que todos os tijolos tenham a mesma largura e a mesma altura. É muito melhor criar variáveis para a largura e a altura no início do código e depois voltar a chamá-las ao longo do resto do código. Porque, se depois quiseres mudar a largura ou a altura, basta mudares num único sítio, e tudo o resto se atualiza.
