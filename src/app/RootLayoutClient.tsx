// app/RootLayoutClient.tsx
"use client";

import { ProtectedRoute } from './ProtectedRoute';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}