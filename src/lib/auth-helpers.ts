import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export function unauthorized() {
  return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message: string = "Ressource non trouvée") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message: string = "Erreur interne du serveur") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function isAdmin(role: string) {
  return role === "admin" || role === "instructor";
}
