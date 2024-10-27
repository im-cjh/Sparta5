import { create, fromBinary, toBinary } from "@bufbuild/protobuf";

import net, { Socket } from "net";
import { ParserUtils } from "./utils/parser/ParserUtils";
import {
  C2L_InitialPacket,
  C2L_InitialPacketSchema,
  C2S_MetadataSchema,
} from "./common/protobuf/client/client_pb";
import { ePacketId } from "./network/PacketId";
import { PacketHeader } from "./network/PacketHeader";
import { config } from "./config/config";
import { L2C_InitSchema } from "./common/protobuf/server/server_pb";

//임시 테스트
const sendPacket = (socket: Socket, sendBuffer: Buffer) => {
  socket.write(sendBuffer);
};

// 서버에 연결할 호스트와 포트
const HOST = "localhost";
const PORT = 3000;

const client = new net.Socket();

client.connect(PORT, HOST, async () => {
  console.log("Connected to server");
  const packet: C2L_InitialPacket = create(C2L_InitialPacketSchema, {
    meta: create(C2S_MetadataSchema, {
      userId: "im-cjh",
      clientVersion: "1.0.0",
    }),
    deviceId: "xxxxx",
  });

  const sendBuffer: Buffer = ParserUtils.SerializePacket<C2L_InitialPacket>(
    packet,
    C2L_InitialPacketSchema,
    ePacketId.C2L_Init,
    0
  );

  sendPacket(client, sendBuffer);
});

client.on("data", (data) => {
  const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

  const packetHeader: PacketHeader = ParserUtils.readPacketHeader(buffer);
  console.log("packetHeader: ", packetHeader);

  // 메시지 추출
  const slicedBuffer = buffer.slice(config.packet.sizeOfHeader); // 앞의 헤더 부분을 잘라낸다.

  const packet = fromBinary(L2C_InitSchema, slicedBuffer);
  console.log("server 에게 받은 메세지: ", packet);
});

client.on("close", () => {
  console.log("Connection closed");
});

client.on("error", (err) => {
  console.error("Client error:", err);
});
