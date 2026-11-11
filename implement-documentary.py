from pathlib import Path
p=Path('src/main.jsx');s=p.read_text(encoding='utf-8')
a=s.index('const services = [');b=s.index('function ServiceViewer',a)
content=s[a:b].replace('const services = [','export const services = [',1).replace('function Photo({','export function Photo({',1)
content=content.replace('];\n\nexport function Photo', '''  {name: "Disaster response", text: "Coordinated care through complex emergencies.", image: "flood.webp", icon: ShieldCheck, detail: "Rescue 1122 brings medical response, firefighting and specialist rescue together for emergencies including floods and building collapse. Call 1122 for emergency assistance."},
  {name: "Emergency rescue training", text: "Preparation, practice and professional teamwork.", image: "rescue.webp", icon: LifeBuoy, detail: "Training and preparedness support professional emergency response. Visit the official Rescue 1122 website for Emergency Services Academy information; community CPR and volunteer programmes are linked on this page."},
];

export function Photo''')
Path('src/content.jsx').write_text('import React from "react";\nimport {HeartPulse,Flame,Bike,Waves,LifeBuoy,HandHeart,PawPrint,Building2,ShieldCheck} from "lucide-react";\nimport images from "./image-manifest.json";\n'+content,encoding='utf-8')
s=s[:a]+'import {services, Photo} from "./content.jsx";\nimport {MotionProvider, useMotion, DocumentaryHero, SpatialGallery, FrontlineChapters, ServiceExplorer} from "./documentary.jsx";\nimport "./documentary.css";\n'+s[b:]
# Reuse the original detail dialog, FAQ, training, contact and programme actions.
a=s.index('        <section className="hero wrap">');b=s.index('        <section id="about"',a)
s=s[:a]+'''        <DocumentaryHero />
        <SpatialGallery />
        <FrontlineChapters onOpenService={setSelected}/>
        <ServiceExplorer onOpenService={setSelected}/>
'''+s[b:]
s=s.replace('function App() {','function App() {\n  const {motion} = useMotion();')
s=s.replace('    const media = matchMedia("(prefers-reduced-motion: reduce)");\n    if (media.matches || !Element.prototype.animate) return;', '    if (!motion || !Element.prototype.animate) return;')
a=s.index('    document.querySelectorAll(".hero-copy > *, .hero-image")');b=s.index('    const observer =',a);s=s[:a]+s[b:]
s=s.replace('".section-head,.service-card,.about-grid,.community-grid,.resources",','".section-head,.about-grid,.community-grid,.resources,.doc-section-heading,.chapter-copy,.people-heading",')
a=s.index('    const reduce = () =>');b=s.index('  return (',a)
s=s[:a]+'''    return () => {observer.disconnect(); animations.forEach(a => a.cancel());};
  }, [motion]);
'''+s[b:]
s=s.replace('["About us", "about"],\n              ["Our services", "services"],\n              ["Community & training", "community"],\n              ["Resources", "resources"],','["Stories", "stories"],\n              ["Services", "services"],\n              ["About", "about"],\n              ["Training", "community"],\n              ["Resources", "resources"],\n              ["Contact", "contact"],')
s=s.replace('<header>','<header className="documentary-nav">')
s=s.replace('<nav className={menu ? "open" : ""} aria-label="Main navigation">','<nav className={menu ? "open" : ""} aria-label="Main navigation" id="main-navigation" onKeyDown={e => {if(e.key === "Escape") {closeMenu(); document.querySelector(".menu-button")?.focus();}}}>')
s=s.replace('aria-expanded={menu}','aria-expanded={menu}\n            aria-controls="main-navigation"')
s=s.replace('<section id="about" className="about-section">','<section id="about" className="about-section people-section">')
s=s.replace('name="flood"\n                alt="Rescue 1122 boat carrying people to safety through floodwaters in Punjab"','name="rescue"\n                alt="Rescue 1122 personnel practising together at the Emergency Services Academy"')
s=s.replace('''                A service built
                <br />
                around <em>humanity.</em>''','''                Courage has<br/>a <em>human face.</em>''')
s=s.replace('<footer>','<footer id="contact">')
s=s.replace('render(<App />);','render(<MotionProvider><App /></MotionProvider>);')
p.write_text(s,encoding='utf-8')
p=Path('src/styles.css');s=p.read_text(encoding='utf-8-sig');s=s.replace('  *,\n  *::before,\n  *::after {','  body:not([data-motion="on"]) *,\n  body:not([data-motion="on"]) *::before,\n  body:not([data-motion="on"]) *::after {');p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text();s=s.replace('#133f35','#071522');p.write_text(s)
