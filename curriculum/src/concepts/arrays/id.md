---
title: "Array"
description: "Rantai elemen yang berurutan (string, angka, boolean, atau apa pun) yang disatukan menjadi satu nilai yang bisa Jiki bawa ke mana-mana."
en_md5: d26ccb9e04fbc77129f3199d63a95017
---

Selama ini kamu sudah menggunakan angka, string, dan Boolean, istilah kerennya untuk benar dan salah. Semua itu kita sebut tipe data (bahasa Inggris: _data type_) yang berbeda-beda. Sekarang kita akan menambahkan tipe data majemuk (bahasa Inggris: _compound data type_) pertama kita.

Maksudnya, tipe data yang bisa berisi banyak hal sekaligus, bukan cuma satu hal, dan tipe data ini disebut _array_ (larik).

Setiap kali mendengar kata array, bayangkanlah sebuah rantai fisik yang menyatukan banyak benda.

Benda-benda yang disatukannya bisa apa saja: string, angka, Boolean, bahkan array lain, bahkan hal-hal yang belum kamu pelajari. Tapi jangan pusingkan itu dulu.

Semua yang ada di rantai ini punya urutan, yaitu urutan saat semuanya dirantai bersama.

Jadi sebuah array berisi banyak hal, tapi ia tetap satu elemen (bahasa Inggris: _element_) yang utuh, satu benda yang utuh: satu array dengan banyak elemen di dalamnya.

Jiki bisa mengambil array itu, rantai itu, lalu memasukkannya ke dalam sebuah kotak, sama seperti ia memasukkan string atau angka ke dalam kotak.

Ia bisa memasukkannya ke lubang sebuah mesin. Ia bisa menariknya keluar dari saluran keluaran. Array ini adalah satu benda, dan Jiki memperlakukannya persis sama seperti string, angka, dan semua hal lain yang sudah kamu lihat sejauh ini.

Nah, dalam kode, array juga terlihat sedikit mirip rantai. Ada tanda kurung siku di kedua ujungnya, lalu banyak item yang dirantai bersama, dipisahkan dengan koma.

Misalnya, kalau kita ingin membuat array berisi nama beberapa mentor kita, kita bisa menyiapkan sebuah kotak bernama `mentors` (para mentor) dan memasukkan rantai itu ke dalamnya.

Kita tulis `let mentors =`, persis sama seperti pada kotak lainnya, lalu ada tanda kurung siku pembuka, banyak elemen berupa nama-nama yang dipisahkan koma, dan diakhiri tanda kurung siku penutup. Saat Jiki melihat ini, ia mengambil empat lembar kertas, satu untuk setiap nama, lalu mengambil rantai baru dan merantai semuanya jadi satu, kemudian memasukkan rantai itu ke dalam kotak `mentors`.

Kamu bisa memasukkan apa saja ke dalam array: string, angka, Boolean, bahkan campuran dari semuanya.

Ini semua contoh array yang sepenuhnya valid.

Kamu juga bisa membuat array kosong. Itu cuma rantai tanpa elemen. Ia tetap benda sungguhan. Kedua ujungnya tetap ada. Ia tetap sebuah rantai. Hanya saja tidak ada item di dalamnya. Tapi kamu tetap bisa memasukkan array kosong ini ke dalam kotak, mengeluarkannya, dan memakainya nanti.

Jadi kamu bisa membuat array dengan sintaks tanda kurung siku. Tapi bagaimana cara memakainya? Bagaimana cara memeriksa isinya dan mengeluarkan sesuatu dari dalamnya? Nah, caranya persis sama seperti saat kita ingin mengambil huruf dari sebuah string. Kita bisa memakai sintaks tanda kurung siku dengan angka di dalamnya.

Mari kita kembali ke daftar mentor kita. Kalau ingin mengambil yang pertama, kita tulis `mentors[0]`. Ingat, di JavaScript kita menghitung mulai dari nol.

Kita juga bisa menelusuri isi array satu per satu, persis seperti kita menelusuri string sebelumnya, menggunakan `for-of`.

Cara kerja array persis sama. Bedanya, kali ini yang kita ambil bukan huruf, melainkan item yang ada di dalam array itu. Dalam contoh ini, nama mentornya.

Jadi saat pertama kali berterima kasih, kita berterima kasih kepada `"DJ"`. Kedua kalinya kepada `"Becky"`, dan seterusnya.

Kita juga bisa memakai properti `length` pada array, sama seperti yang kita pelajari pada string. Kalau ada array berisi empat string di dalam kotak `mentors` dan kita menulis `mentors.length`, ia akan mengembalikan empat.

Dan `includes` juga bisa dipakai persis sama pada array. Kita bisa menulis `mentors.includes("DJ")`, dan hasilnya `true`. Tapi kalau kita menulis `mentors.includes("Frank")`, hasilnya `false`.

Semuanya bekerja persis sama seperti string. Bedanya cuma, kita bekerja dengan elemen-elemen sebuah array, bukan huruf-huruf sebuah string.
