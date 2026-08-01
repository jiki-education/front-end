---
title: "Ciclo repeat"
description: "Usar a palavra-chave `repeat` para dizer ao Jiki que execute o código dentro das chavetas um número específico de vezes."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Até agora, tudo foi escrito de forma linear: o Jiki segue cada instrução por ordem, de cima para baixo.

Agora vamos ver como o Jiki pode sair deste fluxo rígido de cima para baixo e, em concreto, como lhe podemos dizer que execute a mesma secção de código muitas vezes seguidas.

Por exemplo, imagina que estás no labirinto e queres avançar 10 passos. Existe uma função `walk` para ajudar com isso, mas e se ela não existisse? E se só tivesses a função `move` (mover)?

Em vez de escrever `move` 10 vezes seguidas, o que se torna muito repetitivo, o que precisamos de conseguir dizer é: "Ei, Jiki, faz 10 vezes a próxima coisa que eu disser.

`Move`."

Para fazer isto em código, precisamos de usar a nossa primeira palavra-chave (_keyword_ em inglês), e as palavras-chave são instruções que o Jiki entende. Parecem um pouco máquinas, mas não são. Quando o Jiki vê uma palavra-chave, não procura uma máquina na prateleira; sabe simplesmente o que fazer. Está-lhe gravado no cérebro. Há cerca de 20 palavras-chave diferentes que vamos aprender ao longo do curso, e a primeira delas é a palavra-chave `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="O Jiki rodeado de palavras-chave como repeat, if, else, and, or, com a nota de que as palavras-chave são instruções que o Jiki entende"
  width="358"
  height="400"
/>

A palavra-chave `repeat` faz exatamente o que eu disse acima. Diz ao Jiki: "Repete este número de vezes o que eu disser a seguir." Olha para este código. Primeiro, usamos a palavra-chave `repeat` para dizer ao Jiki que ele vai fazer algo várias vezes. Depois pomos entre parênteses normais quantas vezes queremos que o Jiki repita a coisa, e a seguir temos estas chavetas, e dentro dessas chavetas estão as coisas que queremos que o Jiki repita. Este padrão é incrivelmente comum em programação. Especificamos uma palavra-chave, geralmente com alguma informação, como neste caso o número de vezes que algo deve ser feito, e depois um bloco de código (_code block_ em inglês) entre chavetas. Voltando ao mundo do labirinto, em vez de escrever `move`, `move`, `move`, `move`, podemos escrever "repete quatro vezes `move`".

```javascript
repeat(4) {
  move()
}
```

O Jiki vai ver esse código e vai usar a máquina `move` quatro vezes seguidas.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="O Jiki a usar a máquina move quatro vezes seguidas, uma após outra"
  width="421"
  height="400"
/>

E também não estamos limitados a ter só uma coisa dentro dessas chavetas. O Jiki pode fazer várias coisas repetidamente. Podemos dizer ao Jiki que faça `move`, depois `turnLeft`, e que repita tudo isso quatro vezes. Se o Jiki vir este código, vai usar a máquina `move`, depois a máquina `turnLeft`, depois a máquina `move`, depois a máquina `turnLeft`, depois a máquina `move`, e assim por diante, até ter feito as duas quatro vezes.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="O Jiki a usar a máquina move e depois a máquina turnLeft, repetindo o par de ações quatro vezes"
  width="500"
  height="390"
/>

Chamamos ciclos (_loops_ em inglês) a estas instruções de repetição, e há muitos ciclos diferentes que podemos usar, todos a funcionar de maneira ligeiramente diferente.

Há mais uma coisa a saber: manter o teu código limpo e arrumado torna-se essencial quando trabalhas com ciclos. Quando o teu código tem uma boa estrutura visual, é muito fácil ver o que está a acontecer. Mas se não tiver, se te esqueceres de indentar bem as coisas ou misturares a indentação, tudo fica confuso muito depressa. Por isso, neste curso temos sempre uma regra. Pões sempre a chaveta de abertura na mesma linha da instrução (_statement_ em inglês) `repeat`. Pões sempre a chaveta de fecho numa linha própria depois da instrução, e indentas sempre o código entre elas com dois espaços. Assim tudo fica bem arrumado, e se te esqueceres ou tentares seguir outro padrão, vais ter um erro.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="O Jiki a apontar para a indentação e para a nova linha que mantêm o bloco de código de um ciclo arrumado"
  width="500"
  height="398"
/>
