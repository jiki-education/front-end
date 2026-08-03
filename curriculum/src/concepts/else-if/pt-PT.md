---
title: "Else If"
description: "Encadear cláusulas `else if` para verificar várias condições por ordem, executando apenas o primeiro bloco cuja condição é verdadeira."
en_md5: 5e1c9b2e77abbd41708f4c33b9aabd8f
---

Já viste como o `if` e o `else` te dão dois caminhos: fazer uma coisa quando uma condição é verdadeira e fazer outra quando é falsa. Mas e se tiveres mais do que duas possibilidades?

Imagina que o nosso porteiro está a vender bilhetes. Com menos de treze anos, recebes um bilhete de criança. Entre os treze e os vinte, recebes um bilhete de adolescente. Com vinte ou mais, é um bilhete de adulto. Portanto, agora tens três resultados diferentes. Para isto, podemos acrescentar outra condicional depois do else. Assim, podemos dizer: "Se isto, então faz isto. Senão, se isto, faz aquilo. Senão, faz esta outra coisa." Neste exemplo, o Jiki vai ver o if e verificar a primeira condição. Dezasseis é menor do que treze? Não. Então passa ao else if. Dezasseis é menor do que vinte? Sim, é verdade. Então executa esse bloco e entrega um bilhete de adolescente. E depois termina aí. Não verifica mais nada. Nem sequer olha para aquele else final. Assim que o Jiki encontra uma condição verdadeira, executa esse bloco e salta tudo o que vem abaixo.

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
  alt="Três bilhetes com as etiquetas CHILD, TEEN e ADULT, um para cada resultado da verificação da idade"
  width="500"
  height="142"
/>

Isto é o essencial a compreender: só um bloco é executado, sempre. O Jiki percorre esta sequência de condições, encontra a primeira que é verdadeira, executa esse bloco e segue em frente.

Agora, há uma coisa que precisas mesmo de perceber, porque é aqui que muita gente tropeça. Há uma diferença subtil, mas muito importante, entre escrever duas condicionais separadas e usar o else if. Imagina que estamos a criar um programa que dá um prémio básico ou um prémio bónus consoante a pontuação de alguém. Olha para estas duas possibilidades. Uma usa else if e a outra usa duas condicionais `if` separadas. O que vai acontecer de diferente?

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

No primeiro caso, com o else if, verificamos se a pontuação é alta e damos o prémio bónus, e depois o else if já não é executado. Portanto, quem tiver uma pontuação acima de cem recebe apenas o prémio bónus.

Mas no segundo exemplo, os dois if são totalmente independentes. Ambos vão ser executados e ambos vão ser verdadeiros. Portanto, aqui a pessoa recebe dois prémios. No primeiro caso, um prémio. No segundo, dois prémios. Faz uma pausa só para teres a certeza de que percebes mesmo isto.

Também é interessante notar que qualquer uma das versões pode estar correta, consoante a forma como o jogo foi pensado. Talvez o concorrente receba um prémio normal e ainda um bónus, ou talvez seja simplesmente promovido ao prémio bónus. Nenhum dos dois códigos está certo ou errado. São apenas úteis em situações diferentes. Mas precisas de saber qual deles tencionas usar.
