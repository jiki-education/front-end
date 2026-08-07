---
title: "Dicionários"
description: "Uma página de um bloco de notas de espiral em que cada entrada tem uma chave à esquerda e o seu valor à direita, dando-te dados com etiquetas em vez de uma lista."
en_md5: b8a26ad63301df1d00ce08e1e429cf05
---

Os arrays são a nossa escolha habitual quando temos uma lista de qualquer coisa: uma lista de mentores, uma lista de pontuações, uma lista de ingredientes. Qualquer lista, queres usar um array.

Mas há outra estrutura de dados (_data structure_ em inglês) que também é muito comum, para quando queres algo um pouco mais complexo do que uma lista.

Imagina que queremos guardar alguma informação sobre mim: o meu nome, a minha idade, onde nasci. Podias usar um array para isso, mas não fica muito claro o que se está a passar quando o fazes.

Inglaterra é onde nasci ou onde vivo? 42 é a minha idade ou outra coisa qualquer?

E, para usar isto, tenho de me lembrar de que a primeira posição é para o nome, a segunda para a idade, a terceira para o local de nascimento. É tudo um pouco confuso, e é confuso porque isto não é bem uma lista de coisas. É mais complexo do que isso. E é aí que entram os dicionários (_dictionaries_ em inglês). Um dicionário é um novo tipo de estrutura de dados. Já é o quinto: tens strings, números, Booleans, arrays e agora dicionários.

E quero que penses num dicionário como uma folha de um bloco de notas de espiral.

Do lado esquerdo, tens os títulos, as palavras `"name"`, `"age"`, `"birthplace"`, e chamamos-lhes chaves (_keys_ em inglês).

E do lado direito, ao lado de cada título, tens os dados propriamente ditos, `"Jeremy"`, `42`, `"England"`, e chamamos-lhes valores (_values_ em inglês).

Tal como os arrays, um dicionário é uma coisa só. É uma página de um bloco de notas. E tal como os arrays, o Jiki pode pô-lo numa variável, numa caixa, ou usá-lo como valor de entrada de uma função, ou pode tirar um dicionário da calha de saída. Então, eis o aspeto de um dicionário em código. Usamos chavetas para marcar o início e o fim, e lá dentro tens pares: uma chave à esquerda, dois pontos, e depois o valor à direita. E pomos uma vírgula entre cada par. O Jiki vê isto e pega no seu bloco de notas de espiral. Escreve `name`, `"Jeremy"`, `age`, `42`, e assim por diante para cada par.

E quando termina, arranca a folha e coloca-a numa caixa com a etiqueta `person` (pessoa).

Há algumas regras a saber. As chaves são sempre strings. Têm de ter aspas à volta, e cada chave tem de ser única. Não podes ter duas chaves chamadas `name` no mesmo dicionário.

Os valores podem ser iguais, se quiseres, mas as chaves têm de ser diferentes.

E os valores podem ser qualquer coisa. Podem ser strings, números, Booleans, arrays ou até outros dicionários.

Também podes ter um dicionário vazio, tal como tínhamos um array vazio, e podemos começar por aí e ir construindo a partir dele.

Então, tens um dicionário, mas como é que tiras algo lá de dentro?

Usamos a mesma sintaxe de parênteses retos que usámos com os arrays e as strings, mas em vez de um número de posição, pomos uma chave. Portanto, se quisermos tirar o nome de alguém de um dicionário, escrevemos:

```javascript
person["name"] // "Jeremy"
```

E isso diz ao Jiki para procurar no dicionário `person`, encontrar a chave `"name"` e tirar o seu valor. O Jiki vai à caixa `person`, tira a página do bloco de notas, percorre todas as chaves até encontrar `"name"`, lê o valor, `"Jeremy"`, e põe-no numa caixa nova chamada `name`.

Os parênteses retos significam sempre o mesmo. Estás a enfiar a mão em algo e a tirar qualquer coisa lá de dentro. Com os arrays e as strings, usas um número para dizer de que posição queres tirar algo. Com os dicionários, usas uma string para a chave.

É a mesma ideia, só com uma sintaxe ligeiramente diferente.
