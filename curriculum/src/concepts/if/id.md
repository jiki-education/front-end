---
title: "Percabangan `if`"
description: "Menggunakan kata kunci `if` untuk menjalankan blok kode hanya saat suatu kondisi benar, seperti penjaga pintu yang memutuskan siapa boleh masuk."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Ada sebuah kata kunci yang membantu kita memberi tahu Jiki agar hanya melakukan sesuatu dalam situasi tertentu. Misalnya kamu sedang menulis kode untuk menjaga pintu masuk sebuah bar, anggaplah kamu seorang penjaga pintu, dan Jiki hanya boleh membuka pintu jika pakaian orang yang datang sudah pantas. Atau mungkin kamu menulis kode ketika kamu bertugas mengibarkan bendera finis di akhir sebuah balapan, tapi Jiki perlu tahu bahwa ia hanya boleh mengibarkannya di putaran terakhir. Dalam situasi-situasi seperti inilah kita akan menggunakan kata kunci `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki sebagai penjaga pintu yang memutuskan siapa yang boleh masuk ke klub malam"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki siap mengibarkan bendera finis di akhir balapan"
  width="266"
  height="400"
/>

Kita menggunakan kata kunci `if` dengan cara yang sangat mirip dengan `repeat`. Kita menaruh sebuah informasi di dalam tanda kurung. Dalam hal ini, informasi tersebut adalah kondisi (bahasa Inggris: _condition_) yang sedang kita periksa. Lalu kita menaruh blok kode di dalam tanda kurung kurawal, dan blok itu hanya kita jalankan jika kondisinya benar.

```javascript
if (condition) {
}
```

Nah, seperti apa sih kondisi-kondisi ini? Biasanya, kondisi berupa semacam perbandingan (bahasa Inggris: _comparison_). Kita membandingkan dua angka atau dua string, lalu memeriksa apakah hasilnya benar atau salah.

Jadi anggap saja ini sebagai pernyataan (bahasa Inggris: _statement_) yang bisa kamu ucapkan dengan lantang. Tiga kurang dari lima. Itu benar. Tujuh kurang dari dua. Itu salah.

Kita menggunakan simbol untuk menuliskan perbandingan ini. Kamu mungkin sudah mengenalnya dari pelajaran matematika. Ada kurang dari, lebih dari, kurang dari atau sama dengan, dan lebih dari atau sama dengan. Ada juga pemeriksaan untuk melihat apakah dua hal itu sama, apakah keduanya setara. Yang satu ini agak berbeda dari yang biasa kamu kenal, karena kita menggunakan tiga tanda sama dengan berturut-turut untuk memeriksa apakah dua hal itu sama atau berbeda.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Tabel simbol perbandingan: kurang dari, lebih dari, kurang dari atau sama dengan, lebih dari atau sama dengan, sama dengan, dan tidak sama dengan, beserta contohnya"
  width="449"
  height="400"
/>

Ini membantu kita agar tidak tertukar dengan saat kita mengisi atau memperbarui variabel, ketika satu tanda sama dengan berarti masukkan ini ke dalam kotak. Ingat saja: tiga tanda sama dengan untuk membandingkan.

Kamu juga bisa membandingkan string. Jadi `"hello"` sama dengan `"hello"`. Itu benar. Kedua string itu sama. Tapi hati-hati di sini, karena Jiki membandingkan setiap karakter (bahasa Inggris: _character_) di kedua string itu, di kedua lembar kertasnya. Jadi `"Hello"` dengan H besar tidak sama dengan `"hello"` dengan h kecil. Keduanya string yang berbeda. Membandingkan keduanya akan menghasilkan salah, karena H besar dan h kecil adalah karakter yang berbeda.

Oh iya, benar dan salah itu punya sebutan sendiri: _Boolean_. Kedengarannya seperti istilah teknis lagi, tapi sebenarnya sederhana sekali. Itu hanyalah cara formal untuk mengatakan bahwa sesuatu bernilai benar atau salah. Jadi kalau kamu menemukan kata Boolean, artinya cuma benar atau salah. Mari kita lihat contoh nyatanya. Bayangkan kita sedang membangun robot penjaga pintu untuk sebuah klub, dan kita ingin penjaga itu hanya membuka pintu jika orangnya berumur 21 tahun atau lebih. Kita punya fungsi `askAge` (menanyakan umur), yang bisa kita gunakan untuk mengetahui umur seseorang, dan kita akan menyimpan hasilnya di sebuah variabel bernama `age` (umur). Lalu kita bisa bilang, jika `age` itu lebih dari 20, kita buka pintunya. Jadi kalau `askAge` mengembalikan `30`, pintunya kita buka, dan kalau mengembalikan `12`, tidak.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki membuka pintu untuk orang yang cukup umur, dan menolak masuk orang yang masih terlalu muda"
  width="410"
  height="400"
/>
