## Copilot Instructions — MoMu Interactive Longread (Vite + GSAP)
 
### 1) Project context & doelen
Je werkt aan een immersive, interactieve one-pager voor **MoMu (Fashion Museum Antwerp)**. De pagina is een **longread** met sterke **storytelling** en **interactiviteit** (niet enkel animatie). De experience moet bezoekers:
- inhoudelijk iets bijleren over de gekozen ontwerper (focus: **Walter Van Beirendonck**),
- triggeren om verder te exploreren,
- aanzetten tot een museumbezoek.
 
**Kern-eisen (rubrics):**
- **Cross-browser:** Safari + Chrome, desktop + mobile.
- **Performance:** minifiers, responsive images, production build testen (Lighthouse).
- **Code quality:** uitgepuurd, geen repetitie, **BEM** voor CSS, je begrijpt elke regel.
- **Workflow:** GitHub Flow, feature branches, `main` altijd werkend.
- **Responsive:** mobile-first, progressive enhancement.
 
---
 
### 2) Tech stack & verboden keuzes
 
#### Bundler / tooling
- **Vite** voor bundling van JS/CSS, dependencies via npm.
- Geen SSR/backend; **statische deploy** (bv. GitHub Pages).
 
#### Interactie/animatie
- **Vanilla JS (ES modules)** + **GSAP + ScrollTrigger** voor scroll-gekoppelde animaties en transities.
- Waar mogelijk: **CSS eerst**, GSAP enkel wanneer het écht meerwaarde biedt (principe: “CSS animations beat GSAP animations”).
- Voor responsive GSAP: gebruik `gsap.matchMedia()` en respecteer `prefers-reduced-motion`.
 
#### Verboden / niet gewenst
- Geen **jQuery**.
- Geen zware frameworks (React/Vue) tenzij expliciet nodig; dit is een one-pager met focus op story/animatie.
- Geen “magic” code zonder uitleg of bron.
 
---
 
### 3) Project-architectuur (aanbevolen)
 
#### Mappenstructuur
 
```txt
src/
├─ styles/
│  ├─ global.css            # base, typography, layout primitives
│  └─ components/           # section-specifieke CSS (optioneel)
├─ scripts/
│  ├─ animations/           # GSAP timelines per sectie
│  ├─ sections/             # per-sectie modules met init()
│  └─ utils/                # helpers (clamp, media, prefersReducedMotion, ...)
└─ assets/
   ├─ img/                  # responsive images (avif/webp + fallback)
   └─ video/                # gecomprimeerd, lazy waar mogelijk
 
public/                     # statische files (niet door Vite verwerkt)
index.html                # main HTML file
```
 
#### Routing
- Eén one-pager: `index.html` + secties met anchors.
 
---
 
### 4) Code conventies (kwaliteit en consistentie)
 
#### JavaScript
- ES Modules (`import/export`), geen globale variabelen.
- Moduleer interactie per sectie: elke sectie heeft een `init()`.
- Vermijd repetitie: maak herbruikbare helpers (bv. `createScrollTimeline({ trigger, ... })`).
 
#### CSS
- **BEM naming verplicht:**
  - Block: `.gallery`
  - Element: `.gallery__item`
  - Modifier: `.gallery__item--active`
- Mobile-first.
- Media queries:
  - Gebruik **em**, geen px.
  - Gebruik **min-width** queries.
- CSS custom properties voor theming/typografie (consistentie + makkelijk tweaken).
 
- Werk met een duidelijke, herbruikbare **root** (CSS custom properties) zodat je zo weinig mogelijk hardcode.
  - Definieer globale design tokens in `:root` (kleuren, spacing, typography, radii, z-index, timing).
  - Gebruik die tokens overal in component/section CSS (bv. `var(--space-4)`, `var(--font-size-2)`, `var(--radius-2)`), en vermijd losse “magic numbers”.
  - Override tokens per sectie/thema via een wrapper modifier (bv. `.theme--mask { --color-bg: ...; }`) in plaats van nieuwe styles te dupliceren.
 
#### Progressive enhancement
- De pagina moet leesbaar en navigeerbaar zijn zonder JS.
- Interacties “enhancen” de ervaring, maar content blijft toegankelijk.
 
---
 
### 5) Animatie- en interactieprincipes
 
#### Definitie
- **Interactie** = user kan iets doen (kiezen, slepen, combineren, togglen, ontdekken).
- **Animatie** = visuele transitie. Animatie ondersteunt interactie, vervangt die niet.
 
#### GSAP best practices
- Gebruik `ScrollTrigger` met duidelijke triggers en start/end.
- Gebruik `matchMedia` voor breakpoints en reduced motion.
- Gebruik zoveel mogelijk percentages / viewport units in plaats van absolute pixels.
 
#### Asset-strategieën
- Overweeg spritesheets voor “fast image switching”, maar hou spritesheets binnen praktische dimensies (bv. max ~2048×2048) en test geheugenimpact.
- Preload alleen wat nodig is; liever staged loading per hoofdstuk/sectie.
 
---
 
### 6) Performance & QA
 
#### Performance checklist
- Test production build met Lighthouse (incognito) en optimaliseer op basis van audits.
- Responsive images (AVIF/WebP + fallback), correcte sizes, lazy loading waar passend.
- Minimal JS: geen onnodige dependencies, tree-shaking respecteren.
 
#### Cross-device
- Test op echte devices (minstens iOS Safari + Android/Chrome) waar mogelijk.
- Touch events: gebruik **pointer events** (`pointerdown/move/up`) wanneer relevant.
 
#### Responsive images workflow (Respimagen)
Voor responsive images gebruiken we **Respimagen**: https://github.com/devinekask/respimagen
 
Copilot richtlijnen:
- Nieuwe beeldassets altijd optimaliseren via Respimagen vóór commit/deploy.
- Export targets: **AVIF** en **WebP** (met fallback indien nodig) en meerdere groottes voor `srcset`.
- In HTML: gebruik bij voorkeur `<picture>` met `<source type="image/avif">`, `<source type="image/webp">` en een `<img>` fallback.
- Altijd `width` en `height` (of `aspect-ratio`) voorzien om layout shift te vermijden.
- `loading="lazy"` en `decoding="async"` gebruiken voor niet-critical images; hero/above-the-fold kan `fetchpriority="high"` krijgen.
- Bestandsnamen en mapstructuur consistent houden in `src/assets/img/` (of `public/` wanneer nodig).
 
 
---
 
### 7) Deploy (GitHub Pages) — Vite specifics
- Houd rekening met Vite’s `base` optie voor deploy naar GitHub Pages.
- Deploy vroeg en vaak; iteratief verbeteren.
 
---
 
### 8) GitHub Flow & samenwerking
- `main` blijft altijd deployable.
- Nieuwe features in `feature/<korte-naam>` branches.
- Commits: klein, logisch, duidelijke message (`feat:`, `fix:`, `refactor:`).
- Voor elke grote change: korte PR beschrijving met:
  - wat/waarom,
  - impact op performance,
  - hoe getest (Safari/Chrome, mobile/desktop).
 
---
 
### 9) Hoe Copilot moet samenwerken (werkwijze)
Copilot moet steeds:
- Eerst verduidelijken wat het gaat bouwen (korte aanpak + bestandstructuur).
- Uitleg geven per codeblok: wat doet dit, waarom nodig, welke trade-offs.
- Alternatieven aanbieden (minstens 2) wanneer er meerdere valide opties zijn (bv. CSS vs GSAP).
- Kritisch zijn op performance & browser support, zeker iOS Safari.
- Officiële documentatie als leidraad (zeker voor GSAP/ScrollTrigger/Vite deploy).
- Geen “copy-paste dump”: liever kleine stappen met testmomenten.
 
Deze aanpak sluit aan bij de richtlijn: je moet alles blijven begrijpen en beoordelen.
 
---
 
### 10) Copilot prompt templates (copy/paste)
Gebruik deze prompts in je editor om Copilot gericht te sturen:
 
**A. Nieuwe sectie met scroll-animatie**  
“Maak een `initSectionX()` module met GSAP ScrollTrigger die [effect] doet. Mobile-first, matchMedia breakpoints, prefers-reduced-motion fallback, en zonder layout shift.”
 
**B. Interactie (niet enkel animatie)**  
“Bouw een interactief component waarbij de gebruiker [actie] kan uitvoeren en dat de content-interpretatie beïnvloedt. Houd het toegankelijk (keyboard/aria), progressive enhancement, en documenteer keuzes.”
 
**C. Performance audit**  
“Analyseer deze code voor performance bottlenecks op mobile Safari (event listeners, paints, large images). Geef concrete fixes met motivatie.”
 
**D. Refactor naar minder repetitie**  
“Refactor dit naar herbruikbare helpers (geen duplicated timelines), behoud leesbaarheid, en leg uit waarom de nieuwe structuur beter is.”