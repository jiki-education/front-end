---
title: "Perulangan repeat"
description: "Menggunakan kata kunci `repeat` untuk memberi tahu Jiki agar menjalankan kode di dalam tanda kurung kurawal sebanyak jumlah yang ditentukan."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Sejauh ini, semuanya ditulis secara linear: Jiki mengikuti setiap instruksi secara berurutan dari atas ke bawah.

Sekarang kita akan melihat bagaimana Jiki bisa keluar dari alur atas-ke-bawah yang kaku ini, khususnya bagaimana kita bisa menyuruh Jiki menjalankan bagian kode yang sama berkali-kali secara berturut-turut.

Misalnya, bayangkan kamu sedang berada di labirin dan ingin maju 10 langkah. Ada fungsi `walk` yang bisa membantu, tapi bagaimana kalau fungsi itu tidak ada? Bagaimana kalau kamu hanya punya fungsi `move` (bergerak maju satu langkah)?

Daripada menulis `move` 10 kali berturut-turut, yang sangat repetitif, yang kita perlukan adalah cara untuk berkata, “Hei, Jiki, lakukan hal berikutnya yang aku katakan sebanyak 10 kali.

`Move`.”

Untuk melakukannya dalam kode, kita perlu menggunakan kata kunci (bahasa Inggris: _keyword_) pertama kita. Kata kunci adalah instruksi yang dipahami Jiki. Bentuknya sedikit mirip mesin, tapi sebenarnya bukan. Saat Jiki melihat kata kunci, dia tidak mencari mesin di rak; dia langsung tahu harus melakukan sesuatu. Kemampuan itu sudah tertanam di otaknya. Ada sekitar 20 kata kunci berbeda yang akan kita pelajari selama kursus ini, dan yang pertama adalah kata kunci `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki dikelilingi kata kunci seperti repeat, if, else, and, or, dengan catatan bahwa kata kunci adalah instruksi yang dipahami Jiki"
  width="358"
  height="400"
/>

Kata kunci `repeat` melakukan persis seperti yang kukatakan di atas. Ia memberi tahu Jiki, “Ulangi sebanyak ini apa pun yang aku katakan berikutnya.” Coba lihat kode berikut. Pertama, kita menggunakan kata kunci `repeat` untuk memberi tahu Jiki bahwa dia akan melakukan sesuatu beberapa kali. Lalu kita menuliskan berapa kali kita ingin Jiki mengulanginya di dalam tanda kurung, dan setelah itu ada tanda kurung kurawal. Di dalam tanda kurung kurawal itulah hal-hal yang kita ingin Jiki ulangi. Nah, pola ini sangat umum dalam pemrograman: kita menuliskan sebuah kata kunci, biasanya disertai informasi tertentu (dalam hal ini berapa kali sesuatu harus dilakukan), lalu sebuah blok kode (bahasa Inggris: _code block_) di dalam tanda kurung kurawal. Jadi, kembali ke dunia labirin, daripada menulis `move`, `move`, `move`, `move`, kita bisa menulis: ulangi empat kali `move`.

```javascript
repeat(4) {
  move()
}
```

Jiki akan melihat kode itu dan menggunakan mesin `move` empat kali berturut-turut.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki menggunakan mesin move empat kali berturut-turut, satu demi satu"
  width="421"
  height="400"
/>

Dan kita tidak terbatas hanya menaruh satu hal di dalam tanda kurung kurawal itu. Jiki bisa melakukan beberapa hal secara berulang. Kita bisa menyuruh Jiki untuk `move`, lalu `turnLeft`, dan mengulangi seluruh rangkaian itu empat kali. Kalau Jiki melihat kode ini, dia akan menggunakan mesin `move`, lalu mesin `turnLeft`, lalu mesin `move`, lalu mesin `turnLeft`, lalu mesin `move`, dan seterusnya, sampai dia selesai melakukan keduanya empat kali.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki menggunakan mesin move lalu mesin turnLeft, mengulangi pasangan aksi itu empat kali"
  width="500"
  height="390"
/>

Instruksi `repeat` semacam ini kita sebut perulangan (bahasa Inggris: _loop_), dan ada banyak jenis perulangan yang bisa kita gunakan, masing-masing bekerja sedikit berbeda.

Ada satu hal lagi yang perlu kamu tahu: menjaga kode tetap rapi menjadi sangat penting saat bekerja dengan perulangan. Kalau struktur visual kodemu bagus, apa yang sedang terjadi jadi sangat mudah dilihat. Tapi kalau tidak, kalau kamu lupa membuat indentasi dengan rapi atau indentasimu campur aduk, semuanya cepat sekali jadi membingungkan. Karena itu, di kursus ini kita selalu punya satu aturan. Tanda kurung kurawal pembuka selalu ditaruh di baris yang sama dengan pernyataan (bahasa Inggris: _statement_) `repeat`. Tanda kurung kurawal penutup selalu ditaruh di barisnya sendiri setelah pernyataan itu, dan kode di antara keduanya selalu diberi indentasi dua spasi. Dengan begitu semuanya akan tetap rapi, dan kalau kamu lupa atau mencoba mengikuti pola lain, kamu akan mendapatkan error.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki menunjuk indentasi dan baris baru yang menjaga blok kode perulangan tetap rapi"
  width="500"
  height="398"
/>
