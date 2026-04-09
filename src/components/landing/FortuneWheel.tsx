import { useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"

const ideas = [
  "Приложение для обмена навыками",
  "Подкаст о провалах стартапов",
  "Маркет локальных художников",
  "ИИ-наставник по медитации",
  "Карта необычных мест города",
  "Клуб анонимных читателей",
  "Сервис аренды хобби-инструментов",
  "Генератор имён для котов",
  "Школа странных профессий",
  "Дневник синхронных совпадений",
  "Игра в жанре документалки",
  "Биржа абсурдных идей",
]

const COLORS = [
  "#FF4D00", "#FF8C42", "#FFC857", "#A8E063",
  "#56CFE1", "#9B5DE5", "#F15BB5", "#FEE440",
  "#00BBF9", "#00F5D4", "#FF4D00", "#FF8C42",
]

const SEGMENT_COUNT = ideas.length
const ANGLE = 360 / SEGMENT_COUNT

export default function FortuneWheel() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const controls = useAnimation()
  const currentRotation = useRef(0)

  const spin = async () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)

    const extraSpins = 5 + Math.floor(Math.random() * 5)
    const targetSegment = Math.floor(Math.random() * SEGMENT_COUNT)
    const targetAngle = 360 - (targetSegment * ANGLE + ANGLE / 2)
    const totalRotation = currentRotation.current + extraSpins * 360 + targetAngle

    currentRotation.current = totalRotation % 360

    await controls.start({
      rotate: totalRotation,
      transition: { duration: 4, ease: [0.17, 0.67, 0.35, 1.0] },
    })

    setResult(ideas[targetSegment])
    setSpinning(false)
  }

  const r = 140
  const cx = 160
  const cy = 160

  const getSegmentPath = (index: number) => {
    const startAngle = (index * ANGLE - 90) * (Math.PI / 180)
    const endAngle = ((index + 1) * ANGLE - 90) * (Math.PI / 180)
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`
  }

  const getTextPosition = (index: number) => {
    const angle = (index * ANGLE + ANGLE / 2 - 90) * (Math.PI / 180)
    return {
      x: cx + (r * 0.65) * Math.cos(angle),
      y: cy + (r * 0.65) * Math.sin(angle),
      rotation: index * ANGLE + ANGLE / 2,
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10"
          style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "22px solid #FF4D00" }}
        />

        <motion.svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          animate={controls}
          style={{ originX: "50%", originY: "50%" }}
        >
          {ideas.map((idea, i) => {
            const text = getTextPosition(i)
            return (
              <g key={i}>
                <path
                  d={getSegmentPath(i)}
                  fill={COLORS[i % COLORS.length]}
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <text
                  x={text.x}
                  y={text.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${text.rotation}, ${text.x}, ${text.y})`}
                  fill="#fff"
                  fontSize="7.5"
                  fontWeight="bold"
                  style={{ pointerEvents: "none", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                >
                  {idea.length > 14 ? idea.slice(0, 13) + "…" : idea}
                </text>
              </g>
            )
          })}
          <circle cx={cx} cy={cy} r="18" fill="#111" stroke="#FF4D00" strokeWidth="3" />
          <circle cx={cx} cy={cy} r="8" fill="#FF4D00" />
        </motion.svg>
      </div>

      <Button
        onClick={spin}
        disabled={spinning}
        size="lg"
        className="text-black bg-[#FF4D00] border-[#FF4D00] hover:bg-[#ff6a2a] transition-colors font-bold px-10 text-base"
      >
        {spinning ? "Крутится..." : "Крутить!"}
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="text-center max-w-xs"
        >
          <p className="text-neutral-400 text-sm mb-1">Твоя идея:</p>
          <p className="text-white text-xl font-bold">{result}</p>
        </motion.div>
      )}
    </div>
  )
}
