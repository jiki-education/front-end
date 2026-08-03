---
title: "Else"
description: "Adicionar uma cláusula `else` depois de um `if` para que um bloco de código diferente rode quando a condição for falsa."
en_md5: 4dd08e94d86dd11cd54793cf64008e3d
---

As condicionais permitem verificar condições e rodar um código só quando algo é verdadeiro. Agora vamos apresentar o parceiro inseparável do if: o `else`.

Com uma condicional (_if statement_ em inglês), o Jiki roda o bloco de código quando a condição é verdadeira e pula esse bloco quando ela é falsa. Mas e se você quiser que o Jiki faça uma coisa quando a condição for verdadeira e outra diferente quando for falsa? É para isso que o else serve. Podemos colocar uma cláusula `else` depois da chave de fechamento do if, e o Jiki vai rodar essa parte se a condição do if for falsa. Então, voltando ao exemplo do segurança da balada, agora temos a opção de abrir a porta ou de recusar a entrada da pessoa, o que provavelmente é melhor do que ignorá-la completamente, como fazíamos antes. Pense nisso como uma bifurcação no caminho. O Jiki chega nessa bifurcação, verifica a condição e aí pode seguir por um lado se ela for verdadeira, ou pelo outro se for falsa. Mas ele nunca segue pelos dois.

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
  alt="Uma bifurcação no caminho na porta da balada: abrir a porta quando a condição é verdadeira, recusar a entrada quando ela é falsa"
  width="500"
  height="332"
/>

Mas e se houver mais de duas possibilidades? Imagine que o nosso segurança está vendendo ingressos. Menos de treze anos, ingresso infantil. Entre treze e vinte, ingresso de adolescente. Vinte ou mais, ingresso de adulto. Agora são três resultados diferentes. Para isso, podemos adicionar outra condicional depois do else. Ou seja, podemos dizer: "Se isto, faça isto. Senão, se aquilo, faça aquilo. Senão, faça esta outra coisa." Então, neste exemplo, o Jiki vê o if e verifica a primeira condição. Dezesseis é menor que treze? Não. Então ele passa para o else if. Dezesseis é menor que vinte? Sim, é verdade. Então ele roda esse bloco e entrega um ingresso de adolescente. E pronto, ele para por aí. Ele não verifica mais nada. Ele nem olha para aquele else final. Assim que o Jiki encontra uma condição verdadeira, ele roda esse bloco e pula todo o resto que vem abaixo.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

Esse é o ponto principal a entender. Só um bloco roda, nunca mais de um. O Jiki percorre as condições de cima para baixo, encontra a primeira que é verdadeira, roda aquele bloco e segue em frente.

Agora, tem uma coisa que vale entender de verdade, porque ela costuma confundir muita gente. Existe uma diferença sutil, mas muito importante, entre escrever duas condicionais separadas e usar else if. Imagine que estamos criando um programa que dá um prêmio básico ou um prêmio bônus dependendo da pontuação de alguém. Olhe estas duas possibilidades. Uma usa else if e a outra usa duas condicionais `if` separadas. O que vai acontecer de diferente?

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

No primeiro caso, com o else if, verificamos se a pontuação é alta e damos o prêmio, e aí o else if nem chega a rodar. Então a pessoa, se tiver uma pontuação acima de cem, ganha só o prêmio bônus.

Já no segundo exemplo, os dois ifs são totalmente independentes. Os dois vão rodar e os dois vão ser verdadeiros. Então aqui a pessoa ganha dois prêmios. No primeiro caso, um prêmio. No segundo, dois prêmios. Reserve um momento para ter certeza de que você entendeu isso de verdade.

Também é interessante notar que qualquer um dos dois pode estar certo, dependendo de como o jogo foi pensado. Talvez a pessoa ganhe o prêmio normal e mais o bônus, ou talvez ela só seja promovida ao prêmio bônus. Nenhum dos dois códigos está certo ou errado. Eles só são úteis em situações diferentes. Mas você precisa saber qual dos dois pretende usar.
