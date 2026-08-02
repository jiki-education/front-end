---
title: "Relógio digital"
description: "Mostre a hora certa em um relógio digital de 12 horas."
en_md5: e3decc089d371b7113f2657f7571c001
---

Neste exercício, você vai usar duas funções novas para descobrir a hora:

- `currentTimeHour()` (hora atual): retorna a hora atual no formato de 24 horas (por exemplo, 15 minutos antes da meia-noite retornaria `23`), como um número.
- `currentTimeMinute()` (minuto atual): retorna o minuto atual como um número.

Seu trabalho é atualizar um relógio digital com base nos números que essas funções retornarem.

O relógio digital espera os números no formato de 12 horas, com `am` ou `pm` (o que se chama de "meridiem").

Por exemplo:

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

Para mostrar a hora no relógio, use a função `displayTime(hour, minutes, meridiem)` (mostrar a hora).

Em cada cenário, a hora atual muda. Seu trabalho é escrever um código que faça todos os cenários funcionarem. No último cenário, usamos a hora real de verdade, então o cenário muda toda vez que a hora real avança um minuto!
