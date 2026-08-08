---
title: "Contagem de palavras"
description: "Conta quantas vezes cada palavra aparece numa frase."
en_md5: f9b46f800337d7fff2aab88b6e368e3d
---

Ensinas inglês como língua estrangeira a alunos do ensino secundário. Decidiste basear todo o teu programa de ensino em séries de televisão. Precisas de analisar que palavras são usadas e com que frequência se repetem.

A tua tarefa é contar quantas vezes cada palavra ocorre numa legenda de uma série dramática. As legendas usam apenas carateres ASCII.

As personagens falam muitas vezes em inglês informal, com contrações como _they're_ ou _it's_. Embora estas contrações venham de duas palavras, cada contração conta como uma única palavra.

As palavras podem estar separadas por qualquer forma de pontuação (por exemplo, ":", "!" ou "?") ou por espaços. A única pontuação que não separa palavras é o apóstrofo nas contrações.

Os números contam como palavras. Se a legenda disser "It costs 100 dollars", então "100" será uma palavra por si só.

As palavras não distinguem maiúsculas de minúsculas. Por exemplo, a palavra "you" ocorre três vezes em: "You come back, you hear me? DO YOU HEAR ME?"

Cria uma função chamada `countWords` (contar palavras) que recebe uma frase como parâmetro de entrada e devolve um dicionário com as palavras como chaves e as suas frequências como valores.
