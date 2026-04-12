# Stacksphere

Animated SVG tech stack sphere for GitHub READMEs.  
Embed your dev stack as a spinning 3D cloud — pure CSS, no JavaScript, works everywhere.

![Demo](https://stacksphere.vercel.app/stack.svg?icons=typescript,react,postgresql,docker,python,git,figma,tailwindcss,supabase,nodejs)

---

## Usage

Add this to your GitHub profile `README.md`:

```md
![My Stack](https://stacksphere.vercel.app/stack.svg?icons=typescript,react,docker)
```

Or with HTML for size control:

```html
<img src="https://stacksphere.vercel.app/stack.svg?icons=typescript,react,docker" width="500" alt="My Stack" />
```

---

## Parameters

| Parameter | Default | Values | Description |
|-----------|---------|--------|-------------|
| `icons` | required | comma-separated slugs | Tech icons to display (max 30) |
| `theme` | `dark` | `dark` `light` `auto` | Background theme. `auto` adapts to viewer's OS setting |
| `speed` | `30` | `5`–`60` | Seconds per full rotation. Higher = slower |
| `size` | `500` | `300`–`800` | SVG width in pixels |
| `v` | — | any | Cache-busting. Increment when updating your icon list |

### Finding icon slugs

Go to [simpleicons.org](https://simpleicons.org), search for a technology, and use the name shown as the slug in lowercase with spaces replaced by hyphens.

Examples: `typescript`, `react`, `postgresql`, `scikit-learn`, `tailwindcss`

---

## Examples

**Dark theme (default)**
```
https://stacksphere.vercel.app/stack.svg?icons=typescript,react,nodejs,postgresql,docker
```

**Light theme**
```
https://stacksphere.vercel.app/stack.svg?icons=typescript,react,nodejs,postgresql,docker&theme=light
```

**Auto theme** (adapts to viewer's GitHub dark/light mode)
```
https://stacksphere.vercel.app/stack.svg?icons=typescript,react,nodejs,postgresql,docker&theme=auto
```

**Slow rotation**
```
https://stacksphere.vercel.app/stack.svg?icons=typescript,react,docker&speed=45
```

---

## Cache busting

GitHub caches README images through its Camo proxy. If you update your icon list and the old version still shows, increment the `v` parameter:

```md
![My Stack](https://stacksphere.vercel.app/stack.svg?icons=typescript,react,docker&v=2)
```

---

## Self-hosting

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`

### 1. Clone and install

```bash
git clone https://github.com/your-username/stacksphere.git
cd stacksphere
npm install
```

### 2. Test locally

```bash
node test-local.mjs
# Opens test-output.svg — verify the animation in Chrome or Firefox
```

### 3. Deploy to Vercel

```bash
vercel        # first deploy + project setup
vercel --prod # promote to production
```

Vercel will give you a URL like `https://stacksphere.vercel.app`.  
Your endpoint is: `https://your-url.vercel.app/stack.svg`

### 4. Use your own instance

```md
![My Stack](https://your-url.vercel.app/stack.svg?icons=typescript,react,docker)
```

---

## How it works

1. **Request comes in** — `GET /stack.svg?icons=typescript,react,docker`
2. **Slugs are resolved** against the [`simple-icons`](https://simpleicons.org) package — brand colors and SVG paths are extracted
3. **Fibonacci sphere** — icons are placed on the surface of a unit sphere using the golden angle algorithm, distributing them evenly
4. **Rodrigues' rotation** — all sphere points are rotated around a tilted axis (35° from vertical) for each of 16 animation frames, producing the diagonal orbit effect
5. **Perspective projection** — 3D coordinates are projected to 2D with depth-based scale and opacity, making front icons larger/brighter than back ones
6. **SVG is assembled** — icons are embedded as `<symbol>` elements, CSS `@keyframes` encodes all pre-calculated positions, the result is a single self-contained SVG file

The SVG contains no JavaScript. All animation is pure CSS `@keyframes` with pre-computed positions — this is what makes it embeddable in GitHub READMEs, which strip all JS from SVGs.

---

## License

MIT
