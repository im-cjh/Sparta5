import { Socket } from "node:net";
import defaultHandler from "ServerCore/handlers/default.handler";
import { LobbySession } from "src/network/LobbySession";
import initialHandler from "./initial.handler";
import { ePacketId } from "ServerCore/network/PacketId";
import { roomManager } from "src/classes/managers/RoomManager";

type PacketHandler = (buffer: Buffer, session: LobbySession) => unknown;

const handlerMappings: Record<ePacketId, PacketHandler> = {
  [ePacketId.C2L_Init]: (buffer: Buffer, session: LobbySession) =>
    initialHandler(buffer, session),
  [ePacketId.C2L_EnterRoom]: (buffer: Buffer, session: LobbySession) =>
    roomManager.enterRoomHandler(buffer, session),
  [ePacketId.C2L_LeaveRoom]: (buffer: Buffer, session: LobbySession) =>
    roomManager.enterRoomHandler(buffer, session),
  [ePacketId.C2L_GetRooms]: (buffer: Buffer, session: LobbySession) =>
    roomManager.getRoomsHandler(buffer, session),

  [ePacketId.L2C_EnterRoomMe]: (buffer: Buffer, session: LobbySession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_LeaveRoomMe]: (buffer: Buffer, session: LobbySession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_Init]: (buffer: Buffer, session: LobbySession) =>
    defaultHandler(buffer, session),
  [ePacketId.S2C_Error]: (buffer: Buffer, session: LobbySession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_GetRoom]: (buffer: Buffer, session: LobbySession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_EnterRoomOther]: (buffer: Buffer, session: LobbySession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_LeaveRoomOther]: (buffer: Buffer, session: LobbySession) =>
    defaultHandler(buffer, session),
};

export default handlerMappings;
