---
title: "Relacioni semafori"
description: "Ponovo napravi semafor tako da se sve proporcionalno skalira."
en_md5: d54633094a8d14f73b298fe4827504c4
---

Vratio/la si se semaforima! Ovog puta ćemo pratiti šablon iz prethodne dve vežbe i napraviti semafore tako da se, kada promenimo poluprečnik, ispravno skaliraju. Da bismo to postigli, imamo niz promenljivih koje možemo postaviti tako da budu relativne u odnosu na `center` (centar) i/ili `radius` (poluprečnik).

<img src="/static/images/exercise-assets/relational-traffic-lights/target.webp" alt="Ciljni semafor" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Kako funkcioniše

- Gornji levi ugao platna za crtanje je `0,0`. Donji desni ugao je `100,100`.
- Promenljive za boje i `center` su već postavljene za tebe. `radius` je unapred podešen na 10, ali možeš da eksperimentišeš menjajući ga.
- Potrebno je da izvedeš sve promenljive za poziciju i veličinu kao neku kombinaciju `radius`-a i/ili `center`-a.
- Kućište je pravougaonik koji okružuje sva tri svetla sa odmakom. Odmak je jednak poluprečniku.
- Tri svetla su ravnomerno vertikalno raspoređena unutar kućišta, a kućište je u centru slike. (To znači da je centar žutog kruga ujedno i centar slike.)

### Promenljive koje treba izvesti

Sve ove promenljive treba da koriste `radius` ili `center` (na primer, neka formula kao što je `radius * 7` ili `center - (radius * 2)`)

- `redY` (vertikalni centar crvenog svetla), `yellowY` (vertikalni centar žutog svetla), `greenY` (vertikalni centar zelenog svetla) — vertikalni centri svakog svetla
- `housingX` (x-koordinata gornjeg levog ugla kućišta), `housingY` (y-koordinata gornjeg levog ugla kućišta) — gornji levi ugao pravougaonog kućišta
- `housingWidth` (širina kućišta), `housingHeight` (visina kućišta) — dimenzije pravougaonog kućišta

### Provera prilagodljivosti

Dok radiš, možeš da menjaš `radius` od `2` do `12` kako bi proverio/la da li se stvari pravilno skaliraju. Ako je tvoj kod ispravan, videćeš da se sve lepo skalira oko centra slike!
