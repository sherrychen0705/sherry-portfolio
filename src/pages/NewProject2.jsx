import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import img1 from '../assets/hay/1.png'
import img2 from '../assets/hay/2.png'
import img3 from '../assets/hay/3.png'
import img4 from '../assets/hay/4.png'
import img5 from '../assets/hay/5.png'
import img6 from '../assets/hay/6.png'
import img7 from '../assets/hay/7.png'
import img8 from '../assets/hay/8.png'
import img9 from '../assets/hay/9.png'
import img10 from '../assets/hay/10.png'
import img11 from '../assets/hay/11.png'
import img12 from '../assets/hay/12.png'
import img13 from '../assets/hay/13.png'
import img14 from '../assets/hay/14.png'
import img15 from '../assets/hay/15.png'
import img16 from '../assets/hay/16.png'
import img17 from '../assets/hay/17.png'

// 按编号 1→17 从上到下
const hayImages = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9,
  img10, img11, img12, img13, img14, img15, img16, img17,
]

// hive rebranding 的克隆页：复用 new-project-page 类名，padding/间距与 /new-project 完全一致。
// 文字仍为灰条占位；17 张图（hay 文件夹，PDF 转 300DPI PNG）按编号整宽从上到下排布。
function NewProject2() {
  return (
    <div className="new-project-page min-h-screen bg-white">
      <NavBar />

      {/* 左侧固定文字（与 hive/lepal 左栏格式一致） */}
      <aside className="fixed left-6 top-1/2 z-40 hidden w-[clamp(200px,25vw,430px)] -translate-y-1/2 space-y-3 text-left text-[15px] leading-[1.55] text-neutral-600 md:block">
        <p>
          Hygge isn&rsquo;t decoration. It&rsquo;s the feeling of a room that has been made habitable, and
          warmth is the most elemental version of that: the oldest reason people gather in one place. This
          line takes HAY&rsquo;s sense of ongoing, everyday energy and asks what it looks like when
          it&rsquo;s something you can feel rather than only see.
        </p>
        <p>
          Each product is a small source of comfort that stays in the room rather than performing for it.
          The heaters treat warmth as an object you live beside, close enough to reach and quiet enough to
          forget, while the diffuser extends the same idea into scent, warmth registered through air
          instead of skin. Together they&rsquo;re less a set of appliances than a set of conditions: light,
          heat, and atmosphere, sized to a desk or a corner rather than a whole house.
        </p>
      </aside>

      {/* Intro：标题 + 正文 */}
      <div className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-black">Intro to HAY (hygge line)</h2>
        <p className="mt-6 text-neutral-700">
          A new four-product extension line for HAY, built on the core idea of &ldquo;hygge +
          warmth.&rdquo; The line was designed to refresh the brand&rsquo;s existing design language and
          establish a standard for future products. Sponsored by Parsons School of Design, and as the
          sole designer, I crafted the moodboard through the product design, booklet, and packaging.
        </p>
      </div>

      {/* 17 张图：每张放进整宽的浅灰 placeholder 盒（#f1f1f0，与 hive 图同宽）；
          图片 object-contain 完整显示、不裁不拉伸，露出浅灰底。间距 mt-3 */}
      <div className="container-fluid mt-16">
        {hayImages.map((src, i) => (
          <div
            key={i}
            className={`aspect-[3/2] w-full overflow-hidden rounded-md bg-[#f1f1f0] ${
              i > 0 ? 'mt-3' : ''
            }`}
          >
            {/* 图片撑满盒子宽度(=hive 全宽)，object-contain 保证完整不裁不拉；
                非 3:2 的图(如 6.png)靠上下露出浅灰底 */}
            <img
              src={src}
              alt={`Hay ${i + 1}`}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>

      <Footer light />
    </div>
  )
}

export default NewProject2
