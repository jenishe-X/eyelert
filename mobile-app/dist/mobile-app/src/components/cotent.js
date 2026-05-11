"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cotent = Cotent;
const react_1 = __importDefault(require("react"));
const nativewind_1 = require("nativewind");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
function MetricCard({ label, value, hint, }) {
    return (<react_native_1.View className="min-h-[98px] flex-1 rounded-[14px] border border-divider bg-surface p-3 dark:border-night-border dark:bg-night-surface">
      <react_native_1.Text className="font-sans-semibold text-[11px] text-muted dark:text-night-muted">{label}</react_native_1.Text>
      <react_native_1.Text className="mt-1.5 font-sans-bold text-[28px] text-ink dark:text-night-heading">{value}</react_native_1.Text>
      <react_native_1.Text className="mt-1 font-sans text-[11px] text-muted dark:text-night-muted">{hint}</react_native_1.Text>
    </react_native_1.View>);
}
function ControlButton({ label, variant = "secondary", }) {
    const base = "rounded-xl border py-3 px-3.5 active:opacity-90";
    const variantClass = variant === "primary"
        ? "border-royal bg-royal"
        : variant === "danger"
            ? "border-safety bg-safety/10 dark:bg-safety/15"
            : "border-divider bg-surface dark:border-night-border dark:bg-night-surface";
    const textClass = variant === "primary"
        ? "text-white"
        : variant === "danger"
            ? "text-safety"
            : "text-body dark:text-night-body";
    return (<react_native_1.TouchableOpacity activeOpacity={0.85} className={`${base} ${variantClass}`}>
      <react_native_1.Text className={`text-center font-sans-semibold text-sm ${textClass}`}>{label}</react_native_1.Text>
    </react_native_1.TouchableOpacity>);
}
function ThemeSegment({ label, active, onPress, }) {
    return (<react_native_1.TouchableOpacity onPress={onPress} activeOpacity={0.85} className={`flex-1 rounded-lg border py-2 ${active
            ? "border-royal bg-royal/12 dark:bg-royal/25"
            : "border-divider bg-surface dark:border-night-border dark:bg-night-surface"}`}>
      <react_native_1.Text className={`text-center font-sans-semibold text-xs ${active ? "text-royal dark:text-royal-foreground" : "text-body dark:text-night-body"}`}>
        {label}
      </react_native_1.Text>
    </react_native_1.TouchableOpacity>);
}
function Cotent({ statusBarStyle, driverNickname, }) {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const { colorScheme, setColorScheme } = (0, nativewind_1.useColorScheme)();
    return (<react_native_1.View className="flex-1 bg-canvas dark:bg-night-bg">
      <react_native_1.View className="px-4 pb-4" style={{ paddingTop: Math.max(insets.top, react_native_1.Platform.OS === "ios" ? 8 : 12) }}>
        <react_native_1.View className="flex-row items-center justify-between">
          <react_native_1.View className="mt-2 flex-row items-center">
            <react_native_1.Image source={require("../../assets/logo.png")} resizeMode="cover" style={{ width: 32, height: 32, borderRadius: 10 }}/>
            <react_native_1.Text className="ml-2 font-display text-xl text-ink dark:text-night-heading">EYELERT</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.TouchableOpacity activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Open menu" className="mt-2 h-10 w-10 items-center justify-center rounded-lg border border-divider bg-surface dark:border-night-border dark:bg-night-surface">
            <react_native_1.View className="mb-1 h-0.5 w-5 rounded-full bg-ink dark:bg-night-heading"/>
            <react_native_1.View className="mb-1 h-0.5 w-5 rounded-full bg-ink dark:bg-night-heading"/>
            <react_native_1.View className="h-0.5 w-5 rounded-full bg-ink dark:bg-night-heading"/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>
      <react_native_1.ScrollView className="flex-1" contentContainerClassName="gap-3.5 px-4 pt-4" contentContainerStyle={{ paddingBottom: 28 + insets.bottom }}>
        <react_native_1.View className="pb-1" style={{ marginTop: 10, marginBottom: 10 }}>
          <react_native_1.Text className="font-sans-semibold" style={{ fontSize: 44, lineHeight: 48, letterSpacing: -0.8, color: "#5E0006" }}>
            Hello, {driverNickname || "Driver"}!
          </react_native_1.Text>
          <react_native_1.Text className="font-sans text-body dark:text-night-body" style={{ fontSize: 28, lineHeight: 48, letterSpacing: -0.8 }}>
            Ready for a safe
          </react_native_1.Text>
          <react_native_1.Text className="font-sans text-body dark:text-night-body" style={{ fontSize: 28, lineHeight: 30, letterSpacing: -0.8 }}>
            drive today?
          </react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View className="flex-row items-center justify-between rounded-[14px] border border-divider px-3.5 py-3.5 dark:border-night-border" style={{ backgroundColor: "#5E0006" }}>
          <react_native_1.Text className="font-sans-semibold text-sm text-white">
            Driver State
          </react_native_1.Text>
          <react_native_1.View className="rounded-full bg-white/20 px-3 py-1.5">
            <react_native_1.Text className="font-sans-bold text-xs text-white" style={{ letterSpacing: 0.3 }}>
              ALERT
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View className="flex-row gap-2.5">
          <MetricCard label="EAR" value="0.24" hint="Eye openness normal"/>
          <MetricCard label="MAR" value="0.33" hint="No yawn detected"/>
          <MetricCard label="PERCLOS" value="0.12" hint="Low fatigue window"/>
        </react_native_1.View>

        <react_native_1.View className="mt-1">
          <react_native_1.Text className="mb-2 font-sans-bold text-base text-ink dark:text-night-heading">
            Navigation Preview
          </react_native_1.Text>
          <react_native_1.View className="gap-2 rounded-[14px] border border-divider bg-surface px-3 py-2.5 dark:border-night-border dark:bg-night-surface">
            <react_native_1.Text className="font-sans text-[13px] text-body dark:text-night-body">
              Nearest rest area: Gordon Avenue Rest Spot
            </react_native_1.Text>
            <react_native_1.View className="h-px bg-divider dark:bg-night-border"/>
            <react_native_1.Text className="font-sans text-[13px] text-body dark:text-night-body">
              Distance: 1.4 km
            </react_native_1.Text>
            <react_native_1.View className="h-px bg-divider dark:bg-night-border"/>
            <react_native_1.Text className="font-sans text-[13px] text-body dark:text-night-body">
              Next instruction: Continue for 300 meters
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View className="mt-1">
          <react_native_1.Text className="mb-2 font-sans-bold text-base text-ink dark:text-night-heading">
            Appearance
          </react_native_1.Text>
          <react_native_1.View className="mb-4 flex-row gap-2">
            <ThemeSegment label="System" active={colorScheme === undefined} onPress={() => setColorScheme("system")}/>
            <ThemeSegment label="Light" active={colorScheme === "light"} onPress={() => setColorScheme("light")}/>
            <ThemeSegment label="Dark" active={colorScheme === "dark"} onPress={() => setColorScheme("dark")}/>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View className="mt-1">
          <react_native_1.Text className="mb-2 font-sans-bold text-base text-ink dark:text-night-heading">
            Controls
          </react_native_1.Text>
          <react_native_1.View className="gap-2.5">
            <ControlButton label="Start Monitoring" variant="primary"/>
            <ControlButton label="Simulate Drowsy Alert" variant="danger"/>
            <ControlButton label="Trigger Voice Prompt"/>
            <ControlButton label="Start 15-Min Rest Timer"/>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.ScrollView>
    </react_native_1.View>);
}
