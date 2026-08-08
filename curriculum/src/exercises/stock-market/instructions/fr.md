---
title: "La Bourse"
description: "Suis ton investissement pendant que la Bourse monte et descend au gré du hasard."
en_md5: 233edb21475a3846a567f3bdda98ce84
---

Le premier janvier de cette année, tu as investi 10 $ durement gagnés en Bourse. Tu as décidé de garder le secret vis-à-vis de ta famille et de ne leur en parler que dans 20 ans, quand ton investissement aura (espérons-le !) pris beaucoup de valeur.

Il y a trois choses à comprendre sur la Bourse :

1. Elle est imprévisible. Elle peut monter ou descendre chaque année. En moyenne, elle a tendance à croître d'environ 10 %, mais cela peut varier énormément.
2. À mesure qu'elle croît, ton argent croît plus vite que la Bourse elle-même grâce aux intérêts composés. Si tu investis 10 $ cette année et que la Bourse double de valeur au cours des 10 prochaines années, tu auras 20 $. Si elle double encore au cours des 10 années suivantes, tu auras 40 $ (20 $ \* 2, et non 10 $ \* 2 !)
3. Dès que tu fais des bénéfices, tu dois les déclarer au fisc !

### Déroulement de l'exercice

Tu disposes d'une fonction `marketGrowth(year)` (la croissance de la Bourse pour une année donnée) qui renvoie un nombre indiquant de combien la Bourse a progressé cette année-là (par exemple `5` signifie qu'elle a progressé de `5%`). Donc si tu investis 10 $ et qu'elle progresse de 5 %, tu as maintenant 10,50 $.

Ton travail consiste à suivre combien d'argent tu as chaque année et à le déclarer au fisc avec `reportTax(year, balance)` (déclarer les impôts pour une année et un solde donnés). Puis, au bout de 20 ans, annonce le montant final à ta famille avec `announceToFamily(value)` (annoncer une valeur à la famille). La première année que tu passes à `marketGrowth(...)` doit être l'année en cours.

Jette un œil aux fonctions ci-dessous pour plus de détails, et si tu bloques, tu peux toujours consulter les astuces !
