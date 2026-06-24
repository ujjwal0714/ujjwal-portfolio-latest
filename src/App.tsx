import { useEffect, useRef, useState } from 'react'
import {
  House, Article, Briefcase, User,
  LinkedinLogo, EnvelopeSimple, FileText, ArrowRight,
  Code, Database, Robot, ChartBar, GithubLogo, Link,
  GraduationCap, CalendarBlank, GitBranch, RocketLaunch,
  Keyboard, PaintBrush, Gear, HardDrives, Wrench, InstagramLogo,
} from '@phosphor-icons/react'
import Lenis from 'lenis'

/* ─────────────────────────────────────────
   Stars background canvas
───────────────────────────────────────── */
function StarsCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('stars-canvas') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    class Star {
      x: number; y: number; size: number; speed: number
      constructor(x: number, y: number) {
        this.x = x; this.y = y
        this.size = Math.random() * 2
        this.speed = Math.random() * 0.08
      }
      reset() {
        this.size = Math.random() * 2
        this.speed = Math.random() * 0.08
        this.x = width
        this.y = Math.random() * height
      }
      update() {
        this.x -= this.speed
        if (this.x < 0) this.reset()
        else ctx!.fillRect(this.x, this.y, this.size, this.size)
      }
    }

    class ShootingStar {
      x!: number; y!: number; len!: number; speed!: number; size!: number; wait!: number; active!: boolean
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * width
        this.y = 0
        this.len = Math.random() * 80 + 10
        this.speed = Math.random() * 10 + 6
        this.size = Math.random() + 0.1
        this.wait = Date.now() + Math.random() * 3000 + 500
        this.active = false
      }
      update() {
        if (!this.active) {
          if (Date.now() > this.wait) this.active = true
          return
        }
        this.x -= this.speed
        this.y += this.speed
        if (this.x < 0 || this.y > height) { this.reset(); return }
        ctx!.lineWidth = this.size
        ctx!.beginPath()
        ctx!.moveTo(this.x, this.y)
        ctx!.lineTo(this.x + this.len, this.y - this.len)
        ctx!.stroke()
      }
    }

    const entities: (Star | ShootingStar)[] = []
    for (let i = 0; i < height; i++) {
      entities.push(new Star(Math.random() * width, Math.random() * height))
    }
    entities.push(new ShootingStar())
    entities.push(new ShootingStar())

    let animId: number
    function animate() {
      ctx!.clearRect(0, 0, width, height)
      ctx!.fillStyle = '#ffffff'
      ctx!.strokeStyle = '#ffffff'
      for (const e of entities) e.update()
      animId = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(animId) }
  }, [])

  return <canvas id="stars-canvas" className="fixed inset-0 z-[-1] pointer-events-none opacity-80" />
}

/* ─────────────────────────────────────────
   Scroll-progress bar + NavBar
───────────────────────────────────────── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frameId = 0
    const onScroll = () => {
      if (frameId) return
      frameId = requestAnimationFrame(() => {
        frameId = 0
        const el = document.documentElement
        const scrollTop = el.scrollTop
        const max = el.scrollHeight - el.clientHeight
        const progress = max > 0 ? scrollTop / max : 0
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`
        }
        setScrolled(scrollTop > 30)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frameId)
    }
  }, [])

  const navItems = [
    { name: 'Home', icon: <House size={18} weight="bold" />, href: '#home', active: true },
    { name: 'Projects', icon: <Briefcase size={18} weight="bold" />, href: '#projects' },
    { name: 'About', icon: <User size={18} weight="bold" />, href: '#about' },
    { name: 'Blog', icon: <Article size={18} weight="bold" />, href: 'https://blog.dtbom.space', external: true },
  ]

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-xl' : 'bg-black/20 backdrop-blur-md'
        }`}
    >
      {/* scroll progress bar */}
      <div
        ref={progressRef}
        className="h-[3px] w-full origin-left bg-retro-yellow will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#home" className="flex items-center gap-3 group" id="nav-brand">
          <div className="w-10 h-10 bg-retro-yellow neo-border-sm neo-shadow-sm flex items-center justify-center font-pixel font-bold text-black text-lg group-hover:bg-retro-cyan transition-colors duration-200">
            U
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-pixel text-white text-sm font-bold">UJJWAL's &nbsp; PORTFOLIO</span>
            <span className="font-mono text-retro-yellow text-[10px] font-bold tracking-widest">DTBOM.SPACE/UJJWAL</span>
          </div>
        </a>

        {/* Nav pills */}
        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <a
              key={item.name}
              id={`nav-${item.name.toLowerCase()}`}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase transition-all duration-200 border-2 ${item.active
                ? 'bg-retro-yellow text-black border-retro-yellow'
                : 'bg-transparent text-white border-white/30 hover:border-retro-yellow hover:text-retro-yellow'
                }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────
   Typing animation hook
───────────────────────────────────────── */
function useTypingEffect(texts: string[], speed = 50, pause = 2000) {
  const [displayed, setDisplayed] = useState('')
  const [textIdx, setTextIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setTextIdx(i => (i + 1) % texts.length)
    }

    setDisplayed(current.slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, textIdx, texts, speed, pause])

  return displayed
}

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
function Hero() {
  const roles = [
    'Full-Stack Web Development: React, Vanilla JS',
    'API Development: Express and FastAPI',
    'Software Development',
    'Problem Solving',
    'Planning Before Implementation',
  ]
  const typed = useTypingEffect(roles, 55, 2200)

  return (
    <section
      id="home"
      className="pt-36 pb-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
    >
      {/* LEFT: Image */}
      <div className="relative w-full max-w-md mx-auto px-3 sm:px-0 order-2 lg:order-1">
        {/* Terminal badge */}
        <div
          id="hero-terminal-badge"
          className="absolute -top-5 left-0 sm:-left-4 z-10 bg-black border-2 border-retro-yellow neo-shadow-sm px-4 py-2 font-mono font-extrabold text-xs flex items-center gap-2 text-retro-yellow"
        >
          <span>&gt; B.Tech | 2022–2026</span>
        </div>

        {/* Photo frame */}
        <div className="w-full aspect-square border-4 border-white neo-shadow-cyan overflow-hidden relative bg-zinc-200">
          <img
            src={`${import.meta.env.BASE_URL}Images/ujjwal.jpeg`}
            alt="Ujjwal Omar"
            className="w-full h-full object-cover object-center retro-photo"
          />
          {/* scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
            }}
          />
        </div>

        {/* Open for work chip */}
        <div
          id="hero-open-work"
          className="absolute -bottom-5 right-0 sm:-right-4 z-10 bg-retro-red text-black font-pixel font-bold neo-border-sm px-5 py-2 text-sm neo-shadow-sm"
          style={{ animation: 'pulse-border 2s infinite' }}
        >
          ✦ Open for work
        </div>
      </div>

      {/* RIGHT: Text */}
      <div className="flex flex-col items-start gap-7 order-1 lg:order-2">
        <div className="bg-retro-yellow text-black neo-border-sm px-4 py-2 text-xs font-bold neo-shadow-sm uppercase tracking-widest">
          Full-Stack Developer
        </div>

        <h1 className="font-pixel text-6xl lg:text-8xl leading-[0.9] tracking-tighter uppercase font-bold text-white drop-shadow-[4px_4px_0_rgba(0,245,255,0.3)]">
          Ujjwal<br />Omar
        </h1>

        {/* Typing role */}
        <p className="font-mono text-lg font-bold text-retro-cyan min-h-[1.75rem] typing-cursor">
          {typed}
        </p>

        <p className="text-xs font-bold leading-relaxed max-w-[48ch] text-zinc-300">
          Building full-stack products, automation workflows, and clean frontend experiences with Python, FastAPI, React, Node.js, and modern tooling.
        </p>

        <div className="flex flex-col gap-3 w-full sm:flex-row flex-wrap">
          <a
            id="hero-view-projects"
            href="#projects"
            className="bg-retro-yellow text-black neo-border-sm neo-shadow-sm neo-hover px-6 py-3 font-bold flex items-center gap-2 text-sm"
          >
            View Projects <ArrowRight weight="bold" />
          </a>
          <a
            id="hero-contact"
            href="#contact"
            className="bg-transparent text-white neo-border-white neo-hover px-6 py-3 font-bold flex items-center gap-2 text-sm hover:border-retro-cyan hover:text-retro-cyan transition-colors"
          >
            Contact Me <EnvelopeSimple weight="bold" />
          </a>
          <a
            id="hero-resume"
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            target="_blank"
            rel="noreferrer"
            className="bg-transparent text-white neo-border-white neo-hover px-6 py-3 font-bold flex items-center gap-2 text-sm hover:border-retro-yellow hover:text-retro-yellow transition-colors"
          >
            View Resume <FileText weight="bold" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Section divider (numbered)
───────────────────────────────────────── */
function ScrollTorus() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [torusReady, setTorusReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    let disposed = false
    let loaded = false
    let visible = false
    let frameId = 0
    let cleanupThree = () => {}
    let startAnimation = () => {}
    let stopAnimation = () => {}

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loaded) return
        loaded = true
        loadObserver.disconnect()
        void initializeTorus()
      },
      { rootMargin: '600px 0px' },
    )

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) startAnimation()
      else stopAnimation()
    })

    const initializeTorus = async () => {
      try {
        const THREE = await import('three')
        if (disposed) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const mobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
        const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
        const lowPower = mobile || (deviceMemory !== undefined && deviceMemory <= 4)
        const pointCount = lowPower ? 900 : 1800

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
        camera.position.set(0, 0, lowPower ? 8.4 : 7)

        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: !lowPower,
          alpha: true,
          powerPreference: lowPower ? 'low-power' : 'high-performance',
        })
        renderer.setClearColor(0x000000, 0)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1 : 1.75))

        const group = new THREE.Group()
        group.rotation.x = 0.55
        scene.add(group)

        const torusParams = { A: -3, B: 6, r: 2.3, R: 2.2 }
        const tubeRadius = 0.55
        const torusGeometry = new THREE.TorusGeometry(
          torusParams.R,
          tubeRadius,
          lowPower ? 20 : 32,
          lowPower ? 48 : 80,
        )
        const torusMaterial = new THREE.MeshBasicMaterial({
          color: 0x16697a,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        })
        group.add(new THREE.Mesh(torusGeometry, torusMaterial))

        const positions = new Float32Array(pointCount * 3)
        const colors = new Float32Array(pointCount * 3)
        const color = new THREE.Color()
        const palette = [
          new THREE.Color('#00f5ff'),
          new THREE.Color('#facc15'),
          new THREE.Color('#ff2d95'),
          new THREE.Color('#8b5cf6'),
          new THREE.Color('#00f5ff'),
        ]
        const turns = Math.PI * 2 * Math.max(20, Math.ceil(Math.abs(torusParams.B)) * 12)

        for (let i = 0; i < pointCount; i++) {
          const t = (i / (pointCount - 1)) * turns
          const theta = torusParams.r * t
          const phi =
            torusParams.B * torusParams.r * t +
            torusParams.A * Math.sin(torusParams.r * t)
          positions[i * 3] =
            (torusParams.R + tubeRadius * Math.cos(theta)) * Math.cos(phi)
          positions[i * 3 + 1] = tubeRadius * Math.sin(theta)
          positions[i * 3 + 2] =
            (torusParams.R + tubeRadius * Math.cos(theta)) * Math.sin(phi)

          const colorPhase =
            ((phi / (Math.PI * 2)) + 0.18 * Math.sin(theta * 2) + 1000) % 1
          const palettePosition = colorPhase * (palette.length - 1)
          const paletteIndex = Math.min(Math.floor(palettePosition), palette.length - 2)
          color
            .copy(palette[paletteIndex])
            .lerp(palette[paletteIndex + 1], palettePosition - paletteIndex)
          colors[i * 3] = color.r
          colors[i * 3 + 1] = color.g
          colors[i * 3 + 2] = color.b
        }

        const curveGeometry = new THREE.BufferGeometry()
        curveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        curveGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        const curveMaterial = new THREE.LineBasicMaterial({ vertexColors: true })
        group.add(new THREE.Line(curveGeometry, curveMaterial))

        let glowMaterial: InstanceType<typeof THREE.LineBasicMaterial> | undefined
        if (!lowPower) {
          glowMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
          const glowLine = new THREE.Line(curveGeometry, glowMaterial)
          glowLine.scale.setScalar(1.006)
          group.add(glowLine)
        }

        let targetRotation = 0
        let currentRotation = 0
        let idleRotation = 0
        let previousTime = performance.now()

        const updateScrollTarget = () => {
          const rect = section.getBoundingClientRect()
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
          targetRotation = progress * Math.PI * 5
        }
        const resize = () => {
          const { width, height } = section.getBoundingClientRect()
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderer.render(scene, camera)
        }
        const animate = (time: number) => {
          if (disposed) return
          const deltaSeconds = Math.min((time - previousTime) / 1000, 0.1)
          previousTime = time
          idleRotation += deltaSeconds * 0.35
          currentRotation += (targetRotation - currentRotation) * 0.09
          group.rotation.y = idleRotation + currentRotation
          group.rotation.z = (idleRotation + currentRotation) * 0.22
          renderer.render(scene, camera)
          frameId = requestAnimationFrame(animate)
        }
        stopAnimation = () => {
          cancelAnimationFrame(frameId)
          frameId = 0
        }
        startAnimation = () => {
          if (frameId || reducedMotion || document.hidden || !visible) return
          previousTime = performance.now()
          frameId = requestAnimationFrame(animate)
        }
        const handleDocumentVisibility = () => {
          if (document.hidden) stopAnimation()
          else startAnimation()
        }

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(section)
        document.addEventListener('visibilitychange', handleDocumentVisibility)
        if (!reducedMotion) {
          window.addEventListener('scroll', updateScrollTarget, { passive: true })
          updateScrollTarget()
        }
        resize()
        setTorusReady(true)
        startAnimation()

        cleanupThree = () => {
          stopAnimation()
          resizeObserver.disconnect()
          document.removeEventListener('visibilitychange', handleDocumentVisibility)
          window.removeEventListener('scroll', updateScrollTarget)
          torusGeometry.dispose()
          torusMaterial.dispose()
          curveGeometry.dispose()
          curveMaterial.dispose()
          glowMaterial?.dispose()
          renderer.dispose()
        }
      } catch {
        // Keep the lightweight fallback visible if WebGL or the chunk cannot load.
      }
    }

    loadObserver.observe(section)
    visibilityObserver.observe(section)

    return () => {
      disposed = true
      loadObserver.disconnect()
      visibilityObserver.disconnect()
      cleanupThree()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="torus"
      aria-label="Scroll-controlled torus knot"
      className="relative h-[72vh] min-h-[480px] max-h-[760px] w-full overflow-hidden"
    >
      <div
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border-[18px] border-retro-cyan/10 shadow-[0_0_60px_rgba(0,245,255,0.08)] transition-opacity duration-700 sm:h-72 sm:w-72 ${torusReady ? 'opacity-0' : 'opacity-100'}`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${torusReady ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black" />
    </section>
  )
}

function SectionDivider({ number, label }: { number: string; label: string }) {
  return (
    <div className="relative py-16 max-w-7xl mx-auto px-6 flex items-center justify-between">
      {/* Left fading line */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/25" />

      {/* Tech badge */}
      <div className="flex items-center gap-3 px-4 py-1.5 bg-black border-2 border-white/20 text-white font-mono text-xs mx-4 select-none neo-shadow-sm">
        <span className="text-retro-yellow font-bold font-pixel">{number}</span>
        <span className="text-white/20">|</span>
        <span className="uppercase tracking-widest font-black text-zinc-300">{label}</span>
        <span className="w-1.5 h-1.5 bg-retro-red rounded-full animate-pulse" />
      </div>

      {/* Right fading line */}
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/25" />
    </div>
  )
}

/* ─────────────────────────────────────────
   About
───────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="py-12 max-w-7xl mx-auto px-6">
      {/* Section heading */}
      <h2 className="font-pixel text-4xl lg:text-6xl font-bold uppercase mb-12 text-white drop-shadow-[4px_4px_0_rgba(0,245,255,0.25)]">
        About Me
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Large quote / intro - takes 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="text-retro-cyan font-pixel text-8xl leading-none opacity-30 select-none">"</div>
          <p className="text-lg font-bold leading-relaxed text-zinc-100 -mt-10 pl-4 border-l-4 border-retro-yellow">
            Electrical Engineer turned Software Developer, passionate about building practical software, backend systems, and engineering tools. I enjoy transforming complex ideas into intuitive applications through thoughtful design, strong fundamentals, and continuous learning.
          </p>
        </div>

        {/* Fun-fact cards - 1 col */}
        <div className="flex flex-col gap-4">
          {[
            { label: 'University', value: 'HBTU Kanpur', icon: <GraduationCap size={24} weight="bold" /> },
            { label: 'Batch', value: '2022 – 2026', icon: <CalendarBlank size={24} weight="bold" /> },
            { label: 'Currently invested in', value: 'Open Source & Side Projects', icon: <GitBranch size={24} weight="bold" /> },
            { label: 'Looking for', value: 'Full-time & Internships', icon: <RocketLaunch size={24} weight="bold" /> },
          ].map(fact => (
            <div
              key={fact.label}
              className="skill-card px-5 py-4 flex items-start gap-3"
            >
              <span className="mt-0.5 text-retro-cyan">{fact.icon}</span>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{fact.label}</div>
                <div className="text-sm font-bold text-white">{fact.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Tech Skills (marquee rows)
───────────────────────────────────────── */
function TechSkills() {
  const categories = [
    { title: 'Languages', icon: <Keyboard size={20} weight="bold" />, skills: ['Python', 'JavaScript', 'Java', 'SQL'] },
    { title: 'Frontend', icon: <PaintBrush size={20} weight="bold" />, skills: ['React.js', 'HTML', 'CSS', 'Tailwind'] },
    { title: 'Backend', icon: <Gear size={20} weight="bold" />, skills: ['FastAPI', 'Node.js', 'Express.js', 'Flask', 'REST APIs', 'Socket.IO'] },
    { title: 'Databases', icon: <HardDrives size={20} weight="bold" />, skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Database Design'] },
    { title: 'AI & Tools', icon: <Robot size={20} weight="bold" />, skills: ['LangChain', 'RAG', 'LLMs', 'OpenAI API'] },
    { title: 'Infrastructure', icon: <Wrench size={20} weight="bold" />, skills: ['Git', 'GitHub', 'Vercel', 'Docker', 'Figma', 'Linux'] },
  ]

  return (
    <section id="skills" className="py-12 max-w-7xl mx-auto px-6">
      <h2 className="font-pixel text-4xl lg:text-5xl font-bold uppercase mb-12 text-white drop-shadow-[4px_4px_0_rgba(0,245,255,0.25)]">
        Technical Skills
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map(cat => (
          <div key={cat.title} className="skill-card p-5 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-retro-cyan">{cat.icon}</span>
              <h3 className="font-pixel text-lg font-bold uppercase text-white">{cat.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {cat.skills.map(skill => (
                <span key={skill} className="skill-pill">
                  <span className="skill-pill-dot" aria-hidden="true" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   What I Build
───────────────────────────────────────── */
function WhatIBuild() {
  const cards = [
    { title: 'Full-Stack Applications', icon: <Code size={28} weight="bold" />, desc: '' },
    { title: 'Automation Workflows', icon: <Robot size={28} weight="bold" />, desc: '' },
    { title: 'Turn Engineering Concepts Into Real Products', icon: <Database size={28} weight="bold" />, desc: '' },
    { title: 'Build APIs', icon: <ChartBar size={28} weight="bold" />, desc: '' },
  ]
  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <h2 className="font-pixel text-4xl lg:text-5xl font-bold uppercase mb-12 text-center text-white drop-shadow-[4px_4px_0_rgba(0,245,255,0.25)]">
        What I Build
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(card => (
          <div
            key={card.title}
            className="skill-card p-7 flex flex-col gap-5 group hover:border-l-retro-cyan transition-all duration-200"
            style={{ borderLeftColor: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.borderLeftColor = '#00f5ff')}
            onMouseLeave={e => (e.currentTarget.style.borderLeftColor = '#facc15')}
          >
            <div className="w-12 h-12 bg-retro-yellow flex items-center justify-center group-hover:bg-retro-cyan transition-colors duration-200 text-black">
              {card.icon}
            </div>
            <h3 className="font-pixel text-base font-bold leading-tight text-white">{card.title}</h3>
            <p className="text-xs font-bold leading-relaxed text-zinc-400">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Projects (side-by-side list layout)
───────────────────────────────────────── */
function Projects() {
  const projects = [
    {
      title: 'Digi-Blocker: Block Diagram Solver',
      image: `${import.meta.env.BASE_URL}Images/control_sys.png`,
      desc: 'A software tool for simplification of control system block diagrams via step-wise rule based reduction and Mason\'s formula. Integrated with built-in validation system to verify correctness of the determined solutions.',
      tags: ['Tooling', 'Algorithms'],
      link: 'https://dtbom.space/digiblocker',
      // github: '',
      year: '2026',
    },
    {
      title: 'Power Electronics Simulator',
      image: `${import.meta.env.BASE_URL}Images/powet.jpg`,
      desc: 'A study-tool for learners to do a quick simualtion of fundamental power electronics circuits with real-time, interactive waveforms.',
      tags: ['Simulator', 'Web'],
      link: 'https://www.dtbom.space/power-electronics-simulator/',
      // github: 'https://github.com',
      year: '2024',
    },
    {
      title: 'Locomotive Simulator',
      image: `${import.meta.env.BASE_URL}Images/els.jpeg`,
      desc: 'A video-based simulator system aimed to play videos in different speeds in both forward and reverse motion.',
      tags: ['Video', 'Simulator'],
      link: 'https://loco-sim.dtbom.space',
      // github: 'https://github.com',
      year: '2025',
    },
    {
      title: 'Doomsday Clock',
      image: `${import.meta.env.BASE_URL}Images/doomsday.jpeg`,
      desc: 'A fan-tribute to the upcoming Marvel\'s Avengers: Doomsday.',
      tags: ['Web', 'Timer'],
      link: 'https://doomsday-clock.dtbom.space',
      // github: 'https://github.com',
      year: '2026',
    },
  ]

  return (
    <section id="projects" className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
        <div>
          <h2 className="font-pixel text-5xl lg:text-7xl font-bold uppercase text-white drop-shadow-[4px_4px_0_rgba(0,245,255,0.25)]">
            Projects
          </h2>
          {/* <p className="text-xs font-bold text-zinc-400 mt-3 max-w-[50ch]">
            Full-stack applications, simulators, and tooling - built with practical engineering depth.
          </p> */}
        </div>
        <a
          id="projects-github-link"
          href="https://github.com/ujjwal0714"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 bg-transparent text-white neo-border-white neo-hover px-6 py-3 font-bold flex items-center gap-2 text-sm hover:border-retro-yellow hover:text-retro-yellow transition-colors"
        >
          View GitHub <GithubLogo weight="bold" size={18} />
        </a>
      </div>

      <div className="flex flex-col gap-6">
        {projects.map((proj, idx) => (
          <div
            key={proj.title}
            id={`project-${idx}`}
            className="skill-card group flex flex-col sm:flex-row gap-0 overflow-hidden hover:border-l-retro-cyan transition-all duration-200"
            onMouseEnter={e => (e.currentTarget.style.borderLeftColor = '#00f5ff')}
            onMouseLeave={e => (e.currentTarget.style.borderLeftColor = '#facc15')}
          >
            {/* Image */}
            <div className="w-full sm:w-56 lg:w-72 shrink-0 aspect-video sm:aspect-auto overflow-hidden">
              <img
                src={proj.image}
                alt={proj.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Info */}
            <div className="flex-1 p-6 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3
                    className="font-pixel text-2xl font-bold text-white glitch"
                    data-text={proj.title}
                  >
                    {proj.title}
                  </h3>
                  <span className="text-[10px] text-retro-yellow font-bold opacity-60 shrink-0 mt-1">{proj.year}</span>
                </div>
                <p className="text-xs font-bold leading-relaxed text-zinc-400">{proj.desc}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {proj.tags.map(tag => (
                    <span key={tag} className="bg-black/60 text-retro-yellow border border-retro-yellow/40 text-[10px] font-bold px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {proj.link && proj.link !== '#' && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="w-8 h-8 bg-retro-cyan neo-border-sm neo-hover flex items-center justify-center text-black" title="Live Demo">
                      <Link size={15} weight="bold" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Footer / Contact
───────────────────────────────────────── */
function Footer() {
  return (
    <footer id="contact" className="mt-20 bg-black border-t-4 border-retro-red relative overflow-hidden">
      {/* dot grid bg */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Cyan glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-retro-red blur-xl opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: CTA */}
        <div className="flex flex-col gap-6">
          <div className="bg-retro-red text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1 w-fit neo-border-sm">
            Let's connect
          </div>
          <h2 className="font-pixel text-4xl lg:text-6xl font-bold uppercase text-white leading-tight">
            Let's Work<br />
            <span className="text-retro-cyan">Together.</span>
          </h2>
          <p className="text-xs font-bold text-zinc-400 max-w-[40ch] leading-relaxed">
            Open to internships, freelance projects, and full-time roles. Drop me a message and I'll get back within 24 hours.
          </p>
        </div>

        {/* Right: Social links */}
        <div className="flex flex-col gap-3">
          {[
            { icon: <LinkedinLogo size={20} weight="bold" />, href: 'https://linkedin.com/in/ujjwalomar', label: 'linkedin.com/in/ujjwalomar', external: true },
            { icon: <GithubLogo size={20} weight="bold" />, href: 'https://github.com/ujjwal0714', label: 'github.com/ujjwal0714', external: true },
            { icon: <InstagramLogo size={20} weight="bold" />, href: 'https://instagram.com/ujjwal.0714', label: 'instagram.com/ujjwal.0714', external: true },
            { icon: <EnvelopeSimple size={20} weight="bold" />, href: 'mailto:ujjwalomar0714@gmail.com', label: 'ujjwalomar0714@gmail.com', external: false },
            { icon: <FileText size={20} weight="bold" />, href: `${import.meta.env.BASE_URL}resume.pdf`, label: 'View Resume', external: true },
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              target={s.external ? '_blank' : undefined}
              rel={s.external ? 'noreferrer' : undefined}
              className="group flex min-h-12 items-center gap-3 border-2 border-white/20 bg-white/[0.03] px-4 py-3 text-white transition-colors hover:border-retro-cyan hover:text-retro-cyan"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-white/5 text-retro-yellow transition-colors group-hover:bg-retro-cyan group-hover:text-black">
                {s.icon}
              </span>
              <span className="min-w-0 break-all font-mono text-xs font-bold">
                {s.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
          <span>© {new Date().getFullYear()} Ujjwal Omar. All rights reserved.</span>
          {/* <span className="text-retro-yellow/40">Built with React + Vite + TailwindCSS</span> */}
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────
   App root
───────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return (
    <div className="min-h-screen selection:bg-retro-yellow selection:text-black">
      <StarsCanvas />
      <NavBar />
      <main className="pt-16">
        <Hero />
        <ScrollTorus />
        <SectionDivider number="01" label="About" />
        <About />
        <SectionDivider number="02" label="Skills" />
        <TechSkills />
        <SectionDivider number="03" label="What I Build" />
        <WhatIBuild />
        <SectionDivider number="04" label="Projects" />
        <Projects />
      </main>
      <Footer />
    </div>
  )
}
