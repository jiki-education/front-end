---
title: "Laços `for`"
description: "Um laço com três partes (um inicializador, uma condição e um incremento) que dá a você controle total sobre a iteração."
en_md5: e96f2e5a4106a88cfbca449c93a26108
---

Você deve lembrar que o laço repeat não existe de verdade no JavaScript. Ele é só algo que adicionamos para facilitar um pouco a sua vida no começo.

E o que usamos no lugar dele? Bom, usamos um laço `for` normal, que é assim.

```javascript
for (let i = 0; i < 5; i++) {
  // ...
}
```

Dá para entender por que isso teria sido um pouco intimidador para você no primeiro dia.

Mas agora você tem todo o conhecimento necessário para ficar à vontade com isso. Então vamos destrinchar.

Um laço `for` tem três componentes: um inicializador (_initializer_ em inglês), uma condição e um incremento (_increment_ em inglês).

O inicializador, essa parte do `let i = 0`, roda no início do laço inteiro. Ele roda uma única vez e, aqui, cria uma caixa chamada `i` com o valor zero. `i` é só uma letra usada para acompanhar um valor enquanto o laço roda, e tradicionalmente usamos `i` ou `x` para isso.

A parte seguinte, a condição, roda toda vez, antes de cada iteração do laço.

Se a condição é verdadeira, rodamos o laço de novo.

Se não é, não rodamos.

E, por fim, vem o incremento, o `i++`.

`i++` significa o mesmo que `i = i + 1`. É só uma forma abreviada, um jeito de aumentar `i` em um a cada vez.

Então, neste exemplo, definimos `i` como zero. Verificamos se `i` é menor que dois, e é, então rodamos o laço.

E aí, no final, aumentamos `i` em um, então `i` vira um. Zero mais um é um.

E vamos de novo. Verificamos se um é menor que dois.

É, então rodamos o laço. E, no final, aumentamos `i` de novo. Agora ele é dois: um mais um é igual a dois.

```javascript
i = 0
i < 2 // true - roda o laço
...   // Faz a iteração
i = i + 1 // 1

i < 2 // true - roda o laço
...   // Faz a iteração
i = i + 1 // 2

i < 2 // false - sai do laço
```

E então vamos uma terceira vez. Dessa vez, verificamos se dois é menor que dois, e não é, então não rodamos o laço. Na verdade, terminamos com o laço: simplesmente seguimos para qualquer código que vier abaixo. Ou seja, rodamos o laço duas vezes, e isso é uma coisa útil de saber. Desde que a gente comece em zero e tenha uma condição `i < n`, o número `n` é a quantidade de vezes que o laço vai rodar.

Então isso é o mesmo que dizer repeat dois.

Não é difícil, mas é bem mais enrolado do que simplesmente escrever repeat dois. A vantagem do laço `for` é que você pode fazer qualquer coisa nesses três espaços. Você pode começar em outro número, aumentar mais de um por vez, contar para trás, ou usar uma condição que depende de outra coisa além de um simples contador. É essa flexibilidade que faz do laço `for` o pau para toda obra do JavaScript.
