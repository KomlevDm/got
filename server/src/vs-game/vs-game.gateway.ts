import {SubscribeMessage, WebSocketGateway, WsResponse, OnGatewayDisconnect} from '@nestjs/websockets';
import {Socket} from 'socket.io';

import {IClientEvents} from '../../../shared-models/client-events.interface';
import {IServerEvents} from '../../../shared-models/server-events.interface';

@WebSocketGateway({
  namespace: 'vs-game',
  cors: {
    origin: '*',
  },
})
export class VsGameGateway implements OnGatewayDisconnect<Socket> {
  private waitPool: Socket[] = [];

  @SubscribeMessage<IClientEvents['opponentSearch']['event']>('opponentSearch')
  public opponentSearch(client: Socket, data: IClientEvents['opponentSearch']['data']): WsResponse | void {
    if (this.waitPool.length) {
      const opponent = this.waitPool.shift()!;

      opponent.data.opponent = client;
      client.data.opponent = opponent;

      opponent.emit<IServerEvents['opponentFound']['event']>('opponentFound', data);

      client.data.init = data;
      return {event: 'opponentFound', data: opponent.data.init};
    }

    client.data.init = data;
    this.waitPool.push(client);
  }

  @SubscribeMessage('tick')
  public tick(client: Socket, data: any): void {
    const opponent: Socket | undefined = client.data.opponent;

    if (opponent) {
      opponent.emit('tick', data);
    }
  }

  public handleDisconnect(client: Socket): void {
    const opponent: Socket | undefined = client.data.opponent;

    if (opponent) {
      opponent.data.opponent = undefined;
      opponent.emit('opponentLoss');
    } else {
      this.waitPool = this.waitPool.filter(socket => socket.id !== client.id);
    }
  }
}
