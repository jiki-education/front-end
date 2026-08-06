---
title: "Relacioni sneško"
description: "Izmeni svog sneška tako da se sve veličine izvode iz jedne promenljive."
en_md5: 1753f8d873e9a5b58885cc1daee5ea5d
---

U ovoj vežbi pravimo još jednog sneška, ali slično kao u prethodnoj vežbi, radimo to tako da sve može da se izvede iz jedne promenljive `size` (veličina) pomoću aritmetičkih izraza.

U zavisnosti od `size`-a koji odabereš, sneško treba da raste.

<img
  src="/static/images/exercise-assets/relational-snowman/sizes.webp"
  alt="Sneško na veličinama od 1 do 5"
  style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>

### Kako funkcioniše

- Gornji levi ugao platna za crtanje je `0,0`. Donji desni je `100,100`.
- Imaš unapred definisanu promenljivu `snowmanX` (X koordinata sneška) za centar slike i promenljivu `size` koju možeš da menjaš od `1` do `5` da bi sneško rastao.
- Treba da izvedeš sve ostale promenljive pomoću aritmetičkih izraza.
- Poluprečnik glave je `size * 2`, poluprečnik tela je `size * 3`, a poluprečnik osnove je `size * 4`.
- Krugovi treba da se dodiruju: telo se nalazi tačno iznad osnove, a glava tačno iznad tela. (Naš sneško je malo nesigurniji nego u prethodnim vežbama, svaka snežna kugla je postavljena tačno na onu ispod sebe, a da se ne tope jedna u drugu. Mora da je veoma leden dan!)
- Dno osnovnog kruga se nalazi na `size` od dna.
- Treba da izračunaš centre sve tri snežne kugle.

### Promenljive

Tvoj zadatak je da postaviš ove promenljive prema gornjim uputstvima.

- `headRadius` (poluprečnik glave): izvedi iz `size`
- `bodyRadius` (poluprečnik tela): izvedi iz `size`
- `baseRadius` (poluprečnik osnove): izvedi iz `size`
- `baseY` (Y koordinata osnove): izvedi iz `size` i `baseRadius` (osnova sedi na tlu)
- `bodyY` (Y koordinata tela): izvedi iz `baseY`, `baseRadius` i `bodyRadius`
- `headY` (Y koordinata glave): izvedi iz `bodyY`, `bodyRadius` i `headRadius`

### Poigraj se sa veličinom

Možeš da menjaš veličinu od `1` do `5` i sneško treba da raste. Ne zaboravi da pritisneš dugme „Run code“ nakon što je promeniš.
