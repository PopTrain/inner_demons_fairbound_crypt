import { BaseView } from './base-view';
import { DialogueSystem } from '../core/dialogue-manager';

export class DialogueBox extends BaseView {
    private dialogueSystem: DialogueSystem;
    private pages: string[][] = [];
    private currentPageIndex: number = 0;
    private textContainer: HTMLElement | null = null;
    private onCompleteCallback?: () => void;

    constructor(dialogueSystem: DialogueSystem) {
        super('dialogue-box-container');
        this.dialogueSystem = dialogueSystem
        this.hide();
    }

    protected getTemplate(): string {
        return `
            <div class="dialogue-box-inner">
                <div class="dialogue-text-container"></div>
            </div>
        `;
    }

    protected afterRender(): void {
        this.textContainer = this.container.querySelector('.dialogue-text-container');

        this.container.addEventListener('click', () => {
            this.next();
        });
    }

    public startDialogue(key: string, lang?: string, params?: Record<string, string | number>, onComplete?: () => void): void {
        this.dialogueSystem.setLinesPerPage(3);

        this.pages = this.dialogueSystem.getDialoguePages(key, lang, params);
        this.currentPageIndex = 0;
        this.onCompleteCallback = onComplete;

        this.show()
        this.renderCurrentPage();
    }

    public next(): void {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.currentPageIndex++;
            this.renderCurrentPage();
        } else {
            this.close();
        }
    }

    public close(): void {
        this.hide();
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
            this.onCompleteCallback = undefined;
        }
    }

    private renderCurrentPage(): void {
        if (!this.textContainer) return;

        const currentLines = this.pages[this.currentPageIndex] || [];
        this.textContainer.innerHTML = currentLines
            .map(line => `<p class="dialogue-line">${line === '' ? '&nbsp;' : line}</p>`)
            .join('');
    }
}