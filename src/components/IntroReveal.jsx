import { useEffect, useState } from 'react'

// 复刻「设计工具选中物件」风格入场动效（参考录屏）：
// 花括号里的文字「逐字母」打出 → 变品红色 + 内嵌图（像素化→解析清晰）
// 图片位置：Clarity 与 With 之间 1 张；Character 之后 2 张。
// + 四角选择手柄 + 两侧箭头 ← →，循环播放。
const PHRASE = 'Clarity With Character'
const TYPE_MS = 62 // 每个字母间隔
const REVEAL_PAD = 480 // 打完到进入品红阶段的停顿
const HOLD_MS = 3400 // 停留后重新循环

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
        {/* 四角那四个会乱跳的小方块已去掉；样式（.ir-h / ir-glitch-*）还留在 index.css，想要可以再加回来 */}

        <span className="ir-brace ir-brace-l">{'{'}</span>
        {reveal ? (
          <span className="ir-phrase">
            {/* 原来这里会弹出放大镜视频 + 三张照片，已去掉（照片改放到广告牌上了）。
                想要回来：把 IrImg 组件和 charA/B/C、magnifierVid 的 import 加回来。 */}
            <span>{PHRASE}</span>
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
