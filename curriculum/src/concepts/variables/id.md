---
title: "Membuat dan menggunakan variabel"
description: "Kotak-kotak di rak Jiki yang menyimpan sebuah nilai dengan label, supaya kamu bisa mengambilnya kembali nanti di kodemu."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

Variabel (bahasa Inggris: _variables_) adalah cara kita menyimpan informasi. Saat menulis kode, kita sering perlu menyimpan sebuah angka atau string untuk dipakai nanti, dan variabel adalah cara kita melakukannya. Jadi mari kita mundur sedikit di gudang Jiki, dan kamu akan melihat dia punya satu set rak lagi. Kita sudah kenal dengan rak pertama yang berisi fungsi-fungsi, mesin-mesin kecil seperti `move` dan `rectangle`. Tapi di rak kedua ini, alih-alih mesin, kamu bisa melihat banyak kotak, dan kotak-kotak inilah yang kita sebut variabel. Kamu bisa menyuruh Jiki menyimpan apa saja di dalam kotak-kotak ini, lalu nanti memintanya mengambil isinya kembali. Setiap kotak punya nama, persis seperti fungsi yang punya nama, dan setiap kotak hanya berisi satu hal. Untuk saat ini, entah angka atau string. Tapi cara menyimpan hal-hal yang lebih kompleks di dalamnya akan kita bahas nanti di kursus ini.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Dua set rak di gudang Jiki: satu berlabel fungsi berisi mesin, satu berlabel variabel berisi kotak"
  width="500"
  height="173"
/>

Jadi bagaimana cara kita menyuruh Jiki membuat kotak dan memasukkan sesuatu ke dalamnya? Kita menggunakan kata kunci `let` (misalkan). Kata kunci `let` memberi tahu Jiki bahwa dia perlu membuat kotak baru. Kamu bisa membayangkan dia mengeluarkan kotak kardus dari bungkusnya, merakitnya, lalu dia melihat apa yang ada setelah kata `let`, dan itulah label yang dia tempelkan di kotaknya, dalam hal ini `name` (nama). Jadi dia mengambil pulpennya dan menulis `name` di labelnya. Lalu dia melihat apa yang ada setelah tanda sama dengan (bahasa Inggris: _equal sign_). Dalam hal ini, itu namaku, `"Jeremy"`, dan karena `"Jeremy"` adalah string, dia mengambil selembar kertas dan menulis `"Jeremy"` di atasnya. Itu cuma string, persis seperti warna-warna yang sudah kamu pakai selama ini, lalu dia memasukkan kertas itu ke dalam kotaknya.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki memegang selembar kertas bertuliskan string Jeremy, siap dimasukkan ke dalam kotak"
  width="373"
  height="400"
/>

Jadi kita sudah menyuruhnya membuat kotak, menempelkan label, dan memasukkan sesuatu ke dalamnya, dan sekarang dia pergi menaruh kotak itu di rak. Lalu kapan pun di programmu, Jiki bisa pergi mengambil kotak itu dari rak dan melihat apa isinya. Mulailah membangun model mental ini. Aku sudah menulis kode sejak lama sekali, dan sampai sekarang pun saat menulis kode aku masih membayangkan bahwa aku sedang memasukkan sesuatu ke dalam kotak dan akan mengambilnya lagi nanti. Saat kamu melihat kata kunci `let`, benar-benar pikirkan, “Oke, berarti aku sedang membuat kotak baru.”

Sedikit catatan soal nama variabel, label di kotak-kotak ini. Ada beberapa aturan tentangnya. Pertama, nama variabel tidak boleh mengandung spasi. Kalau kamu ingin memakai beberapa kata untuk label sebuah kotak, kita rapatkan kata-katanya, dan huruf pertama setiap kata kita ubah menjadi huruf kapital. Ini kita sebut _camel case_ (gaya punuk unta). Bayangkan punuk-punuk unta mendorong huruf pertama setiap kata baru sehingga menjadi huruf kapital. Jadi kalau kamu ingin label berupa namaku, alih-alih menulis dua kata dengan spasi, kita menulisnya sebagai satu kata dengan huruf N kapital: `myName`.

Selain itu, setiap nama variabel harus unik. Kamu tidak boleh punya dua kotak dengan label yang sama, dan variabel juga tidak boleh punya nama yang sama dengan fungsi. Kalau kamu lupa, Jiki akan bingung dan memberimu pesan error.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki tampak bingung melihat dua kotak yang sama-sama berlabel name"
  width="485"
  height="400"
/>

Sekarang mari kita lihat di mana kita mungkin ingin memakai variabel. Misalnya kita sedang menggambar matahari di langit. Kita tahu kita bisa memakai fungsi `circle` (lingkaran) dan memberinya empat input: `left` (kiri), `top` (atas), `radius`, dan `color` (warna). Tapi begitu kita menggambar banyak hal dan semua angka ini bertebaran di seluruh kode kita, kodenya bisa jadi sangat sulit diikuti dan dibaca. Jadi sebagai gantinya, kita bisa membuat variabel untuk masing-masing left, top, `radius`, dan `color`, lalu merujuk ke variabel-variabel itu nanti. Tujuan akhir kita di sini adalah bisa memakai fungsi `circle` sambil menyebutkan nama-nama kotak yang enak dibaca, dan saat Jiki melihat nama-nama itu, dia tahu harus mengambil kotaknya dari rak dan memakai apa pun yang ada di dalamnya.

Jadi mari kita buat beberapa variabel untuk ini. Kita mulai dengan posisi kiri matahari. Kita pakai kata kunci `let` untuk menyuruh Jiki membuat kotak baru bernama `leftPosition` (posisi kiri). Perhatikan _camel case_ di sana, dengan huruf P kapital. Lalu kita beri tahu Jiki angka apa yang masuk ke kotak itu. Dia menaruhnya di rak, lalu melakukan hal yang sama untuk `topPosition` (posisi atas), `radius`, dan `color`.

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
  alt="Kotak-kotak berlabel di rak variabel, masing-masing menyimpan satu nilai untuk diambil Jiki nanti"
  width="500"
  height="378"
/>

Kapan pun di kode kita, kita bisa merujuk kembali ke variabel-variabel ini, dan Jiki akan mengambil nilai (bahasa Inggris: _values_) yang tersimpan dan memasukkannya ke dalam mesin. Hal hebat lain dari variabel adalah kapan pun kita ingin menggambar sesuatu di posisi yang sama dengan matahari, kita bisa memakai ulang variabel `leftPosition` dan `topPosition` yang sama. Ambil contoh lain. Bayangkan kamu sedang membangun tembok dengan 30 batu bata, dan kamu ingin semua batanya punya lebar dan tinggi yang sama. Jauh lebih baik membuat variabel untuk lebar dan tinggi di awal kodemu, lalu merujuk kembali ke variabel-variabel itu di sisa kodemu. Karena kalau nanti kamu ingin mengubah lebar atau tingginya, kamu cukup mengubahnya di satu tempat, dan semua yang lain akan ikut terbarui.
