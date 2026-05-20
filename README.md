<div align="center">
  <img src="https://res.cloudinary.com/dano796/image/upload/stack_sphere_logo.svg" width="120px" alt="GitHub Stack Sphere" />
  <h1 style="font-size: 28px; margin: 10px 0;">GitHub Stack Sphere</h1>
  <p>Showcase your tech stack on a spinning sphere for your GitHub README!</p>
</div>

<div align="center">

[![Stars](https://img.shields.io/github/stars/dano796/github-stack-sphere?style=flat&color=FFD700)](https://github.com/dano796/github-stack-sphere/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/dano796/github-stack-sphere?color=3BBF48)](https://github.com/dano796/github-stack-sphere/commits/main)
[![License](https://img.shields.io/github/license/dano796/github-stack-sphere)](LICENSE)
![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Fdano796%2Fgithub-stack-sphere&label=visitors&countColor=%230c7ebe&style=flat&labelStyle=none)

<img src="https://github-stack-sphere.vercel.app/stack.svg?icons=javascript,typescript,python,postgresql,mysql,supabase,express,react,angular,tailwindcss,git,github,figma,trello,html5,css3,docker,pandas,numpy&theme=auto" width="500" alt="Demo" />

</div>

---

## Usage

Copy and paste this into your markdown file.

Change the `?icons=` value to the slugs you want.

```md
![My Tech Stack](https://github-stack-sphere.vercel.app/stack.svg?icons=javascript,typescript,python,postgresql,mysql,supabase,express,react,angular,tailwindcss,git,github,figma,trello,html5,css3,docker,pandas,numpy)
```

Or with HTML for size control:

```html
<img
  src="https://github-stack-sphere.vercel.app/stack.svg?icons=javascript,typescript,python,postgresql,mysql,supabase,express,react,angular,tailwindcss,git,github,figma,trello,html5,css3,docker,pandas,numpy"
  width="500"
  alt="My tech stack"
/>
```

And that's it. It's really that simple!

---

## Parameters

| Parameter   | Default  | Values                                | Description                                                                       |
| ----------- | -------- | ------------------------------------- | --------------------------------------------------------------------------------- |
| `icons`     | required | comma-separated slugs                 | Tech icons to display (max 30)                                                    |
| `theme`     | `dark`   | `dark` `light` `auto` `transparent`   | Background theme. `auto` adapts to viewer's OS setting. `transparent` omits the background entirely |
| `speed`     | `30`     | `5`–`60`                              | Seconds per full rotation. Higher = slower                                        |
| `size`      | `500`    | `300`–`800`                           | SVG width in pixels                                                               |
| `direction` | `cw`     | `cw` `ccw`                            | Rotation direction (clockwise or counter-clockwise)                               |
| `bg`        | —        | hex color (3 or 6 chars, no `#`)      | Custom background color. Overrides the `theme` background. Ignored when `theme=transparent` |
| `iconColor` | —        | hex color (3 or 6 chars, no `#`)      | Paints every icon with the same color, ignoring brand colors                      |
| `v`         | —        | any                                   | Cache-busting. Increment when updating your icon list                             |

---

## Examples

#### `icons`

List the slugs you want, separated by commas (max 30). Find slugs at [simpleicons.org](https://simpleicons.org).

```md
![My Stack](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker,postgresql,python)
```

#### `theme`

Controls the background color. `auto` adapts to the viewer's GitHub dark/light mode. `transparent` omits the background entirely, so the SVG blends with whatever page renders it.

```md
![Dark](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&theme=dark)
![Light](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&theme=light)
![Auto](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&theme=auto)
![Transparent](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&theme=transparent)
```

#### `speed`

Seconds per full rotation. Default is `30`. Higher = slower.

```md
![Fast](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&speed=10)
![Slow](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&speed=50)
```

#### `size`

SVG width in pixels. Default is `500`. Height is always 80% of width.

```md
![Small](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&size=300)
![Large](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&size=700)
```

#### `direction`

Rotation direction. `cw` is clockwise (default), `ccw` is counter-clockwise.

```md
![CCW](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&direction=ccw)
```

#### `bg`

Custom background color as a hex string (no `#`). Overrides the theme background.

```md
![Custom bg](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&bg=1a1a2e)
```

#### `iconColor`

Paints every icon with a single uniform color (hex, no `#`), ignoring brand colors. Useful for monochrome layouts.

```md
![Mono](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&iconColor=ffffff&bg=000000)
```

#### `v`

Not rendered — only used for cache-busting. If you update your icon list and GitHub still shows the old version, increment this value.

```md
![My Stack](https://github-stack-sphere.vercel.app/stack.svg?icons=typescript,react,docker&v=2)
```

---

## Finding icon slugs

Go to [simpleicons.org](https://simpleicons.org), search for a technology, and use the slug shown under the icon name.

Examples: `typescript`, `react`, `postgresql`, `scikit-learn`, `tailwindcss`

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

## Contributing

Stack Sphere is always open to improvements and contributions. Check the [Open Issues](https://github.com/dano796/github-stack-sphere/issues) if you want to contribute, or open a new one to add your own improvements/ideas. Before contributing, please read the [Contribution Guide](./CONTRIBUTING.md).

---

## Support the project

GitHub Stack Sphere is free to use. If you find it useful, you can support the project by:

- Linking back to this repo when using it in your README. 🔗
- Starring and sharing the project. ⭐
- Making a one-time donation via [PayPal](https://www.paypal.me/dano796). ☕

Thank you! ❤️

---

## License

This project is licensed under the [MIT License](./LICENSE).

Attribution is appreciated.
