---
title: "Ciclos while"
description: "Um ciclo que continua a correr enquanto uma condição se mantém verdadeira."
en_md5: daef89c6551b1d1cbc0e58668fd368bc
---

O próximo ciclo a conhecer é o ciclo `while` (enquanto).

Este ciclo diz: "Enquanto uma condição se verificar, corre o ciclo." Imagina que temos uma regra que diz que só podes disparar cinco vezes no Space Invaders. Então teríamos aqui um ciclo que diz: enquanto o número de disparos for menor que cinco, corre um ciclo que permite a alguém jogar o jogo.

```javascript
while (numShots < 5) {
  // disparar contra o alienígena
  numShots++
}
```

Cada vez que alguém dispara, aumentamos o `numShots` em um e, a certa altura, chegamos a cinco e o ciclo termina.

Ora, um problema dos ciclos `while` é que é bastante fácil ter bugs que fazem com que o ciclo nunca acabe. Estes chamam-se ciclos infinitos (_infinite loops_ em inglês) e são um dos bugs mais comuns nos programas.

Quando o teu computador fica lento, as ventoinhas começam a girar e tudo fica barulhento, muitas vezes é porque alguém deixou no código um ciclo infinito que nunca acaba.
