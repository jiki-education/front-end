---
title: "Dicionários"
description: "Uma folha de caderno espiral em que cada entrada tem uma chave à esquerda e o valor dela à direita, dando a você dados com rótulos em vez de uma lista."
en_md5: b8a26ad63301df1d00ce08e1e429cf05
---

Arrays são a nossa primeira escolha quando temos uma lista de qualquer coisa: uma lista de mentores, uma lista de pontuações, uma lista de ingredientes. Se é uma lista, você vai querer usar um array.

Mas existe outra estrutura de dados (_data structure_ em inglês) que também é muito comum, para quando você quer algo um pouco mais complexo do que uma lista.

Imagine que queremos guardar algumas informações sobre mim: meu nome, minha idade, onde eu nasci. Você poderia usar um array para isso, mas não fica muito claro o que está acontecendo quando você faz assim.

Inglaterra é onde eu nasci ou onde eu moro? 42 é a minha idade ou outra coisa?

E, se eu quiser usar isso, tenho que lembrar que a primeira posição é para o nome, a segunda é para a idade, a terceira é para o lugar de nascimento. Fica tudo meio bagunçado, e fica bagunçado porque isso não é bem uma lista de coisas. É algo mais complexo do que isso. E é aí que entram os dicionários (_dictionaries_ em inglês). Um dicionário é um novo tipo de estrutura de dados. É a sua quinta: você já tem strings, números, Booleans, arrays e, agora, dicionários.

E quero que você pense em um dicionário como uma folha de um caderno espiral.

Do lado esquerdo, você tem os títulos, as palavras `"name"`, `"age"`, `"birthplace"`, e chamamos esses títulos de chaves (_keys_ em inglês).

E do lado direito, ao lado de cada título, você tem os dados de verdade, `"Jeremy"`, `42`, `"England"`, e chamamos esses dados de valores (_values_ em inglês).

Assim como um array, um dicionário é uma coisa só. É uma página de um caderno. E, assim como acontece com os arrays, o Jiki pode colocar um dicionário em uma variável, em uma caixa, ou como uma entrada para uma função, ou pode tirar um dicionário da boca da máquina. Então, é assim que um dicionário aparece no código. Usamos um par de chaves (`{}`) para marcar o início e o fim, e dentro você tem os pares: uma chave à esquerda, dois-pontos e o valor à direita. E colocamos uma vírgula entre cada par. O Jiki vê isso e pega o caderno espiral dele. Ele escreve `name`, `"Jeremy"`, `age`, `42`, e assim por diante para cada par.

E, quando termina, ele arranca a folha e a coloca em uma caixa com o rótulo `person` (pessoa).

Há algumas regras para conhecer. As chaves são sempre strings. Elas precisam estar entre aspas, e cada chave deve ser única. Você não pode ter duas chaves chamadas `name` no mesmo dicionário.

Os valores podem ser iguais, se você quiser, mas as chaves precisam ser diferentes.

E os valores podem ser qualquer coisa. Podem ser strings, números, Booleans, arrays ou até outros dicionários.

Você também pode ter um dicionário vazio, assim como tivemos um array vazio, e podemos começar com ele e ir acrescentando coisas depois.

Então você tem um dicionário, mas como tirar alguma coisa de dentro dele?

Usamos a mesma sintaxe de colchetes que usamos com arrays e strings, mas, em vez de um número de posição, colocamos uma chave. Então, se quisermos tirar o nome de alguém de um dicionário, escrevemos:

```javascript
person["name"] // "Jeremy"
```

E isso diz ao Jiki para olhar no dicionário `person`, encontrar a chave `"name"` e tirar o valor dela. O Jiki vai até a caixa `person`, tira a página do caderno, percorre todas as chaves até encontrar `"name"`, lê o valor, `"Jeremy"`, e o coloca em uma nova caixa chamada `name`.

Colchetes sempre significam a mesma coisa: você está entrando em algo e tirando alguma coisa de lá. Com arrays e strings, você usa um número para dizer de qual posição quer tirar algo. Com dicionários, você usa uma string para a chave.

É a mesma ideia, só com uma sintaxe um pouco diferente.
