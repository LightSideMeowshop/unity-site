import { useState } from 'react';
import {
  Globe,
  Zap,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Cpu,
  Layers,
  Smartphone,
  Monitor,
  Play,
  Code,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Languages,
  Gauge,
  MemoryStick,
} from 'lucide-react';

// Custom Apple logo icon
function AppleLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

// Official Unity logo icon (Bootstrap Icons)
function UnityLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M15 11.2V3.733L8.61 0v2.867l2.503 1.466c.099.067.099.2 0 .234L8.148 6.3c-.099.067-.197.033-.263 0L4.92 4.567c-.099-.034-.099-.2 0-.234l2.504-1.466V0L1 3.733V11.2v-.033.033l2.438-1.433V6.833c0-.1.131-.166.197-.133L6.6 8.433c.099.067.132.134.132.234v3.466c0 .1-.132.167-.198.134L4.031 10.8l-2.438 1.433L7.983 16l6.391-3.733-2.438-1.434L9.434 12.3c-.099.067-.198 0-.198-.133V8.7c0-.1.066-.2.132-.233l2.965-1.734c.099-.066.197 0 .197.134V9.8z"/>
    </svg>
  );
}
import { useI18n } from '../hooks/useI18n';
import { useScrollHide } from '../hooks/useScrollHide';
import { LangDropdown } from '../components/LangDropdown';

// Benchmark data (100 objects, Android build)
// Layout values are averages of 4 cases: Wrap ON/OFF × AutoSize ON/OFF
const BENCHMARKS = {
  creation: { unitext: 217, tmp: 579, uitk: 458 },
  rebuild: { unitext: 83, tmp: 288, uitk: 75 },
  layout: { unitext: 29, tmp: 297, uitk: 52 },
  mesh: { unitext: 25, tmp: 150, uitk: 25 },
};

const GC_DATA = {
  unitext: { cycles: 2, memory: 298 },
  tmp: { cycles: 46, memory: 618 },
  uitk: { cycles: 54, memory: 1219 },
};

// Runtime allocations per operation (Layout/Rebuild)
const RUNTIME_ALLOC = {
  unitext: { value: '~500 B', multiplier: null },
  tmp: { value: '~1.5 KB', multiplier: '×3' },
  uitk: { value: '~100 MB', multiplier: '×200,000' },
};

// Unicode compliance data
const UNICODE_TESTS = [
  { standard: 'UAX #9', name: 'BiDi Algorithm', tests: 91707 },
  { standard: 'UAX #14', name: 'Line Breaking', tests: 19338 },
  { standard: 'UAX #24', name: 'Script Detection', tests: 9705 },
  { standard: 'UAX #29', name: 'Grapheme Clusters', tests: 766 },
];

// Feature comparison
// UI Toolkit: Unity 6+ has Advanced Text Generator with HarfBuzz/ICU
// But still has massive memory allocations (1.2GB for 100 objects)
const FEATURES = [
  { key: 'bidi', unitext: 'full', tmp: 'basic', uitk: 'limited' },      // Unity 6+ only
  { key: 'bidi_auto', unitext: 'full', tmp: 'none', uitk: 'none' },     // UI Toolkit: planned but not implemented
  { key: 'arabic', unitext: 'full', tmp: 'plugin', uitk: 'limited' },   // Unity 6+ only
  { key: 'hebrew', unitext: 'full', tmp: 'plugin', uitk: 'limited' },   // Unity 6+ only
  { key: 'hindi', unitext: 'full', tmp: 'limited', uitk: 'limited' },   // Unity 6+ only
  { key: 'emoji', unitext: 'full', tmp: 'limited', uitk: 'full' },      // Works well
  { key: 'zwj', unitext: 'full', tmp: 'none', uitk: 'limited' },        // Unity 6+ only
  { key: 'zeroalloc', unitext: 'full', tmp: 'none', uitk: 'none' },     // 1.2GB allocations
  { key: 'parallel', unitext: 'full', tmp: 'none', uitk: 'none' },      // Not supported
];

// Platforms
const PLATFORMS = [
  { name: 'Windows', archs: ['x86', 'x64', 'ARM64'], icon: Monitor },
  { name: 'macOS', archs: ['x64', 'Apple Silicon'], icon: AppleLogo },
  { name: 'Linux', archs: ['x64'], icon: Monitor },
  { name: 'Android', archs: ['ARMv7', 'ARM64', 'x86', 'x64'], icon: Smartphone },
  { name: 'iOS', archs: ['ARM64'], icon: AppleLogo },
  { name: 'WebGL', archs: ['1.0', '2.0'], icon: Globe },
];

// Complex scripts supported
const SCRIPTS = [
  { name: 'Arabic', native: 'العربية', users: '400M' },
  { name: 'Hindi', native: 'हिन्दी', users: '600M' },
  { name: 'Bengali', native: 'বাংলা', users: '230M' },
  { name: 'Hebrew', native: 'עברית', users: '9M' },
  { name: 'Thai', native: 'ไทย', users: '60M' },
  { name: 'Tamil', native: 'தமிழ்', users: '80M' },
];

function StatusIcon({ status }) {
  if (status === 'full') return <CheckCircle className="w-5 h-5 text-green-400" />;
  if (status === 'limited' || status === 'basic') return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  if (status === 'plugin') return <AlertCircle className="w-5 h-5 text-orange-400" />;
  return <XCircle className="w-5 h-5 text-red-400" />;
}

function BenchmarkBar({ value, max, color = 'green' }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorMap = {
    green: 'bg-green-500/70',
    red: 'bg-red-500/70',
    purple: 'bg-purple-500/70',
  };
  const bgColor = colorMap[color] || colorMap.green;

  return (
    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${bgColor} rounded-full transition-all duration-1000`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">
        {children}
      </div>
    </section>
  );
}

function SectionHeader({ icon: Icon, kicker, title, subtitle }) {
  return (
    <div className="text-center mb-12">
      {kicker && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-[var(--color-accent)]/15 text-[var(--color-accent)] mb-4">
          {Icon && <Icon className="w-4 h-4" />}
          {kicker}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      {subtitle && <p className="mt-3 text-lg text-white/70 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export function UniTextPage() {
  const { t, locale, setLocale, status } = useI18n();
  const [activeDemo, setActiveDemo] = useState('arabic');
  const headerHidden = useScrollHide({ mobileOnly: true, mobileBreakpoint: 768 });

  // Demo text samples
  const demoTexts = {
    arabic: { label: 'Arabic', text: 'مرحبا بالعالم! Hello World! 🌍', broken: 'م ر ح ب ا ب ا ل ع ا ل م!' },
    hebrew: { label: 'Hebrew', text: 'שלום עולם! Hello World! 🌍', broken: 'ם ל ו ע ם ו ל ש!' },
    hindi: { label: 'Hindi', text: 'नमस्ते दुनिया! Hello World! 🌍', broken: 'न म स त' },
    emoji: { label: 'Emoji', text: '👨‍👩‍👧‍👦 Family emoji as ONE grapheme', broken: '👨 👩 👧 👦 (4 separate)' },
    bidi: { label: 'BiDi Mix', text: 'Price: $1,234 — السعر: 1,234$', broken: '$4,321 — :ecirP' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#12121f] to-[#0a0a12] text-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/30 border-b border-white/10 transition-transform duration-300 ${headerHidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/unitext/assets/unitext-logo-clear-1024.png" alt="UniText" className="w-10 h-10 rounded-xl" />
            <span className="font-bold text-lg">UniText</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-[var(--color-accent)] transition">{t('nav.features')}</a>
            <a href="#benchmarks" className="hover:text-[var(--color-accent)] transition">{t('nav.performance')}</a>
            <a href="#platforms" className="hover:text-[var(--color-accent)] transition">{t('nav.platforms')}</a>
            <a href="#comparison" className="hover:text-[var(--color-accent)] transition">{t('nav.comparison')}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LangDropdown locale={locale} setLocale={setLocale} />
            <a
              href="#cta"
              className="hidden md:inline-flex px-4 py-2 rounded-xl bg-[var(--color-accent)] text-black font-semibold hover:bg-white hover:text-black transition"
            >
              {t('cta.get_started')}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            {t('hero.badge')}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            {t('hero.title_1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-orange-400">
              {t('hero.title_2')}
            </span>
          </h1>

          <p className="mt-6 text-xl text-white/70 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#cta" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-accent)] text-black font-semibold hover:scale-105 hover:text-black transition">
              <Play className="w-5 h-5" />
              {t('cta.get_started')}
            </a>
            <a href="#features" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/10 transition">
              {t('cta.learn_more')}
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '150+', label: t('stats.languages') },
              { value: '3-14×', label: t('stats.faster') },
              { value: '100%', label: t('stats.unicode') },
              { value: '0', label: t('stats.gc') },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-[var(--color-accent)]">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <Section id="problem">
        <SectionHeader
          icon={Globe}
          kicker={t('problem.kicker')}
          title={t('problem.title')}
          subtitle={t('problem.subtitle')}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* TMP Broken */}
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
              <span className="font-semibold text-red-400">TextMesh Pro</span>
            </div>
            <div className="space-y-3 font-mono text-lg">
              {Object.entries(demoTexts).map(([key, { label, broken }]) => (
                <div key={key} className="p-3 rounded-xl bg-black/30">
                  <div className="text-xs text-white/50 mb-1">{label}</div>
                  <div className="text-white/70" dir="auto">{broken}</div>
                </div>
              ))}
            </div>
          </div>

          {/* UniText Correct */}
          <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="font-semibold text-green-400">UniText</span>
            </div>
            <div className="space-y-3 font-mono text-lg">
              {Object.entries(demoTexts).map(([key, { label, text }]) => (
                <div key={key} className="p-3 rounded-xl bg-black/30">
                  <div className="text-xs text-white/50 mb-1">{label}</div>
                  <div className="text-white" dir="auto">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Affected users */}
        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="text-5xl font-bold text-[var(--color-accent)]">1.8B+</div>
          <div className="mt-2 text-white/70">{t('problem.users_affected')}</div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {SCRIPTS.map((script) => (
              <div key={script.name} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10" dir="ltr">
                <bdi className="font-medium">{script.native}</bdi>
                <span className="text-white/50 ml-2 text-sm">{script.users}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section id="features" className="bg-white/[0.02]">
        <SectionHeader
          icon={Layers}
          kicker={t('features.kicker')}
          title={t('features.title')}
          subtitle={t('features.subtitle')}
        />

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Languages, key: 'harfbuzz' },
            { icon: CheckCircle, key: 'unicode' },
            { icon: MemoryStick, key: 'zeroalloc' },
            { icon: Cpu, key: 'parallel' },
            { icon: Sparkles, key: 'emoji' },
            { icon: Code, key: 'modular' },
          ].map(({ icon: Icon, key }) => (
            <div key={key} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--color-accent)]/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)]/30 transition">
                <Icon className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t(`features.${key}.title`)}</h3>
              <p className="text-white/60 text-sm">{t(`features.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Benchmarks */}
      <Section id="benchmarks">
        <SectionHeader
          icon={Gauge}
          kicker={t('benchmarks.kicker')}
          title={t('benchmarks.title')}
          subtitle={t('benchmarks.subtitle')}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Speed benchmarks */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--color-accent)]" />
              {t('benchmarks.speed')}
            </h3>
            <div className="space-y-6">
              {Object.entries(BENCHMARKS).map(([key, data]) => {
                const maxVal = Math.max(data.tmp, data.uitk);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t(`benchmarks.${key}`)}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="w-20 text-xs text-white/50">UniText</span>
                        <div className="flex-1">
                          <BenchmarkBar value={data.unitext} max={maxVal} color="green" />
                        </div>
                        <span className="w-16 text-right text-xs font-mono">{data.unitext}ms</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-20 text-xs text-white/50">TMP</span>
                        <div className="flex-1">
                          <BenchmarkBar value={data.tmp} max={maxVal} color="red" />
                        </div>
                        <span className="w-16 text-right text-xs font-mono">{data.tmp}ms</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-20 text-xs text-white/50">UI Toolkit</span>
                        <div className="flex-1">
                          <BenchmarkBar value={data.uitk} max={maxVal} color="purple" />
                        </div>
                        <span className="w-16 text-right text-xs font-mono">{data.uitk}ms</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Memory benchmarks */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MemoryStick className="w-5 h-5 text-[var(--color-accent)]" />
              {t('benchmarks.memory')}
            </h3>

            <div className="space-y-8">
              {/* GC Cycles */}
              <div>
                <div className="text-sm mb-3">{t('benchmarks.gc_cycles')}</div>
                <div className="flex gap-3">
                  <div className="flex-1 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                    <div className="text-2xl font-bold text-green-400">{GC_DATA.unitext.cycles}</div>
                    <div className="text-xs text-white/50 mt-1">UniText</div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                    <div className="text-2xl font-bold text-red-400">{GC_DATA.tmp.cycles}</div>
                    <div className="text-xs text-white/50 mt-1">TMP</div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center">
                    <div className="text-2xl font-bold text-purple-400">{GC_DATA.uitk.cycles}</div>
                    <div className="text-xs text-white/50 mt-1">UI Toolkit</div>
                  </div>
                </div>
              </div>

              {/* Memory Usage */}
              <div>
                <div className="text-sm mb-3">{t('benchmarks.memory_usage')}</div>
                <div className="flex gap-3">
                  <div className="flex-1 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                    <div className="text-2xl font-bold text-green-400">{GC_DATA.unitext.memory}</div>
                    <div className="text-xs text-white/50 mt-1">MB</div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                    <div className="text-2xl font-bold text-red-400">{GC_DATA.tmp.memory}</div>
                    <div className="text-xs text-white/50 mt-1">MB</div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center">
                    <div className="text-2xl font-bold text-purple-400">{GC_DATA.uitk.memory}</div>
                    <div className="text-xs text-white/50 mt-1">MB</div>
                  </div>
                </div>
              </div>

              {/* Runtime Allocations */}
              <div>
                <div className="text-sm mb-3">{t('benchmarks.runtime_alloc')}</div>
                <div className="flex gap-3">
                  <div className="flex-1 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                    <div className="text-2xl font-bold text-green-400">{RUNTIME_ALLOC.unitext.value}</div>
                    <div className="text-xs text-white/50 mt-1">UniText</div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{RUNTIME_ALLOC.tmp.value}</div>
                    <div className="text-xs text-white/50 mt-1">TMP</div>
                    <div className="text-xs text-yellow-400/70 mt-1">{RUNTIME_ALLOC.tmp.multiplier} {t('benchmarks.more')}</div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                    <div className="text-2xl font-bold text-red-400">{RUNTIME_ALLOC.uitk.value}</div>
                    <div className="text-xs text-white/50 mt-1">UI Toolkit</div>
                    <div className="text-xs text-red-400/70 mt-1">{RUNTIME_ALLOC.uitk.multiplier} {t('benchmarks.more')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/50">
          {t('benchmarks.note')}
        </p>
      </Section>

      {/* Unicode Compliance */}
      <Section id="unicode" className="bg-white/[0.02]">
        <SectionHeader
          icon={Shield}
          kicker={t('unicode.kicker')}
          title={t('unicode.title')}
          subtitle={t('unicode.subtitle')}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {UNICODE_TESTS.map((test) => (
            <div key={test.standard} className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[var(--color-accent)] font-mono font-bold">{test.standard}</div>
              <div className="mt-2 font-medium">{test.name}</div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-mono">{test.tests.toLocaleString()}</span>
              </div>
              <div className="text-xs text-white/50 mt-1">100% PASS</div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[var(--color-accent)]/20 to-purple-500/20 border border-[var(--color-accent)]/30 text-center">
          <div className="text-2xl font-bold">Unicode 17.0.0</div>
          <div className="text-white/70 mt-1">{t('unicode.version_note')}</div>
        </div>
      </Section>

      {/* Platforms */}
      <Section id="platforms">
        <SectionHeader
          icon={Smartphone}
          kicker={t('platforms.kicker')}
          title={t('platforms.title')}
          subtitle={t('platforms.subtitle')}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.name} className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-[var(--color-accent)]/50 transition">
                <Icon className="w-8 h-8 mx-auto text-[var(--color-accent)]" />
                <div className="mt-3 font-semibold">{platform.name}</div>
                {platform.archs.length > 0 && (
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {platform.archs.map((arch) => (
                      <span key={arch} className="px-2 py-0.5 text-xs rounded-full bg-white/10">{arch}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
            <UnityLogo className="w-6 h-6 text-white/70" />
            <span className="text-white/70">Unity 2021 LTS+</span>
          </div>
        </div>
      </Section>

      {/* Comparison Table */}
      <Section id="comparison" className="bg-white/[0.02]">
        <SectionHeader
          icon={Layers}
          kicker={t('comparison.kicker')}
          title={t('comparison.title')}
          subtitle={t('comparison.subtitle')}
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-left">{t('comparison.feature')}</th>
                <th className="py-4 px-4 text-center">
                  <span className="text-[var(--color-accent)] font-bold">UniText</span>
                </th>
                <th className="py-4 px-4 text-center">TextMesh Pro</th>
                <th className="py-4 px-4 text-center">UI Toolkit</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature) => (
                <tr key={feature.key} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4">{t(`comparison.features.${feature.key}`)}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <StatusIcon status={feature.unitext} />
                      <span className="text-sm text-white/70">{t(`comparison.status.${feature.unitext}`)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <StatusIcon status={feature.tmp} />
                      <span className="text-sm text-white/70">{t(`comparison.status.${feature.tmp}`)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <StatusIcon status={feature.uitk} />
                      <span className="text-sm text-white/70">{t(`comparison.status.${feature.uitk}`)}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Unicode version row */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-4">{t('comparison.features.unicode_version')}</td>
                <td className="py-4 px-4 text-center">
                  <span className="text-lg font-bold text-green-400">17.0</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <StatusIcon status="none" />
                    <span className="text-sm text-white/70">{t('comparison.status.none')}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-lg font-bold text-yellow-400">15.0</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-sm text-white/50">
          {t('comparison.footnote_uitk')}
        </p>
      </Section>

      {/* CTA */}
      <Section id="cta">
        <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-[var(--color-accent)]/20 via-purple-500/20 to-[var(--color-accent)]/20 border border-[var(--color-accent)]/30">
          <h2 className="text-3xl md:text-4xl font-bold">{t('cta.title')}</h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">{t('cta.subtitle')}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://assetstore.unity.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-accent)] text-black font-semibold hover:scale-105 hover:text-black transition"
            >
              <Play className="w-5 h-5" />
              {t('cta.asset_store')}
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/10 transition"
            >
              <Code className="w-5 h-5" />
              {t('cta.documentation')}
            </a>
          </div>

          <div className="mt-8 text-sm text-white/50">
            {t('cta.contact')}: <a href="mailto:unity@lightside.media" className="text-[var(--color-accent)] hover:underline">unity@lightside.media</a>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/unitext/assets/unitext-logo-clear-1024.png" alt="UniText" className="w-8 h-8 rounded-lg" />
            <span className="text-sm text-white/50">
              © {new Date().getFullYear()} Light Side. {t('footer.rights')}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <a href="/" className="hover:text-[var(--color-accent)]">Light Side</a>
            <a href="/privacy.html" className="hover:text-[var(--color-accent)]">{t('footer.privacy')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
