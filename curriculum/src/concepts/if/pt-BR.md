---
title: "Condicionais"
description: "Como usar a palavra-chave `if` para executar um bloco de código só quando uma condição é verdadeira, como um segurança decidindo quem entra."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Existe uma palavra-chave que nos ajuda a dizer ao Jiki para fazer as coisas só em certas situações. Talvez você esteja escrevendo um código para guardar a entrada de um bar, talvez você seja o segurança, e o Jiki só deva abrir a porta se a pessoa estiver vestida adequadamente. Ou talvez você esteja escrevendo um código em que é responsável por agitar a bandeira quadriculada no fim de uma corrida, mas o Jiki precisa saber que só deve fazer isso na última volta. Nesse tipo de situação, vamos usar a palavra-chave `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki como segurança decidindo se deixa as pessoas entrarem na balada"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki pronto para agitar a bandeira quadriculada no fim de uma corrida"
  width="266"
  height="400"
/>

Usamos a palavra-chave `if` de um jeito muito parecido com a `repeat`. Colocamos alguma informação entre parênteses. Nesse caso, essa informação é a condição (_condition_ em inglês) que estamos verificando. E depois colocamos entre chaves um bloco de código que só executamos se essa condição for verdadeira.

```javascript
if (condition) {
}
```

E como são essas condições? Bom, normalmente elas são algum tipo de comparação (_comparison_ em inglês). Comparamos dois números ou duas strings e verificamos se o resultado é verdadeiro ou falso.

Pense nelas como afirmações (_statements_ em inglês) que você poderia dizer em voz alta. Três é menor que cinco. Isso é verdadeiro. Sete é menor que dois. Isso é falso.

Usamos símbolos para escrever essas comparações. Você provavelmente já conhece vários deles da matemática. Temos menor que, maior que, menor ou igual a, maior ou igual a, e também temos uma verificação para saber se duas coisas são iguais. E essa é um pouco diferente do que você costuma ver, porque usamos três sinais de igual seguidos para verificar se duas coisas são iguais ou diferentes.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Uma tabela de operadores de comparação: menor que, maior que, menor ou igual, maior ou igual, igual e diferente, com exemplos"
  width="449"
  height="400"
/>

Isso ajuda a gente a não se confundir na hora de definir ou atualizar variáveis, quando usamos um sinal de igual para dizer “coloque isto na caixa”. É só lembrar: três sinais de igual para comparar.

Você também pode comparar strings. Então `"hello"` é igual a `"hello"`. Isso é verdadeiro. As duas strings são iguais. Mas tome cuidado aqui, porque o Jiki compara cada caractere (_character_ em inglês) das duas strings, nos dois pedaços de papel. Então `"Hello"` com H maiúsculo não é igual a `"hello"` com h minúsculo. São strings diferentes. Comparar as duas daria falso, porque o H maiúsculo e o h minúsculo são caracteres diferentes.

Ah, e a propósito: verdadeiro e falso são chamados de _Booleans_ (booleanos), que é mais uma palavra com cara de termo técnico. Mas é bem simples. É só um jeito formal de dizer que algo é verdadeiro ou falso. Então, se você encontrar a palavra Booleans por aí, ela só quer dizer verdadeiro ou falso. Vamos ver isso em ação. Imagine que estamos construindo aquele segurança robô para uma balada, e vamos dizer que o segurança só deve abrir a porta se a pessoa tiver 21 anos ou mais. Então temos uma função `askAge` (perguntar a idade), que podemos usar para descobrir a idade de alguém, e vamos guardar o resultado dela em uma variável chamada `age` (idade). Depois podemos dizer: se essa `age` for maior que 20, abrimos a porta. Então, se `askAge` retornar `30`, abrimos, e se retornar `12`, não abrimos.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki abrindo a porta para alguém com idade suficiente e recusando a entrada de alguém jovem demais"
  width="410"
  height="400"
/>
