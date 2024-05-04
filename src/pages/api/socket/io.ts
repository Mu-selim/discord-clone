import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextServerIOApiResponse } from "@/types";

export const config = {
  api: { bodyParser: false },
};

export default function ioHandler(req: NextApiRequest, res: NextServerIOApiResponse) {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  res.end();
}
