export const colors = {
  light: {
    primary: "#2563EB",
    primaryLight: "#EFF6FF",
    accent: "#059669",
    accentLight: "#ECFDF5",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    surfaceElevated: "#FFFFFF",
    text: "#0F172A",
    textSecondary: "#64748B",
    textTertiary: "#94A3B8",
    border: "#E2E8F0",
    borderLight: "#F1F5F9",
    destructive: "#DC2626",
    destructiveLight: "#FEF2F2",
    warning: "#D97706",
    warningLight: "#FFFBEB",
  },
  dark: {
    primary: "#3B82F6",
    primaryLight: "#1E3A5F",
    accent: "#10B981",
    accentLight: "#064E3B",
    background: "#0F172A",
    surface: "#1E293B",
    surfaceElevated: "#334155",
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",
    border: "#334155",
    borderLight: "#1E293B",
    destructive: "#EF4444",
    destructiveLight: "#451A1A",
    warning: "#F59E0B",
    warningLight: "#451A1A",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 9999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: "700" as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: "600" as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
  label: { fontSize: 10, fontWeight: "700" as const, lineHeight: 14 },
} as const;

export const touchTarget = { min: 48 } as const;

export const statusColors = {
  pending: { bg: "#FEF3C7", text: "#92400E" },
  confirmed: { bg: "#EFF6FF", text: "#1E40AF" },
  packed: { bg: "#F3E8FF", text: "#6B21A8" },
  assigned: { bg: "#E0E7FF", text: "#3730A3" },
  on_the_way: { bg: "#CFFAFE", text: "#155E75" },
  delivered: { bg: "#ECFDF5", text: "#065F46" },
} as const;
