---
title: "Kutumia Vitendakazi"
description: "Kumwambia Jiki aendeshe mojawapo ya mashine zake ndogo kwa kuandika jina lake likifuatiwa na mabano mawili."
en_md5: 007a425ced42fd3550bfdf9fe6f7b391
---

Unapoandika msimbo, unachofanya kwa kweli ni kueleza unachotaka kitokee, kwa lugha ambayo kompyuta inaielewa. Sasa, kuna lugha nyingi tofauti za programu, na kuna wakalimani (_interpreter_ kwa Kiingereza) wengi tofauti wanaochukua kile unachoandika na kukibadilisha kuwa moja na sifuri ambazo kompyuta inaweza kuzielewa. Katika kozi hii, mkalimani wako ni Jiki. Kozi yote imepewa jina la Jiki. Huyu ni Jiki. Jiki atakuwa rafiki yako katika safari hii ya kujifunza kupanga programu. Kazi yake ni kufasiri msimbo unaoandika na kuubadilisha kuwa moja na sifuri ambazo kompyuta inaweza kuzitekeleza.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, mkalimani mkarimu atakayekuongoza katika kozi hii yote"
  width="421"
  height="400"
/>

Lengo kuu la kupanga programu ni kumpa mkalimani, ambaye hapa ni Jiki, maagizo sahihi. Kuna maagizo mengi tofauti unayoweza kumpa Jiki, mengi ambayo anayaelewa. Anaweza kuunganisha vitu pamoja, anaweza kufanya kitu mara nyingi, anaweza kusema, “Kama hili litatokea, basi ninahitaji kufanya hili.” Anaweza kukumbuka vitu na kuvitumia tena baadaye. Anaweza kukupa hitilafu (_error_ kwa Kiingereza) kama kitu hakiko sawa. Tutaangalia mambo haya yote tofauti katika kozi hii. Lakini jambo la muhimu kuelewa ni kwamba kila kitu utakachofanya ni kuweka maagizo kwenye ubao ili Jiki aje na kuyafuata.

Nilipojifunza kupanga programu miaka 34 iliyopita, hii ndiyo modeli ya kiakili niliyojenga, na ndiyo hiyo hiyo ninayoitumia hadi leo. Ninaelewa jinsi kompyuta zinavyofanya kazi hadi kwenye kiwango cha moja na sifuri, lakini kwa kweli sifikirii hilo kamwe. Kichwani mwangu, kuna mtu mdogo anayeishi ndani ya kompyuta, na mimi ninamwambia afanye nini. Kwa hiyo twende pamoja katika hili. Ni modeli ya kiakili yenye nguvu ambayo unaweza kuijenga, na ukianza kufikiria mambo kwa njia hii ya picha, kuhusu kile ambacho mtu aliyeko ndani ya kompyuta anafanya, itakusaidia sana unapojifunza kupanga programu.

Hebu tuanze kwa kuangalia mojawapo ya dhana za msingi katika kupanga programu, inayoitwa kitendakazi (_functions_ kwa Kiingereza). Vitendakazi ni kama mashine ndogo ambazo unaweza kumwambia Jiki azitumie. Na tukiangalia ndani ya ghala la Jiki, ambapo yeye hupenda kukaa, utaona ana rafu yenye mashine tatu tofauti: `move` (sogea), `turnLeft` (geuka kushoto), na `turnRight` (geuka kulia).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Rafu katika ghala la Jiki iliyo na mashine tatu zilizoandikwa move, turnLeft, na turnRight"
  width="500"
  height="371"
/>

Ulipoandika `move` na kisha mabano yale mawili, kile ulichokuwa unafanya ni kumwambia Jiki aende achukue mashine ya `move` kutoka rafuni, azungushe mpini, aiwashe, na aitumie.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki akisukuma mashine ya move kutoka rafuni ili aitumie"
  width="439"
  height="400"
/>

Ulipoandika `turnLeft` na kisha mabano, ulikuwa unamwambia Jiki achukue mashine ya `turnLeft` kutoka rafuni na aitumie. Na huu ni mtindo utakaoutumia tena na tena. Kila unapotaka kutumia mashine, utaandika jina lake na kisha mabano yale, na hilo linamwambia Jiki aende achukue mashine na aitumie:

```javascript
move()
turnLeft()
```

Sasa, kinachotokea ndani ya mashine hiyo, jinsi mashine hiyo inavyofanya kazi, hatuhitaji kujali kwa sasa. Tutaliangalia hilo kwa undani zaidi baadaye. Kwa kweli, hivi karibuni utaweza kutengeneza mashine zako mwenyewe pia. Lakini kwa sasa, usijali kuhusu hilo. Kwa kila zoezi, utaambiwa mashine zipi zilizo kwenye rafu ya Jiki. Zitakuwa tofauti kwa kila zoezi, na utaweza kutumia mashine hizo kutatua mazoezi.
