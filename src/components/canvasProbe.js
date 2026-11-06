// WebGL 画布（现在只有首页山丘）把「鼠标底下那一点是深是浅」登记在这里，
// 自定义鼠标（CustomCursor）读它来决定手画成黑还是白。
//
// 为什么要绕这一圈：WebGL 画完就把缓冲清了，外面用 drawImage 读只会读到空白；
// 开 preserveDrawingBuffer 能读，但每帧都要多拷一整张画面，白白拖慢动画。
// 所以改成画布自己在 render() 之后顺手读 1 个像素（几乎没有开销）再登记过来。
const probes = new WeakMap()

export const setCanvasProbe = (canvas, data) => {
  if (canvas) probes.set(canvas, data)
}

// 返回 { dark, t }：dark=深色，t=登记时间（太旧就别信，说明鼠标已经离开画布了）
export const getCanvasProbe = (canvas) => (canvas ? probes.get(canvas) : undefined)
