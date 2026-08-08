import { useEffect, useRef, useState } from 'react'
import loadingVid from '../assets/loading.mp4'

// 首次进入网站时的 loading 动画：每个浏览器会话只在第一次访问时播放一次，
// 播完（或兜底超时）淡出，露出网站。
function LoadingScreen() {
  const [show, setShow] = useState(() => !sessionStorage.getItem('loadingShown'))
  const [fading, setFading] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!show) return
    sessionStorage.setItem('loadingShown', '1')
    // 兜底：万一视频 onEnded 未触发（自动播放被拦等），5.5s 后也淡出
    const fallback = setTimeout(finish, 5500)
    return () => clearTimeout(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  function finish() {
    setFading(true)
    setTimeout(() => setShow(false), 500) // 等淡出过渡结束再卸载
  }

  if (!show) return null
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src={loadingVid}
        autoPlay
        muted
        playsInline
        onEnded={finish}
        className="h-auto w-[200px] max-w-[55vw]"
      />
    </div>
  )
}

export default LoadingScreen
