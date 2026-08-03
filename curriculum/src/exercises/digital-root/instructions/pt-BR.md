---
title: "Raiz Digital"
description: "Reduza um número a um único dígito somando os dígitos dele repetidamente."
en_md5: 9847d9ea8c4a86ad65869e4f7b4c718e
---

A raiz digital (_digital root_ em inglês) de um número é o que você obtém quando soma os dígitos dele repetidamente até sobrar um único dígito.

Se somar os dígitos uma vez ainda deixar mais de um dígito, você soma os dígitos _desse_ resultado, e continua até restar um único dígito.

Por exemplo, para encontrar a raiz digital de `942`:

```
9 + 4 + 2 = 15
1 + 5 = 6
```

Então a raiz digital de `942` é `6`.

Um número que já tem um único dígito (como `7`) é a própria raiz digital dele.

Crie uma função chamada `digitalRoot` que recebe um número e retorna a raiz digital dele.

### A função `String()`

Nas últimas lições, você teve acesso à função `Number(str)`, que converte uma string em um número.

Você pode fazer o mesmo ao contrário e transformar um número em uma string usando a função `String(num)`. Por exemplo:

```js
String(147) === "147"
```

De novo, repare que ela começa com letra maiúscula, e de novo, não se preocupe com o porquê por enquanto!

### Colocando em prática o que você aprendeu.

Embora existam muitas formas de resolver este exercício, a solução que queremos que você encontre usa um laço `while`.

Divirta-se!
