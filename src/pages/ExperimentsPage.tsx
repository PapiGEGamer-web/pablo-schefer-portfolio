import { ArrowDown, Atom, Braces, MousePointer2, Orbit, Sparkles } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import type { Locale } from '../content'
import { QuantumOrbital } from '../components/QuantumOrbital'
import './ExperimentsPage.css'

export function ExperimentsPage({ locale }: { locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const labels = locale === 'es' ? {
    eyebrow: 'Código · Ciencia · Interacción',
    title: 'Experimentos que puedes tocar.',
    intro: 'Un espacio para prototipos visuales, modelos generativos e interfaces que convierten ideas técnicas en experiencias directas.',
    explore: 'Abrir primer experimento',
    index: 'Experimento 01',
    atomTitle: 'Átomo de hidrógeno.',
    atomIntro: 'Una reinterpretación propia del visualizador orbital que compartiste. La nube se genera en tu navegador mediante muestreo de probabilidad, sin iframes, vídeos ni servicios externos.',
    local: 'Cálculo local',
    particles: '17K partículas',
    interactive: '3D interactivo',
    explanationEyebrow: 'Qué estás viendo',
    explanationTitle: 'Probabilidad convertida en espacio.',
    explanationBody: 'Los puntos no representan electrones diminutos en posiciones fijas. Representan muestras de la densidad de probabilidad de la función de onda del hidrógeno para los números cuánticos elegidos.',
    radialTitle: 'Distribución radial',
    radialBody: 'El radio se obtiene de una CDF construida con polinomios asociados de Laguerre. Al cambiar n o l, la nube recalcula sus nodos y su extensión.',
    angularTitle: 'Geometría angular',
    angularBody: 'Los armónicos esféricos y los polinomios asociados de Legendre determinan los lóbulos. El número m modifica la orientación y la dinámica.',
    controlsTitle: 'Controles en tiempo real',
    controlsBody: 'Arrastra el modelo, amplía con la rueda y ajusta los números cuánticos, la intensidad o los planos de recorte sin recargar la página.',
  } : {
    eyebrow: 'Code · Science · Interaction',
    title: 'Experiments you can touch.',
    intro: 'A space for visual prototypes, generative models and interfaces that turn technical ideas into direct experiences.',
    explore: 'Open first experiment',
    index: 'Experiment 01',
    atomTitle: 'Hydrogen atom.',
    atomIntro: 'An original reinterpretation of the orbital visualizer you shared. The cloud is generated in your browser through probability sampling, with no iframe, video or external service.',
    local: 'Local computation',
    particles: '17K particles',
    interactive: 'Interactive 3D',
    explanationEyebrow: 'What you are seeing',
    explanationTitle: 'Probability turned into space.',
    explanationBody: 'The points do not represent tiny electrons in fixed positions. They are samples of the hydrogen wave-function probability density for the selected quantum numbers.',
    radialTitle: 'Radial distribution',
    radialBody: 'Radius is sampled from a CDF built with associated Laguerre polynomials. Changing n or l recalculates the cloud nodes and reach.',
    angularTitle: 'Angular geometry',
    angularBody: 'Spherical harmonics and associated Legendre polynomials determine the lobes. The m number changes orientation and dynamics.',
    controlsTitle: 'Real-time controls',
    controlsBody: 'Drag the model, zoom with the wheel and adjust quantum numbers, intensity or clipping planes without reloading the page.',
  }

  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-6% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.68, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <div className="experiments-page">
      <section className="page-hero experiments-hero">
        <m.div
          className="page-hero__copy"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.76, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <p>{labels.intro}</p>
        </m.div>

        <m.div
          className="experiments-hero__visual"
          initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.12, duration: reduceMotion ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <span className="experiments-hero__core"><Atom size={72} /></span>
          <i><Sparkles size={18} /></i>
          <i><Braces size={18} /></i>
          <i><Orbit size={18} /></i>
        </m.div>

        <a className="page-hero__scroll" href="#atomo"><ArrowDown size={15} aria-hidden="true" />{labels.explore}</a>
      </section>

      <section className="section experiment-intro" id="atomo">
        <m.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{labels.index}</p>
            <h2>{labels.atomTitle}</h2>
          </div>
          <p className="section-heading__intro">{labels.atomIntro}</p>
        </m.div>
        <m.div className="experiment-signals" {...reveal}>
          <span><Braces size={14} aria-hidden="true" />{labels.local}</span>
          <span><Sparkles size={14} aria-hidden="true" />{labels.particles}</span>
          <span><MousePointer2 size={14} aria-hidden="true" />{labels.interactive}</span>
        </m.div>
      </section>

      <m.div {...reveal}>
        <QuantumOrbital locale={locale} />
      </m.div>

      <section className="section experiment-explanation">
        <m.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{labels.explanationEyebrow}</p>
            <h2>{labels.explanationTitle}</h2>
          </div>
          <p className="section-heading__intro">{labels.explanationBody}</p>
        </m.div>

        <div className="experiment-explanation__grid">
          {[
            { index: '01', title: labels.radialTitle, body: labels.radialBody, icon: Orbit },
            { index: '02', title: labels.angularTitle, body: labels.angularBody, icon: Atom },
            { index: '03', title: labels.controlsTitle, body: labels.controlsBody, icon: MousePointer2 },
          ].map(({ index, title, body, icon: Icon }, itemIndex) => (
            <m.article
              key={index}
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduceMotion ? 0 : itemIndex * 0.08, duration: reduceMotion ? 0 : 0.62 }}
            >
              <header><span>{index}</span><Icon size={20} aria-hidden="true" /></header>
              <h3>{title}</h3>
              <p>{body}</p>
            </m.article>
          ))}
        </div>
      </section>
    </div>
  )
}
