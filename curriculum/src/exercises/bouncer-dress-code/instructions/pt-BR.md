---
title: "Segurança: código de vestimenta"
description: "Combine a roupa, a idade e a presença na lista de convidados para decidir quem entra."
en_md5: 3e9f98d0b80d6bf0865cd0439005807b
---

Você está de volta ao seu bico como segurança, e hoje à noite está trabalhando em um local com um código de vestimenta rígido.

Seu trabalho é verificar o que a pessoa está vestindo, junto com a idade dela, e decidir o que fazer. Você tem algumas regras mais "interessantes" para seguir.

### As regras

- **Qualquer pessoa** com roupa **formal** ou **elegante** entra (esteja ou não na lista de convidados) e recebe canapés.
- **Adultos** (18 anos ou mais) com roupa **formal** **também** recebem champanhe.
- **Menores de 18** com qualquer outra roupa só podem entrar **se** estiverem na lista de convidados.
- Todas as outras pessoas são barradas.

As categorias do código de vestimenta:

- **Formal** significa `"ballgown"` ou `"tuxedo"`
- **Elegante** significa `"suit"` ou `"dress"`

### Suas habilidades

Você tem três funções para obter dados:

- `getOutfit()` (obter a roupa) retorna o nome da roupa que a pessoa está vestindo (ex.: `"ballgown"`, `"suit"`, `"denim"`)
- `getAge()` (obter a idade) retorna a idade dela.
- `onGuestList()` (está na lista de convidados) retorna se a pessoa está na lista de convidados.

Você só pode usar cada uma das funções de "obter dados" uma vez na solução (senão as pessoas vão ficar irritadas se você continuar perguntando o nome delas, etc.!)

Depois, você tem algumas ações que pode realizar:

- `offerChampagne()` (oferecer champanhe) oferece uma taça de champanhe à pessoa
- `offerCanapes()` (oferecer canapés) oferece canapés à pessoa (tartar de salmão)
- `letIn()` (deixar entrar) deixa a pessoa entrar no local
- `turnAway()` (barrar a entrada) barra a pessoa

### Programando com eficiência

Há muitas maneiras possíveis de resolver este exercício. Seu objetivo é juntar todas essas regras de um jeito que deixe o código **claro de ler**. Minimize a duplicação sempre que possível.

Divirta-se e boa sorte!
