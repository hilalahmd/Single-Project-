import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ChevronRight, Activity, Target, CheckCircle2,
  Leaf, Flame, Zap, TrendingUp, Star, Camera, Brain, Shield
} from 'lucide-react'

// ─── Helpers ────────────────────────────────────────────────────────────────
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const mapRange = (v, a, b, c, d) =>
  clamp(((v - a) * (d - c)) / (b - a) + c, Math.min(c, d), Math.max(c, d))

// ─── Scroll Reveal Wrapper ───────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Diet Plan Form ──────────────────────────────────────────────────────────
const GOALS = [
  { id: 'loss',     title: 'Weight Loss',   desc: 'Burn fat, get leaner',      icon: Flame,       color: '#EF4444' },
  { id: 'gain',     title: 'Muscle Gain',   desc: 'Build size & strength',     icon: Zap,         color: '#F59E0B' },
  { id: 'maintain', title: 'Maintenance',   desc: 'Stay at your current weight', icon: TrendingUp, color: '#10B981' },
]

const DIETS = [
  { id: 'veg',        title: 'Vegetarian',     emoji: '🥦' },
  { id: 'nonveg',     title: 'Non-Veg',        emoji: '🍗' },
  { id: 'vegan',      title: 'Vegan',          emoji: '🌱' },
  { id: 'eggetarian', title: 'Eggetarian',     emoji: '🥚' },
]

function DietForm({ onDone }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ gender: '', age: '', height: '', weight: '', goal: '', diet: '' })
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  const generate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setDone(true) }, 2800)
  }

  if (done) return <DietResult form={form} onRestart={() => { setDone(false); setStep(1); setForm({ gender: '', age: '', height: '', weight: '', goal: '', diet: '' }) }} />
  if (generating) return <Generating form={form} />

  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          <span>Step {step} of 3</span>
          <span>{Math.round((step / 3) * 100)}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-white font-['Syne'] tracking-tight">Your Metrics</h3>
            <p className="text-gray-400 text-sm mt-1">We calculate your daily caloric needs</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Biological Gender</label>
            <div className="grid grid-cols-2 gap-3">
              {['Male', 'Female'].map(g => (
                <button key={g} onClick={() => setForm({ ...form, gender: g })}
                  className={`py-4 rounded-xl font-bold border-2 transition-all duration-300 ${
                    form.gender === g
                      ? 'border-[#2563EB] bg-[#2563EB]/15 text-white shadow-[0_0_20px_rgba(37,99,235,0.25)]'
                      : 'border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/5'
                  }`}
                >{g}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'age',    label: 'Age',    unit: 'yrs', placeholder: '25' },
              { key: 'height', label: 'Height', unit: 'cm',  placeholder: '175' },
              { key: 'weight', label: 'Weight', unit: 'kg',  placeholder: '70' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  {f.label} <span className="text-gray-600 normal-case font-normal">({f.unit})</span>
                </label>
                <input
                  type="number" placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-[#0D0F18] border border-white/10 rounded-xl px-3 py-3.5 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all text-sm"
                />
              </div>
            ))}
          </div>

          <button
            onClick={next}
            disabled={!form.gender || !form.age || !form.height || !form.weight}
            className="w-full mt-4 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white py-4 rounded-xl font-[800] uppercase tracking-widest hover:opacity-90 transition-all duration-300 disabled:opacity-40 flex justify-center items-center gap-2"
          >
            Continue <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-white font-['Syne'] tracking-tight">Your Goal</h3>
            <p className="text-gray-400 text-sm mt-1">This sets your caloric target</p>
          </div>

          {GOALS.map(goal => (
            <button key={goal.id} onClick={() => setForm({ ...form, goal: goal.id })}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-300 text-left ${
                form.goal === goal.id
                  ? 'border-[#2563EB] bg-[#2563EB]/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                  : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${goal.color}20`, border: `1px solid ${goal.color}50` }}
              >
                <goal.icon size={22} style={{ color: goal.color }} />
              </div>
              <div>
                <div className="font-bold text-white">{goal.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{goal.desc}</div>
              </div>
              {form.goal === goal.id && <CheckCircle2 size={20} className="ml-auto text-[#2563EB]" />}
            </button>
          ))}

          <div className="flex gap-3 mt-6">
            <button onClick={back} className="px-5 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">Back</button>
            <button onClick={next} disabled={!form.goal}
              className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white py-4 rounded-xl font-[800] uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40 flex justify-center items-center gap-2"
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-white font-['Syne'] tracking-tight">Dietary Preference</h3>
            <p className="text-gray-400 text-sm mt-1">We'll tailor your meals to your lifestyle</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {DIETS.map(d => (
              <button key={d.id} onClick={() => setForm({ ...form, diet: d.id })}
                className={`p-5 rounded-xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${
                  form.diet === d.id
                    ? 'border-[#2563EB] bg-[#2563EB]/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                    : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span className="text-3xl">{d.emoji}</span>
                <span className="font-bold text-white text-sm">{d.title}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={back} className="px-5 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">Back</button>
            <button onClick={generate} disabled={!form.diet}
              className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white py-4 rounded-xl font-[800] uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2"
            >
              Generate Plan ✨
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Generating({ form }) {
  const [progress, setProgress] = useState(0)
  const steps = ['Calculating your BMR & TDEE...', 'Adapting to Indian meal patterns...', 'Optimising macros for your goal...', 'Finalising your 30-day plan...']
  const [stepIdx, setStepIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 2, 100))
      setStepIdx(i => Math.min(i + 1, steps.length - 1))
    }, 56)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative w-28 h-28 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="url(#grad)" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain size={32} className="text-[#2563EB] animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-black text-white font-['Syne'] mb-2 animate-pulse">FitForge AI is working…</h3>
      <p className="text-[#2563EB] text-xs font-bold tracking-[0.2em] uppercase mb-6">{steps[stepIdx]}</p>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function DietResult({ form, onRestart }) {
  const navigate = useNavigate()
  const goalLabel = GOALS.find(g => g.id === form.goal)?.title ?? ''
  const dietLabel = DIETS.find(d => d.id === form.diet)?.title ?? ''

  const meals = [
    { time: 'Breakfast · 8:00 AM', name: 'Oats Idli with Sambar', detail: '3 Idlis · 1 bowl Sambar · 350 kcal · 12g Protein' },
    { time: 'Lunch · 1:00 PM',     name: 'Brown Rice & Paneer/Chicken Curry', detail: '1 cup Rice · 150g Protein · Salad · 550 kcal · 35g Protein' },
    { time: 'Snack · 5:00 PM',     name: 'Sprout Chaat or Mixed Nuts',        detail: '1 bowl · ~200 kcal · 8g Protein' },
    { time: 'Dinner · 8:00 PM',    name: 'Multigrain Roti & Dal',             detail: '2 Rotis · 1 bowl Dal · Veggies · 400 kcal · 15g Protein' },
  ]

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/40 shadow-[0_0_25px_rgba(34,197,94,0.25)]">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="text-2xl font-black text-white font-['Syne'] tracking-tight">Your Sample Plan is Ready!</h3>
        <p className="text-[#00E5FF] font-bold text-xs tracking-widest uppercase mt-1">Target: ~1,850 kcal / day · {dietLabel} · {goalLabel}</p>
      </div>

      <div className="bg-[#0D0F18] border border-white/10 rounded-2xl overflow-hidden mb-6">
        <div className="bg-white/5 px-5 py-3 border-b border-white/10 flex justify-between items-center">
          <span className="font-bold text-white text-sm">Day 1 Sample Menu</span>
          <span className="text-xs font-bold bg-[#2563EB]/20 text-[#2563EB] px-3 py-1 rounded-full">{dietLabel.toUpperCase()}</span>
        </div>
        <div className="divide-y divide-white/5">
          {meals.map((m, i) => (
            <div key={i} className="p-4">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{m.time}</div>
              <div className="font-bold text-white mb-0.5">{m.name}</div>
              <div className="text-xs text-gray-400">{m.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#2563EB]/20 to-[#7C3AED]/10 border border-[#2563EB]/30 p-5 rounded-2xl mb-5">
        <h4 className="font-bold text-white mb-1">This is just Day 1 of 30.</h4>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          Get your complete personalized 30-day plan, macro tracking, AI food photo analysis, and a live dedicated coach.
        </p>
        <button onClick={() => navigate('/auth/register')}
          className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white py-3.5 rounded-xl font-[800] uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2"
        >
          Unlock Full Plan →
        </button>
      </div>

      <button onClick={onRestart} className="w-full py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-colors">
        Start Over
      </button>
    </div>
  )
}

// ─── Transformation Stories ──────────────────────────────────────────────────
const STORIES = [
  { name: 'Rahul K.',   city: 'Bengaluru', lost: '18 kg', time: '4 months', trainer: 'Arjun Menon',   rating: 5, quote: 'The live video sessions felt like having a personal trainer at home. My trainer caught every wrong rep in real time.' },
  { name: 'Sneha P.',   city: 'Kochi',     lost: '12 kg', time: '3 months', trainer: 'Priya Nair',    rating: 5, quote: 'The AI food analyser changed how I eat. I photograph every meal and it tells me exactly what I'm putting in my body.' },
  { name: 'Vikram S.',  city: 'Mumbai',    lost: '9 kg',  time: '2 months', trainer: 'Rahul Sharma',  rating: 5, quote: 'I gained 6 kg of muscle while losing fat. The macro-optimised diet plan made all the difference.' },
  { name: 'Divya T.',   city: 'Chennai',   lost: '15 kg', time: '5 months', trainer: 'Divya Thomas',  rating: 5, quote: 'Language matching is genius — my trainer explains workouts in Malayalam. Zero communication barrier.' },
]

const STATS = [
  { value: '500+',  label: 'Certified Trainers', icon: Shield, color: '#2563EB' },
  { value: '10k+',  label: 'Clients Transformed', icon: TrendingUp, color: '#10B981' },
  { value: '4.9★',  label: 'Average Rating', icon: Star, color: '#F59E0B' },
  { value: '87%',   label: 'Reach Their Goal', icon: Target, color: '#EF4444' },
]

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function TransformPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#07080C] text-white font-['Inter'] selection:bg-[#2563EB] selection:text-white">

      {/* Ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(37,99,235,0.12)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.10)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 z-[70] mix-blend-overlay opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
        <button onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <span className="text-xl font-black tracking-[-0.05em] text-white font-['Syne']">FITFORGE</span>
        <button onClick={() => navigate('/auth/register')}
          className="bg-[#2563EB] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-white hover:text-[#2563EB] transition-all"
        >
          Get Started
        </button>
      </nav>

      <div className="relative z-10">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="pt-10 pb-20 px-4 text-center max-w-4xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-xs font-bold px-4 py-2 rounded-full tracking-[0.15em] uppercase mb-6">
              <Brain size={14} /> AI-Powered Transformation
            </div>
            <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black text-white tracking-[-0.03em] leading-[0.9] font-['Syne'] mb-6">
              YOUR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
                TRANSFORMATION
              </span><br />
              STARTS HERE
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Get a free AI-generated Indian diet plan in under 60 seconds — then discover real stories of people just like you who transformed their bodies with FitForge.
            </p>
          </Reveal>
        </section>

        {/* ── STATS BAR ────────────────────────────────────────────────────── */}
        <Reveal delay={100}>
          <div className="max-w-5xl mx-auto px-4 mb-20">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: `${s.color}15`, border: `1px solid ${s.color}40` }}
                  >
                    <s.icon size={18} style={{ color: s.color }} />
                  </div>
                  <div className="text-2xl font-black text-white font-['Syne']">{s.value}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── AI DIET PLAN ─────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 mb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: info */}
            <Reveal>
              <div>
                <div className="flex items-center gap-2 text-[#00E5FF] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                  <Camera size={14} /> AI Diet Analysis
                </div>
                <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black text-white font-['Syne'] tracking-tight leading-tight mb-6">
                  Curious how AI<br />fits your diet?
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Our AI understands <span className="text-white font-semibold">Indian meal patterns</span> — dosa, idli, biryani, roti, dal — and calculates your precise macros in seconds. No guessing. No generic Western plans.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Zap,        label: 'Instant plan generation — under 60 seconds' },
                    { icon: Brain,      label: 'Trained on thousands of Indian food profiles' },
                    { icon: Camera,     label: 'Photograph any meal for live calorie tracking' },
                    { icon: Shield,     label: 'No credit card or account needed to try' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center shrink-0">
                        <f.icon size={15} className="text-[#2563EB]" />
                      </div>
                      <span className="font-medium">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Right: form card */}
            <Reveal delay={150}>
              <div className="relative">
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-br from-[#2563EB]/30 to-[#7C3AED]/20 rounded-3xl blur-xl opacity-60" />
                <div className="relative bg-[#0D0F18]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-gray-500 font-medium">FitForge AI · Free Plan Generator</span>
                  </div>
                  <DietForm />
                </div>
              </div>
            </Reveal>

          </div>
        </section>

        {/* ── TRANSFORMATION STORIES ───────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 mb-28">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-bold px-4 py-2 rounded-full tracking-[0.15em] uppercase mb-4">
                <TrendingUp size={14} /> Real Transformations
              </div>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black text-white font-['Syne'] tracking-tight">
                People Just Like You
              </h2>
              <p className="text-gray-400 text-lg mt-3 max-w-xl mx-auto">
                Verified results from FitForge clients across India.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STORIES.map((s, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array(s.rating).fill(0).map((_, j) => (
                      <Star key={j} size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-5 italic">"{s.quote}"</p>
                  {/* Person */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-black text-sm shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.city}</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-[#10B981] font-black text-sm">−{s.lost}</div>
                        <div className="text-xs text-gray-500">{s.time}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 font-medium">
                      Coach: <span className="text-gray-300">{s.trainer}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 pb-28 text-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12">
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white font-['Syne'] tracking-tight leading-tight mb-4">
                  Ready to Write<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
                    Your Story?
                  </span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                  Join 10,000+ clients who transformed their bodies with India's #1 live coaching platform.
                </p>
                <button onClick={() => navigate('/auth/register')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white px-10 py-5 rounded-full font-[800] text-lg uppercase tracking-[0.05em] hover:opacity-90 hover:scale-105 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                >
                  Start Free Today →
                </button>
                <p className="mt-4 text-xs text-gray-500 font-medium tracking-widest uppercase">No credit card · Cancel anytime</p>
              </div>
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  )
}
