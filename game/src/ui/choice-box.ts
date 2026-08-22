import { BaseView } from './base-view';
import { type InputAction } from '../core/input-manager';

export interface ChoiceOption {
    text: string;
    callback: () => void;
}

export class ChoiceBox extends BaseView {
    private choices: ChoiceOption[] = [];
    private selectedIndex: number = 0;
    private choiceElements: HTMLElement[] = [];
    private listContainer: HTMLElement | null = null;

    constructor() {
        super('choice-box-container');
        this.hide();

        if (this.container) {
            (this.container as any).__choiceBox = this;
        }
    }

    private static getChoiceBox(): ChoiceBox {
        const container = document.getElementById('choice-box-container');
        if (container && (container as any).__choiceBox) {
            return (container as any).__choiceBox as ChoiceBox;
        }
        throw new Error('[ChoiceBox] Active instance not found in the DOM.');
    }

    public static showChoices(options: string[], callback: (selectedOption: string) => void): void {
        const instance = ChoiceBox.getChoiceBox();
        const formattedChoices: ChoiceOption[] = [];

        for (let i = 0; i < options.length; i += 2) {
            const text = options[i]?.replace(/^"|"$/g, '') || '';
            const label = options[i + 1];

            if (text && label) {
                formattedChoices.push({
                    text: text,
                    callback: () => callback(label)
                });
            }
        }
        
        instance.showChoices(formattedChoices);
    }

    protected getTemplate(): string {
        return `
        <div class="choice-box-inner">
            <div class="choice-list"></div>
        </div>
        `;
    }

    protected afterRender(): void {
        this.listContainer = this.container.querySelector('.choice-list');
    }

    public showChoices(choices: ChoiceOption[]): void {
        this.choices = choices;
        this.selectedIndex = 0;
        this.show();
        this.renderChoices();
    }

    public hideChoices(): void {
        this.choices = [];
        this.choiceElements = [];
        this.hide();
    }

    public isHidden(): boolean {
        return this.container.classList.contains('hidden');
    }

    private renderChoices(): void {
        if (!this.listContainer) return;

        this.listContainer.innerHTML = '';
        this.choiceElements = [];

        this.choices.forEach((option, index) => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('choice-item');
            if (index === this.selectedIndex) {
                itemEl.classList.add('selected');
            }
            itemEl.textContent = option.text;

            itemEl.addEventListener('click', () => {
                this.selectedIndex = index;
                this.updateSelection();
                this.selectCurrent();
            });

            this.listContainer!.appendChild(itemEl);
            this.choiceElements.push(itemEl);
        });
    }

    private updateSelection(): void {
        this.choiceElements.forEach((el, index) => {
            if (index === this.selectedIndex) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });
    }
    
    public handleInput(action: InputAction): void {
        if (this.isHidden()) return;

        switch (action) {
            case 'up':
                if (this.choices.length > 0) {
                    this.selectedIndex = (this.selectedIndex - 1 + this.choices.length) % this.choices.length;
                    this.updateSelection();
                }
                break;
            case 'down':
                if (this.choices.length > 0) {
                    this.selectedIndex = (this.selectedIndex + 1) % this.choices.length;
                    this.updateSelection();
                }
                break;
            case 'interact':
        }
    }

    private selectCurrent(): void {
        const choice = this.choices[this.selectedIndex];
        if (choice) {
            this.hideChoices();
            choice.callback();
        }
    }
}