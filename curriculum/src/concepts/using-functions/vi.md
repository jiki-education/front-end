---
title: "Sử dụng hàm"
description: "Bảo Jiki chạy một trong những cái máy nhỏ của cậu ấy bằng cách viết tên máy rồi thêm hai dấu ngoặc đơn."
en_md5: 007a425ced42fd3550bfdf9fe6f7b391
---

Khi bạn viết code, thật ra bạn đang diễn đạt điều mình muốn xảy ra bằng một ngôn ngữ mà máy tính hiểu được. Có rất nhiều ngôn ngữ lập trình khác nhau, và cũng có rất nhiều thông dịch viên (tiếng Anh: _interpreters_) khác nhau. Chúng nhận những gì bạn viết rồi chuyển thành các số 0 và 1 mà máy tính hiểu được. Trong khóa học này, thông dịch viên của bạn là Jiki. Cả khóa học được đặt tên theo Jiki. Đây là Jiki. Jiki sẽ là người bạn đồng hành trên hành trình học lập trình này. Việc của cậu ấy là thông dịch đoạn code bạn viết và chuyển nó thành các số 0 và 1 mà máy tính thực sự làm việc được.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, thông dịch viên thân thiện sẽ đồng hành cùng bạn suốt khóa học này"
  width="421"
  height="400"
/>

Mục đích của việc lập trình là đưa cho thông dịch viên, ở đây là Jiki, những chỉ dẫn đúng. Có rất nhiều chỉ dẫn khác nhau mà bạn có thể đưa cho Jiki, rất nhiều thứ cậu ấy hiểu được. Cậu ấy có thể ghép các thứ lại với nhau, có thể làm một việc gì đó thật nhiều lần, và có thể nói: “Nếu điều này xảy ra thì mình cần làm việc kia.” Cậu ấy có thể ghi nhớ mọi thứ rồi dùng lại sau đó. Cậu ấy cũng có thể báo cho bạn một lỗi (tiếng Anh: _error_) nếu có gì đó không ổn. Chúng ta sẽ tìm hiểu tất cả những điều này trong khóa học. Nhưng điều quan trọng nhất cần hiểu là: mọi việc bạn sắp làm đều là viết các chỉ dẫn lên một cái bảng, rồi Jiki đi tới và làm theo.

Hồi mình học lập trình 34 năm trước, đây chính là mô hình tư duy mà mình đã xây dựng, và tới hôm nay mình vẫn giữ nó. Mình hiểu máy tính hoạt động thế nào, xuống tới từng số 0 và số 1, nhưng thật lòng thì gần như chẳng bao giờ nghĩ tới chuyện đó. Trong đầu mình có một người tí hon sống trong máy tính, và mình bảo cậu ta làm gì. Nên bạn hãy thử nghĩ theo cách này cùng mình nhé. Đây là một mô hình tư duy rất mạnh mà bạn có thể tự xây dựng, và nếu bạn bắt đầu hình dung thật trực quan về việc người tí hon trong máy tính đang làm gì, điều đó sẽ giúp bạn rất nhiều trên đường học lập trình.

Vậy thì chúng ta cùng bắt đầu với một trong những khái niệm nền tảng nhất của lập trình: hàm (tiếng Anh: _functions_). Hàm giống như những cái máy nhỏ mà bạn có thể nhờ Jiki dùng. Nếu ngó vào nhà kho của Jiki, chỗ cậu ấy hay lui về, bạn sẽ thấy cậu ấy có một cái kệ với ba cái máy khác nhau: `move` (di chuyển), `turnLeft` (rẽ trái) và `turnRight` (rẽ phải).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Một cái kệ trong nhà kho của Jiki với ba cái máy mang nhãn move, turnLeft và turnRight"
  width="500"
  height="371"
/>

Khi bạn viết `move` rồi thêm hai dấu ngoặc đơn đó, việc bạn làm là bảo Jiki đi lấy cái máy `move` xuống khỏi kệ, vặn tay quay, khởi động nó lên và dùng nó.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki đẩy cái máy move xuống khỏi kệ để dùng"
  width="439"
  height="400"
/>

Khi bạn viết `turnLeft` rồi thêm hai dấu ngoặc đơn, bạn đang bảo Jiki lấy cái máy `turnLeft` xuống khỏi kệ và dùng nó. Đây chính là khuôn mẫu bạn sẽ dùng lại nhiều lần. Mỗi khi muốn dùng một cái máy, bạn viết tên của nó rồi thêm hai dấu ngoặc đơn đó, thế là Jiki biết phải đi lấy máy ra và dùng:

```javascript
move()
turnLeft()
```

Còn cái máy đó thực sự hoạt động ra sao, bên trong nó có những gì, thì bây giờ chúng ta chưa cần lo. Sau này chúng ta sẽ xem kỹ hơn nhiều. Thật ra chẳng lâu nữa bạn còn tự làm được máy riêng của mình. Nhưng giờ thì đừng lo về chuyện đó. Ở mỗi bài tập, bạn sẽ được cho biết trên kệ của Jiki có những cái máy nào. Mỗi bài tập sẽ có những máy khác nhau, và bạn dùng chúng để giải bài tập.
