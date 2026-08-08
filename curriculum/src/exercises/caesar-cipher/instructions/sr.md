---
title: "Cezarova šifra"
description: "Šifriraj tajnu poruku koristeći staru rimsku šifru."
en_md5: 029bbd7050127405f5e67a3a20353139
---

Cezarova šifra je jedna od najranijih i najjednostavnijih tehnika šifrovanja. Koristio ju je Julije Cezar da šalje tajne poruke svojim generalima.

Ova šifra funkcioniše tako što pomera svako slovo u poruci za fiksni broj mesta u alfabetu. Na primer, sa pomakom od 3, 'a' postaje 'd', 'b' postaje 'e', i tako dalje. Ako pomak pređe 'z', vraća se na početak alfabeta.

Razmaci ostaju razmaci (ne pomeraju se).

Kreiraj funkciju koja se zove `encode(message, shift)` (zakodira poruku sa pomakom) koja prima poruku napisanu malim slovima i iznos pomaka, i vraća šifrovanu poruku.

Na primer:

- `encode("abc", 1)` returns `"bcd"`
- `encode("xyz", 3)` returns `"abc"` (vraća se na početak)
- `encode("hello world", 5)` returns `"mjqqt btwqi"`

Savet: Biće ti lakše ako ovaj problem podeliš na manje pomoćne funkcije!

### Slučajna činjenica

Jednom sam bio voditelj na jednoj tech konferenciji u Bragi, u Portugalu. Pet minuta pre nego što sam trebalo da izađem na binu, organizatori su došli i pomalo postiđeno me pitali da li bih imao nešto protiv da se obučem kao Julije Cezar za prvi deo dana, kako bi proslavili rimsko nasleđe Brage. Da li sam uspeo da to izvedem...?

<img
  src="/static/images/exercise-assets/caesar-cipher/jeremy-as-caesar.webp"
  alt="Džeremi obučen kao Cezar"
  style="width: 100%; max-width: 300px; border: 5px solid var(--color-purple-500); padding: 4px; border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>
