---
title: "Portero: Código de vestimenta"
description: "Combina la vestimenta, la edad y si está en la lista de invitados de la persona para decidir quién entra."
en_md5: 3e9f98d0b80d6bf0865cd0439005807b
---

Volviste a tu trabajo secundario como portero, y esta noche trabajas en un lugar con un código de vestimenta estricto.

Tu trabajo es revisar la vestimenta y la edad de la persona, y decidir qué hacer. Tienes que seguir algunas reglas «interesantes».

### Las reglas

- **Cualquier persona** con ropa **formal** o **elegante** entra (sin importar si está en la lista de invitados) y recibe canapés.
- **Los adultos** (18 años o más) con ropa **formal** también reciben champán.
- **Los niños** (menores de 18 años) con cualquier otra ropa solo pueden entrar **si están en la lista de invitados**.
- A los demás se les deniega la entrada.

Las categorías del código de vestimenta:

- **Formal** significa `"ballgown"` o `"tuxedo"`
- **Elegante** significa `"suit"` o `"dress"`

### Tus habilidades

Tienes tres funciones para obtener datos:

- `getOutfit()` (obtiene la vestimenta) devuelve el nombre de la vestimenta que lleva puesta la persona (por ejemplo, `"ballgown"`, `"suit"`, `"denim"`).
- `getAge()` (obtiene la edad) devuelve su edad.
- `onGuestList()` (está en la lista de invitados) devuelve si la persona está en la lista de invitados.

Solo puedes usar cada una de las funciones para obtener datos una única vez en la solución (de lo contrario, la gente se va a molestar si le preguntas el nombre una y otra vez, etc.).

Luego, tienes algunas acciones que puedes realizar:

- `offerChampagne()` (ofrece champán) ofrece a la persona una copa de champán.
- `offerCanapes()` (ofrece canapés) ofrece a la persona algunos canapés (tartar de salmón).
- `letIn()` (deja entrar a la persona) deja entrar a la persona al lugar.
- `turnAway()` (rechaza a la persona) rechaza a la persona.

### Escribir código eficiente

Hay muchas maneras posibles de resolver esto. Tu objetivo es combinar todas esas reglas de manera que el código sea **claro de leer**. Minimiza la duplicación siempre que puedas.

¡Diviértete y buena suerte!
