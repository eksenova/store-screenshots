# Contributing to Store Screenshots

Thanks for your interest in contributing! This project is open source and we welcome contributions of all kinds.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/store-screenshots.git`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`
5. Create a feature branch: `git checkout -b feat/my-feature`

## Adding a New Device

1. Create the SVG frame in `devices/frames/` (see existing frames for reference)
2. Add the device definition to `devices/apple.ts` or `devices/android.ts`
3. Register it in `devices/index.ts`
4. Test with a real screenshot at the correct resolution

**Device definition format:**
```typescript
{
  id: "iphone-16-pro-max",
  name: "iPhone 16 Pro Max",
  brand: "apple",
  category: "phone",
  screenWidth: 1320,
  screenHeight: 2868,
  screenX: 0,      // screen offset in SVG
  screenY: 0,
  frameWidth: 0,   // total frame width
  frameHeight: 0,  // total frame height
  framePath: "/devices/frames/iphone-16-pro-max.svg",
}
```

## Code Style

- TypeScript strict mode
- Functional React components
- Tailwind CSS for styling
- Named exports
- Conventional commit messages (`feat:`, `fix:`, `docs:`, `refactor:`)

## Pull Requests

1. Make sure `npm run lint` and `npm run typecheck` pass
2. Write a clear PR description
3. One feature per PR — keep changes focused
4. Update README.md device table if adding devices

## Issues

- Use the issue templates
- Include browser + OS info for bug reports
- Screenshots are helpful!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
