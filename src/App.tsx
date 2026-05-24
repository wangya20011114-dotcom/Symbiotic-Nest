/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Calendar, 
  Bell, 
  User, 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Plus,
  Zap,
  Moon,
  CheckCircle2,
  Bluetooth,
  Sprout,
  Instagram,
  Music,
  Youtube,
  Facebook,
  Sun,
  CloudMoon,
  Volume2,
  Waves,
  Sparkles,
  Wind,
  Hourglass,
  Settings,
  ShieldCheck,
  HelpCircle,
  Info,
  LogOut,
  Activity,
  BatteryCharging
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- Types ---

type AppScreen = 'dashboard' | 'setup' | 'sync' | 'stats' | 'custom-ritual' | 'sleep-sanctuary' | 'settings' | 'settings-general' | 'zen-mode' | 'interruption';

interface SessionStep {
  id: number;
  label: string;
  isCompleted: boolean;
}

// --- Constants ---

const MOODS = ['Gentle', 'Firm', 'Locked'];

const FOCUS_GOALS = [
  { id: 'reading', label: 'Reading', icon: '📖' },
  { id: 'study', label: 'Study', icon: '📝' },
  { id: 'disconnect', label: 'Disconnect', icon: '🌿' },
];

const BLOCKABLE_APPS = [
  { id: 'insta', name: 'Instagram', icon: <Instagram className="w-6 h-6 text-pink-600" /> },
  { id: 'tiktok', name: 'TikTok', icon: <Music className="w-6 h-6 text-black" /> },
  { id: 'x', name: 'X', icon: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-900" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )},
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-6 h-6 text-red-600" /> },
  { id: 'fb', name: 'Facebook', icon: <Facebook className="w-6 h-6 text-blue-600" /> },
  { id: 'others', name: 'Other Apps', icon: <Plus className="w-6 h-6 text-slate-400" /> },
];

const QUICK_ACTIONS = [
  { id: 'log', label: 'Custom Ritual', icon: <Plus className="w-6 h-6" />, color: 'var(--color-pastel-blue-primary)', shadow: 'var(--shadow-pastel-blue)', value: 'set up' },
  { id: 'deep-work', label: 'Deep Work', icon: <Zap className="w-6 h-6" />, color: 'var(--color-pastel-peach)', shadow: 'var(--shadow-pastel-peach)', value: '14 Sessions' },
  { id: 'sleep', label: 'Sleep Sanctuary', icon: <Moon className="w-6 h-6" />, color: 'var(--color-pastel-mint)', shadow: 'var(--shadow-pastel-mint)', value: '8 Hours' },
  { id: 'breath', label: 'Time Reclaimed', icon: <Hourglass className="w-6 h-6" />, color: 'var(--color-pastel-blue-soft)', shadow: 'var(--shadow-pastel-blue)', value: '2.5 HRS TODAY' },
];

const INITIAL_STEPS: SessionStep[] = [
  { id: 1, label: 'Initial steps', isCompleted: true },
  { id: 2, label: 'Focusing the mind', isCompleted: true },
  { id: 3, label: 'Setting intention', isCompleted: false },
  { id: 4, label: 'Deep concentration', isCompleted: false },
];

// --- Components ---

function JellyfishAvatar({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      className={`relative ${className}`}
      animate={{ 
        y: [0, -6, 0],
      }}
      transition={{ 
        duration: 5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <svg viewBox="0 0 200 240" className="w-full h-full">
        {/* Tentacles */}
        <g transform="translate(100, 145)">
          {[ -55, -25, 25, 55].map((angle, i) => (
            <motion.path
              key={i}
              d={`M 0,0 C ${angle},20 ${angle * 1.8},40 ${angle * 1.5},80`}
              fill="none"
              stroke="var(--color-pastel-blue-primary)"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.5"
              animate={{
                d: [
                  `M 0,0 C ${angle},20 ${angle * 1.8},40 ${angle * 1.5},80`,
                  `M 0,0 C ${angle * 0.3},15 ${angle * 0.5},25 ${angle * 0.4},35`,
                  `M 0,0 C ${angle},20 ${angle * 1.8},40 ${angle * 1.5},80`
                ],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.1 * i
              }}
            />
          ))}
        </g>

        {/* Head Body */}
        <motion.path
          d="M40,120 C40,40 160,40 160,120 C160,140 135,150 100,150 C65,150 40,140 40,120 Z"
          fill="var(--color-pastel-blue-primary)"
          opacity="0.85"
          animate={{
            d: [
              "M40,120 C40,40 160,40 160,120 C160,140 135,150 100,150 C65,150 40,140 40,120 Z",
              "M50,115 C50,55 150,55 150,115 C150,130 130,135 100,135 C70,135 50,130 50,115 Z",
              "M40,120 C40,40 160,40 160,120 C160,140 135,150 100,150 C65,150 40,140 40,120 Z"
            ],
            scale: [1, 0.95, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Subtle Inner Glow */}
        <motion.circle 
          cx="100" cy="100" r="30" 
          fill="white" 
          opacity="0.2"
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Zen Face */}
        <g transform="translate(100, 110)">
          {/* Eyes as circles */}
          <circle cx="-25" cy="0" r="6" fill="var(--color-navy-dark)" opacity="0.6" />
          <circle cx="25" cy="0" r="6" fill="var(--color-navy-dark)" opacity="0.6" />
          {/* Small circular mouth */}
          <circle cx="0" cy="12" r="3" fill="var(--color-navy-dark)" opacity="0.5" />
        </g>
      </svg>
    </motion.div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('dashboard');
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'profile'>('home');
  const [selectedMood, setSelectedMood] = useState('Gentle');
  const [duration, setDuration] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Deep Work Sheet State ---
  const [showDeepWorkSheet, setShowDeepWorkSheet] = useState(false);

  // --- Sleep Sanctuary State ---
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeUpTime, setWakeUpTime] = useState('07:30');
  const [repeatDays, setRepeatDays] = useState<string[]>(['M', 'T', 'W', 'T', 'F']);
  const [selectedSound, setSelectedSound] = useState('Ocean Waves');
  const [sunriseRelease, setSunriseRelease] = useState(true);

  // --- Custom Ritual State ---
  const [customGoal, setCustomGoal] = useState('reading');
  const [customDuration, setCustomDuration] = useState(35);
  const [blockedAppIds, setBlockedAppIds] = useState<string[]>(['insta', 'tiktok']);

  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- Zen Mode / Deep Work Session State ---
  const [zenTimeLeft, setZenTimeLeft] = useState(45 * 60);
  const [isEmergencyPressing, setIsEmergencyPressing] = useState(false);
  const emergencyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (screen === 'zen-mode' && zenTimeLeft > 0) {
      interval = setInterval(() => {
        setZenTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (zenTimeLeft === 0) {
      handleBack();
      // In a real app, show success toast
    }
    return () => clearInterval(interval);
  }, [screen, zenTimeLeft]);

  const handleStartZen = () => {
    setShowDeepWorkSheet(false);
    setZenTimeLeft(duration * 60);
    setScreen('zen-mode');
  };

  const handleEmergencyStart = () => {
    emergencyTimerRef.current = setTimeout(() => {
      handleBack();
    }, 3000);
    setIsEmergencyPressing(true);
  };

  const handleEmergencyEnd = () => {
    if (emergencyTimerRef.current) {
      clearTimeout(emergencyTimerRef.current);
    }
    setIsEmergencyPressing(false);
  };

  const formatZenTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Handlers ---

  const handleSetup = () => setScreen('setup');
  const handleCustomRitual = () => setScreen('custom-ritual');
  const handleSleepSanctuary = () => setScreen('sleep-sanctuary');
  const handleSync = () => setScreen('sync');
  const handleBack = () => {
    setScreen('dashboard');
    setActiveTab('home');
  };

  const [statsPeriod, setStatsPeriod] = useState('W');

  const formatTime = (value: number) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const toggleAppBlocking = (id: string) => {
    setBlockedAppIds(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const statsData = [
    { name: 'Mon', value: 1.5 },
    { name: 'Tue', value: 2.2 },
    { name: 'Wed', value: 1.8 },
    { name: 'Thu', value: 2.8 },
    { name: 'Fri', value: 2.5 },
    { name: 'Sat', value: 3.1 },
    { name: 'Sun', value: 2.9 },
  ];

  // --- Renderers ---

  const renderSleepSanctuary = () => (
    <motion.div 
      key="sleep-sanctuary"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-6 pb-32 pt-8"
    >
      <header className="flex items-center mb-8">
        <button onClick={handleBack} className="w-10 h-10 rounded-2xl bg-white shadow-soft-ui flex items-center justify-center text-navy-dark">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="ml-4 text-2xl font-extrabold text-navy-dark leading-tight">Sleep Sanctuary</h2>
      </header>

      {/* Time Settings */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] shadow-soft-ui flex flex-col items-center">
          <CloudMoon className="w-6 h-6 text-indigo-400 mb-2" />
          <p className="text-[10px] font-black text-navy-dark/40 uppercase mb-2">Bedtime</p>
          <input 
            type="time" 
            value={bedtime} 
            onChange={(e) => setBedtime(e.target.value)}
            className="text-2xl font-black text-navy-dark bg-transparent border-none outline-none text-center"
          />
        </div>
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] shadow-soft-ui flex flex-col items-center">
          <Sun className="w-6 h-6 text-orange-400 mb-2" />
          <p className="text-[10px] font-black text-navy-dark/40 uppercase mb-2">Wake Up</p>
          <input 
            type="time" 
            value={wakeUpTime} 
            onChange={(e) => setWakeUpTime(e.target.value)}
            className="text-2xl font-black text-navy-dark bg-transparent border-none outline-none text-center"
          />
        </div>
      </div>

      {/* Repeat Selection */}
      <section className="mb-8">
        <p className="text-[10px] font-black text-navy-dark/40 uppercase tracking-widest mb-4">Cycle</p>
        <div className="flex justify-between gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
            const isSelected = repeatDays.includes(day);
            return (
              <button
                key={idx}
                onClick={() => setRepeatDays(prev => 
                  prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                )}
                className={`w-10 h-10 rounded-full text-xs font-black transition-all ${
                  isSelected ? 'bg-navy-dark text-white scale-110' : 'bg-white text-navy-dark/20'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </section>

      {/* Soundscape Selection */}
      <section className="mb-8">
        <p className="text-[10px] font-black text-navy-dark/40 uppercase tracking-widest mb-4">Soundscape</p>
        <div className="space-y-3">
          {[
            { name: 'Ocean Waves', icon: Waves, color: 'text-blue-400' },
            { name: 'Deep Space', icon: Sparkles, color: 'text-purple-400' },
            { name: 'Gentle Chimes', icon: Wind, color: 'text-emerald-400' }
          ].map(sound => (
            <button
              key={sound.name}
              onClick={() => setSelectedSound(sound.name)}
              className={`w-full pastel-card p-4 flex items-center justify-between transition-all ${
                selectedSound === sound.name ? 'ring-2 ring-navy-dark/5 shadow-md' : 'opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <sound.icon className={`w-5 h-5 ${sound.color}`} />
                <span className="font-extrabold text-navy-dark">{sound.name}</span>
              </div>
              {selectedSound === sound.name && <Volume2 className="w-4 h-4 text-navy-dark" />}
            </button>
          ))}
        </div>
      </section>

      {/* Sunrise Release Hardware Toggle */}
      <section className="mb-10">
        <div className="bg-pastel-peach/10 border border-pastel-peach/30 p-5 rounded-[32px] flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h4 className="text-sm font-black text-navy-dark">Sunrise Release</h4>
            <p className="text-[10px] font-bold text-navy-dark/60 leading-tight mt-1">
              Jellyfish will gently deflate and illuminate 5 mins before wake up.
            </p>
          </div>
          <button 
            onClick={() => setSunriseRelease(!sunriseRelease)}
            className={`w-14 h-8 rounded-full p-1 transition-all ${sunriseRelease ? 'bg-pastel-peach' : 'bg-navy-dark/10'}`}
          >
            <motion.div 
              animate={{ x: sunriseRelease ? 24 : 0 }}
              className="w-6 h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
      </section>

      <button onClick={handleBack} className="stadium-button bg-navy-dark text-white w-full h-16 shadow-lg">
        Confirm Sanctuary
      </button>
    </motion.div>
  );

  const renderDeepWorkSheet = () => (
    <AnimatePresence>
      {showDeepWorkSheet && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeepWorkSheet(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full bg-white rounded-t-[48px] z-[70] px-8 pt-10 pb-12 shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-navy-dark/10 rounded-full mx-auto mb-8" />
            
            <header className="text-center mb-10">
              <div className="w-16 h-16 bg-pastel-peach rounded-3xl mx-auto flex items-center justify-center shadow-pastel-peach mb-4">
                <Zap className="w-8 h-8 text-white fill-current" />
              </div>
              <h3 className="text-3xl font-extrabold text-navy-dark">Deep Work</h3>
              <p className="text-navy-dark/40 font-bold uppercase tracking-widest text-[10px] mt-2">Ready for impact</p>
            </header>

            <div className="bg-navy-dark/5 rounded-[32px] p-6 mb-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-pastel-peach" />
                  <span className="font-extrabold text-navy-dark">45 Mins Focus</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-pastel-blue-primary" />
                  <span className="font-extrabold text-navy-dark">Social Media Blocked</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <span className="font-extrabold text-navy-dark">Locked Barrier Activation</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleStartZen}
              className="stadium-button bg-pastel-peach text-white shadow-pastel-peach w-full h-18 text-xl font-black"
            >
              Start Focus
            </button>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );

  const renderCustomRitual = () => (
    <motion.div 
      key="custom-ritual"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-6 pb-32 pt-8"
    >
      <header className="flex items-center mb-8">
        <button onClick={handleBack} className="w-10 h-10 rounded-2xl bg-white shadow-soft-ui flex items-center justify-center text-navy-dark">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="ml-4 text-2xl font-extrabold text-navy-dark leading-tight">Custom Ritual</h2>
      </header>

      {/* Goal Selection */}
      <section className="mb-10">
        <p className="text-[10px] font-black text-navy-dark/40 uppercase tracking-widest mb-4">Choose Goal</p>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {FOCUS_GOALS.map(goal => (
            <button
              key={goal.id}
              onClick={() => setCustomGoal(goal.id)}
              className={`flex-shrink-0 px-6 py-4 rounded-3xl flex flex-col items-center gap-2 transition-all ${
                customGoal === goal.id 
                  ? 'bg-pastel-blue-primary text-navy-dark shadow-pastel-blue scale-105' 
                  : 'bg-white text-navy-dark/40 shadow-soft-ui'
              }`}
            >
              <span className="text-2xl">{goal.icon}</span>
              <span className="text-xs font-black">{goal.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Duration Scroller */}
      <section className="mb-10">
        <p className="text-[10px] font-black text-navy-dark/40 uppercase tracking-widest mb-4">Set Duration</p>
        <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 shadow-soft-ui">
          <div className="flex items-end justify-center gap-2 mb-4">
            <span className="text-5xl font-black text-navy-dark">{customDuration}</span>
            <span className="text-sm font-bold text-navy-dark/40 pb-2 uppercase">min</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="120" 
            step="5"
            value={customDuration}
            onChange={(e) => setCustomDuration(Number(e.target.value))}
            className="w-full h-2 bg-navy-dark/5 rounded-full appearance-none accent-pastel-blue-primary cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold text-navy-dark/20 uppercase tracking-widest">
            <span>5m</span>
            <span>60m</span>
            <span>120m</span>
          </div>
        </div>
      </section>

      {/* App Blacklist */}
      <section className="mb-10">
        <p className="text-[10px] font-black text-navy-dark/40 uppercase tracking-widest mb-4">Digital Shield (Physical Block)</p>
        <div className="space-y-3">
          {BLOCKABLE_APPS.map(app => (
            <button
              key={app.id}
              onClick={() => toggleAppBlocking(app.id)}
              className="w-full pastel-card p-4 flex items-center justify-between group active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm transition-all group-hover:scale-110">
                  {app.icon}
                </div>
                <span className="font-extrabold text-navy-dark">{app.name}</span>
              </div>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${blockedAppIds.includes(app.id) ? 'bg-pastel-blue-primary text-navy-dark' : 'bg-navy-dark/5 text-transparent'}`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Activation Hint */}
      <div className="mb-8 p-4 rounded-2xl bg-pastel-mint/10 border border-pastel-mint/20 flex gap-4 items-start">
        <Sprout className="w-5 h-5 text-pastel-mint shrink-0" />
        <p className="text-xs font-bold text-navy-dark/60 leading-relaxed">
          Physical shields will deploy once the ritual starts. Place your phone in the base station for maximum focus.
        </p>
      </div>

      <button 
        onClick={handleSync}
        className="stadium-button bg-pastel-blue-primary text-navy-dark shadow-pastel-blue w-full h-16 text-lg"
      >
        Activate Ritual
      </button>
    </motion.div>
  );

  const renderStats = () => (
    <motion.div
      key="stats"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 pb-40 pt-8"
    >
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h2 className={`text-3xl font-extrabold leading-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>
            Time Reclaimed
            <div className="w-1.5 h-1.5 rounded-full bg-pastel-blue-primary mt-2" />
          </h2>
          <p className={`${isDarkMode ? 'text-white/40' : 'text-navy-dark/40'} font-bold uppercase tracking-widest text-[10px] mt-1`}>Growth & Focus</p>
        </div>
        <JellyfishAvatar className="w-24 h-24 -mt-4 -mr-2" />
      </header>

      {/* Period Selector */}
      <div className={`${isDarkMode ? 'bg-white/5' : 'bg-navy-dark/5'} p-1 rounded-2xl flex mb-10 transition-colors`}>
        {['D', 'W', 'M', '6M', 'Y'].map(p => (
          <button
            key={p}
            onClick={() => setStatsPeriod(p)}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              statsPeriod === p 
                ? (isDarkMode ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-navy-dark shadow-sm') 
                : (isDarkMode ? 'text-white/20' : 'text-navy-dark/40')
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Summary Stat */}
      <div className="mb-10 text-center">
        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/40' : 'text-navy-dark/40'}`}>AVERAGE</p>
        <h3 className={`text-5xl font-black leading-none ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>2<span className="text-2xl lowercase font-bold">h</span> 48<span className="text-2xl lowercase font-bold">m</span></h3>
        <p className={`text-[10px] font-bold mt-3 ${isDarkMode ? 'text-white/20' : 'text-navy-dark/40'}`}>May 12 - 18, 2026</p>
      </div>

      {/* Chart */}
      <div className={`w-full h-64 backdrop-blur-md rounded-[32px] p-6 mb-8 shadow-soft-ui border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white/50 border-white'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={statsData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pastel-blue-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-pastel-blue-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 800 }}
              dy={10}
            />
            <YAxis hide domain={[0, 4]} />
            <Tooltip 
              formatter={(value: number) => [formatTime(value), "Time"]}
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
                fontWeight: 800,
                backgroundColor: isDarkMode ? '#1A2333' : '#FFFFFF',
                color: isDarkMode ? '#FFFFFF' : '#000000'
              }}
              itemStyle={{ color: isDarkMode ? '#FFFFFF' : 'var(--color-navy-dark)' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-pastel-blue-primary)" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className={`backdrop-blur-md p-5 rounded-[24px] shadow-soft-ui border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white'}`}>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/40' : 'text-navy-dark/40'}`}>TIME RECLAIMED</p>
            <p className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>4h 12m</p>
          </div>
          <div className={`backdrop-blur-md p-5 rounded-[24px] shadow-soft-ui border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white'}`}>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/40' : 'text-navy-dark/40'}`}>REMINDER HITS</p>
            <p className="text-xl font-black text-pastel-mint">24 Hits</p>
          </div>
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 pb-40 pt-8"
    >
      <header className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-navy-dark leading-tight">Nest & Settings</h2>
        <button className="w-10 h-10 rounded-2xl bg-white shadow-soft-ui flex items-center justify-center text-navy-dark">
          <Settings className="w-6 h-6 rotate-45" />
        </button>
      </header>

      {/* Block 1: Hardware & Symbiosis */}
      <section className={`rounded-[40px] p-6 mb-8 shadow-pastel-blue/10 border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-pastel-blue-primary/10 border-pastel-blue-primary/20'}`}>
        <h3 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${isDarkMode ? 'text-white/40' : 'text-navy-dark/40'}`}>Hardware & Symbiosis</h3>
        
        <div className="space-y-6">
          {/* Account Detail */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-[24px] shadow-sm overflow-hidden flex items-center justify-center border-2 ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white border-white'}`}>
              <JellyfishAvatar className="w-20 h-20" />
            </div>
            <div>
              <h4 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>Arip</h4>
              <p className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-white/40' : 'text-navy-dark/40'}`}>Focus Pioneer</p>
            </div>
            <button className={`ml-auto w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-white/5 text-white/40' : 'bg-white/50 text-navy-dark/40'}`}>
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>

          <div className={`h-px ${isDarkMode ? 'bg-white/5' : 'bg-navy-dark/5'}`} />

          {/* Nest Sync */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center text-pastel-blue-primary ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                <Bluetooth className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>Nest Sync</p>
                <p className="text-[10px] font-bold text-pastel-blue-primary uppercase flex items-center gap-1">
                  Connected <span className="inline-block w-1 h-1 rounded-full bg-pastel-blue-primary" /> 85% Battery
                </p>
              </div>
            </div>
            <BatteryCharging className="w-5 h-5 text-pastel-blue-primary" />
          </div>

          {/* Hardware Diagnostics */}
          <button className={`w-full h-14 transition-colors rounded-2xl flex items-center px-4 border ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/40 border-navy-dark/5 hover:bg-white/60'}`}>
            <Activity className="w-5 h-5 text-navy-dark/40 mr-4" />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>Hardware Diagnostics</span>
            <div className="ml-auto text-[10px] font-black text-pastel-blue-primary uppercase bg-pastel-blue-primary/10 px-2 py-0.5 rounded-md">
              Test
            </div>
          </button>
        </div>
      </section>

      {/* Block 2: Preferences */}
      <section className="mb-8">
        <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ml-4 ${isDarkMode ? 'text-white/40' : 'text-navy-dark/40'}`}>Preferences</h3>
        <div className={`backdrop-blur-md rounded-[32px] overflow-hidden border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white'}`}>
          {[
            { label: 'General Settings', icon: Settings, onClick: () => setScreen('settings-general') },
            { label: 'Notifications', icon: Bell },
            { label: 'Screen Time Permissions', icon: ShieldCheck }
          ].map((item, idx, arr) => (
            <button 
              key={item.label}
              onClick={item.onClick}
              className={`w-full h-16 px-6 flex items-center gap-4 active:bg-black/5 transition-colors ${idx !== arr.length - 1 ? 'border-b border-navy-dark/5' : ''}`}
            >
              <item.icon className="w-5 h-5 opacity-20" />
              <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>{item.label}</span>
              <ChevronLeft className="ml-auto w-4 h-4 text-navy-dark/10 rotate-180" />
            </button>
          ))}
        </div>
      </section>

      {/* Block 3: Support & About */}
      <section className="mb-8">
        <h3 className="text-[10px] font-black text-navy-dark/40 uppercase tracking-widest mb-4 ml-4">Support & About</h3>
        <div className="bg-white/50 backdrop-blur-md rounded-[32px] overflow-hidden border border-white mb-6">
          {[
            { label: 'Help & Contact', icon: HelpCircle },
            { label: 'Privacy & Data', icon: Info, subtitle: 'Your focus data stays on your device.' }
          ].map((item, idx, arr) => (
            <button 
              key={item.label}
              className={`w-full py-5 px-6 flex flex-col transition-colors active:bg-navy-dark/5 ${idx !== arr.length - 1 ? 'border-b border-navy-dark/5' : ''}`}
            >
              <div className="flex items-center gap-4 w-full">
                <item.icon className="w-5 h-5 text-navy-dark/20" />
                <span className="text-sm font-bold text-navy-dark">{item.label}</span>
                <ChevronLeft className="ml-auto w-4 h-4 text-navy-dark/10 rotate-180" />
              </div>
              {item.subtitle && (
                <p className="ml-9 mt-1 text-[10px] font-bold text-pastel-blue-primary/60 leading-tight">
                  {item.subtitle}
                </p>
              )}
            </button>
          ))}
        </div>

        <button className="w-full h-16 rounded-[24px] border-2 border-red-100 flex items-center justify-center gap-3 text-red-400 font-extrabold active:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          Logout Account
        </button>
      </section>
    </motion.div>
  );

  const renderZenMode = () => (
    <motion.div 
      key="zen-mode"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#050B1B] flex flex-col items-center justify-between py-20 px-8"
    >
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <p className="text-[10px] font-black text-pastel-blue-primary uppercase tracking-[0.2em]">Deep Work Active</p>
        </div>
        <h2 className="text-white/40 text-sm font-bold uppercase tracking-widest">Barrier Sealed</h2>
      </div>

      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-pastel-blue-primary/20 blur-[80px] rounded-full animate-pulse" />
        <JellyfishAvatar className="w-56 h-56 relative z-10 drop-shadow-[0_0_30px_rgba(100,180,255,0.4)]" />
      </div>

      <div className="text-center">
        <p className="text-6xl font-black text-white tracking-tight tabular-nums">{formatZenTime(zenTimeLeft)}</p>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Mins Remaining</p>
      </div>

      {/* Mock Interruption Trigger (Small for demo) */}
      <button 
        onClick={() => setScreen('interruption')}
        className="absolute top-10 right-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
      >
         <Activity className="w-4 h-4 text-white/20" />
      </button>

      {/* Emergency Override */}
      <div className="w-full flex flex-col items-center gap-4">
        <button 
          onMouseDown={handleEmergencyStart}
          onMouseUp={handleEmergencyEnd}
          onTouchStart={handleEmergencyStart}
          onTouchEnd={handleEmergencyEnd}
          className="group relative px-6 py-3"
        >
          <div className="relative z-10 text-[10px] font-black text-white/20 uppercase tracking-widest group-active:text-white/60 transition-colors">
            Hold to break Focus (3s)
          </div>
          {isEmergencyPressing && (
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 bg-white origin-left w-full"
            />
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderInterruptionState = () => (
    <motion.div 
      key="interruption"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-orange-600 flex flex-col items-center justify-between py-20 px-8 text-center"
    >
       <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-white/10 rounded-3xl mx-auto flex items-center justify-center border border-white/20">
          <Zap className="w-8 h-8 text-white animate-bounce" />
        </div>
        <h2 className="text-3xl font-black text-white leading-tight">Sync Broken</h2>
        <p className="text-white/60 font-bold text-sm">Hardware sensor detects phone removal.<br/>Connection unstable.</p>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={() => setScreen('zen-mode')}
          className="w-full h-18 bg-white rounded-3xl flex items-center justify-center gap-3 text-orange-600 font-black text-lg shadow-xl shadow-black/10 active:scale-95 transition-transform"
        >
          Return to Nest
        </button>
        <button 
          onClick={() => {
            setScreen('dashboard');
            // Mock penalty
          }}
          className="w-full py-4 text-white/40 font-bold text-xs uppercase tracking-widest"
        >
          Break Contract (Penalty: -2 Health)
        </button>
      </div>
    </motion.div>
  );

  const renderGeneralSettings = () => (
    <motion.div
      key="settings-general"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-6 pb-40 pt-8"
    >
      <header className="flex items-center mb-8">
        <button onClick={() => setScreen('settings')} className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-white/10 text-white' : 'bg-white shadow-soft-ui text-navy-dark'}`}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className={`ml-4 text-2xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>General Settings</h2>
      </header>

      <section className="space-y-4">
        <div className={`p-6 rounded-[32px] flex items-center justify-between border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white'}`}>
          <div>
            <h4 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>Deep Sleep Mode</h4>
            <p className={`text-[10px] font-bold leading-tight mt-1 ${isDarkMode ? 'text-white/40' : 'text-navy-dark/60'}`}>
              Immerse in a deep blue theme for restorative focus.
            </p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-14 h-8 rounded-full p-1 transition-all ${isDarkMode ? 'bg-indigo-500' : 'bg-navy-dark/10'}`}
          >
            <motion.div 
              animate={{ x: isDarkMode ? 24 : 0 }}
              className="w-6 h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        <div className={`p-6 rounded-[32px] flex items-center justify-between border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white'}`}>
          <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>Time Format</span>
          <span className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-navy-dark/20'}`}>24 Hours</span>
        </div>
      </section>
    </motion.div>
  );

  const renderDashboard = () => (
    <motion.div 
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col overflow-y-auto hide-scrollbar"
    >
      {/* Top Section: The Canvas (Atmosphere) */}
      <div className="px-6 pt-12 pb-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-extrabold font-display ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>Welcome back, Arip!</h1>
            <p className={`${isDarkMode ? 'text-white/60' : 'text-navy-dark/60'} font-medium`}>What do you need right now?</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl backdrop-blur-md shadow-soft-ui flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-white/60'}`}>
              <Bluetooth className="text-pastel-blue-primary w-6 h-6" />
          </div>
        </header>

        {/* Barrier Strength Control */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2 w-full justify-center">
            {MOODS.map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`px-6 py-2 rounded-full font-bold transition-all shadow-sm flex-1 max-w-[100px] text-sm ${
                  selectedMood === mood 
                    ? 'bg-pastel-blue-primary text-navy-dark shadow-pastel-blue' 
                    : isDarkMode ? 'bg-white/10 text-white/40' : 'bg-white/80 text-navy-dark/40'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${isDarkMode ? 'text-white/20' : 'text-navy-dark/20'}`}>Barrier Strength</p>
        </div>

        {/* Progress Widget */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="128" cy="128" r="110" 
                className={`fill-none stroke-[12] ${isDarkMode ? 'stroke-white/10' : 'stroke-white/50'}`}
              />
              <motion.circle 
                cx="128" cy="128" r="110" 
                className="fill-none stroke-pastel-blue-primary stroke-[12]"
                initial={{ strokeDasharray: "691", strokeDashoffset: "691" }}
                animate={{ strokeDashoffset: 691 - (691 * 0.64) }}
                transition={{ duration: 2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Jellyfish Illustration Container */}
            <div className={`w-48 h-48 rounded-full backdrop-blur-sm shadow-soft-ui flex flex-col items-center justify-center overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-white/90'}`}>
               <JellyfishAvatar className="w-32 h-32" />
               <div className="-mt-3 text-center">
                  <p className={`text-2xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>64<span className="text-sm">%</span></p>
                  <p className={`text-[10px] uppercase font-black tracking-widest ${isDarkMode ? 'text-white/40' : 'text-navy-dark/40'}`}>RECOVERY</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: The Control */}
      <div className="px-6 pt-6 pb-32">
        {/* Grid Actions */}
        <div className="grid grid-cols-2 gap-4">
          {QUICK_ACTIONS.map(action => (
            <button 
              key={action.id}
              onClick={() => {
                if (action.id === 'deep-work') setShowDeepWorkSheet(true);
                else if (action.id === 'log') handleCustomRitual();
                else if (action.id === 'breath') { setScreen('stats'); setActiveTab('stats'); }
                else if (action.id === 'sleep') handleSleepSanctuary();
              }}
              className={`pastel-card p-5 text-left flex flex-col justify-between h-40 active:scale-95 backdrop-blur-sm ${isDarkMode ? 'bg-white/10' : 'bg-white/90'}`}
              style={{ boxShadow: isDarkMode ? 'none' : action.shadow }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${action.color}33`, color: action.color }}
              >
                {action.icon}
              </div>
              <div>
                <h3 className={`font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-navy-dark'}`}>{action.label}</h3>
                {action.value && <p className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${isDarkMode ? 'text-white/40' : 'text-navy-dark/40'}`}>{action.value}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderSetup = () => (
    <motion.div 
      key="setup"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-6 pb-20"
    >
      <header className="flex items-center mb-8 pt-8">
        <button onClick={handleBack} className="w-10 h-10 rounded-2xl bg-white shadow-soft-ui flex items-center justify-center text-navy-dark">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="ml-4 text-2xl font-extrabold text-navy-dark leading-tight">Energize Focus</h2>
      </header>

      {/* Relaxing Illustration */}
      <div className="aspect-[4/3] w-full bg-pastel-mint/20 rounded-[32px] mb-10 flex items-center justify-center overflow-hidden relative">
         <motion.div 
          animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -right-10 -top-10 w-40 h-40 bg-pastel-mint opacity-20 blur-3xl rounded-full"
         />
         <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              animate={{ rotate: [0, 2, 0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <svg viewBox="0 0 200 150" className="w-48 h-auto text-navy-dark/20">
                {/* Minimalist person chilling figure */}
                <circle cx="100" cy="40" r="15" fill="currentColor" opacity="0.6" />
                <path d="M70,70 Q100,100 130,70" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" />
                <path d="M80,75 L60,110" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" />
                <path d="M120,75 L140,110" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" />
              </svg>
            </motion.div>
            <p className="mt-4 text-sm font-bold text-navy-dark/40 uppercase tracking-widest">Finding Stillness</p>
         </div>
      </div>

      {/* Time Picker Wheel */}
      <div className="flex flex-col items-center mb-10">
         <div className="h-24 w-full relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-lavender-bg to-transparent z-10" />
            <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-lavender-bg to-transparent z-10" />
            <div className="flex flex-col items-center overflow-y-auto h-full scroll-smooth hide-scrollbar snap-y snap-mandatory py-8">
               {Array.from({ length: 13 }).map((_, i) => {
                 const minutes = (i + 1) * 5;
                 return (
                   <button 
                    key={minutes}
                    onClick={() => setDuration(minutes)}
                    className={`h-10 text-3xl flex items-center justify-center snap-center transition-all ${duration === minutes ? 'text-navy-dark font-black scale-125' : 'text-navy-dark/20 font-bold'}`}
                   >
                     {minutes}
                   </button>
                 );
               })}
            </div>
         </div>
         <p className="mt-4 font-bold text-navy-dark/60">Minutes for this session</p>
      </div>

      {/* Session Steps */}
      <div className="space-y-4 mb-10">
        {INITIAL_STEPS.map(step => (
          <div key={step.id} className="pastel-card p-5 flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Play className="w-5 h-5 text-pastel-peach fill-current" />
             </div>
             <span className="flex-1 font-bold text-navy-dark">{step.label}</span>
             {step.isCompleted && <CheckCircle2 className="w-6 h-6 text-pastel-mint fill-current" />}
          </div>
        ))}
      </div>

      <button 
        onClick={handleSync}
        className="stadium-button bg-pastel-blue-primary text-navy-dark shadow-pastel-blue w-full h-16 text-lg"
      >
        Energize Now
      </button>
    </motion.div>
  );

  const renderSync = () => (
    <motion.div 
      key="sync"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="h-full flex flex-col items-center justify-center text-center px-6 relative"
    >
      {/* Mesh Gradient Animating */}
      <div className="absolute inset-0 z-0 mesh-gradient opacity-40 blur-3xl rounded-full scale-150 rotate-45" />

      {/* Back Button */}
      <button 
        onClick={handleBack} 
        className="absolute top-12 left-6 w-10 h-10 rounded-2xl bg-white/50 backdrop-blur-md shadow-soft-ui flex items-center justify-center text-navy-dark z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Glowing Orb */}
      <div className="relative mb-16 z-10">
         <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ 
            scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
          }}
          className="w-64 h-64 rounded-full relative"
         >
            <div className="absolute inset-0 bg-gradient-to-tr from-pastel-blue-soft via-pastel-blue-primary to-pastel-mint rounded-full blur-2xl opacity-60" />
            <div className="absolute inset-4 bg-white/20 backdrop-blur-3xl rounded-full border border-white/40" />
            <div className="absolute inset-0 flex items-center justify-center">
               <motion.div 
                 animate={{ opacity: [0.2, 1, 0.2] }}
                 transition={{ duration: 4, repeat: Infinity }}
               >
                 <Hourglass className="w-16 h-16 text-white" />
               </motion.div>
            </div>
         </motion.div>
         {/* Second glow layer */}
         <motion.div 
            animate={{ scale: [1.2, 1.5, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute inset-0 bg-pastel-blue-primary blur-[80px] rounded-full -z-10"
         />
      </div>

      <div className="space-y-4 mb-20 z-10">
        <h2 className="text-4xl font-extrabold text-navy-dark tracking-tight">Focusing Intent</h2>
        <p className="text-navy-dark/60 font-bold max-w-xs mx-auto text-lg leading-snug">
          Place phone in Nest... <br />
          Use your breath to find energy.
        </p>
      </div>

      {/* Audio Controls */}
      <div className="z-10 w-full max-w-xs flex items-center justify-between px-8 py-6 rounded-[32px] bg-white/60 backdrop-blur-xl shadow-soft-ui">
        <button className="text-navy-dark/40 hover:text-navy-dark transition-colors">
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 rounded-full bg-pastel-blue-primary shadow-pastel-blue flex items-center justify-center text-navy-dark active:scale-90 transition-transform"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
        </button>
        <button className="text-navy-dark/40 hover:text-navy-dark transition-colors">
          <Hourglass className="w-6 h-6 rotate-180" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#050810]' : 'bg-slate-50'}`}>
      <div 
        id="app-shell" 
        className={`relative w-full max-w-sm h-[800px] rounded-[48px] overflow-hidden shadow-2xl border-[12px] ring-1 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-[#0B1221] to-[#070D18] border-[#1A2333] ring-white/5' 
            : 'bg-gradient-to-b from-sky-100 via-sky-50 to-white border-white ring-black/5'
        }`}
      >
        
        {/* Screen Content */}
        <main className="h-full relative overflow-y-auto hide-scrollbar">
           <AnimatePresence mode="wait">
             {screen === 'dashboard' && renderDashboard()}
             {screen === 'setup' && renderSetup()}
             {screen === 'sync' && renderSync()}
             {screen === 'stats' && renderStats()}
             {screen === 'custom-ritual' && renderCustomRitual()}
             {screen === 'sleep-sanctuary' && renderSleepSanctuary()}
             {screen === 'settings' && renderSettings()}
             {screen === 'settings-general' && renderGeneralSettings()}
             {screen === 'zen-mode' && renderZenMode()}
             {screen === 'interruption' && renderInterruptionState()}
           </AnimatePresence>
        </main>

        {renderDeepWorkSheet()}

        {/* Global Navigation - Only visible on certain screens */}
        <AnimatePresence>
          {(screen === 'dashboard' || screen === 'stats' || screen === 'settings' || screen === 'settings-general') && (
            <motion.nav 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className={`absolute bottom-0 left-0 w-full backdrop-blur-2xl border-t px-8 pt-4 pb-10 flex justify-between items-center z-50 transition-colors duration-500 ${
                isDarkMode ? 'bg-[#0B1221]/80 border-white/5' : 'bg-white/80 border-black/5'
              }`}
            >
              {[
                { id: 'home', icon: Home, label: 'Home', screen: 'dashboard', tab: 'home' },
                { id: 'stats', icon: Sprout, label: 'Growth', screen: 'stats', tab: 'stats' },
                { id: 'profile', icon: User, label: 'Profile', screen: 'settings', tab: 'profile' }
              ].map(({ id, icon: Icon, screen: targetScreen, tab: targetTab }) => (
                <button 
                  key={id}
                  onClick={() => {
                    setActiveTab(targetTab as any);
                    setScreen(targetScreen as any);
                  }}
                  className={`relative p-2 transition-all ${activeTab === targetTab ? 'text-pastel-blue-primary' : 'text-navy-dark/20'}`}
                >
                  <Icon className={`w-7 h-7 ${activeTab === targetTab ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                  {activeTab === targetTab && (
                    <motion.div 
                      layoutId="tab-underline"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pastel-blue-primary"
                    />
                  )}
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
