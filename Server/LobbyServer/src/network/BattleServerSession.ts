import { Socket } from "net";
import { PacketHeader } from "ServerCore/network/PacketHeader";
import { Session } from "ServerCore/network/Session";

class BattleServerSession extends Session {
  constructor(socket: Socket) {
    super(socket);
  }

  protected onEnd(): void {
    throw new Error("Method not implemented.");
  }
  protected onError(error: any): void {
    throw new Error("Method not implemented.");
  }
  protected handlePacket(packet: Buffer, header: PacketHeader): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
