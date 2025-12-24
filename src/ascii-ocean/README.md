# ascii-ocean

Animated ASCII water caustics for React/Next.js projects. The `Background` component now measures its container, feeds those dimensions into a 3D simplex-noise field, and keeps a continuous ASCII flow in sync with `requestAnimationFrame`-friendly intervals so the ocean feels alive without sacrificing performance.

## Features
- Adaptive grid sizing that matches whatever container you drop it into
- Procedural animation driven by a persistent 3D simplex-noise generator
- Lightweight interval updates via a built-in `useInterval` hook
- Configurable glyph palette, FPS, and resolution through props
- Pure client component with no CSS dependencies beyond optional utility classes

## Installation
```bash
npm install ascii-ocean
# or
yarn add ascii-ocean
# or
pnpm add ascii-ocean
```

## Usage
```jsx
// src/app/page.js
import Background from 'ascii-ocean/Background';

export default function Page() {
  return (
    <main className="min-h-screen">
      <Background />
    </main>
  );
}
```

### With overlay content
```jsx
import Background from 'ascii-ocean/Background';

export default function Hero() {
  return (
    <section className="relative min-h-screen">
      <Background className="text-lime-400" />
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <h1 className="text-4xl">Drift into the ASCII tide</h1>
      </div>
    </section>
  );
}
```

### Passing custom props
```jsx
<Background
  fps={24}
  resolution={60}
  chars={"~^:;-=+"}
  className="text-cyan-300"
/>
```

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `fps` | `number` | `30` | Target frames per second for noise updates. |
| `resolution` | `number` | `80` | Higher numbers create smoother waves; lower numbers exaggerate noise. |
| `chars` | `string` | `"..//{#(;%)!};..:''"` | Glyph palette sampled according to noise intensity. |
| `className` | `string` | `''` | Extra classes applied to the wrapper to tweak typography/colors. |

## Customization
- **Character palette:** supply a custom `chars` prop or edit the default string for different textures.
- **Grid density:** change `resolution` to control how quickly values change between cells.
- **Tempo:** modify `fps` to speed up or slow down the wave motion.
- **Styling:** pass `className` or wrap the component to layer gradients, blend modes, or noise overlays.

Because the component renders simple `<div>` rows, you can wrap it with any container and layer additional UI above it using absolute positioning or CSS grids.

## Requirements
- React 18+
- Next.js 13+ (App Router) or any React build system that supports client components and CSS modules

## Development
1. Install dependencies inside the `src/ascii-ocean` package directory: `npm install`
2. Use `npm publish --dry-run` (or link the package locally) to verify bundle output.
3. Import the component into the host Next.js app (`src/app/page.js` already does this) to preview changes in real time.

## License
ISC © Kane Jackson
