---
title: "Gökkuşağı"
description: "100 renkli dikey çubuktan oluşan bir gökkuşağı boyayın."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Göreviniz, 100 dikey çubuktan oluşan güzel bir gökkuşağı deseni oluşturmak. Sonuç şöyle görünmeli:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Gökkuşağı" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Gökkuşağı, her biri yukarıdan aşağıya uzanan ve genişliği `1` olan `100` çubuktan oluşuyor. İlk çubuğun `x` (yatay konum) değeri `0`, son çubuğun `x` değeri `99` olmalı.

Rengi ayarlamak için `hsl(...)` (renk tonu, doygunluk, açıklık) fonksiyonunu kullanın. Bu fonksiyon bir renk karakter dizisi döndürür (İngilizce: _returns_); bu karakter dizisini daha sonra `rectangle(...)` (dikdörtgen) fonksiyonuna son girdi olarak verebilirsiniz. Doygunluk (İngilizce: _saturation_) ve açıklık (İngilizce: _lightness_) değerlerini `50` civarında tutmak muhtemelen en iyisi. Açıklık, rengin ne kadar açık ya da koyu olduğunu belirler: değer küçüldükçe renk koyulaşır, büyüdükçe açılır. İlk çubuğun **renk tonu (İngilizce: _hue_)** değeri `0` olmalı. Renk tonu her çubukta biraz artmalı ve sonunda 300 civarında bir değere ulaşmalı.
