---
title: "Condicionais"
description: "Usar a palavra-chave `if` para executar um bloco de código apenas quando uma condição é verdadeira, como um segurança a decidir quem entra."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Há uma palavra-chave que nos ajuda a dizer ao Jiki para só fazer certas coisas em determinadas situações. Imagina que estás a escrever código para guardar a entrada de um bar, talvez sejas o segurança, e o Jiki só deve abrir a porta se a pessoa estiver vestida de forma adequada. Ou imagina que estás a escrever código em que és responsável por agitar a bandeira axadrezada no final de uma corrida, mas o Jiki precisa de saber que só o deve fazer na última volta. Nestes casos, vamos usar a palavra-chave `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="O Jiki como segurança a decidir se deixa as pessoas entrar na discoteca"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="O Jiki pronto para agitar a bandeira axadrezada no final de uma corrida"
  width="266"
  height="400"
/>

Usamos a palavra-chave `if` de uma forma muito parecida com a `repeat`. Colocamos alguma informação dentro de parênteses. Neste caso, essa informação é a condição (_condition_ em inglês) que estamos a verificar. E depois colocamos nas chavetas um bloco de código que só é executado se essa condição for verdadeira.

```javascript
if (condition) {
}
```

E como são estas condições? Bem, normalmente são algum tipo de comparação (_comparison_ em inglês). Comparamos dois números ou duas strings e verificamos se o resultado é verdadeiro ou falso.

Pensa nelas como afirmações (_statements_ em inglês) que podias dizer em voz alta. Três é menor que cinco. Isso é verdadeiro. Sete é menor que dois. Isso é falso.

Usamos símbolos para escrever estas comparações. Provavelmente já os conheces da matemática. Temos o menor que, o maior que, o menor ou igual, o maior ou igual, e temos também uma forma de verificar se duas coisas são iguais. E esta é um pouco diferente daquilo a que estás habituado, porque usamos três sinais de igual seguidos para ver se duas coisas são iguais ou diferentes.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Uma tabela de operadores de comparação: menor que, maior que, menor ou igual, maior ou igual, igual e diferente, com exemplos"
  width="449"
  height="400"
/>

E isso ajuda-nos a não confundir com os momentos em que estamos a definir ou a atualizar variáveis, em que usamos um sinal de igual para dizer "põe isto na caixa". Lembra-te: três sinais de igual para comparar.

Também podes comparar strings. Por exemplo, `"hello"` é igual a `"hello"`. Isso é verdadeiro. As duas strings são iguais. Mas cuidado, porque o Jiki compara cada caráter (_character_ em inglês) das duas strings, nos dois pedaços de papel. Por isso, `"Hello"` com H maiúsculo não é igual a `"hello"` com h minúsculo. São strings diferentes. Comparar essas duas daria falso, porque o H maiúsculo e o h minúsculo são carateres diferentes.

Já agora, o verdadeiro e o falso chamam-se _Booleans_ (booleanos), e essa é mais uma palavra com ar técnico. Mas é muito simples. É só uma forma formal de dizer que algo é verdadeiro ou falso. Por isso, se encontrares a palavra _Booleans_, significa apenas verdadeiro ou falso. Vamos ver isto em ação. Imagina que estamos a construir aquele segurança-robô para uma discoteca, e vamos dizer que o segurança só deve abrir a porta se a pessoa tiver 21 anos ou mais. Temos uma função `askAge` (perguntar a idade), que podemos usar para saber a idade de alguém, e vamos guardar o resultado numa variável chamada `age` (idade). Depois podemos dizer: se essa `age` for maior que 20, abrimos a porta. Portanto, se `askAge` devolver `30`, abrimos, e se devolver `12`, não abrimos.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="O Jiki a abrir a porta a alguém com idade suficiente e a recusar a entrada a alguém demasiado novo"
  width="410"
  height="400"
/>
