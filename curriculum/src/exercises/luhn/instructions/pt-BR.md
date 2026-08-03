---
title: "Luhn"
description: "Valide números de identificação, como os de cartões de crédito, usando a soma de verificação de Luhn."
en_md5: 07b0aea3adc2353e50a26e5cbe5cd162
---

Acabamos de ver como validar os números ISBN de livros. Existe outra fórmula bem comum, usada para conferir números em vários contextos: a fórmula de Luhn. Ela é famosa principalmente por detectar erros de digitação em números de cartão de crédito.

### A verificação de Luhn

A verificação de Luhn tem alguns passos:

- Começando pelo dígito **mais à direita** e indo para a esquerda, **dobre o valor de cada segundo dígito**.
- Se dobrar um dígito resultar em um número maior que 9, subtraia 9 dele.
- Depois, some todos os dígitos.
- Se o total for divisível por 10, o número é válido.

Por exemplo, com `"067"`, seguimos os passos:

```
0   6   7     // dígitos originais
0  12   7     // cada segundo dígito (a partir da direita) dobrado
0   3   7     // 12 é maior que 9, então subtraímos 9 → 3
       10     // Somamos os dígitos
     true     // 10 é divisível por 10, então 067 é válido
```

### Sua tarefa

Crie uma função chamada `valid` (válido) que recebe uma string e retorna `true` se ela passar na verificação de Luhn e `false` se não passar.

Os números são dados como strings e podem conter espaços para facilitar a leitura (por exemplo, `"4539 1488 0343 6467"`). Os espaços devem ser ignorados.

Algumas observações importantes:

- A entrada pode conter espaços; você deve ignorá-los.
- Se a entrada contiver qualquer outro caractere, você deve retornar false.
- Strings de comprimento 1 ou menos (depois de remover os espaços) **não** são válidas.

### Colocando em prática o que você aprendeu.

Embora existam muitas formas de resolver este exercício, a solução que queremos que você encontre usa um laço `for`.

Você também vai precisar da função <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">`Number(str)`</a>, que apresentamos no exercício anterior.

Divirta-se!
