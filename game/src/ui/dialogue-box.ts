import { BaseView } from './base-view';
import { DialogueSystem } from '../core/dialogue-manager';

class NameBoxComponent {
    private element: HTMLElement | null = null;

    constructor(container: HTMLElement) {
        this.element = container.querySelector('.name-box');
    }

    public setName(name?: string | null): void {
        if (!this.element) return;

        if (name && typeof name === 'string' && name.trim() !== '' && name.toLowerCase() !== 'null') {
            this.element.textContent = name;
            this.element.classList.remove('hidden');
        } else {
            this.element.textContent = '';
            this.element.classList.add('hidden');
        }
    }
}

export class DialogueBox extends BaseView {
    private dialogueSystem: DialogueSystem;
    private pages: string[][] = [];
    private currentPageIndex: number = 0;
    private textContainer: HTMLElement | null = null;
    private nameBoxComponent: NameBoxComponent | null = null;
    private onCompleteCallback?: () => void;

    constructor(dialogueSystem: DialogueSystem) {
        super('dialogue-box-container');
        this.dialogueSystem = dialogueSystem
        this.hide();

        if (this.container) {
            (this.container as any).__dialogueBox = this;
        }
    }

    private static getDialogueBox(): DialogueBox {
        const container = document.getElementById('dialogue-box-container');
        if (container && (container as any).__dialogueBox) {
            return (container as any).__dialogueBox as DialogueBox;
        }
        throw new Error('[DialogueBox] Active instance not found in the DOM.');
    }

    public static startDialogue(key: string, onComplete: () => void): void {
        const instance = DialogueBox.getDialogueBox();
        instance.startDialogueInstance(key, undefined, undefined, onComplete);
    }

    public static setNameBox(name?: string | null): void {
        const instance = DialogueBox.getDialogueBox();
        instance.setName(name);
    }

    protected getTemplate(): string {
        return `
            <div class="name-box hidden"></div>
            <div class="dialogue-box-inner">
                <div class="dialogue-text-container"></div>
            </div>
        `;
    }

    protected afterRender(): void {
        this.textContainer = this.container.querySelector('.dialogue-text-container');

        this.nameBoxComponent = new NameBoxComponent(this.container);

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

    public setName(name?: string | null): void {
        this.nameBoxComponent?.setName(name);
    }

    public startDialogueInstance(key: string, lang?: string, params?: Record<string, string | number>, onComplete?: () => void): void {
        this.dialogueSystem.setLinesPerPage(3);

        this.pages = this.dialogueSystem.getDialoguePages(key, lang, params);
        this.currentPageIndex = 0;
        this.onCompleteCallback = onComplete;

        this.show();
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
        this.setName(null);
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