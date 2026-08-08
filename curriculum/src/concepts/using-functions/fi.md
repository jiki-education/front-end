---
title: "Funktioiden käyttö"
description: "Kerrot Jikille, että hän käyttää yhtä pienistä koneistaan: kirjoitat koneen nimen ja sen perään sulkeet."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Kun kirjoitat koodia, kerrot oikeastaan vain sen, mitä haluat tapahtuvan, ja kerrot sen ohjelmointikielellä, jota tietokone ymmärtää. Ohjelmointikieliä on monenlaisia, ja samoin on tulkkeja, jotka ottavat kirjoittamasi koodin ja muuttavat sen ykkösiksi ja nolliksi, joita tietokone ymmärtää. Tällä kurssilla tulkkisi on Jiki. Koko kurssi on nimetty Jikin mukaan. Tässä on Jiki. Jikistä tulee ystäväsi tällä ohjelmointimatkalla. Hänen tehtävänsä on tulkita kirjoittamaasi koodia ja muuttaa se ykkösiksi ja nolliksi, joiden mukaan tietokone osaa toimia.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, ystävällinen tulkki, joka opastaa sinua tällä kurssilla"
  width="421"
  height="400"
/>

Ohjelmoinnissa on pohjimmiltaan kyse siitä, että annat tulkille, tässä tapauksessa Jikille, oikeat ohjeet. Jikille voi antaa monenlaisia ohjeita, ja hän ymmärtää niitä paljon. Hän osaa liittää asioita yhteen, hän osaa tehdä saman asian monta kertaa ja hän osaa sanoa: ”Jos näin käy, minun pitää tehdä näin.” Hän osaa muistaa asioita ja käyttää niitä myöhemmin uudelleen. Ja jos jokin ei ole kunnossa, hän antaa virheilmoituksen. Käymme kaikki nämä läpi tällä kurssilla. Tärkeintä on kuitenkin ymmärtää yksi asia: aina kun teet jotain, kirjoitat ohjeita tussitaululle, ja Jiki tulee sitten noudattamaan niitä.

Kun opin ohjelmoimaan 34 vuotta sitten, rakensin juuri tällaisen ajatusmallin, ja se on minulla yhä. Ymmärrän kyllä, miten tietokoneet toimivat aina ykkösiä ja nollia myöten, mutta rehellisesti sanottuna en koskaan ajattele sitä. Päässäni tietokoneen sisällä asuu pieni mies, ja minä kerron hänelle, mitä tehdä. Lähde siis mukaan tähän ajatukseen. Se on vahva ajatusmalli, ja kun alat hahmottaa näin kuvallisesti, mitä tietokoneen sisällä oleva mies tekee, siitä on sinulle paljon hyötyä ohjelmoinnin oppimisessa.

Aloitetaan tarkastelemalla yhtä ohjelmoinnin peruskäsitteistä: funktioita. Funktiot ovat kuin pieniä koneita, joita voit pyytää Jikiä käyttämään. Jos kurkistat Jikin varastoon, siellä hän aikaansa viettää, näet hyllyllä kolme erilaista konetta: `move` (liiku), `turnLeft` (käänny vasemmalle) ja `turnRight` (käänny oikealle).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Hylly Jikin varastossa, ja sillä kolme konetta, joiden tarroissa lukee move, turnLeft ja turnRight"
  width="500"
  height="371"
/>

Kun kirjoitit `move` ja sen perään sulkeet, kerroit Jikille, että hän hakee `move`-koneen hyllyltä, kääntää kampea, käynnistää koneen ja käyttää sitä.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki kärräämässä move-konetta pois hyllyltä käyttääkseen sitä"
  width="439"
  height="400"
/>

Kun kirjoitit `turnLeft` ja sen perään sulkeet, kerroit Jikille, että hän hakee `turnLeft`-koneen hyllyltä ja käyttää sitä. Tätä samaa kaavaa toistat jatkuvasti: aina kun haluat käyttää jotain konetta, kirjoita koneen nimi ja sen perään sulkeet. Se kertoo Jikille, että hänen pitää hakea kone ja käyttää sitä:

```javascript
move()
turnLeft()
```

Siitä, miten kone oikeastaan toimii ja mitä koneen sisällä tapahtuu, ei tarvitse vielä välittää. Palaamme siihen paljon tarkemmin myöhemmin. Itse asiassa kestää vain hetken, ennen kuin osaat rakentaa omia koneitasi. Mutta älä murehdi sitä nyt. Jokaisen harjoituksen kohdalla kerrotaan, mitkä koneet ovat Jikin hyllyllä. Joka harjoituksessa ne ovat erilaiset, ja juuri niillä koneilla ratkaiset harjoitukset.
