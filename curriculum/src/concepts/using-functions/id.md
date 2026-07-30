---
title: "Menggunakan fungsi"
description: "Menyuruh Jiki menjalankan salah satu mesin kecilnya dengan menulis namanya diikuti dua tanda kurung."
en_md5: 007a425ced42fd3550bfdf9fe6f7b391
---

Saat kamu menulis kode, yang sebenarnya kamu lakukan adalah menyampaikan apa yang kamu inginkan terjadi, dalam bahasa yang dimengerti komputer. Ada banyak sekali bahasa pemrograman, dan ada banyak sekali juga _interpreter_ (penerjemah) yang mengambil apa yang kamu tulis lalu mengubahnya menjadi angka satu dan nol yang bisa dipahami komputer. Di kursus ini, interpreter-mu adalah Jiki. Seluruh kursus ini dinamai dari Jiki. Inilah Jiki. Jiki akan menjadi temanmu dalam perjalanan belajar pemrograman ini. Tugasnya adalah menerjemahkan kode yang kamu tulis dan mengubahnya menjadi angka satu dan nol yang benar-benar bisa dijalankan komputer.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, interpreter yang ramah dan akan menemanimu sepanjang kursus ini"
  width="421"
  height="400"
/>

Inti dari pemrograman adalah memberikan instruksi yang tepat kepada interpreter, dalam hal ini Jiki. Ada banyak instruksi berbeda yang bisa kamu berikan ke Jiki, banyak hal yang dia pahami. Dia bisa menyambungkan berbagai hal, dia bisa melakukan sesuatu berulang kali, dan dia bisa berkata, “Kalau ini terjadi, maka aku harus melakukan ini.” Dia bisa mengingat sesuatu lalu memakainya lagi nanti. Dia juga bisa memberimu _error_ (kesalahan) kalau ada yang tidak benar. Semua hal ini akan kita bahas di kursus ini. Tapi yang paling penting untuk dipahami: semua yang akan kamu lakukan sebenarnya adalah menuliskan instruksi di sebuah papan tulis, lalu Jiki datang dan mengikutinya.

Waktu saya belajar pemrograman 34 tahun lalu, ini model mental yang saya bangun, dan sampai hari ini model itulah yang masih saya pakai. Saya paham bagaimana komputer bekerja sampai ke level angka satu dan nol, tapi sejujurnya saya hampir tidak pernah memikirkan itu. Di kepala saya, ada orang kecil yang tinggal di dalam komputer, dan saya menyuruhnya melakukan sesuatu. Jadi, ikuti saja cara berpikir ini. Ini model mental yang kuat dan bisa kamu bangun juga, dan kalau kamu mulai membayangkan secara visual apa yang sedang dilakukan si orang di dalam komputer, itu akan sangat membantumu selama belajar pemrograman.

Jadi, mari kita mulai dengan salah satu konsep paling dasar dalam pemrograman, yaitu fungsi (bahasa Inggris: _functions_). Fungsi itu seperti mesin-mesin kecil yang bisa kamu suruh Jiki gunakan. Kalau kita melihat ke dalam gudang Jiki, tempat dia biasa nongkrong, kamu akan melihat dia punya satu rak dengan tiga mesin berbeda: `move` (bergerak), `turnLeft` (belok kiri), dan `turnRight` (belok kanan).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Sebuah rak di gudang Jiki dengan tiga mesin berlabel move, turnLeft, dan turnRight"
  width="500"
  height="371"
/>

Ketika kamu menulis `move` diikuti dua tanda kurung itu, yang kamu lakukan adalah menyuruh Jiki mengambil mesin `move` dari rak, memutar tuasnya, menyalakannya, lalu menggunakannya.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki mendorong mesin move turun dari rak untuk digunakan"
  width="439"
  height="400"
/>

Ketika kamu menulis `turnLeft` diikuti tanda kurung, kamu menyuruh Jiki mengambil mesin `turnLeft` dari rak dan menggunakannya. Dan inilah pola yang akan kamu pakai berulang-ulang. Setiap kali kamu ingin menggunakan sebuah mesin, tulis namanya lalu tanda kurung itu, dan Jiki akan tahu bahwa dia harus mengambil mesin tersebut dan menggunakannya:

```javascript
move()
turnLeft()
```

Soal bagaimana mesin itu sebenarnya bekerja, apa yang terjadi di dalamnya, kita belum perlu memikirkannya sekarang. Nanti kita akan membahasnya jauh lebih detail. Bahkan, tidak lama lagi kamu juga akan bisa membuat mesinmu sendiri. Tapi untuk sekarang, jangan khawatirkan itu. Di setiap latihan, kamu akan diberi tahu mesin apa saja yang ada di rak Jiki. Setiap latihan punya mesin yang berbeda, dan kamu bisa memakai mesin-mesin itu untuk menyelesaikan latihannya.
