---
title: "Prebrojavanje reči"
description: "Prebroj koliko puta se svaka reč pojavljuje u rečenici."
en_md5: f9b46f800337d7fff2aab88b6e368e3d
---

Predaješ engleski kao strani jezik srednjoškolcima. Odlučuješ da ceo svoj kurikulum zasnuješ na TV serijama. Treba da analiziraš koje se reči koriste i koliko često se ponavljaju.

Tvoj zadatak je da prebrojiš koliko puta se svaka reč javlja u titlu jedne drame. Titlovi koriste samo ASCII karaktere.

Likovi često govore neformalnim engleskim i koriste skraćene oblike poput _they're_ ili _it's_. Iako ovi skraćeni oblici nastaju od dve reči, skraćeni oblik se računa kao jedna reč.

Reči mogu biti razdvojene bilo kojim znakom interpunkcije (npr. ":", "!" ili "?") ili razmacima. Jedini znak interpunkcije koji ne razdvaja reči jeste apostrof u skraćenim oblicima.

Brojevi se računaju kao reči. Ako u titlu piše "It costs 100 dollars", onda će "100" biti zasebna reč.

Velika i mala slova se ne razlikuju. Na primer, reč "you" se javlja tri puta u: "You come back, you hear me? DO YOU HEAR ME?"

Napravi funkciju pod imenom `countWords` (prebroj reči) koja prima rečenicu kao ulaz i vraća rečnik u kome su reči ključevi, a njihove učestalosti vrednosti.
