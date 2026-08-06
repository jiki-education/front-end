---
title: "Arrays"
description: "Uma corrente ordenada de elementos (strings, números, Booleans ou qualquer outra coisa) mantidos juntos como um único valor que o Jiki pode passar de um lado para outro."
en_md5: d26ccb9e04fbc77129f3199d63a95017
---

Você já vem usando números, strings e Booleans (o nome técnico para verdadeiro e falso), e chamamos isso de diferentes tipos de dados (_data types_ em inglês). Agora vamos adicionar o nosso primeiro tipo de dado composto (_compound data type_ em inglês).

É um tipo de dado que pode conter várias coisas, não só uma coisa, e esse tipo de dado se chama _array_ (vetor, em português).

Quando você ouvir a palavra array, quero que pense em uma corrente segurando várias coisas juntas.

Essas coisas que ela segura podem ser qualquer coisa: strings, números, Booleans, até outros arrays, até coisas que você ainda não aprendeu, mas não vamos nos preocupar com isso por enquanto.

Tudo nessa corrente está em ordem: a ordem em que as coisas foram presas umas às outras.

Então um array contém várias coisas, mas é uma coisa só, uma unidade: um único array com vários elementos dentro dele.

O Jiki pode pegar esse array, essa corrente, e colocar em uma caixa, do mesmo jeito que ele coloca uma string em uma caixa ou um número em uma caixa.

Ele pode colocá-lo na fenda de uma máquina. Pode puxá-lo da boca da máquina. O array é uma coisa só, e o Jiki trabalha com ele exatamente do mesmo jeito que trabalha com strings, números e tudo o mais que você viu até agora.

Agora, no código, um array também se parece um pouco com uma corrente. Ele tem um colchete em cada ponta e, entre eles, vários itens encadeados uns aos outros, separados por vírgulas.

Então, por exemplo, se quiséssemos criar um array com os nomes de alguns dos nossos mentores, poderíamos montar uma caixa chamada `mentors` (mentores) e colocar essa corrente dentro dela.

Escreveríamos `let mentors =`, exatamente como fazemos com qualquer outra caixa, e depois viria um colchete de abertura, vários elementos, os nomes separados por vírgulas, e por fim um colchete de fechamento. Quando o Jiki vê isso, ele vai buscar quatro pedaços de papel, um para cada nome, depois pega uma corrente nova e prende todos eles juntos, e então coloca essa corrente na caixa `mentors`.

Você pode colocar qualquer coisa em um array: strings, números, Booleans, até uma mistura de coisas.

Estes são todos exemplos diferentes de arrays totalmente válidos.

Você também pode criar um array vazio. É só uma corrente sem elementos. Ainda é uma coisa de verdade. Ainda tem as duas pontas. Ainda é uma corrente. Só não tem nenhum item dentro. Mas você ainda pode colocar esse array vazio dentro de uma caixa, tirar de lá e usar mais tarde.

Então você pode criar um array usando a sintaxe de colchetes, mas como a gente usa esses arrays na prática? Como verificamos o que tem dentro deles e tiramos coisas de lá? Bom, exatamente do mesmo jeito que fizemos quando queríamos tirar letras de uma string. Podemos usar a sintaxe de colchetes com números dentro.

Então vamos voltar à nossa lista de mentores. Se quisermos pegar o primeiro, escrevemos `mentors[0]`. Lembre-se de que em JavaScript contamos a partir do zero.

E também podemos iterar sobre um array exatamente do mesmo jeito que iteramos sobre strings antes, usando `for-of`.

Os arrays funcionam exatamente da mesma forma. A única diferença é que desta vez, em vez de pegar uma letra, pegamos o item que estiver no array. Neste exemplo, o nome do mentor.

Então, na primeira vez que agradecemos a alguém, agradecemos a `"DJ"`. Na segunda, agradecemos a `"Becky"`, e assim por diante.

Também podemos usar a propriedade `length` em arrays, do mesmo jeito que aprendemos com as strings. Se tivermos um array com quatro strings na caixa `mentors` e escrevermos `mentors.length`, ele vai retornar quatro.

E também podemos usar `includes` exatamente da mesma forma em arrays. Podemos escrever `mentors.includes("DJ")`, e vai retornar `true`. Mas se escrevermos `mentors.includes("Frank")`, vai retornar `false`.

Tudo funciona exatamente como nas strings. A diferença é que estamos trabalhando com os elementos de um array, não com as letras de uma string.
