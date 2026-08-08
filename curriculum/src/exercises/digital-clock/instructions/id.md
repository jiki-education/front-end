---
title: "Jam Digital"
description: "Tampilkan waktu yang benar pada jam digital 12 jam."
en_md5: e3decc089d371b7113f2657f7571c001
---

Dalam latihan ini kamu akan menggunakan dua fungsi baru untuk mendapatkan waktu:

- `currentTimeHour()` (jam saat ini): Mengembalikan jam saat ini dalam format 24 jam (misalnya 15 menit menjelang tengah malam akan mengembalikan `23`) sebagai angka.
- `currentTimeMinute()` (menit saat ini): Mengembalikan menit saat ini sebagai angka.

Tugasmu adalah memperbarui jam digital berdasarkan angka apa pun yang dikembalikan kedua fungsi itu.

Jam digital ini mengharapkan angka dalam format 12 jam yang disertai `am` atau `pm` (yang disebut "meridiem").

Contohnya:

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

Untuk menampilkan waktu pada jam, kamu menggunakan fungsi `displayTime(hour, minutes, meridiem)` (menampilkan waktu).

Di setiap skenario, waktu saat ini berubah. Tugasmu adalah menulis kode yang membuat semua skenario berhasil. Di skenario terakhir, kami menggunakan waktu asli yang sebenarnya, jadi skenarionya akan berubah setiap kali waktu sebenarnya bergeser satu menit!
