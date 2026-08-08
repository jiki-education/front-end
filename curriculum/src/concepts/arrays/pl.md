---
title: "Tablice"
description: "Uporządkowany łańcuch elementów (stringów, liczb, wartości logicznych lub czegokolwiek innego), połączonych w jedną wartość, którą Jiki może się posługiwać."
en_md5: d26ccb9e04fbc77129f3199d63a95017
---

Używasz już liczb, stringów i wartości logicznych, czyli tego eleganckiego określenia na prawdę i fałsz. Wszystko to nazywamy typami danych (ang. _data types_). Teraz poznasz pierwszy złożony typ danych (ang. _compound data type_).

To typ danych, który może zawierać wiele rzeczy naraz, nie tylko jedną. Nazywa się tablicą (ang. _array_).

Gdy słyszysz słowo „tablica”, wyobraź sobie fizyczny łańcuch, który łączy wiele rzeczy.

Te rzeczy mogą być czymkolwiek: stringami, liczbami, wartościami logicznymi, nawet innymi tablicami, a nawet rzeczami, których jeszcze nie znasz. Ale na razie nie musisz się tym przejmować.

Wszystko w tym łańcuchu ma swoją kolejność, taką, w jakiej zostało połączone.

Tablica zawiera więc wiele rzeczy, ale sama jest jednym solidnym elementem, jedną całością: jedna tablica z wieloma elementami w środku.

Jiki może wziąć tę tablicę, ten łańcuch, i włożyć go do pudełka, dokładnie tak samo, jak wkłada do pudełka string albo liczbę.

Może ją włożyć do otworu wejściowego maszyny. Może ją wyciągnąć z kanału zwrotnego. Tablica jest jedną rzeczą i Jiki pracuje z nią dokładnie tak samo, jak ze stringami, liczbami i wszystkim innym, co już znasz.

W kodzie tablica też trochę przypomina łańcuch. Ma nawias kwadratowy na każdym końcu, a pomiędzy nimi wiele elementów połączonych ze sobą, oddzielonych przecinkami.

Na przykład: gdybyśmy chcieli stworzyć tablicę z imionami kilku naszych mentorów, moglibyśmy przygotować pudełko o nazwie `mentors` (mentorzy) i włożyć do niego ten łańcuch.

Napisalibyśmy `let mentors =`, dokładnie tak samo jak przy każdym innym pudełku, potem otwierający nawias kwadratowy, wiele elementów, czyli imiona oddzielone przecinkami, i na końcu zamykający nawias kwadratowy. Gdy Jiki to widzi, bierze cztery kartki papieru, po jednej na każde imię, potem bierze nowy łańcuch i łączy je wszystkie razem, a na końcu wkłada ten łańcuch do pudełka `mentors`.

Do tablicy można włożyć cokolwiek: stringi, liczby, wartości logiczne, a nawet mieszankę różnych rzeczy.

To wszystko są przykłady całkowicie poprawnych tablic.

Można też stworzyć pustą tablicę. To po prostu łańcuch bez elementów. Wciąż jest prawdziwą rzeczą. Wciąż ma oba końce. Wciąż jest łańcuchem. Po prostu nie ma nic w środku. Ale taką pustą tablicę nadal można włożyć do pudełka, wyjąć ją i użyć później.

Tablicę można więc stworzyć za pomocą składni z nawiasami kwadratowymi, ale jak z niej korzystać? Jak sprawdzić, co jest w środku, i jak coś z niej wyciągnąć? Dokładnie tak samo, jak przy wyciąganiu liter ze stringa. Używa się składni z nawiasami kwadratowymi i liczbą w środku.

Wróćmy do naszej listy mentorów. Jeśli chcemy wyciągnąć pierwszego z nich, piszemy `mentors[0]`. Pamiętaj, że w języku JavaScript liczymy od zera.

Możemy też iterować po tablicy dokładnie tak samo, jak wcześniej iterowaliśmy po stringach, za pomocą pętli `for-of`.

Z tablicami działa to dokładnie tak samo. Jedyna różnica jest taka, że tym razem zamiast litery dostajemy to, co było elementem tablicy. W tym przykładzie: imię mentora.

Za pierwszym razem dziękujemy więc `"DJ"`. Za drugim `"Becky"`, i tak dalej.

Na tablicach możemy też używać właściwości `length`, tak samo jak na stringach. Jeśli w pudełku `mentors` mamy tablicę z czterema stringami i napiszemy `mentors.length`, zwróci nam cztery.

Dokładnie tak samo działa na tablicach `includes`. Możemy napisać `mentors.includes("DJ")` i zwróci `true`. Ale jeśli napiszemy `mentors.includes("Frank")`, zwróci `false`.

Wszystko działa dokładnie tak samo jak ze stringami. Po prostu tym razem pracujemy z elementami tablicy, a nie z literami stringa.
