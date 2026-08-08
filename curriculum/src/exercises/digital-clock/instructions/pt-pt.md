---
title: "Relógio Digital"
description: "Mostra a hora certa num relógio digital de 12 horas."
en_md5: e3decc089d371b7113f2657f7571c001
---

Neste exercício vais usar duas funções novas para obter a hora:

- `currentTimeHour()` (hora atual): Devolve a hora atual em formato de 24 horas (por exemplo, 15 minutos antes da meia-noite devolveria `23`), como um número.
- `currentTimeMinute()` (minuto atual): Devolve o minuto atual como um número.

O teu trabalho é atualizar um relógio digital com base nos números que essas funções devolverem.

O relógio digital espera que os números estejam num formato de 12 horas, com um `am` ou `pm` (a que se chama "meridiem").

Por exemplo:

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

Para mostrar a hora no relógio, usas a função `displayTime(hour, minutes, meridiem)` (mostrar a hora).

Em cada cenário, a hora atual muda. O teu trabalho é escrever código que faça todos os cenários funcionar. No último cenário usamos a hora real, por isso o cenário muda sempre que a hora real avança um minuto!
