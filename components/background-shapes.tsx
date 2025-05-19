"use client"

import { useEffect, useRef } from "react"

export default function BackgroundShapes() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initial setup
    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Shape class
    class Shape {
      x: number
      y: number
      size: number
      color: string
      type: string
      speed: number
      angle: number
      rotation: number
      rotationSpeed: number

      constructor(x: number, y: number, size: number, color: string, type: string) {
        this.x = x
        this.y = y
        this.size = size
        this.color = color
        this.type = type
        this.speed = Math.random() * 0.2 + 0.1
        this.angle = Math.random() * Math.PI * 2
        this.rotation = 0
        this.rotationSpeed = (Math.random() - 0.5) * 0.01
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        this.rotation += this.rotationSpeed

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) {
          this.angle = Math.PI - this.angle
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.angle = -this.angle
        }
      }

      draw() {
        if (!ctx) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.globalAlpha = 0.1
        ctx.strokeStyle = this.color
        ctx.lineWidth = 1

        switch (this.type) {
          case "circle":
            ctx.beginPath()
            ctx.arc(0, 0, this.size, 0, Math.PI * 2)
            ctx.stroke()
            break
          case "square":
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size)
            break
          case "triangle":
            ctx.beginPath()
            ctx.moveTo(0, -this.size / 2)
            ctx.lineTo(this.size / 2, this.size / 2)
            ctx.lineTo(-this.size / 2, this.size / 2)
            ctx.closePath()
            ctx.stroke()
            break
        }

        ctx.restore()
      }
    }

    // Create shapes
    const shapes: Shape[] = []
    const shapeTypes = ["circle", "square", "triangle"]
    const colors = ["#ffffff", "#a78bfa", "#60a5fa", "#34d399"]

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 30 + 20
      const color = colors[Math.floor(Math.random() * colors.length)]
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      shapes.push(new Shape(x, y, size, color, type))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      shapes.forEach((shape) => {
        shape.update()
        shape.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}
