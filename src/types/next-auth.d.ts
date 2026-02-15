import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      avatar: string | null;
      level: string | null;
      assessmentCompleted: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    avatar: string | null;
    level: string | null;
    assessmentCompleted: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    avatar: string | null;
    level: string | null;
    assessmentCompleted: boolean;
  }
}
