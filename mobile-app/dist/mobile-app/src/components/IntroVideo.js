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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntroVideo = IntroVideo;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_av_1 = require("expo-av");
const INTRO_TIMEOUT_MS = 12000;
function IntroVideo({ onDone }) {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const videoRef = (0, react_1.useRef)(null);
    const [didFinish, setDidFinish] = (0, react_1.useState)(false);
    const [isReady, setIsReady] = (0, react_1.useState)(false);
    const source = (0, react_1.useMemo)(() => {
        // NOTE: Ensure `mobile-app/assets/open.mp4` exists.
        // We intentionally keep this as a static require so Metro bundles it.
        return require("../../assets/open.mp4");
    }, []);
    const doneOnce = (0, react_1.useCallback)(() => {
        setDidFinish(true);
        onDone();
    }, [onDone]);
    const onPlaybackStatusUpdate = (0, react_1.useCallback)((status) => {
        if (!status.isLoaded)
            return;
        if (!isReady)
            setIsReady(true);
        if (status.didJustFinish)
            doneOnce();
    }, [doneOnce, isReady]);
    (0, react_1.useEffect)(() => {
        const t = setTimeout(() => {
            doneOnce();
        }, INTRO_TIMEOUT_MS);
        return () => clearTimeout(t);
    }, [doneOnce]);
    (0, react_1.useEffect)(() => {
        return () => {
            videoRef.current?.stopAsync?.().catch(() => undefined);
            videoRef.current?.unloadAsync?.().catch(() => undefined);
        };
    }, []);
    return (<react_native_1.View className="absolute inset-0 bg-black">
      <react_native_1.StatusBar hidden/>

      <expo_av_1.Video ref={(ref) => {
            videoRef.current = ref;
        }} source={source} resizeMode={expo_av_1.ResizeMode.COVER} shouldPlay isLooping={false} onPlaybackStatusUpdate={onPlaybackStatusUpdate} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} useNativeControls={false}/>

      <react_native_1.View pointerEvents="box-none" style={{
            paddingTop: Math.max(insets.top, react_native_1.Platform.OS === "ios" ? 10 : 12),
            paddingRight: 16,
            alignItems: "flex-end",
        }}>
        <react_native_1.Pressable onPress={doneOnce} disabled={didFinish} style={({ pressed }) => ({
            opacity: didFinish ? 0.4 : pressed ? 0.7 : 1,
        })} className="rounded-full bg-black/45 px-4 py-2" accessibilityRole="button" accessibilityLabel="Skip intro">
          <react_native_1.Text className="font-sans-semibold text-sm text-white">{isReady ? "Skip" : "Loading…"}</react_native_1.Text>
        </react_native_1.Pressable>
      </react_native_1.View>
    </react_native_1.View>);
}
