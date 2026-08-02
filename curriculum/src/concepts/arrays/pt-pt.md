---
title: "Arrays"
description: "Uma corrente ordenada de elementos (strings, números, Booleans ou qualquer outra coisa) unidos num só valor que o Jiki pode transportar."
en_md5: 012da550948ba2ebcfaf953cd0906f3f
---

Tens usado números, strings e Booleans, o nome pomposo para verdadeiro e falso, e chamamos a estas coisas diferentes tipos de dados (_data types_ em inglês). Agora vamos acrescentar o nosso primeiro tipo de dados composto (_compound data type_ em inglês).

É um tipo de dados que pode conter várias coisas, não apenas uma, e chama-se _array_ (_vetor_).

Quando ouvires a palavra array, quero que penses numa corrente física que segura muitas coisas juntas.

Essas coisas que a corrente segura podem ser qualquer coisa: strings, números, Booleans, até outros arrays, até coisas que ainda não aprendeste. Mas não te preocupes com isso por agora.

Tudo nesta corrente está por ordem, a ordem em que as coisas foram encadeadas.

Portanto, um array contém muitas coisas, mas é um elemento sólido, uma coisa só: um array com muitos elementos lá dentro.

O Jiki pode pegar nesse array, nessa corrente, e pô-la numa caixa, tal como pode pôr uma string numa caixa ou um número numa caixa.

Pode inseri-la na fenda de uma máquina. Pode tirá-la da calha de saída. Este array é uma coisa só, e o Jiki trabalha com ele exatamente da mesma forma que trabalha com strings, números e tudo o resto que viste até agora.

Ora, em código, um array também se parece um pouco com uma corrente. Tem um parêntese reto em cada ponta e depois muitos itens encadeados, separados por vírgulas.

Por exemplo, se quiséssemos criar um array com os nomes de alguns membros do nosso bootcamp, podíamos montar uma caixa chamada `mentors` (mentores) e pôr essa corrente lá dentro.

Escreveríamos `let mentors =`, exatamente como fazemos com qualquer outra caixa, e depois um parêntese reto de abertura, muitos elementos, os nomes separados por vírgulas, e por fim um parêntese reto de fecho. Quando o Jiki vê isto, vai buscar quatro pedaços de papel, um para cada nome, depois arranja uma corrente nova e prende-os todos nela, e a seguir põe essa corrente na caixa `mentors`.

Podes pôr qualquer coisa num array: strings, números, Booleans, até uma mistura de coisas.

Estes são todos exemplos diferentes de arrays perfeitamente válidos.

Também podes criar um array vazio. É só uma corrente sem elementos. Continua a ser uma coisa real. Continua a ter as duas pontas. Continua a ser uma corrente. Só que não tem itens lá dentro. Mas mesmo assim podes pôr este array vazio dentro de uma caixa, tirá-lo de lá e usá-lo mais tarde.

Portanto, podes criar um array com a sintaxe dos parênteses retos, mas como é que os usamos de facto? Como é que vemos o que está lá dentro e tiramos coisas de lá? Bem, exatamente da mesma forma que fizemos quando queríamos tirar letras de uma string. Podemos usar a sintaxe dos parênteses retos com números lá dentro.

Voltemos então à nossa lista de mentores. Se quisermos tirar o primeiro, escrevemos `mentors[0]`. Lembra-te de que em JavaScript contamos a partir do zero.

E também podemos percorrer um array exatamente da mesma forma que percorremos strings antes, com o `for-of`.

Os arrays funcionam exatamente da mesma maneira. A única diferença é que desta vez, em vez de tirarmos uma letra, tiramos o item que estiver no array. Neste exemplo, o nome do mentor.

Assim, na primeira vez que agradecemos a alguém, agradecemos a `"DJ"`. Na segunda, agradecemos a `"Becky"`, e assim por diante.

Também podemos usar a propriedade `length` nos arrays, tal como aprendemos nas strings. Se tivermos um array com quatro strings na caixa `mentors` e escrevermos `mentors.length`, devolve quatro.

E também podemos usar o `includes` exatamente da mesma forma nos arrays. Podemos escrever `mentors.includes("DJ")`, e devolve `true`. Mas se escrevermos `mentors.includes("Frank")`, devolve `false`.

Tudo funciona exatamente como nas strings. Só que aqui trabalhamos com os elementos de um array, não com as letras de uma string.
