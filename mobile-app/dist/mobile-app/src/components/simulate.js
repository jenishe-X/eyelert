"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulate = Simulate;
const netinfo_1 = __importDefault(require("@react-native-community/netinfo"));
const vector_icons_1 = require("@expo/vector-icons");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
function Simulate({ onOpenFaceEnrollment }) {
    const [isEyelertWifiConnected, setIsEyelertWifiConnected] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const unsubscribe = netinfo_1.default.addEventListener((state) => {
            const isWifiConnected = state.isConnected && state.type === "wifi";
            const ssid = state.details && "ssid" in state.details ? state.details.ssid : null;
            const normalizedSsid = typeof ssid === "string" ? ssid.toLowerCase() : "";
            const isEyelertNetwork = normalizedSsid.includes("esp32") || normalizedSsid.includes("eyelert");
            setIsEyelertWifiConnected(Boolean(isWifiConnected && isEyelertNetwork));
        });
        return unsubscribe;
    }, []);
    const openWifiSettings = async () => {
        try {
            if (react_native_1.Platform.OS === "android") {
                await react_native_1.Linking.sendIntent("android.settings.WIFI_SETTINGS");
                return;
            }
            await react_native_1.Linking.openURL("App-Prefs:root=WIFI");
        }
        catch {
            await react_native_1.Linking.openSettings();
        }
    };
    return (<react_native_1.View className="flex-1 px-4 pt-6">
      <react_native_1.View className="mt-[80px]">
        <react_native_1.Text className="mb-4 font-sans-bold text-2xl text-ink dark:text-night-heading">
          Connection process
        </react_native_1.Text>

        <react_native_1.Pressable onPress={openWifiSettings} className="mb-4 flex-row items-center justify-between rounded-[14px] px-4 py-3.5" style={{ backgroundColor: "#5E0006" }}>
          <react_native_1.Text className="font-sans-bold text-base text-white">
            Connect Phone to Eyelert Wi-Fi
          </react_native_1.Text>
          <react_native_1.Text className="font-sans-bold text-lg text-white">→</react_native_1.Text>
        </react_native_1.Pressable>

        <react_native_1.Pressable onPress={onOpenFaceEnrollment} className="mb-4 flex-row items-center justify-between rounded-[14px] border border-divider bg-surface px-4 py-3.5 dark:border-night-border dark:bg-night-surface">
          <react_native_1.View className="flex-row items-center gap-2">
            <vector_icons_1.MaterialIcons name="face-retouching-natural" size={22} color="#5E0006"/>
            <react_native_1.Text className="font-sans-bold text-base text-ink dark:text-night-heading">
              Face Enrollment
            </react_native_1.Text>
          </react_native_1.View>
          <react_native_1.Text className="font-sans-bold text-lg text-ink dark:text-night-heading">→</react_native_1.Text>
        </react_native_1.Pressable>

        <react_native_1.Text className="mb-2 font-sans-bold text-base text-ink dark:text-night-heading">
          Device Connection
        </react_native_1.Text>
        <react_native_1.View className="gap-2 rounded-[14px] border border-divider bg-surface px-3 py-2.5 dark:border-night-border dark:bg-night-surface">
          <react_native_1.Text className="font-sans text-[13px] text-body dark:text-night-body">
            ESP32-S3: {isEyelertWifiConnected ? "Connected" : "Not connected"}
          </react_native_1.Text>
          <react_native_1.View className="h-px bg-divider dark:bg-night-border"/>
          <react_native_1.Text className="font-sans text-[13px] text-body dark:text-night-body">
            Camera Stream: {isEyelertWifiConnected ? "15 fps" : "Waiting for link"}
          </react_native_1.Text>
          <react_native_1.View className="h-px bg-divider dark:bg-night-border"/>
          <react_native_1.Text className="font-sans text-[13px] text-body dark:text-night-body">
            Mic Keyword Spotter: {isEyelertWifiConnected ? "Ready" : "Offline"}
          </react_native_1.Text>
          <react_native_1.View className="h-px bg-divider dark:bg-night-border"/>
          <react_native_1.Text className="font-sans text-[13px] text-body dark:text-night-body">
            Speaker + Buzzer: {isEyelertWifiConnected ? "Armed" : "Offline"}
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
}
