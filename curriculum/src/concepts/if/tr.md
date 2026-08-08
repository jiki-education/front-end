---
title: "`if` deyimleri"
description: "Bir kod bloğunu yalnızca bir koşul doğru olduğunda çalıştırmak için `if` anahtar kelimesini kullanıyoruz, tıpkı kimi içeri alacağına karar veren bir fedai gibi."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Jiki'ye bazı şeyleri yalnızca belirli durumlarda yapmasını söylememize yardımcı olan bir anahtar kelime var. Belki bir barın girişini korumak için kod yazıyorsunuz, belki bir fedaisiniz ve Jiki kapıyı yalnızca gelen kişi uygun giyinmişse açmalı. Ya da belki bir yarışın sonunda damalı bayrağı sallamaktan sorumlu olduğunuz bir kod yazıyorsunuz, ama Jiki bayrağı yalnızca son turda sallaması gerektiğini bilmeli. İşte bu tür durumlarda `if` anahtar kelimesini kullanacağız.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Gece kulübüne kimlerin gireceğine karar veren fedai Jiki"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Bir yarışın sonunda damalı bayrağı sallamaya hazır Jiki"
  width="266"
  height="400"
/>

`if` anahtar kelimesini `repeat` ile çok benzer bir şekilde kullanıyoruz. Normal parantezlerin içine bir bilgi koyuyoruz. Bu durumda o bilgi, kontrol ettiğimiz koşul (İngilizce: _condition_). Sonra da süslü parantezlerin içine, yalnızca o koşul doğruysa çalıştırdığımız bir kod bloğu koyuyoruz.

```javascript
if (condition) {
}
```

Peki bu koşullar neye benziyor? Genellikle bir tür karşılaştırma (İngilizce: _comparison_) oluyorlar. İki sayıyı ya da karakter dizisini karşılaştırıp sonucun doğru mu yanlış mı olduğuna bakıyoruz.

Bunları yüksek sesle söyleyebileceğiniz önermeler (İngilizce: _statement_) olarak düşünün. Üç, beşten küçüktür. Bu doğru. Yedi, ikiden küçüktür. Bu yanlış.

Bu karşılaştırmaları yazmak için semboller kullanıyoruz. Büyük ihtimalle bunlara matematikten zaten aşinasınız. Küçüktür, büyüktür, küçük eşittir, büyük eşittir var; bir de iki şeyin aynı olup olmadığını, yani eşit olup olmadığını kontrol eden bir sembolümüz var. Bu sonuncusu alışık olduğunuzdan biraz farklı, çünkü iki şeyin aynı mı farklı mı olduğuna bakmak için yan yana üç eşittir işareti kullanıyoruz.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Karşılaştırma operatörlerinin tablosu: küçüktür, büyüktür, küçük eşittir, büyük eşittir, eşittir ve eşit değildir, örneklerle"
  width="449"
  height="400"
/>

Bu, değişkenleri ayarlarken ya da güncellerken kafamızın karışmamasına da yardımcı oluyor, çünkü orada tek eşittir işaretini “bunu kutuya koy” anlamında kullanıyoruz. Karşılaştırmak için üç eşittir işareti olduğunu hatırlamanız yeterli.

Karakter dizilerini de karşılaştırabilirsiniz. Örneğin `"hello"` eşittir `"hello"`. Bu doğru. İki karakter dizisi aynı. Ama burada dikkatli olun, çünkü Jiki her iki kâğıt parçasındaki karakter dizilerinin her bir karakterini tek tek karşılaştırır. Yani büyük H ile yazılmış `"Hello"`, küçük h ile yazılmış `"hello"` ile eşit değildir. Bunlar farklı karakter dizileri. Dolayısıyla bu ikisini karşılaştırmak yanlış sonucunu verir, çünkü büyük H ile küçük h farklı karakterlerdir.

Bu arada, doğru ve yanlış değerlere _Boolean_ (mantıksal değer) denir; bu da kulağa teknik gelen bir başka kelime. Ama aslında çok basit. Bir şeyin ya doğru ya da yanlış olduğunu söylemenin resmi bir yolu sadece. Yani _Boolean_ kelimesiyle karşılaşırsanız, anlamı sadece doğru ya da yanlış. Bunu iş başında görelim. O robot fedaiyi bir kulüp için yaptığımızı düşünelim ve fedai kapıyı yalnızca gelen kişi 21 yaşında ya da daha büyükse açsın diyelim. Birinin yaşını öğrenmek için kullanabileceğimiz bir `askAge` (yaş sor) fonksiyonumuz var ve bu fonksiyonun sonucunu `age` (yaş) adında bir değişkene kaydedeceğiz. Sonra da “bu `age` 20'den büyükse kapıyı aç” diyebiliriz. Yani `askAge` `30` döndürürse kapıyı açıyoruz, `12` döndürürse açmıyoruz.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Yaşı yeterince büyük birine kapıyı açan ve çok genç birini içeri almayan Jiki"
  width="410"
  height="400"
/>
