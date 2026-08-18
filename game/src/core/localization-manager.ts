export class LocalizationSystem {
    private defaultLang: string;
    private currentLang: string;
    private translations: Record<string, Record<string, string>> = {};
    private variables: Record<string, string | number> = {};

    constructor(defaultLang: string = 'en') {
        this.defaultLang = defaultLang;
        this.currentLang = defaultLang;
    }

    public loadCSV(content: string): void {
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
        if (lines.length === 0) return;

        const headers = this.parseCSVLine(lines[0]);
        const keyIndex = headers.indexOf('KEY');
        if (keyIndex === -1) {
            throw new Error('Invalid CSV format: Missing KEY column.');
        }

        const languages = headers.filter(h => h !== 'KEY');
        for (const lang of languages) {
            if (!this.translations[lang]) {
                this.translations[lang] = {};
            }
        }

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const key = values[keyIndex];
            if (!key) continue;

            headers.forEach((header, index) => {
                if (header !== 'KEY' && values[index] !== undefined) {
                    let val = values[index].trim();
                    if (val.startsWith('"') && val.endsWith('"')) {
                        val = val.substring(1, val.length - 1);
                    }
                    this.translations[header][key] = val;
                }
            });
        }
    }

    private parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    public setLanguage(lang: string): void {
        if (this.translations[lang]) {
            this.currentLang = lang;
        } else {
            console.warn(`Language '${lang}' is not supported. Falling back to default.`);
        }
    }

    public setVariable(key: string, value: string | number): void {
        this.variables[key] = value;
    }

    public setVariables(vars: Record<string, string | number>): void {
        this.variables = { ...this.variables, ...vars };
    }

    public translate(key: string, lang?: string, params?: Record<string, string | number>): string {
        const targetLang = lang || this.currentLang;
        let text = this.translations[targetLang]?.[key];

        if (text === undefined) {
            text = this.translations[this.defaultLang]?.[key] ?? key;
        }

        const combinedParams = { ...this.variables, ...(params || {}) };

        text = text.replace(/\\v\[([\w_]+)\]|\\v\{([\w_]+)\}/g, (match, p1, p2) => {
            const varKey = p1 || p2;
            return combinedParams[varKey] !== undefined ? String(combinedParams[varKey]) : match;
        });

        const shortcuts: Record<string, string> = {
            '\\pn': 'player_name',
            '\\g': 'gold',
            '\\item': 'item_name'
        };

        for (const [code, varName] of Object.entries(shortcuts)) {
            const regex = new RegExp(code.replace(/\\/g, '\\\\') + '(?![a-zA-Z0-9])', 'g');
            if (combinedParams[varName] !== undefined) {
                text = text.replace(regex, String(combinedParams[varName]));
            }
        }

        text = text.replace(/\\\\/g, '\\')

        return text;
    }

    public t(key: string, lang?: string, params?: Record<string, string | number>): string {
        return this.translate(key, lang, params);
    }
}