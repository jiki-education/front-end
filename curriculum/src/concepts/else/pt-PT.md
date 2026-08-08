---
title: "Else"
description: "Adicionar uma cláusula `else` depois de um `if` para que um bloco de código diferente seja executado quando a condição se revela falsa."
en_md5: 4dd08e94d86dd11cd54793cf64008e3d
---

As condicionais permitem-te verificar condições e executar código apenas quando algo é verdadeiro. Agora vamos apresentar o parceiro inseparável do if: o `else`.

Com uma condicional (_if statement_ em inglês), o Jiki executa o bloco de código quando a condição é verdadeira e salta esse bloco quando é falsa. Mas e se quiseres que o Jiki faça uma coisa quando a condição é verdadeira e outra diferente quando é falsa? É para isso que serve o else. Podemos colocar uma cláusula else (_else clause_ em inglês) depois da chaveta de fecho (`}`) do if, e o Jiki executa esse bloco se a condição do if for falsa. Voltando ao exemplo do porteiro da discoteca, agora temos a opção de abrir a porta ou de mandar a pessoa embora, o que é provavelmente melhor do que ignorá-la por completo, como fazíamos antes. Pensa nisto como uma bifurcação na estrada. O Jiki chega à bifurcação, verifica a condição e depois pode seguir por um caminho se ela for verdadeira, ou pelo outro se for falsa. Mas nunca segue pelos dois.

```javascript
if (age >= 21) {
  openDoor()
} else {
  turnAway()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else/fork-in-the-road.webp"
  alt="Uma bifurcação na estrada à porta da discoteca: abre-se a porta quando a condição é verdadeira e manda-se a pessoa embora quando é falsa"
  width="500"
  height="332"
/>

Mas e se tiveres mais do que duas possibilidades? Imagina que o nosso porteiro está a vender bilhetes. Menos de treze anos, recebes um bilhete de criança. Entre os treze e os vinte, recebes um bilhete de adolescente. Vinte ou mais, é um bilhete de adulto. Portanto agora tens três resultados diferentes. Para isto, podemos acrescentar outra condicional a seguir ao else. Podemos dizer: "Se isto, faz isto. Senão, se isto, faz aquilo. Senão, faz esta outra coisa." Neste exemplo, o Jiki vê o if e verifica a primeira condição. Dezasseis é menor do que treze? Não. Então passa ao else if. Dezasseis é menor do que vinte? Sim, é verdadeiro. Então executa esse bloco e entrega um bilhete de adolescente. E fica por aí. Não verifica mais nada. Nem sequer olha para aquele else final. Assim que o Jiki encontra uma condição verdadeira, executa esse bloco e salta tudo o que vem abaixo.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

Isto é o essencial a compreender. Só um bloco é executado, nunca mais do que um. O Jiki percorre esta sequência de condições, encontra a primeira que é verdadeira, executa esse bloco e segue em frente.

Agora, há uma coisa que precisas mesmo de perceber, porque costuma baralhar as pessoas. Há uma diferença subtil mas muito importante entre escrever duas condicionais separadas e usar else if. Imagina que estamos a criar um programa que dá um prémio básico ou um prémio bónus consoante a pontuação de alguém. Olha para estas duas possibilidades. Uma usa else if e a outra usa duas condicionais `if` separadas. O que vai acontecer de diferente?

```javascript
if (score > 100) {
  bonusPrize()
} else if (score > 50) {
  basicPrize()
}
```

```javascript
if (score > 100) {
  bonusPrize()
}
if (score > 50) {
  basicPrize()
}
```

No primeiro caso, com o else if, verificamos a pontuação alta e damos o prémio, e depois não executamos o else if. Portanto, se a pessoa tiver uma pontuação acima de cem, recebe apenas o prémio bónus.

Mas no segundo exemplo, os dois if são totalmente independentes. Ambos vão ser executados e ambos vão ser verdadeiros. Portanto aqui a pessoa recebe dois prémios. No primeiro caso, um prémio. No segundo, dois prémios. Faz uma pausa por um momento para teres a certeza de que percebeste mesmo isto.

Também é interessante notar que qualquer uma das opções pode estar certa, consoante a forma como o jogo é desenhado. Talvez o concorrente receba o prémio normal e ainda o bónus, ou talvez seja simplesmente promovido ao prémio bónus. Nenhum dos dois códigos está certo ou errado. São apenas úteis em situações diferentes. Mas precisas de saber qual deles tencionas usar.
