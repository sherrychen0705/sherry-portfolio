import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import p1 from '../assets/primus/1.mp4'
import p2 from '../assets/primus/2.png'
import p3 from '../assets/primus/3.png'
import p3_1 from '../assets/primus/3.1.png'
import p4 from '../assets/primus/4.png'
import p5 from '../assets/primus/5.png'
import p6 from '../assets/primus/6.mp4'
import p7 from '../assets/primus/7.mp4'
import p8 from '../assets/primus/8.png'
import p9 from '../assets/primus/9.png'
import p10 from '../assets/primus/10.png'
import p11 from '../assets/primus/11.png'
import p12 from '../assets/primus/12.png'
import p12_1 from '../assets/primus/12.1.mp4'
import p13 from '../assets/primus/13.png'
import p14 from '../assets/primus/14.png'
import p15 from '../assets/primus/15.png'
import p16 from '../assets/primus/16.png'
import p17 from '../assets/primus/17.png'
import p18 from '../assets/primus/18.png'

// primus 素材：按编号顺序（小数排在同整数之后）
const primusAssets = [
  { src: p1, video: true },
  { src: p2 },
  { src: p3 },
  { src: p3_1 },
  { src: p4 },
  { src: p5 },
  { src: p6, video: true },
  { src: p7, video: true },
  { src: p8 },
  { src: p9 },
  { src: p10 },
  { src: p11 },
  { src: p12 },
  { src: p12_1, video: true },
  { src: p13 },
  { src: p14 },
  { src: p15 },
  { src: p16 },
  { src: p17 },
  { src: p18 },
]

// primus 项目页：结构/间距与 HAY(/new-project-2) 一致。文字仍为灰条占位；
// 素材按编号放入整宽浅灰(#f1f1f0)方框，object-contain 完整显示、不裁不拉伸，宽度一致。
function NewProject3() {
  return (
    <div className="new-project-page min-h-screen bg-white">
      <NavBar />

      {/* 左侧固定文字 */}
      <aside className="fixed left-6 top-1/2 z-40 hidden w-[clamp(200px,25vw,430px)] -translate-y-1/2 space-y-3 text-left text-[15px] leading-[1.55] text-neutral-600 md:block">
        <p>
          Primus 2.0 needed to look energetic, outgoing, and proactive. When a rebrand involves adopting
          a completely different design style, the challenges become even more pronounced. A completely
          new visual direction requires meticulous audience education, ensuring that customers understand
          the reasons behind the change and can connect with the new style.
        </p>
      </aside>

      {/* Intro：标题 + 正文 */}
      <div className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-black">Intro to Primus 2.0</h2>
        <p className="mt-6 text-neutral-700">
          <a
            href="https://primuslabs.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-neutral-400 transition-colors hover:text-black"
          >
            Primus
          </a>{' '}
          is a cryptography infrastructure company building zkTLS tools that let people prove facts
          about their private web data — a balance, a credential, an account history — without revealing
          the data itself. This school-sponsored project was a rebrand for Primus, done in collaboration
          with designers Ellie Li; they led typography while I focused on animation design and
          prototyping. The challenge was evolution rather than reinvention: Primus had already
          established a voice built on logical, bold, trust, so the new identity had to signal where the
          company was heading while still reading as familiar to the audience it had already earned.
        </p>
      </div>

      {/* 素材：每个放进整宽浅灰方框(#f1f1f0)，object-contain 完整不裁不拉；间距 mt-3 */}
      <div className="container-fluid mt-16">
        {primusAssets.map((a, i) => (
          <div
            key={i}
            className={`aspect-[3/2] w-full overflow-hidden rounded-md bg-[#f1f1f0] ${i > 0 ? 'mt-3' : ''}`}
          >
            {a.video ? (
              <video src={a.src} autoPlay loop muted playsInline className="h-full w-full object-contain" />
            ) : (
              <img src={a.src} alt={`Primus ${i + 1}`} className="h-full w-full object-contain" />
            )}
          </div>
        ))}
      </div>

      <Footer light />
    </div>
  )
}

export default NewProject3
