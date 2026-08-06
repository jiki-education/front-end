---
title: "Bolsa de valores"
description: "Sigue tu inversión mientras la bolsa de valores sube y baja aleatoriamente."
en_md5: 233edb21475a3846a567f3bdda98ce84
---

El primero de enero de este año, invertiste $10 que tanto te costó ganar en la bolsa de valores. Decidiste mantenerlo en secreto de tu familia y solo contarles después de 20 años, cuando (¡con suerte!) haya ganado mucho valor.

Hay tres cosas que entender sobre las bolsas de valores:

1. Son impredecibles. Pueden crecer o caer cada año. En promedio, tienden a crecer alrededor del 10%, pero puede variar muchísimo.
2. A medida que crecen, tu dinero crece más rápido que la bolsa debido al interés compuesto. Si inviertes $10 este año y la bolsa duplica su valor en los próximos 10 años, tendrás $20. Si vuelve a duplicarse en los siguientes 10 años, tendrás $40 ($20 \* 2, ¡no $10 \* 2!)
3. A medida que obtienes ganancias, ¡tienes que informarle al recaudador de impuestos!

### Flujo del ejercicio

Tienes una función llamada `marketGrowth(year)` (crecimiento del mercado en ese año) que devuelve un número que indica cuánto creció la bolsa de valores este año (por ejemplo, `5` significa que creció un `5%`). Así que si inviertes $10 y crece un 5%, ahora tienes $10.50.

Tu trabajo es seguir cuánto dinero tienes cada año e informarlo al recaudador de impuestos usando `reportTax(year, balance)` (reportar impuestos según el año y el saldo). Luego, después de 20 años, anúnciale a tu familia el monto final usando `announceToFamily(value)` (anunciar a la familia el valor acumulado). El primer año de `marketGrowth(...)` debe ser este año actual.

Revisa las funciones a continuación para más detalles y, si te atascas, ¡siempre puedes consultar las pistas!
