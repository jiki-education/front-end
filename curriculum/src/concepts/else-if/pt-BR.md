---
title: "Else If"
description: "Como encadear cláusulas `else if` para checar várias condições em ordem, executando só o primeiro bloco cuja condição for verdadeira."
en_md5: 5e1c9b2e77abbd41708f4c33b9aabd8f
---

Você já viu como `if` e `else` te dão dois caminhos: fazer uma coisa quando a condição é verdadeira e fazer outra quando ela é falsa. Mas e se você tiver mais de duas possibilidades?

Imagine que o nosso segurança está vendendo ingressos. Menos de treze anos, você ganha um ingresso infantil. Entre treze e vinte, um ingresso de adolescente. Vinte ou mais, ingresso de adulto. Agora temos três resultados diferentes. Para isso, podemos adicionar outro condicional depois do else. Aí podemos dizer: "Se isto, faça isto. Senão, se isto, faça aquilo. Senão, faça esta outra coisa." Então, neste exemplo, o Jiki vai ver o if e checar a primeira condição. Dezesseis é menor que treze? Não. Então ele passa para o else if. Dezesseis é menor que vinte? Sim, é verdadeiro. Então ele executa esse bloco e entrega um ingresso de adolescente. Mas aí ele terminou. Ele não checa mais nada. Ele nem olha para aquele else final. Assim que o Jiki encontra uma condição verdadeira, ele executa esse bloco e pula tudo o que vem abaixo.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else-if/tickets.webp"
  alt="Três ingressos escritos CHILD, TEEN e ADULT, um para cada resultado da checagem de idade"
  width="500"
  height="142"
/>

Essa é a parte mais importante de entender. Só um bloco é executado, sempre. O Jiki desce por essa sequência, encontra a primeira condição verdadeira, executa aquele bloco e segue em frente.

Agora, tem uma coisa que você precisa entender de verdade, porque muita gente tropeça nela. Existe uma diferença sutil, mas muito importante, entre escrever dois condicionais separados e usar else if. Imagine que estamos criando um programa que dá um prêmio básico ou um prêmio bônus dependendo da pontuação de alguém. Olhe estas duas possibilidades. Uma usa else if e a outra usa dois `if` separados. O que vai acontecer de diferente?

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

No primeiro caso, com o else if, checamos se a pontuação é alta e damos o prêmio bônus, e aí não executamos o else if. Então a pessoa, se tiver uma pontuação acima de cem, ganha só o prêmio bônus.

Mas no segundo exemplo, os dois if são totalmente independentes. Os dois vão ser executados, e os dois vão ser verdadeiros. Então aqui a pessoa ganha dois prêmios. No primeiro, um prêmio. No segundo, dois prêmios. Reserve um momento para se certificar de que você realmente entendeu isso.

Também é interessante notar que qualquer um dos dois pode estar certo, dependendo de como o jogo foi pensado. Talvez quem participa ganhe um prêmio normal e mais um bônus, ou talvez ganhe só o prêmio bônus no lugar do normal. Nenhum dos dois códigos está certo ou errado. Eles só são úteis em situações diferentes. Mas você precisa saber qual dos dois pretende usar.
