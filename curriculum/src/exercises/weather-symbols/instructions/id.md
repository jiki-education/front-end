---
title: "Simbol Cuaca"
description: "Gambarlah prakiraan cuaca enam hari dari sebuah daftar deskripsi."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

Kamu diminta membuat prakiraan cuaca untuk enam hari. Tapi alih-alih menerima data cuaca pada umumnya, bosmu memberimu deskripsi cuaca berdasarkan perasaannya terhadap cuaca itu (misalnya "Snowboarding time! 🏂" atau "Miserable 😩").

Kamu diberi sebuah _array_ (larik) berisi enam deskripsi cuaca, satu untuk setiap hari, dan tugasmu adalah menggambar cuaca setiap hari ke dalam kotaknya masing-masing.

Prakiraan ini ditampilkan sebagai kisi berisi enam kotak, satu untuk setiap hari dari Senin sampai Sabtu. Deskripsinya tersusun berurutan: yang pertama (kotak `0`) adalah cuaca hari Senin, yang kedua (kotak `1`) cuaca hari Selasa, dan seterusnya sampai Sabtu (kotak `5`). (Bosmu tidak pernah keluar rumah di hari Minggu, jadi dia tidak peduli dengan cuacanya, dan karena itu kita tidak akan pernah bisa melaporkannya...)

## Menggambar satu hari

Kami sudah menyiapkan fungsi `draw` (menggambar) yang mengerjakan semua urusan gambarnya untukmu. Tugasmu adalah menentukan elemen yang tepat untuk dimasukkan ke dalamnya.

```js
draw(box, day, elements)
```

- `box` adalah kotak tempat menggambar (`0` sampai `5`).
- `day` adalah nama hari untuk label kotaknya, misalnya `"Monday"`.
- `elements` adalah array berisi simbol cuaca yang akan ditampilkan (lihat detailnya di bawah).

Nama-nama harinya, secara berurutan, adalah `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"`, dan `"Saturday"`.

Jadi kalau hari pertamanya `"Exciting 🤩"`, kamu akan menulis:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## Arti setiap deskripsi

Setiap deskripsi dipetakan ke satu array simbol tertentu:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## Tugasmu

Kerjakan daftar `days` satu hari demi satu hari. Untuk setiap deskripsi, ubah deskripsi itu menjadi daftar simbol yang tepat, lalu gunakan `draw` untuk menggambarnya ke dalam kotak hari itu, dengan label nama hari yang sesuai.
