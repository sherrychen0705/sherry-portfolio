import { useEffect, useState } from 'react'
import magnifierVid from '../assets/home/intro/magnifier.mp4'
import charA from '../assets/home/intro/char-a.jpg' // 墨镜自拍+狗（横向）
import charB from '../assets/home/intro/char-b.jpg' // 毕业照（竖向，最高）
import charC from '../assets/home/intro/char-c.jpg' // 货运自行车（小正方）

// 复刻「设计工具选中物件」风格入场动效（参考录屏）：
// 花括号里的文字「逐字母」打出 → 变品红色 + 内嵌图（像素化→解析清晰）
// 图片位置：Clarity 与 With 之间 1 张；Character 之后 2 张。
// + 四角选择手柄 + 两侧箭头 ← →，循环播放。
const PHRASE = 'Clarity With Character'
const TYPE_MS = 62 // 每个字母间隔
const REVEAL_PAD = 480 // 打完到进入品红阶段的停顿
const HOLD_MS = 3400 // 停留后重新循环

// 内嵌媒体：图片/视频「始终清晰」，出场用宽度从 0 拉开的揭示（像视频那样把文字推开）。
// w/h 为该卡尺寸（em，随 3× 字号缩放），delay 用于错开出场；内层媒体固定尺寸 → 揭示时不变形。
function IrImg({ media, type, w = '2.4em', h = '1em', delay = 0 }) {
  const inner =
    type === 'video' ? (
      <video className="ir-media" style={{ width: w, height: h }} src={media} autoPlay loop muted playsInline />
    ) : (
      <img className="ir-media" style={{ width: w, height: h }} src={media} alt="" />
    )
  return (
    <span className="ir-img" style={{ '--w': w, width: w, height: h, animationDelay: `${delay}s` }}>
      {inner}
    </span>
  )
}

function IntroReveal() {
  const [n, setN] = useState(0) // 已打出的字母数
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    let typer = null
    const timers = []
    const run = () => {
      clearInterval(typer)
      setReveal(false)
      setN(0)
      let i = 0
      typer = setInterval(() => {
        i += 1
        setN(i)
        if (i >= PHRASE.length) clearInterval(typer)
      }, TYPE_MS)
      const typeDone = PHRASE.length * TYPE_MS
      timers.push(setTimeout(() => setReveal(true), typeDone + REVEAL_PAD))
      timers.push(setTimeout(run, typeDone + REVEAL_PAD + HOLD_MS)) // 循环
    }
    run()
    return () => {
      clearInterval(typer)
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="ir-wrap">
      <div className={`ir-box${n > 0 ? ' ir-active' : ''}${reveal ? ' ir-reveal' : ''}`}>
        {/* 四角选择手柄 */}
        <span className="ir-h ir-h-tl" />
        <span className="ir-h ir-h-tr" />
        <span className="ir-h ir-h-bl" />
        <span className="ir-h ir-h-br" />

        <span className="ir-brace ir-brace-l">{'{'}</span>
        {reveal ? (
          <span className="ir-phrase">
            <span>Clarity</span>
            <IrImg media={magnifierVid} type="video" w="2.3em" h="1.55em" delay={0} />
            <span>With Character</span>
            <IrImg media={charA} type="img" w="1.95em" h="1.5em" delay={0.12} />
            <IrImg media={charB} type="img" w="1.55em" h="1.95em" delay={0.24} />
            <IrImg media={charC} type="img" w="1.4em" h="1.4em" delay={0.36} />
          </span>
        ) : (
          <span className="ir-phrase">
            {PHRASE.slice(0, n)}
            <span className="ir-caret" />
          </span>
        )}
        <span className="ir-brace ir-brace-r">{'}'}</span>
      </div>
    </div>
  )
}

export default IntroReveal
