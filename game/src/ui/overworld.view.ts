import { BaseView } from './base-view';

export class OverworldView extends BaseView {
    constructor() {
        super('overworld-screen');
    }

    protected getTemplate(): string {
        return `
            <div class="environment">
            </div>
        `;
    }
}