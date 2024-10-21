import net, { Server, Socket } from 'net';

const PORT: number = 5555;

const server: Server = net.createServer((socket: Socket): void => {
  console.log(`Client Connected: ${socket.remoteAddress} : ${socket.remotePort}`);

  socket.on('data', (data) => {
    console.log(data);
  });

  socket.on('end', (): void => {
    console.log(`Client disconnected: ${socket.remoteAddress} : ${socket.remotePort}`);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(PORT, (): void => {
  console.log(`Echo Server listening on port ${PORT}`);
  console.log(server.address());
});
