---
title: "Repeat döngüsü"
description: "Jiki'ye süslü parantezlerin içindeki kodu belirli sayıda çalıştırmasını söylemek için `repeat` anahtar kelimesini kullanmak."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Şimdiye kadar her şeyi doğrusal bir şekilde yazdık: Jiki her talimatı yukarıdan aşağıya sırayla takip etti.

Şimdi Jiki'nin bu katı yukarıdan aşağıya akışın dışına nasıl çıkabileceğine bakacağız. Özellikle de Jiki'ye aynı kod bölümünü art arda birçok kez çalıştırmasını nasıl söyleyebileceğimizi göreceğiz.

Örneğin labirentte olduğunuzu ve 10 adım ilerlemek istediğinizi düşünün. Bunun için yardımcı olacak bir `walk` fonksiyonu var, ama ya bu fonksiyon olmasaydı? Ya elinizde yalnızca `move` (hareket et) fonksiyonu olsaydı?

`move` fonksiyonunu art arda 10 kez yazmak çok tekrarlı olur. Bunun yerine şöyle diyebilmemiz gerekiyor: “Hey Jiki, şimdi söyleyeceğim şeyi 10 kez yap.

`Move`.”

Bunu kodda yapabilmek için ilk anahtar kelimemizi (İngilizce: _keyword_) kullanmamız gerekiyor. Anahtar kelimeler, Jiki'nin anladığı talimatlardır. Biraz makinelere benzerler ama makine değildirler. Jiki bir anahtar kelime gördüğünde rafta bir makine aramaz; onun yerine ne yapacağını zaten bilir. Bu, beynine işlenmiştir. Kurs boyunca öğreneceğimiz yaklaşık 20 farklı anahtar kelime var ve bunların ilki `repeat` anahtar kelimesi.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Repeat, if, else, and, or gibi anahtar kelimelerle çevrili Jiki ve anahtar kelimelerin Jiki'nin anladığı talimatlar olduğu notu"
  width="358"
  height="400"
/>

`repeat` anahtar kelimesi tam olarak yukarıda söylediğim şeyi yapıyor. Jiki'ye “Bundan sonra söyleyeceğim şeyi şu kadar kez tekrarla” diyor. Şu koda bir bakalım. Önce Jiki'ye bir şeyi birden çok kez yapacağını söylemek için `repeat` anahtar kelimesini kullanıyoruz. Sonra Jiki'nin o şeyi kaç kez tekrarlamasını istediğimizi normal parantezlerin içine yazıyoruz. Ardından da şu süslü parantezler geliyor ve Jiki'nin tekrarlamasını istediğimiz şeyler bu süslü parantezlerin içinde duruyor. Bu kalıp programlamada inanılmaz derecede yaygındır. Bir anahtar kelime belirtiriz, genellikle yanında bir bilgi olur (bu örnekte bir şeyin kaç kez yapılacağı), ardından da süslü parantezler içinde bir kod bloğu (İngilizce: _code block_) gelir. Labirent dünyasına dönersek, `move`, `move`, `move`, `move` yazmak yerine dört kez `move` tekrarla diyebiliriz.

```javascript
repeat(4) {
  move()
}
```

Jiki bu kodu görecek ve `move` makinesini art arda dört kez kullanacak.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki'nin move makinesini art arda, birbiri ardına dört kez kullanması"
  width="421"
  height="400"
/>

Üstelik o süslü parantezlerin içine yalnızca tek bir şey koymakla da sınırlı değiliz. Jiki birden çok şeyi tekrar tekrar yapabilir. Jiki'ye önce `move`, sonra `turnLeft` yapmasını ve bütün bunları dört kez tekrarlamasını söyleyebiliriz. Jiki bunu görürse `move` makinesini, sonra `turnLeft` makinesini, sonra yine `move` makinesini, sonra yine `turnLeft` makinesini kullanır ve ikisini de dörder kez yapana kadar böyle devam eder.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki'nin move makinesini, ardından turnLeft makinesini kullanması ve bu iki eylemi dört kez tekrarlaması"
  width="500"
  height="390"
/>

Bu tekrar talimatlarına döngü (İngilizce: _loop_) diyoruz. Kullanabileceğimiz, her biri biraz farklı çalışan birçok farklı döngü var.

Bilmeniz gereken bir şey daha var: Döngülerle çalışırken kodunuzu düzenli ve derli toplu tutmak vazgeçilmez hale gelir. Kodunuzun görsel yapısı iyi olduğunda neler olduğunu görmek çok kolaylaşır. Ama olmadığında, yani girintileri düzgün yapmayı unuttuğunuzda ya da girintileri karıştırdığınızda işler çok hızlı karışır. Bu yüzden bu kursta her zaman geçerli bir kuralımız var. Açılış süslü parantezini her zaman `repeat` deyimi (İngilizce: _statement_) ile aynı satıra koyarsınız. Kapanış süslü parantezini her zaman deyimden sonra kendi satırına koyarsınız ve aradaki kodu her zaman iki boşluk girintilersiniz. Böylece her şey gerçekten derli toplu kalır; unutur ya da farklı bir düzen denerseniz hata alırsınız.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki'nin, bir döngünün kod bloğunu düzenli tutan girintiyi ve yeni satırı göstermesi"
  width="500"
  height="398"
/>
