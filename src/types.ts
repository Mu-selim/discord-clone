import { Server, Member, Profile } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { Server as ServerIO } from "socket.io";
import { NextApiResponse } from "next";

export type ServerWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextServerIOApiResponse = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};
