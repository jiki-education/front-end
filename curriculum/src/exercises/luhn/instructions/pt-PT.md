---
title: "Luhn"
description: "Valida números de identificação, como cartões de crédito, com a soma de verificação de Luhn."
en_md5: 07b0aea3adc2353e50a26e5cbe5cd162
---

Acabámos de ver como validar os números ISBN dos livros. Existe outra fórmula comum usada para verificar números em muitos contextos: a fórmula de Luhn. É famosa sobretudo por apanhar gralhas em números de cartões de crédito.

### A verificação de Luhn

A verificação de Luhn tem vários passos:

- A começar no dígito **mais à direita** e a avançar para a esquerda, **duplica o valor de cada segundo dígito**.
- Se ao duplicar um dígito o resultado for maior do que 9, subtrai-lhe 9.
- Depois soma todos os dígitos.
- Se o total for divisível por 10, o número é válido.

Por exemplo, com `"067"` seguimos os passos:

```
0   6   7     // dígitos originais
0  12   7     // cada segundo dígito (a contar da direita) duplicado
0   3   7     // 12 é maior do que 9, por isso subtraímos 9 → 3
       10     // Somamos os dígitos
     true     // 10 é divisível por 10, por isso 067 é válido
```

### O teu trabalho

Cria uma função chamada `valid` (válido) que recebe uma string e devolve `true` se passar na verificação de Luhn e `false` se não passar.

Os números são dados como strings e podem conter espaços para facilitar a leitura (por exemplo `"4539 1488 0343 6467"`). Os espaços devem ser ignorados.

Algumas notas importantes:

- O valor de entrada pode conter espaços, deves ignorá-los.
- Se o valor de entrada contiver quaisquer outros carateres, deves devolver false.
- Strings com comprimento 1 ou menos (depois de retirar os espaços) **não** são válidas.

### Pôr em prática o que aprendeste.

Embora haja muitas formas de resolver este exercício, a solução que queremos que encontres usa um ciclo `for`.

Vais também precisar da função <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">`Number(str)`</a>, que apresentámos no exercício anterior.

Diverte-te!
