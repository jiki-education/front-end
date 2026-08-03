---
title: "String"
description: "Potongan teks yang diapit tanda kutip (satu huruf, satu kata, satu kalimat, atau satu paragraf utuh) yang ditulis Jiki di atas kertas."
en_md5: 89b04f3849f9388a46734924f35c913c
---

Saat kamu ingin menggunakan angka, kamu bisa langsung menuliskan angka itu, dan Jiki tahu maksudmu. Tapi bagaimana kalau kamu ingin menggunakan huruf, kata, atau kalimat? Misalnya, pada fungsi `rectangle` (persegi panjang) atau fungsi `circle` (lingkaran), bagaimana kalau ada input tambahan untuk menentukan warnanya? Bagaimana cara kita menuliskan warna itu supaya bisa dimasukkan ke dalam mesin? Kalau kita hanya menulis kata `green` (hijau) atau `blue` (biru), Jiki akan mengira kita sedang menunjuk sebuah mesin di rak, dan dia akan berkata, “Tidak ada mesin bernama green. Aku tidak tahu harus berbuat apa.”

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki berdiri kebingungan di samping mesin rectangle, dengan tanda tanya di atas kepalanya"
  width="446"
  height="400"
/>

Jadi kita punya aturan: setiap kali perlu menggunakan teks, kita harus menaruhnya di dalam tanda kutip, tepatnya tanda kutip ganda. Saat kamu menaruh sesuatu di dalam tanda kutip seperti ini, Jiki akan mengambil selembar kertas dan menulis apa pun yang kamu taruh di dalam tanda kutip itu di kertas tersebut. Potongan-potongan kertas inilah yang kita sebut _string_ (rangkaian).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki menulis kata green di selembar kertas, yang menjadi sebuah string"
  width="398"
  height="400"
/>

String bisa berupa satu huruf, satu kata, satu kalimat, satu paragraf, bahkan sebuah buku. Aturannya: kalau itu teks, kita taruh di dalam tanda kutip, dan jadilah string.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Papan tulis menampilkan string dengan berbagai panjang di dalam tanda kutip: satu huruf, satu kata, satu kalimat, dan sebuah alamat beberapa baris"
  width="500"
  height="398"
/>

Jadi kalau kita ingin membuat persegi panjang biru, kita tulis angka untuk posisi kirinya, posisi atasnya, lebarnya, dan tingginya. Tapi untuk input kelima, kita akan menulis `"blue"` di dalam tanda kutip.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki akan mengambil mesinnya dari rak, lalu memasukkan koin ke empat lubang pertama. Kemudian dia akan menulis blue di selembar kertas, memasukkan kertas itu ke lubang kelima, lalu menjalankan mesinnya.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki memasukkan kertas bertuliskan blue ke lubang kelima mesin rectangle, dengan koin 10, 20, 30, 40 di empat lubang pertama"
  width="500"
  height="392"
/>

String memang salah satu istilah teknis yang awalnya terasa agak menakutkan, tapi sebenarnya artinya cuma teks. Kamu akan cepat terbiasa. Tidak ada yang ajaib di sini.
