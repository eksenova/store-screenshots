// Popular Google Fonts list (curated, no API call needed)
export const GOOGLE_FONTS = [
  "Inter", "Roboto", "Open Sans", "Montserrat", "Lato", "Poppins",
  "Oswald", "Raleway", "Nunito", "Ubuntu", "Playfair Display",
  "Merriweather", "PT Sans", "Noto Sans", "Source Sans 3", "Rubik",
  "Work Sans", "Quicksand", "Barlow", "DM Sans", "Mulish",
  "Josefin Sans", "Fira Sans", "Karla", "Cabin", "Libre Franklin",
  "Outfit", "Space Grotesk", "Plus Jakarta Sans", "Manrope",
  // Arabic / RTL fonts
  "Cairo", "Tajawal", "Amiri", "Almarai", "Changa", "El Messiri",
  "Noto Sans Arabic", "IBM Plex Sans Arabic", "Readex Pro",
  // Display / decorative
  "Bebas Neue", "Anton", "Pacifico", "Lobster", "Righteous",
  "Fredoka", "Comfortaa", "Permanent Marker", "Satisfy",
  // Monospace
  "Fira Code", "JetBrains Mono", "Source Code Pro", "IBM Plex Mono",
  // Serif
  "Lora", "PT Serif", "Noto Serif", "Bitter", "Crimson Text",
  "EB Garamond", "Libre Baskerville", "DM Serif Display",
] as const;

export type FontFamily = (typeof GOOGLE_FONTS)[number] | string;

const loadedFonts = new Set<string>();
const loadingFonts = new Set<string>();

export function loadFont(family: string): Promise<void> {
  if (loadedFonts.has(family)) return Promise.resolve();
  if (loadingFonts.has(family)) return Promise.resolve();

  loadingFonts.add(family);

  return new Promise((resolve, reject) => {
    import("webfontloader").then((WebFont) => {
      WebFont.load({
        google: { families: [family] },
        active: () => {
          loadedFonts.add(family);
          loadingFonts.delete(family);
          resolve();
        },
        inactive: () => {
          loadingFonts.delete(family);
          reject(new Error(`Failed to load font: ${family}`));
        },
      });
    });
  });
}

export function isFontLoaded(family: string): boolean {
  return loadedFonts.has(family);
}

export function searchFonts(query: string): string[] {
  if (!query.trim()) return [...GOOGLE_FONTS];
  const lower = query.toLowerCase();
  return GOOGLE_FONTS.filter((f) => f.toLowerCase().includes(lower));
}
