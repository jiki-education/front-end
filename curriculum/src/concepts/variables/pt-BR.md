---
title: "Criando e usando variáveis"
description: "Caixas nas prateleiras do Jiki que guardam um valor com uma etiqueta, para você pegar de volta depois no seu código."
en_md5: 6fca9aed7a4f51de337288e739f8b44a
---

As variáveis (_variables_ em inglês) são o que nos permite guardar informações. Quando estamos programando, muitas vezes precisamos guardar algum número ou alguma string para usar depois, e as variáveis são como fazemos isso. Então vamos nos afastar um pouco no galpão do Jiki, e você vai ver que ele tem outro conjunto de prateleiras. Já conhecemos as primeiras prateleiras, que guardam as funções, aquelas maquininhas como `move` e `rectangle`. Mas nessas segundas prateleiras, em vez de máquinas, você pode ver um monte de caixas, e essas caixas são o que chamamos de variáveis. Você pode pedir ao Jiki para guardar qualquer coisa nessas caixas e, mais tarde, pedir para ele tirar de lá de novo. Cada caixa tem um nome, exatamente como as funções têm um nome, e cada caixa contém só uma coisa. Por enquanto, um número ou uma string. Mas vamos ver como guardar coisas mais complexas nelas mais adiante no curso.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Dois conjuntos de prateleiras no galpão do Jiki: um com a etiqueta funções, guardando máquinas, e outro com a etiqueta variáveis, guardando caixas"
  width="500"
  height="173"
/>

Então, como dizemos ao Jiki para fazer uma caixa e colocar algo dentro dela? Usamos a palavra-chave `let` (deixe). A palavra-chave `let` diz ao Jiki que ele precisa fazer uma caixa nova. Você pode imaginar ele desembalando uma caixa de papelão, montando tudo e, então, olhando o que vem depois da palavra `let`: essa é a etiqueta que ele cola na caixa, neste caso, `name` (nome). Então ele pega a caneta e escreve `name` na etiqueta. Depois, ele olha o que vem depois do sinal de igual (_equal sign_ em inglês). Neste caso, é o meu nome, `"Jeremy"`, e como `"Jeremy"` é uma string, ele pega um pedaço de papel e escreve `"Jeremy"` nele. É só uma string, exatamente igual às cores com que você vem trabalhando, e então ele coloca esse pedaço de papel dentro da caixa.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki segurando um pedaço de papel com a string Jeremy escrita nele, pronto para colocá-lo na caixa"
  width="373"
  height="400"
/>

Então dissemos a ele para fazer uma caixa, colocar uma etiqueta nela e guardar algo dentro, e agora ele vai lá e coloca a caixa na prateleira. E depois, em qualquer outro momento do seu programa, o Jiki pode buscar essa caixa na prateleira e olhar o que tem dentro. Comece a construir esse modelo mental. Eu programo há muito tempo e, até hoje, quando escrevo código, imagino que estou colocando algo numa caixa e que vou tirar de lá depois. Quando você vir a palavra-chave `let`, pense de verdade: "Certo, isso significa que estou fazendo uma caixa nova."

Uma observação sobre os nomes das variáveis, as etiquetas dessas caixas. Temos algumas regras sobre esses nomes. Primeiro, nomes de variáveis não podem ter espaços. Se você quiser usar várias palavras na etiqueta de uma caixa, juntamos as palavras umas nas outras e trocamos a primeira letra de cada palavra por uma maiúscula. Chamamos isso de camel case. Imagine as corcovas de um camelo empurrando para cima a primeira letra de cada palavra nova até virar maiúscula. Então, se você quiser uma etiqueta que seja "meu nome", em vez de escrever duas palavras com espaço, escrevemos tudo como uma palavra só, com a segunda inicial maiúscula: `myName`.

Além disso, cada nome de variável precisa ser único. Você não pode ter duas caixas com a mesma etiqueta, e as variáveis também não podem ter o mesmo nome que as funções. Se você esquecer, o Jiki vai ficar confuso e vai te dar uma mensagem de erro.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki olhando confuso para duas caixas que têm a mesma etiqueta name"
  width="485"
  height="400"
/>

Então vamos ver onde podemos querer usar uma variável. Digamos que estamos desenhando um sol no céu. Sabemos que podemos usar a função `circle` (círculo) e dar quatro entradas a ela: `left` (esquerda), `top` (topo), `radius` (raio) e `color` (cor). Mas, à medida que desenhamos várias coisas e ficamos com todos esses números espalhados pelo código, pode ficar bem difícil de acompanhar e de ler. Então, em vez disso, podemos criar variáveis para cada um deles: `left`, `top`, `radius` e `color`, e depois nos referir a essas variáveis. Nosso objetivo final aqui é conseguir usar a função `circle` passando nomes de caixas claros e legíveis, e, quando o Jiki vir esses nomes, ele vai saber que precisa pegar as caixas nas prateleiras e usar o que estiver dentro delas.

Então vamos criar algumas variáveis para isso. Começamos com a posição da esquerda do sol. Usamos a palavra-chave `let` para dizer ao Jiki para criar uma caixa nova chamada `leftPosition` (posição da esquerda). Repare no camel case, com o P maiúsculo. E dizemos ao Jiki que número vai dentro da caixa. Ele coloca a caixa nas prateleiras e depois faz o mesmo para `topPosition` (posição do topo), `radius` e `color`.

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
  alt="Caixas etiquetadas nas prateleiras de variáveis, cada uma guardando um valor para o Jiki buscar depois"
  width="500"
  height="378"
/>

Em qualquer momento do nosso código, podemos nos referir de novo a essas variáveis, e o Jiki vai tirar os valores (_values_ em inglês) das caixas e colocá-los numa máquina. A outra grande vantagem das variáveis é que, sempre que quisermos desenhar algo na mesma posição do sol, podemos reutilizar as mesmas variáveis `leftPosition` e `topPosition`. Veja um exemplo diferente. Imagine que você está construindo um muro com 30 tijolos e quer que todos os tijolos tenham a mesma largura e a mesma altura. É muito melhor criar variáveis para a largura e a altura no começo do código e depois se referir a elas no resto do código todo. Porque, se você quiser mudar a largura ou a altura, basta mudar num lugar só, e todo o resto se atualiza.
