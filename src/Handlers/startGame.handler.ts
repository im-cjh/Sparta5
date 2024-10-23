import { UUID } from 'node:crypto';
import { ePacketId } from '../constants/packetId';
import { fromBinary } from '@bufbuild/protobuf';
import { C2SPosSchema } from '../../Protocol/request/common_pb';

//임시
export const handlePos = async (buffer: Buffer) => {
  const pos = fromBinary(C2SPosSchema, buffer);

  console.log(pos);

  return buffer;
};
