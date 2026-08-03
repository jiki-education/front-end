---
title: "Değişken oluşturma ve kullanma"
description: "Jiki'nin raflarındaki, bir değeri etiketiyle saklayan ve daha sonra kodunuzda geri alabileceğiniz kutular."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

Değişkenler (İngilizce: _variables_) bilgi saklamamızı sağlar. Kod yazarken çoğu zaman bir sayıyı veya bir karakter dizisini daha sonra kullanmak üzere saklamamız gerekir ve bunu değişkenlerle yaparız. Şimdi Jiki'nin deposunda biraz geriye çekilip bakalım: Jiki'nin bir raf takımı daha olduğunu göreceksiniz. İlk raf takımını zaten tanıyoruz; üzerinde fonksiyonlar, yani `move` ve `rectangle` gibi küçük makineler duruyor. Bu ikinci raf takımındaysa makineler yerine bir sürü kutu var ve işte bu kutulara değişken diyoruz. Jiki'ye bu kutulara herhangi bir şey koymasını söyleyebilir, daha sonra da tekrar çıkarmasını isteyebilirsiniz. Tıpkı fonksiyonların bir adı olduğu gibi her kutunun da bir adı vardır ve her kutunun içinde yalnızca tek bir şey bulunur. Şimdilik bu ya bir sayı ya da bir karakter dizisi olacak. Kursun ilerleyen bölümlerinde kutularda daha karmaşık şeyler saklamayı da göreceğiz.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Jiki'nin deposunda iki raf takımı: fonksiyonlar etiketli olanda makineler, değişkenler etiketli olanda kutular var"
  width="500"
  height="173"
/>

Peki Jiki'ye bir kutu yapıp içine bir şey koymasını nasıl söyleriz? Bunun için `let` anahtar kelimesini kullanırız. Bu kelimenin birebir Türkçe karşılığı yok; “olsun” anlamında düşünebilirsiniz. Yaptığı iş ikiye ayrılır: değişken tanımlama ve değer atama. `let` anahtar kelimesi Jiki'ye yeni bir kutu yapması gerektiğini söyler. Onu bir karton kutuyu ambalajından çıkarıp katlarını açarken hayal edebilirsiniz. Sonra `let` kelimesinden sonra gelene bakar; bu, kutuya yapıştıracağı etikettir, bu örnekte `name` (isim). Kalemini çıkarır ve etikete `name` yazar. Ardından eşittir işaretinden (İngilizce: _equal sign_) sonra gelene bakar. Bu örnekte bu benim adım, `"Jeremy"`. `"Jeremy"` bir karakter dizisi olduğu için Jiki bir kâğıt parçası alır ve üzerine `"Jeremy"` yazar. Bu, şimdiye kadar çalıştığınız renklerle tıpatıp aynı türden bir karakter dizisi. Sonra o kâğıt parçasını kutunun içine koyar.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki, üzerinde Jeremy karakter dizisi yazan bir kâğıt parçasını kutuya koymak üzere elinde tutuyor"
  width="373"
  height="400"
/>

Böylece ona bir kutu yapmasını, üzerine bir etiket yapıştırmasını ve içine bir şey koymasını söylemiş olduk; şimdi gidip kutuyu rafa koyuyor. Programınızın herhangi bir başka yerinde Jiki gidip o kutuyu raftan alabilir ve içine bakabilir. Bu zihinsel modeli kurmaya şimdiden başlayın. Yıllardır kod yazıyorum ve hâlâ kod yazarken bir kutuya bir şey koyduğumu ve daha sonra geri çıkaracağımı hayal ediyorum. O `let` anahtar kelimesini gördüğünüzde gerçekten şöyle düşünün: “Tamam, demek ki yeni bir kutu yapıyorum.”

Değişkenlerin adları, yani bu kutuların üzerindeki etiketler hakkında da birkaç söz söyleyelim. Bunlarla ilgili birkaç kuralımız var. Öncelikle değişken adlarında boşluk olamaz. Bir kutunun etiketinde birden fazla kelime kullanmak istiyorsanız kelimeleri birbirine yapıştırır ve her kelimenin ilk harfini büyük harfe çeviririz. Buna _camel case_ (deve notasyonu) diyoruz. Devenin hörgüçlerinin her yeni kelimenin ilk harfini yukarı itip büyük harfe dönüştürdüğünü hayal edin. Yani etiket olarak benim adımı kullanmak isterseniz, iki kelimeyi arada boşlukla yazmak yerine N harfi büyük olacak şekilde tek kelime hâlinde yazarız: `myName`.

Ayrıca her değişken adı benzersiz olmalıdır. Aynı etikete sahip iki kutunuz olamaz; değişkenler fonksiyonlarla da aynı adı taşıyamaz. Bunu unutursanız Jiki'nin kafası karışır ve size bir hata mesajı verir.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki, ikisinde de name etiketi olan iki kutuya kafası karışmış hâlde bakıyor"
  width="485"
  height="400"
/>

Şimdi bir değişkeni nerede kullanmak isteyebileceğimize bakalım. Diyelim ki gökyüzüne bir güneş çiziyoruz. `circle` (daire) fonksiyonunu kullanıp ona dört girdi verebileceğimizi biliyoruz: `left` (sol), `top` (üst), `radius` (yarıçap) ve `color` (renk). Ama pek çok şey çizdikçe ve tüm bu sayılar kodumuzun her yerine dağıldıkça, kodu takip etmek ve okumak gerçekten zorlaşabilir. Bunun yerine sol konum, üst konum, `radius` ve `color` için birer değişken oluşturabilir ve daha sonra o değişkenlere başvurabiliriz. Buradaki asıl hedefimiz, `circle` fonksiyonunu kullanırken kutuların güzel, okunaklı adlarını yazabilmek; Jiki bu adları gördüğünde kutuları raflardan alıp içlerindekini kullanması gerektiğini bilecek.

Öyleyse bunlar için birkaç değişken oluşturalım. Güneşin sol konumuyla başlıyoruz. `let` anahtar kelimesini kullanarak Jiki'ye `leftPosition` (sol konum) adında yeni bir kutu yapmasını söylüyoruz. Buradaki deve notasyonuna, yani büyük P harfine dikkat edin. Sonra Jiki'ye kutuya hangi sayının gireceğini söylüyoruz. Jiki kutuyu raflara koyuyor, ardından aynısını `topPosition` (üst konum), `radius` ve `color` için de yapıyor.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Değişken raflarında etiketli kutular; her biri Jiki'nin daha sonra alması için bir değer saklıyor"
  width="500"
  height="378"
/>

Kodumuzun herhangi bir yerinde bu değişkenlere yeniden başvurabiliriz; Jiki de değerleri (İngilizce: _values_) kutulardan çıkarıp bir makineye koyar. Değişkenlerin bir diğer güzel yanı da şu: ne zaman güneşle aynı konumda bir şey çizmek istesek, aynı `leftPosition` ve `topPosition` değişkenlerini yeniden kullanabiliriz. Farklı bir örnek düşünelim. Bir duvar ördüğünüzü, duvarda 30 tuğla olduğunu ve tüm tuğlaların aynı genişlikte, aynı yükseklikte olmasını istediğinizi hayal edin. Kodunuzun başında genişlik ve yükseklik için birer değişken oluşturup kodunuzun geri kalanında hep onlara başvurmak çok daha iyidir. Çünkü daha sonra genişliği veya yüksekliği değiştirmek isterseniz, tek bir yerde değiştirmeniz yeterli olur ve geri kalan her şey kendiliğinden güncellenir.
