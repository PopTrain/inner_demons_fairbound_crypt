export abstract class BaseView {
    protected container: HTMLElement;

    constructor(protected viewId: string) {
        this.container = document.createElement('div');
        this.container.id = this.viewId;
        this.container.classList.add('view')
    }

    protected abstract getTemplate(): string;

    protected afterRender(): void {}

    public render(parentElement: HTMLElement): void {
        this.container.innerHTML = this.getTemplate();
        parentElement.appendChild(this.container);
        this.afterRender();
    }

    public destroy(): void {
        this.container.remove();
    }

    public show(): void {
        this.container.classList.remove('hidden');
    }

    public hide():void {
        this.container.classList.add('hidden');
    }
}