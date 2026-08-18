import { LocalizationSystem } from "./localization-manager";

export class UIManager {
    private localization: LocalizationSystem;

    constructor(localization: LocalizationSystem) {
        this.localization = localization;
    }

    public updateDOM(root: Document | HTMLElement = document): void {
        const textElements = root.querySelectorAll('[data-i18n]');
        textElements.forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                const params = this.extractParams(el);
                el.textContent = this.localization.t(key, undefined, params);
            }
        });

        const placeholderElements = root.querySelectorAll('[data-i18n-placeholder');
        placeholderElements.forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
                const params = this.extractParams(el);
                el.placeholder = this.localization.t(key, undefined, params);
            }
        });

        const titleElements = root.querySelectorAll('[data-i18n-title]');
        titleElements.forEach((el) => {
            const key = el.getAttribute('data-i18n-title');
            if (key) {
                const params = this.extractParams(el);
                el.setAttribute('title', this.localization.t(key, undefined, params));
            }
        });
    }

    public setLanguage(lang: string): void {
        this.localization.setLanguage(lang);
        this.updateDOM();
    }

    public setVariable(key: string, value: string | number, refresh: boolean = true): void {
        this.localization.setVariable(key, value);
        if (refresh) {
            this.updateDOM();
        }
    }

    private extractParams(el: Element): Record<string, string | number> | undefined {
        const paramsAttr = el.getAttribute('data-i18n-params');
        if (!paramsAttr) return undefined;

        try {
            return JSON.parse(paramsAttr);
        } catch (error) {
            console.warn(`Failed to parse data-i18n-params for element:`, el, error);
            return undefined;
        }
    }
}