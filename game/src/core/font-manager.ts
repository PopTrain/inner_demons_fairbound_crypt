export class FontManager {
    private static loadedFonts: Set<string> = new Set();

    public static async loadFont(fontName: string, fontUrl: string): Promise<void> {
        if (this.loadedFonts.has(fontName)) {
            return;
        }

        try {
            const fontFace = new FontFace(fontName, `url(${fontUrl})`);

            await fontFace.load();

            (document.fonts as any).add(fontFace);

            this.loadedFonts.add(fontName);
            console.log(`[FontManager] Successfully loaded font: ${fontName}`);
        } catch (error) {
            console.error(`[FontManager] Failed to load font '${fontName}' from ${fontUrl}:`, error);
            throw error;
        }
    }

    public static async preloadEngineFonts(): Promise<void> {
        await this.loadFont('FixedSys Excelsior', '/fonts/FSEX302.ttf');

        await document.fonts.ready;
        console.log('[FontManager] All engine fonts are fully ready.');
    }
}