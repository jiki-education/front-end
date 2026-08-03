---
title: "Ciclos for"
description: "Um ciclo com três partes (um inicializador, uma condição e um incremento) que te dá controlo total sobre a iteração."
en_md5: e96f2e5a4106a88cfbca449c93a26108
---

Talvez te lembres de que o ciclo repeat não existe realmente em JavaScript. É apenas algo que acrescentámos para te facilitar a vida enquanto damos os primeiros passos.

Então, o que usamos em vez disso? Bem, usamos um ciclo `for` normal, que tem este aspeto.

```javascript
for (let i = 0; i < 5; i++) {
  // ...
}
```

Consegues perceber porque é que isto podia ter sido um pouco intimidante logo no primeiro dia.

Mas agora já tens todo o conhecimento de que precisas para te sentires à vontade com isto. Por isso, vamos analisá-lo por partes.

Um ciclo for tem três componentes: um inicializador (_initializer_ em inglês), uma condição e um incremento (_increment_ em inglês).

O inicializador, esta parte do `let i = 0`, corre no início do ciclo inteiro. Corre só uma vez e, aqui, cria uma caixa chamada `i` com o valor zero. O `i` é só uma letra usada para acompanhar um valor ao longo do ciclo e, por tradição, usa-se `i` ou `x` para isto.

A parte seguinte, a condição, corre antes de cada iteração do ciclo.

Se a condição for verdadeira, corremos o ciclo outra vez.

Se não for, não corremos.

E, por fim, vem o incremento, o `i++`.

`i++` significa exatamente o mesmo que `i = i + 1`. É só uma abreviatura, uma forma de aumentar o `i` em um a cada volta.

Então, neste exemplo, definimos o `i` como zero. Verificamos se o `i` é menor do que dois, e é, por isso corremos o ciclo.

E depois, no fim, aumentamos o `i` em um, e o `i` passa a ser um. Zero mais um é um.

E voltamos a começar. Verificamos se um é menor do que dois.

É, por isso corremos o ciclo. E, no fim, aumentamos o `i` outra vez. Agora é dois: um mais um é igual a dois.

```javascript
i = 0
i < 2 // true - corre o ciclo
...   // Faz a iteração
i = i + 1 // 1

i < 2 // true - corre o ciclo
...   // Faz a iteração
i = i + 1 // 2

i < 2 // false - sai do ciclo
```

E depois vamos à terceira volta. Desta vez verificamos se dois é menor do que dois, e não é, por isso não corremos o ciclo. Aliás, o ciclo terminou mesmo. Passamos simplesmente ao código que vem a seguir. Ou seja, corremos o ciclo duas vezes, e isso é útil de saber. Desde que comecemos em zero e tenhamos uma condição `i < n`, o número `n` é o número de vezes que o ciclo vai correr.

Portanto, isto é o mesmo que dizer repeat two.

Não é difícil, mas é bastante mais rebuscado do que escrever apenas repeat two. A vantagem de um ciclo for é que podes fazer o que quiseres nesses três espaços. Podes começar num número diferente, aumentar a contagem em mais do que um de cada vez, contar para trás, ou usar uma condição que dependa de outra coisa que não um simples contador. É essa flexibilidade que faz dos ciclos for a ferramenta de eleição do JavaScript.
