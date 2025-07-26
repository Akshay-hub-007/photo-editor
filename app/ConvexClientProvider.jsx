"use client";

import { useAuth } from "@clerk/nextjs";
import {  ConvexProviderWithAuth, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({ children }) {
  return <ConvexProviderWithAuth client={convex}
  useAuth={useAuth}
  >{children}</ConvexProviderWithAuth>;
}