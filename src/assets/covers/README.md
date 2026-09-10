# covers/ —— 画廊封面素材

首页那个画廊（`Home.jsx` 里的 `ExperimentGallery`）每一格封面用到的素材，都放在这里。
**一个项目一个文件夹**，以后要换封面，只在这里动就行。

```
covers/
  hive-rebranding/   01-hero.mp4  02-ins1.png  03-poster1.png  04-demo1.mp4  05-keyvisual.mp4
  heartie/           01-ipad2.png 02-cover.png 03-watch.png 04-ipad1.png 05-ad1.png 06-merch1.png
  heykura/           01-cover.jpg 02-covervideo.mp4
  primus/            01-3.1.png 02-12.png 03-18.png 04-1.mp4
  parkinson/         01-screen1.png 02-screen2.png
  lepal/             01-work-lepal.jpg
  hay/               01-14.png
  kevzara/           01-hero.png
  jakafi/            01-hero.png
  niktimvo/          01-hero.png
  Soundscape/        01-soundscape.jpg
  SolarX/            01-solarx.jpg
  Food Delivery/     01-food-delivery.jpg
  flowith/           bg.png  main.mp4        ← 叠加型，不用数字前缀
  <下一个项目>/
    01-...
```

## 规则

- **文件名前缀的数字 = 播放顺序**（01 先播，02 其次……），在 Finder 里一眼就能看出顺序
- 数字后面保留素材原本的名字，方便回溯它是从哪来的
- 视频（.mp4）会**完整播完**才进下一帧；图片会**停 2 秒**再进下一帧；整组无限循环
- 默认裁切填满格子（`object-cover`）；素材尺寸偏小、想居中留白的，在代码里标 `fit: 'contain'`

## 播放顺序和 fit 在哪改

在 `src/pages/Home.jsx` 里，搜 `CoverSeq`：

```js
const hiveCoverSeq = [
  { type: 'video', src: hiveHeroVid },                   // 完整播完
  { type: 'img',   src: hiveIns1 },                      // 停 2s
  { type: 'img',   src: hivePoster1 },                   // 停 2s
  { type: 'video', src: hiveDemo1Vid, fit: 'contain' },  // 完整播完，居中留白
  { type: 'video', src: hiveKeyVisualVid },               // 完整播完
]
```

## 封面怎么对应到画廊格子

**不是按第几格，是按项目名匹配的**（`Home.jsx` 里的 `coverMatchers`）：

```js
const coverMatchers = [
  { test: /hive/i,            seq: hiveCoverSeq },
  { test: /heartie/i,         seq: heartieCoverSeq, bg: '#ffffff' }, // 这一格底色改成白
  { test: /heykura/i,         seq: heykuraCoverSeq },
  { test: /primus/i,          seq: primusCoverSeq },
  { test: /lepal/i,           seq: lepalCoverSeq },
  { test: /\bhay\b/i,         seq: hayCoverSeq },
  { test: /flowith/i,         layer: flowithCoverLayer },            // 叠加型用 layer
  { test: /parkinson/i,       seq: parkinsonCoverSeq },
  { test: /kev/i,             seq: kevzaraCoverSeq },
  { test: /jak/i,             seq: jakafiCoverSeq },
  { test: /nik/i,             seq: niktimvoCoverSeq },
  { test: /soundscape/i,      seq: soundscapeCoverSeq },
  { test: /solar\s*x/i,       seq: solarxCoverSeq },
  { test: /food\s*delivery/i,  seq: foodDeliveryCoverSeq },
]
```

`bg` 可选，是**这一格 placeholder 的底色**，不填默认灰 `#e9e9e7`。
标了 `fit: 'contain'` 的素材，四周露出来的就是这个颜色。

只要那一格的项目名里带得上关键词（这里是 `hive`，不分大小写），封面就会出现在那格。
所以在页面上改名字、调顺序都不会让封面跑丢。加新项目就往这个表里加一行。

## 现有项目

| 文件夹 | 匹配关键词 | 一轮时长 | 顺序 |
|---|---|---|---|
| hive-rebranding | `hive` | 约 34.5s | hero 视频 → ins1 2s → poster1 2s → demo1 视频（居中留白）→ keyvisual 视频 |
| heartie | `heartie` | 12s | ipad2 → cover → watch（居中留白）→ ipad1 → ad1 → merch1，各停 2s。**底色白** |
| heykura | `heykura` | 约 16.2s | cover 图 2s → covervideo 视频 14.2s |
| primus | `primus` | 约 13.8s | 3.1 → 12 → 18 各 2s → 视频 7.8s |
| parkinson | `parkinson` | 4s | 两张截图各 2s |
| lepal | `lepal` | 静止 | 一张图 |
| hay | `hay`（词边界）| 静止 | 一张图 |
| kevzara | `kev` | 静止 | case study 页的 hero |
| jakafi | `jak` | 静止 | case study 页的 hero |
| niktimvo | `nik` | 静止 | case study 页的 hero |
| Soundscape | `soundscape` | 静止 | 一张图 |
| SolarX | `solarx` | 静止 | 一张图 |
| Food Delivery | `food delivery` | 静止 | 一张图 |
| flowith | `flowith` | 13.7s 循环 | **叠加型**：bg.png 铺满 + main.mp4 居中循环播 |

## 两种封面类型

- **`seq`（轮播型）**：一组素材按顺序轮着放，视频播完 / 图片停 2s 换下一个。HIVE、Heartie、Primus、Heykura、Lepal、HAY 都是这种。
- **`layer`（叠加型）**：底图铺满 + 视频居中叠在上面循环播，四周露出底图。目前只有 Flowith。

叠加型的配置长这样，`videoWidth` 是唯一要调的旋钮 —— 视频占格子宽度的百分比，数字越小四周留白越多：

```js
const flowithCoverLayer = { bg: flowithBg, video: flowithMain, videoWidth: '78%' }
```

## 注意

`01-hero.mp4` 有 17MB。本地开发没问题，真要上线前建议压一版，不然首页会很慢。
