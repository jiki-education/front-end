---
title: "धारीदार कपड़ा"
description: "हर धारी का रंग सही चुनकर एक धारीदार पैटर्न बुनिए।"
en_md5: ba93b39f1883d50139d243a16e3c204f
---

आप एक ऐसा एल्गोरिदम डिज़ाइन कर रहे हैं जो धारीदार कपड़े का एक रोल बनाए। वह कुछ इस तरह दिखना चाहिए:

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="बीस खड़ी पट्टियाँ: दोनों सिरों पर बैंगनी, बीच में हरी, नीली और पीली पट्टियाँ" style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
  <rect x="0" y="0" width="5" height="100" fill="#A020F0" />
  <rect x="5" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="10" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="15" y="0" width="5" height="100" fill="#008000" />
  <rect x="20" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="25" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="30" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="35" y="0" width="5" height="100" fill="#008000" />
  <rect x="40" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="45" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="50" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="55" y="0" width="5" height="100" fill="#008000" />
  <rect x="60" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="65" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="70" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="75" y="0" width="5" height="100" fill="#008000" />
  <rect x="80" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="85" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="90" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="95" y="0" width="5" height="100" fill="#A020F0" />
</svg>

यह पैटर्न "yellow", "blue", "yellow", "green" का एक दोहराया जाने वाला क्रम है। पहली और आखिरी धारी "purple" है।

जिस कैनवास पर आप डिज़ाइन कर रहे हैं, उसकी चौड़ाई `100` और ऊँचाई `100` है। आपको `20` धारियाँ बनानी हैं, जिनमें से प्रत्येक `5` चौड़ी है।

### अभ्यास के नियम

इस अभ्यास को केवल 20 rectangle स्टेटमेंट लिखकर हल नहीं किया जा सकता। आपका कोड किसी भी आकार के कपड़े के लिए काम करने वाला होना चाहिए। असल में, आप अपने कोड में `rectangle(...)` (आयत) फंक्शन का इस्तेमाल सिर्फ एक बार ही कर सकते हैं!

इसके बजाय, आपको लूप का उपयोग करना है और पिछले वीडियो पाठ में देखे गए शेषफल (_remainder_) ऑपरेटर (_operator_) का इस्तेमाल करना है। स्टेटमेंट के क्रम के बारे में ध्यान से सोचिए: यही इस अभ्यास में सफल होने की कुंजी है।

आराम से कीजिए और मज़े कीजिए!
