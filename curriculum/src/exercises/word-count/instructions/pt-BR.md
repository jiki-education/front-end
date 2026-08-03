---
title: "Contagem de palavras"
description: "Conte quantas vezes cada palavra aparece em uma frase."
en_md5: f9b46f800337d7fff2aab88b6e368e3d
---

Você ensina inglês como língua estrangeira para estudantes do ensino médio. Você decidiu basear todo o seu currículo em séries de TV. Agora precisa analisar quais palavras são usadas e com que frequência elas se repetem.

Sua tarefa é contar quantas vezes cada palavra aparece na legenda de um drama. As legendas usam apenas caracteres ASCII.

Os personagens costumam falar em inglês casual, usando contrações como _they're_ ou _it's_. Embora essas contrações venham de duas palavras, a contração é considerada uma única palavra.

As palavras podem ser separadas por qualquer forma de pontuação (por exemplo ":", "!" ou "?") ou por espaços. A única pontuação que não separa palavras é o apóstrofo nas contrações.

Números são considerados palavras. Se a legenda disser "It costs 100 dollars", então "100" será uma palavra por si só.

Maiúsculas e minúsculas não fazem diferença. Por exemplo, a palavra "you" aparece três vezes em: "You come back, you hear me? DO YOU HEAR ME?"

Crie uma função chamada `countWords` (contar palavras) que recebe uma frase como entrada e retorna um dicionário com as palavras como chaves e suas frequências como valores.
