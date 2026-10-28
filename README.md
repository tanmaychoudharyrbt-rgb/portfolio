# 📜 Tanmay Choudhary — Paper Portfolio & Chibi Companion

An interactive, paper-themed portfolio website with a water splash intro, procedural Web Audio sound synthesis, and an anime chibi companion that interacts with your pages!

---

## 🌟 Key Features

### 💧 1. Liquid Inception (Water Splash Intro)
- **Dynamic Water Splash**: Starts on page load with physics-driven water droplets and refractive expanding ripple waves on an interactive canvas.
- **Name Reveal**: Unveils **TANMAY CHOUDHARY** with fluid caustics and typography.
- **Interactive**: Move your mouse to create water ripples, or click anywhere to splash and transition into the paper world.
- **Replay Button**: A dedicated **"💧 Replay Splash"** button on the desk header lets you re-experience the intro at any time.

---

### 📄 2. Tactile Paper Theme
- **Realistic Paper Texture**: Built using procedural SVG turbulence and diffuse lighting filters (`feTurbulence`, `feDiffuseLighting`), creating genuine paper fibers and cardstock grain.
- **Physical Stationery Accents**:
  - Notebook binder margin line & hole punches
  - Translucent washi tape with torn edges pinning corners
  - Rubber ink stamps (*"AUTHENTIC CRAFT"*, *"CONFIDENTIAL"*, *"VERIFIED"*)
  - Hand-drawn sticky notes and wax seals
  - Wooden craftsman desk background with subtle 3D perspective mouse tilt

---

### 🎀 3. Cute Anime Chibi Girl Companion ("Paper-chan")
- **Fixed Position**: Standing comfortably at the bottom-right corner.
- **3-Second Looping Idle Animation**:
  - `0.0s – 0.8s`: Gentle breathing bounce & ahoge (cowlick) sway
  - `0.8s – 1.4s`: Adorable double-blink with starry eye highlights & head tilt
  - `1.4s – 2.2s`: Playful hand wave & twintail flutter
  - `2.2s – 3.0s`: Soft blush glow and return to base pose (smooth infinite 3.0s loop)
- **Interactive Speech Bubble**: Reacts with cute anime thoughts and hints. You can also click her anytime to trigger a happy chime and wink!

---

### 📜 4. Page Crumple & Eat Transition (Forward Navigation)
When you click any forward navigation option (**Home**, **About Me**, **Achievements**, **Hobbies**):
1. The current paper sheet crumples and folds into a 3D textured paper ball.
2. The paper ball flies directly into Paper-chan's open mouth with cute anime fang (`NOM`).
3. Paper-chan's cheeks puff out as she chews with popping crumb sparkles and crunch sounds (`*munch munch*`).
4. She swallows with a cute gulp, gives a satisfied wink `(^_−)☆`, and the new webpage unfolds flat onto your desk!

---

### 💫 5. Regurgitate & Throw Transition (Back to Parent Webpage)
When you click the **"⟵ Back to Parent Webpage"** button (or press `Escape` / `Backspace`):
1. Paper-chan's eyes go wide with dizzy spirals (`(°ロ°) !`) as her tummy rumbles.
2. She coughs up the crumpled paper ball with an anime "BLEGH!" pop effect.
3. She winds up her arm and **pitches/throws the crumpled paper ball** across the desk.
4. The paper ball arcs through the air and lands in the center of the screen, un-crumpling into the parent page!

---

### 📂 6. Webpages & Portfolio Sections
1. **🏠 Home**:
   - Hero greeting & introduction to Tanmay Choudhary
   - Polaroid photograph card with illustrated developer avatar
   - Quick table of contents cards
   - Companion intro sticky note
2. **👤 About Me**:
   - Biographical journal entry
   - Categorized skills sticky notes (Languages, Frameworks, Systems, Cloud)
   - Core engineering principles
   - Kraft paper contact envelope with GitHub, LinkedIn, and Email links
3. **🏆 My Achievements**:
   - Stat counters (Projects Shipped, Hackathons Won, Reliability, Users Impacted)
   - Lined ledger paper timeline featuring National Hackathon Championships, telemetry engine scaling, and academic honors
   - Wax seal decorations
4. **🎨 My Hobbies**:
   - Tactile scrapbook with polaroid cards pinned with red pushpins & washi tape
   - Digital Art & Anime Sketching, Specialty Coffee Brewing, Indie Gaming & Retro RPGs, Lo-Fi Music & Synthesizers, Origami & Papercraft, and Mechanical Keyboards

---

### 🔊 7. Procedural Web Audio API Sound Engine
- 100% self-contained — no external MP3s or network dependencies!
- Synthesizes water splashes, droplet bloops, paper crumples, crunching bites, anime gulps, throw whooshes, and paper unfold rustles.
- Includes a **"Sound ON/OFF"** toggle in the top-right corner.

---

### ⌨️ Keyboard Shortcuts
- `1`: Jump to **Home**
- `2`: Jump to **About Me**
- `3`: Jump to **Achievements**
- `4`: Jump to **Hobbies**
- `Escape` or `Backspace`: **Back to Parent Webpage** (triggers Chibi throw animation)

