import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_IO_CORS } from '../cors-options';
import { StoreAccessTokenPayload } from '../auth/auth.service';
import type { StoreSocketEventName } from './notifications.events';

type SocketData = {
  boothId?: number;
};

type StoreSocket = Socket<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  SocketData
>;

@WebSocketGateway({
  cors: SOCKET_IO_CORS,
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: StoreSocket): Promise<void> {
    const token = this.extractToken(client);
    if (token) {
      try {
        const payload =
          await this.jwtService.verifyAsync<StoreAccessTokenPayload>(token);
        const boothId = this.parseStoreId(payload.sub);

        client.data.boothId = boothId;
        await client.join(this.boothRoom(boothId));
        return;
      } catch (error) {
        this.logger.warn(
          `Rejected socket connection: ${
            error instanceof Error ? error.message : 'invalid token'
          }`,
        );
        client.disconnect(true);
        return;
      }
    }

    const boothId = this.extractBoothId(client);
    if (!boothId) {
      this.logger.warn('Rejected socket connection: missing token and boothId');
      client.disconnect(true);
      return;
    }

    client.data.boothId = boothId;
    await client.join(this.boothRoom(boothId));
  }

  emitToStore(storeId: number, event: StoreSocketEventName, payload: unknown): void {
    this.server.to(this.boothRoom(storeId)).emit(event, payload);
  }

  private extractToken(client: StoreSocket): string | null {
    const authPayload = this.toRecord(client.handshake.auth);
    const authToken = authPayload?.token;
    if (typeof authToken === 'string' && authToken.trim()) {
      return authToken;
    }

    const authorization = client.handshake.headers.authorization;
    if (typeof authorization !== 'string') {
      return null;
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return null;
    }

    return token;
  }

  private parseStoreId(raw: StoreAccessTokenPayload['sub']): number {
    const storeId = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw;
    if (storeId == null || Number.isNaN(storeId)) {
      throw new Error('JWT sub must be a store id');
    }

    return storeId;
  }

  private extractBoothId(client: StoreSocket): number | null {
    const authPayload = this.toRecord(client.handshake.auth);
    const queryPayload = this.toRecord(client.handshake.query);
    const authBoothId = authPayload?.boothId;
    const queryBoothId = queryPayload?.boothId;
    const raw = authBoothId ?? queryBoothId;
    if (raw == null) {
      return null;
    }

    let boothId: number;
    if (typeof raw === 'number') {
      boothId = raw;
    } else if (typeof raw === 'string') {
      boothId = Number.parseInt(raw, 10);
    } else if (Array.isArray(raw) && typeof raw[0] === 'string') {
      boothId = Number.parseInt(raw[0], 10);
    } else {
      return null;
    }
    if (Number.isNaN(boothId)) {
      return null;
    }

    return boothId;
  }

  private boothRoom(boothId: number): string {
    return `booth:${boothId}`;
  }

  private toRecord(value: unknown): Record<string, unknown> | null {
    if (typeof value !== 'object' || value == null) {
      return null;
    }
    return value as Record<string, unknown>;
  }
}
