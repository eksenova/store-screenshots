# Store Screenshots

Open-source App Store & Google Play screenshot generator. Create professional marketing screenshots for iOS and Android apps — right in your browser.

**Live Demo:** Coming soon

## Features

- **iOS & Android device mockups** — iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16, iPhone 15, iPhone SE, iPad Pro, Pixel 9 Pro, Samsung Galaxy S25, and more
- **SVG-based device frames** — Lightweight, scalable, customizable colors
- **Rich text editing** — Title, subtitle, Google Fonts support, custom colors
- **Background customization** — Solid colors, gradients, images
- **Bulk export** — Generate multiple screenshots at once, download as ZIP
- **Correct dimensions** — Auto-sized for App Store and Play Store requirements
- **No account required** — Everything runs client-side, no data leaves your browser
- **Shareable configs** — Save and share screenshot settings via URL
- **i18n ready** — English and Turkish interface

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, Static Export)
- [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- HTML5 Canvas for rendering
- SVG device mockups

## Quick Start

```bash
# Clone
git clone https://github.com/eksenova/store-screenshots.git
cd store-screenshots

# Install
npm install

# Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
store-screenshots/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Home — main generator UI
│   └── globals.css         # Global styles (Tailwind)
├── components/             # React components
│   ├── Editor/             # Screenshot editor panel
│   │   ├── DevicePicker.tsx
│   │   ├── TextEditor.tsx
│   │   ├── BackgroundPicker.tsx
│   │   ├── FontSelector.tsx
│   │   └── ExportPanel.tsx
│   ├── Preview/            # Live preview & canvas rendering
│   │   ├── ScreenshotCanvas.tsx
│   │   └── DeviceFrame.tsx
│   ├── Upload/             # Image upload (drag & drop)
│   │   └── ImageUpload.tsx
│   └── ui/                 # Shared UI primitives
│       ├── Button.tsx
│       ├── ColorPicker.tsx
│       ├── Slider.tsx
│       └── Modal.tsx
├── devices/                # Device definitions & SVG frames
│   ├── index.ts            # Device registry
│   ├── apple.ts            # iPhone & iPad definitions
│   ├── android.ts          # Pixel & Samsung definitions
│   └── frames/             # SVG mockup files
│       ├── iphone-16-pro-max.svg
│       ├── iphone-16-pro.svg
│       ├── ipad-pro.svg
│       ├── pixel-9-pro.svg
│       └── ...
├── lib/                    # Shared utilities
│   ├── canvas.ts           # Canvas rendering logic
│   ├── export.ts           # PNG/ZIP export helpers
│   ├── fonts.ts            # Google Fonts loader
│   ├── store-specs.ts      # App Store / Play Store size specs
│   └── url-state.ts        # URL query param serialization
├── hooks/                  # Custom React hooks
│   ├── useScreenshot.ts    # Main editor state
│   ├── useFontLoader.ts    # Dynamic font loading
│   └── useExport.ts        # Export logic
├── public/                 # Static assets
│   ├── og-image.png        # Open Graph image
│   └── favicon.ico
├── CLAUDE.md               # AI assistant instructions
├── CONTRIBUTING.md          # Contribution guide
├── LICENSE                  # MIT License
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── postcss.config.mjs
```

## Device Support

### iOS (App Store)
| Device | Screenshot Size | Status |
|--------|----------------|--------|
| iPhone 16 Pro Max | 1320 x 2868 | Planned |
| iPhone 16 Pro | 1206 x 2622 | Planned |
| iPhone 16 | 1179 x 2556 | Planned |
| iPhone 15 | 1179 x 2556 | Planned |
| iPhone SE (3rd gen) | 750 x 1334 | Planned |
| iPad Pro 13" | 2064 x 2752 | Planned |
| iPad Pro 11" | 1668 x 2388 | Planned |

### Android (Google Play)
| Device | Screenshot Size | Status |
|--------|----------------|--------|
| Pixel 9 Pro | 1344 x 2992 | Planned |
| Samsung Galaxy S25 | 1440 x 3120 | Planned |
| Generic Phone | 1080 x 1920 | Planned |
| Generic Tablet (10") | 1200 x 1920 | Planned |

## Store Requirements

### Apple App Store
- Format: PNG or JPEG
- At least 2 screenshots required (up to 10)
- Must match exact device resolution
- No alpha channel

### Google Play Store
- Format: PNG or JPEG (24-bit, no alpha)
- Min: 320px, Max: 3840px on any side
- Aspect ratio: max 2:1
- At least 2 screenshots (up to 8)

## Roadmap

- [ ] Core editor UI with live preview
- [ ] SVG device frames (iPhone 16 series)
- [ ] Android device frames (Pixel, Samsung)
- [ ] iPad & Android tablet frames
- [ ] Google Fonts integration
- [ ] Gradient backgrounds
- [ ] Background image support
- [ ] Bulk screenshot generation
- [ ] ZIP export
- [ ] URL-based sharing
- [ ] Template presets
- [ ] i18n (EN/TR)
- [ ] PWA support

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE) for details.
