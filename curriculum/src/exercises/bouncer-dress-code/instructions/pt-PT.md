---
title: "Porteiro: Código de vestuário"
description: "Combina a roupa da pessoa, a idade e a presença na lista de convidados para decidir quem entra."
en_md5: 3e9f98d0b80d6bf0865cd0439005807b
---

Estás de volta ao teu trabalho extra como porteiro, e esta noite estás num espaço com um código de vestuário rigoroso.

O teu trabalho é verificar o que a pessoa tem vestido, juntamente com a idade, e decidir o que fazer. Tens mais algumas regras "interessantes" para seguir.

### As regras

- **Qualquer pessoa** com roupa **formal** ou **elegante** entra (esteja ou não na lista de convidados) e recebe canapés.
- **Adultos** (com 18 anos ou mais) com roupa **formal** recebem **também** uma taça de champanhe.
- **Menores** (com menos de 18 anos) com qualquer outra roupa só entram **se** estiverem na lista de convidados.
- Todas as outras pessoas são mandadas embora.

As categorias do código de vestuário:

- **Formal** significa `"ballgown"` ou `"tuxedo"`
- **Elegante** significa `"suit"` ou `"dress"`

### As tuas capacidades

Tens três funções para obter dados:

- `getOutfit()` (obter a roupa) devolve o nome da roupa que a pessoa tem vestida (p. ex. `"ballgown"`, `"suit"`, `"denim"`)
- `getAge()` (obter a idade) devolve a idade da pessoa.
- `onGuestList()` (está na lista de convidados) devolve se a pessoa está na lista de convidados.

Só podes usar cada uma das funções de "obter dados" uma vez na solução (senão as pessoas começam a ficar irritadas se continuares a perguntar-lhes o nome, etc.!)

Depois tens algumas ações que podes fazer:

- `offerChampagne()` (oferecer champanhe) oferece uma taça de champanhe à pessoa
- `offerCanapes()` (oferecer canapés) oferece canapés à pessoa (tártaro de salmão)
- `letIn()` (deixar entrar) deixa a pessoa entrar no espaço
- `turnAway()` (mandar embora) manda a pessoa embora

### Programar com eficiência

Há muitas formas possíveis de resolver este exercício. O teu objetivo é juntar todas estas regras de maneira a que o código fique **fácil de ler**. Evita duplicação sempre que possível.

Diverte-te e boa sorte!
