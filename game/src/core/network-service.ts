export type NetworkEventType =
    | 'connect'
    | 'disconnect'
    | 'battle_invite'
    | 'battle_action'
    | 'trade_offer'
    | 'trade_response';

export interface NetworkMessage {
    type: NetworkEventType;
    senderId: string;
    targetId?: string;
    payload: any;
}

export class NetworkService {
    private socket: WebSocket | null = null;
    private listeners: Map<NetworkEventType, ((payload: any, senderId: string) => void)[]> = new Map();
    private serverUrl: string;

    constructor(serverUrl: string) {
        this.serverUrl = serverUrl;
    }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.socket = new WebSocket(this.serverUrl);

                this.socket.onopen = () => {
                    console.log('Connected to the IDFC Network Server.');
                    resolve();
                };

                this.socket.onerror = (error) => {
                    console.error('WebSocket error encountered:', error);
                    reject(error);
                };

                this.socket.onmessage = (event) => {
                    try {
                        const message: NetworkMessage = JSON.parse(event.data);
                        this.handleMessage(message);
                    } catch (error) {
                        console.error('Disconnected from the IDFC Network Server.');
                    }
                };

                this.socket.onclose = () => {
                    console.log('Disconnected from the IDFC Network Server.');
                    this.triggerListeners('disconnect', {}, '');
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    public send(type: NetworkEventType, payload: any, senderId: string, targetId?: string): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            return;
        }

        const message: NetworkMessage = {
            type,
            senderId,
            targetId,
            payload
        };

        this.socket.send(JSON.stringify(message));
    }

    public on(type: NetworkEventType, callback: (payload: any, senderId: string) => void): void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type)!.push(callback);
    }

    private handleMessage(message: NetworkMessage): void {
        this.triggerListeners(message.type, message.payload, message.senderId);
    }

    private triggerListeners(type: NetworkEventType, payload: any, senderId: string) {
        const callbacks = this.listeners.get(type);
        if (callbacks) {
            callbacks.forEach(cb => cb(payload, senderId));
        }
    }

    public sendBattleInvite(senderId: string, targetPlayerId: string): void {
        this.send('battle_invite', {}, senderId, targetPlayerId);
    }

    public sendBattleAction(senderId: string, targetPlayerId: string, moveId: string, activeDemonInstanceId: string): void {
        this.send('battle_action', { moveId, activeDemonInstanceId }, senderId, targetPlayerId);
    }

    public sendTradeOffer(senderId: string, targetPlayerId: string, offeredDemonInstanceId: string): void {
        this.send('trade_offer', { offeredDemonInstanceId }, senderId, targetPlayerId);
    }

    public respondToTrade(senderId: string, targetPlayerId: string, accepted: boolean, counterDemonInstanceId?: string): void {
        this.send('trade_response', { accepted, counterDemonInstanceId }, senderId, targetPlayerId);
    }
}