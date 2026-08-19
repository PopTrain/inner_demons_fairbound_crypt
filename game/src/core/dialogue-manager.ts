import { LocalizationSystem } from "./localization-manager";

export interface DialogueConfig {
    maxLineLength?: number;
    linesPerPage?: number;
}

export class DialogueSystem {
    private localization: LocalizationSystem;
    private maxLineLength: number;
    private linesPerPage: number;

    constructor(localization: LocalizationSystem, config?: DialogueConfig) {
        this.localization = localization;
        this.maxLineLength = config?.maxLineLength ?? 40;
        this.linesPerPage = config?.linesPerPage ?? 3;
    }

    public getDialoguePages(key: string, lang?: string, params?: Record<string, string | number>): string[][] {
        const rawText = this.localization.translate(key, lang, params);
        const wrappedLines = this.wrapText(rawText, this.maxLineLength);
        return this.paginateLines(wrappedLines, this.linesPerPage);
    }

    private wrapText(text: string, maxLen: number): string[] {
        const paragraphs = text.split(/\r?\n/);
        const lines: string[] = [];

        for (const paragraph of paragraphs) {
            if (paragraph.trim() === "") {
                lines.push("");
                continue;
            }

            const words = paragraph.split(' ');
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine === '' ? word : `${currentLine} ${word}`;
                if (testLine.length <= maxLen) {
                    currentLine = testLine;
                } else {
                    if (currentLine !== '') {
                        lines.push(currentLine);
                    }
                    currentLine = word;
                }
            }
            if (currentLine !== '') {
                lines.push(currentLine);
            }
        }

        return lines;
    }

    private paginateLines(lines: string[], pageSize: number): string[][] {
        const pages: string[][] = [];
        for (let i = 0; i < lines.length; i += pageSize) {
            pages.push(lines.slice(i, i + pageSize));
        }
        return pages.length > 0 ? pages : [[]];
    }

    public setMaxLineLength(length: number): void {
        this.maxLineLength = length;
    }

    public setLinesPerPage(count: number): void {
        this.linesPerPage = count;
    }
}