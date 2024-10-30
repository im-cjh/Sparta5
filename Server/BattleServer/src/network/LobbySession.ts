import { create } from "@bufbuild/protobuf";
import { Socket } from "net";
import { PacketHeader } from "ServerCore/network/PacketHeader";
import { ePacketId } from "ServerCore/network/PacketId";
import { Session } from "ServerCore/network/Session";
import { ParserUtils } from "ServerCore/utils/parser/ParserUtils";
import { battleConfig } from "src/config/config";
import {
  B2L_InitialPacket,
  B2L_InitialPacketSchema,
} from "src/protocol/server_pb";
import { v4 as uuidv4 } from "uuid";

export class LobbySession extends Session {
  constructor(socket: Socket) {
    super(socket);

    this.setId(uuidv4());
  }

  public connectLobbyServer(): void {
    this.socket.connect(
      battleConfig.lobbyServer.port,
      battleConfig.lobbyServer.host,
      async () => {
        console.log("Connected to server");
        const packet: B2L_InitialPacket = create(B2L_InitialPacketSchema, {
          serverId: this.getId(),
        });

        const sendBuffer: Buffer =
          ParserUtils.SerializePacket<B2L_InitialPacket>(
            packet,
            B2L_InitialPacketSchema,
            ePacketId.B2L_Init,
            0
          );

        this.send(sendBuffer);
      }
    );
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
