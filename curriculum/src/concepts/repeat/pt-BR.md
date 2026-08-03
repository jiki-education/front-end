---
title: "O laço repeat"
description: "Usando a palavra-chave `repeat` para dizer ao Jiki que rode o código dentro das chaves um número específico de vezes."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Até agora, tudo foi escrito de forma linear: o Jiki segue cada instrução na ordem, de cima para baixo.

Agora vamos ver como o Jiki pode sair desse fluxo rígido de cima para baixo. Mais especificamente, como podemos dizer ao Jiki que rode o mesmo trecho de código várias vezes seguidas.

Por exemplo, imagine que você está no labirinto e quer andar 10 passos para a frente. Existe uma função `walk` que ajuda com isso, mas e se ela não existisse? E se você só tivesse a função `move` (mover)?

Em vez de escrever `move` 10 vezes seguidas, o que fica bem repetitivo, precisamos de um jeito de dizer: "Ei, Jiki, faça a próxima coisa que eu disser 10 vezes.

`Move`."

Para fazer isso em código, precisamos usar a nossa primeira palavra-chave (_keyword_ em inglês). Palavras-chave são instruções que o Jiki entende. Elas se parecem um pouco com máquinas, mas não são. Quando o Jiki vê uma palavra-chave, ele não procura uma máquina na prateleira: ele simplesmente sabe o que fazer. Está gravado no cérebro dele. Existem cerca de 20 palavras-chave diferentes que vamos aprender ao longo do curso, e a primeira delas é a palavra-chave `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="O Jiki cercado por palavras-chave como repeat, if, else, and, or, com a observação de que palavras-chave são instruções que o Jiki entende"
  width="358"
  height="400"
/>

A palavra-chave `repeat` faz exatamente o que eu disse acima. Ela diz ao Jiki: "Repita este número de vezes o que eu disser a seguir." Dê uma olhada neste código. Primeiro, usamos a palavra-chave `repeat` para avisar ao Jiki que ele vai fazer algo várias vezes. Depois, colocamos entre parênteses quantas vezes queremos que o Jiki repita a coisa. E então temos as chaves (`{}`), e dentro delas ficam as coisas que queremos que o Jiki repita. Esse padrão é incrivelmente comum em programação: especificamos uma palavra-chave, geralmente com alguma informação (neste caso, o número de vezes que algo deve ser feito) e, em seguida, um bloco de código (_code block_ em inglês) entre chaves. Então, voltando ao mundo do labirinto, em vez de escrever `move`, `move`, `move`, `move`, podemos escrever "repita quatro vezes: `move`".

```javascript
repeat(4) {
  move()
}
```

O Jiki vai ver esse código e vai usar a máquina `move` quatro vezes seguidas.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="O Jiki usando a máquina move quatro vezes seguidas, uma após a outra"
  width="421"
  height="400"
/>

E não estamos limitados a ter só uma coisa dentro das chaves. O Jiki pode fazer várias coisas repetidamente. Podemos dizer ao Jiki para usar `move`, depois `turnLeft`, e repetir tudo isso quatro vezes. Se o Jiki vir esse código, ele vai usar a máquina `move`, depois a máquina `turnLeft`, depois a máquina `move`, depois a máquina `turnLeft`, depois a máquina `move`, e assim por diante, até ter feito as duas coisas quatro vezes.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="O Jiki usando a máquina move e depois a máquina turnLeft, repetindo o par de ações quatro vezes"
  width="500"
  height="390"
/>

Chamamos essas instruções de repetição de laços (_loops_ em inglês), e existem vários laços diferentes que podemos usar, cada um funcionando de um jeito um pouco diferente.

Tem mais uma coisa importante: manter o código limpo e organizado se torna essencial quando trabalhamos com laços. Quando o seu código tem uma boa estrutura visual, fica muito fácil ver o que está acontecendo. Mas se não tiver, se você esquecer de indentar direito ou misturar a indentação, as coisas ficam confusas bem rápido. Por isso, neste curso, temos uma regra. Você sempre coloca a chave de abertura na mesma linha da instrução (_statement_ em inglês) `repeat`. Você sempre coloca a chave de fechamento em uma linha própria, depois da instrução. E você sempre indenta o código entre elas com dois espaços. Assim tudo fica bem organizado. E se você esquecer ou tentar seguir outro padrão, vai dar erro.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="O Jiki apontando para a indentação e para a linha nova que mantêm o bloco de código de um laço organizado"
  width="500"
  height="398"
/>
