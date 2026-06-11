export const colors = {
  light: {
    // Core palette
    background: "#eff1f5",
    foreground: "#4c4f69",

    card: "#ffffff",
    cardForeground: "#4c4f69",

    popover: "#ccd0da",
    popoverForeground: "#4c4f69",

    primary: "#8839ef",
    primaryForeground: "#ffffff",
    primaryLight: "#f3ecfe",

    secondary: "#ccd0da",
    secondaryForeground: "#4c4f69",

    muted: "#dce0e8",
    mutedForeground: "#6c6f85",

    accent: "#04a5e5",
    accentForeground: "#ffffff",
    accentLight: "#e6f7fd",

    destructive: "#d20f39",
    destructiveForeground: "#ffffff",
    destructiveLight: "#fde8ec",

    success: "#40a02b",
    successForeground: "#ffffff",
    successLight: "#e6f4e2",

    border: "#bcc0cc",
    borderLight: "#dce0e8",

    input: "#ccd0da",
    ring: "#8839ef",

    warning: "#fe640b",
    warningForeground: "#ffffff",
    warningLight: "#fff0e6",

    // Semantic aliases (keep for backward compat, but map to foreground)
    text: "#4c4f69",
    textSecondary: "#6c6f85",
    textTertiary: "#9ca0b0",

    surface: "#e6e9ef",
    surfaceElevated: "#ffffff",

    chart1: "#8839ef",
    chart2: "#04a5e5",
    chart3: "#40a02b",
    chart4: "#fe640b",
    chart5: "#dc8a78",

    sidebar: "#e6e9ef",
    sidebarForeground: "#4c4f69",
    sidebarPrimary: "#8839ef",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent: "#04a5e5",
    sidebarAccentForeground: "#ffffff",
    sidebarBorder: "#bcc0cc",
    sidebarRing: "#8839ef",

    glassBackground: "rgba(255,255,255,0.70)",
    shadow: "0 4px 12px rgba(76,79,105,0.10)",
  },
  dark: {
    background: "#181825",
    foreground: "#cdd6f4",

    card: "#1e1e2e",
    cardForeground: "#cdd6f4",

    popover: "#45475a",
    popoverForeground: "#cdd6f4",

    primary: "#cba6f7",
    primaryForeground: "#1e1e2e",
    primaryLight: "rgba(203,166,247,0.15)",

    secondary: "#585b70",
    secondaryForeground: "#cdd6f4",

    muted: "#292c3c",
    mutedForeground: "#a6adc8",

    accent: "#89dceb",
    accentForeground: "#1e1e2e",
    accentLight: "rgba(137,220,235,0.12)",

    destructive: "#f38ba8",
    destructiveForeground: "#1e1e2e",
    destructiveLight: "rgba(243,139,168,0.12)",

    success: "#a6e3a1",
    successForeground: "#1e1e2e",
    successLight: "rgba(166,227,161,0.12)",

    border: "#313244",
    borderLight: "#242538",

    input: "#313244",
    ring: "#cba6f7",

    warning: "#fab387",
    warningForeground: "#1e1e2e",
    warningLight: "rgba(250,179,135,0.12)",

    text: "#cdd6f4",
    textSecondary: "#a6adc8",
    textTertiary: "#6c7086",

    surface: "#1e1e2e",
    surfaceElevated: "#24253a",

    chart1: "#cba6f7",
    chart2: "#89dceb",
    chart3: "#a6e3a1",
    chart4: "#fab387",
    chart5: "#f5e0dc",

    sidebar: "#11111b",
    sidebarForeground: "#cdd6f4",
    sidebarPrimary: "#cba6f7",
    sidebarPrimaryForeground: "#1e1e2e",
    sidebarAccent: "#89dceb",
    sidebarAccentForeground: "#1e1e2e",
    sidebarBorder: "#45475a",
    sidebarRing: "#cba6f7",

    glassBackground: "rgba(30,30,46,0.70)",
    shadow: "0 4px 12px rgba(0,0,0,0.30)",
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
  display: { fontSize: 36, fontWeight: "700" as const, lineHeight: 44, fontFamily: "Montserrat_700Bold" },
  h1: { fontSize: 28, fontWeight: "700" as const, lineHeight: 34, fontFamily: "Montserrat_700Bold" },
  h2: { fontSize: 22, fontWeight: "700" as const, lineHeight: 28, fontFamily: "Montserrat_700Bold" },
  h3: { fontSize: 18, fontWeight: "600" as const, lineHeight: 24, fontFamily: "Montserrat_600SemiBold" },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24, fontFamily: "Montserrat_400Regular" },
  caption: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16, fontFamily: "Montserrat_500Medium" },
  label: { fontSize: 10, fontWeight: "700" as const, lineHeight: 14, fontFamily: "Montserrat_700Bold" },
  mono: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20, fontFamily: "FiraCode_400Regular" },
} as const;

export const touchTarget = { min: 48 } as const;

/**
 * Theme-adaptive status colors that reference semantic tokens.
 * Use these in components instead of hardcoded hex values.
 */
export const statusColors = {
  pending: { bg: "warningLight", text: "warning" },
  confirmed: { bg: "accentLight", text: "accent" },
  packed: { bg: "primaryLight", text: "primary" },
  assigned: { bg: "accentLight", text: "accent" },
  on_the_way: { bg: "accentLight", text: "accent" },
  delivered: { bg: "successLight", text: "success" },
} as const;

/**
 * Resolve a status color pair against the current theme colors.
 * Usage: getStatusColor("delivered", colors) => { bg: "#e6f4e2", text: "#40a02b" }
 */
export function getStatusColor(
  status: keyof typeof statusColors,
  themeColors: Record<string, string>,
) {
  const pair = statusColors[status];
  if (!pair) return { bg: themeColors.muted, text: themeColors.foreground };
  return {
    bg: themeColors[pair.bg] ?? themeColors.muted,
    text: themeColors[pair.text] ?? themeColors.foreground,
  };
}
