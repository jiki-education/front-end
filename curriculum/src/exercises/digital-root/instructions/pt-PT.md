---
title: "Raiz Digital"
description: "Reduz um número a um único algarismo somando repetidamente os seus algarismos."
en_md5: 9847d9ea8c4a86ad65869e4f7b4c718e
---

A raiz digital (_digital root_ em inglês) de um número é o que obténs quando somas os seus algarismos repetidamente até restar apenas um algarismo.

Se somares os algarismos uma vez e ainda ficares com mais do que um algarismo, somas os algarismos _desse_ resultado, e continuas até restar um único algarismo.

Por exemplo, para encontrar a raiz digital de `942`:

```
9 + 4 + 2 = 15
1 + 5 = 6
```

Portanto, a raiz digital de `942` é `6`.

Um número que já tem um único algarismo (como `7`) é a sua própria raiz digital.

Cria uma função chamada `digitalRoot` que recebe um número e devolve a sua raiz digital.

### A função `String()`

Nas últimas lições tiveste acesso à função `Number(str)`, que converte uma string num número.

Podes fazer o mesmo ao contrário e transformar um número numa string com a função `String(num)`. Por exemplo:

```js
String(147) === "147"
```

Mais uma vez, repara que começa com uma letra maiúscula e, mais uma vez, não te preocupes com o porquê para já!

### Pôr em prática o que aprendeste.

Embora haja muitas formas de resolver este exercício, a solução que queremos que encontres usa um ciclo `while`.

Diverte-te!
