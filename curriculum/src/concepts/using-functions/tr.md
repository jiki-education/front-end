---
title: "Fonksiyonları kullanmak"
description: "Adını ve ardından iki parantez yazarak Jiki'ye küçük makinelerinden birini çalıştırmasını söylemek."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Kod yazarken aslında yaptığınız şey, ne olmasını istediğinizi bilgisayarın anladığı bir dilde anlatmaktır. Pek çok farklı programlama dili var ve yazdıklarınızı alıp bilgisayarın anlayabileceği birlere ve sıfırlara dönüştüren pek çok farklı yorumlayıcı (İngilizce: _interpreter_) var. Bu kursta yorumlayıcınız Jiki. Kursun adı da Jiki'den geliyor. İşte bu Jiki. Jiki, bu programlama yolculuğunda arkadaşınız olacak. Onun işi, yazdığınız kodu yorumlamak ve bilgisayarın gerçekten işleyebileceği birlere ve sıfırlara dönüştürmek.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, bu kurs boyunca size yol gösterecek dost canlısı yorumlayıcı"
  width="421"
  height="400"
/>

Programlamanın bütün amacı, yorumlayıcıya, bu durumda Jiki'ye doğru talimatları vermektir. Jiki'ye verebileceğiniz pek çok farklı talimat var, anladığı çok şey var. Bir şeyleri birbirine ekleyebilir, bir şeyi defalarca yapabilir, “Bu olursa, o zaman şunu yapmam gerekir” diyebilir. Bir şeyleri hatırlayıp sonra tekrar kullanabilir. Bir şey yolunda değilse size bir hata (İngilizce: _error_) verebilir. Bu kursta bunların hepsini göreceğiz. Ama anlaşılması gereken en önemli şey şu: yapacağınız her şey, Jiki'nin gelip uygulaması için bir beyaz tahtaya talimatlar yazmaktan ibaret.

34 yıl önce programlamayı öğrendiğimde kafamda kurduğum zihinsel model buydu ve bugün de hâlâ aynısını kullanıyorum. Bilgisayarların birlere ve sıfırlara kadar nasıl çalıştığını biliyorum, ama açıkçası bunu hiç düşünmüyorum. Kafamda, bilgisayarın içinde yaşayan küçük bir adam var ve ona ne yapacağını söylüyorum. Bu yüzden bu konuda bana katılın. Bu, kurabileceğiniz çok güçlü bir zihinsel modeldir. Bilgisayarın içindeki kişinin ne yaptığını görsel bir şekilde düşünmeye başlamak, programlamayı öğrenirken çok yarar sağlayacaktır.

Öyleyse programlamanın temel kavramlarından biriyle, fonksiyonlarla (İngilizce: _function_) başlayalım. Fonksiyonlar, Jiki'ye kullanmasını söyleyebileceğiniz küçük makineler gibidir. Jiki'nin takıldığı yer olan deposuna bakarsak, üzerinde üç farklı makine bulunan bir rafı olduğunu göreceksiniz: `move` (hareket et), `turnLeft` (sola dön) ve `turnRight` (sağa dön).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Jiki'nin deposunda, üzerinde move, turnLeft ve turnRight yazan üç makinenin durduğu bir raf"
  width="500"
  height="371"
/>

`move` yazıp arkasına o iki parantezi eklediğinizde, aslında Jiki'ye `move` makinesini raftan indirmesini, kolunu çevirip çalıştırmasını ve kullanmasını söylemiş oldunuz.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki, kullanmak için move makinesini raftan indiriyor"
  width="439"
  height="400"
/>

`turnLeft` yazıp arkasına parantezleri eklediğinizde de Jiki'ye `turnLeft` makinesini raftan indirip kullanmasını söylemiş oldunuz. Tekrar tekrar kullanacağınız kalıp da bu. Bir makineyi kullanmak istediğinizde adını, ardından da o parantezleri yazacaksınız; bu da Jiki'ye gidip makineyi getirmesini ve kullanmasını söyleyecektir:

```javascript
move()
turnLeft()
```

Makinenin gerçekte nasıl çalıştığı, içinde neler olup bittiği şimdilik bizi ilgilendirmiyor. Daha sonra buna çok daha ayrıntılı bakacağız. Hatta çok geçmeden kendi makinelerinizi de yapabileceksiniz. Ama şimdilik bunu kafanıza takmayın. Her alıştırmada Jiki'nin rafında hangi makinelerin bulunduğu size söylenecek. Her alıştırmada farklı makineler olacak ve alıştırmaları çözmek için bu makineleri kullanabileceksiniz.
