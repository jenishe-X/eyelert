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
exports.Screen3 = Screen3;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
function Screen3({ onNext }) {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const slideAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(96)).current;
    const fadeAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const scaleAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0.97)).current;
    (0, react_1.useEffect)(() => {
        react_native_1.Animated.sequence([
            react_native_1.Animated.delay(80),
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 760,
                    easing: react_native_1.Easing.bezier(0.22, 1, 0.36, 1),
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 520,
                    easing: react_native_1.Easing.out(react_native_1.Easing.cubic),
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 760,
                    easing: react_native_1.Easing.bezier(0.22, 1, 0.36, 1),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [fadeAnim, scaleAnim, slideAnim]);
    return (<react_native_1.View className="flex-1 bg-black">
      <react_native_1.StatusBar barStyle="light-content"/>

      <react_native_1.ImageBackground source={require("../../../assets/screen3.png")} resizeMode="cover" style={{ flex: 1, justifyContent: "flex-end" }}>
        <react_native_1.View pointerEvents="none" style={{
            ...react_native_1.StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}/>

        <react_native_1.View pointerEvents="none" style={{
            position: "absolute",
            top: insets.top + 18,
            left: 22,
            right: 70,
        }}>
        </react_native_1.View>

        <react_native_1.Animated.View style={{
            backgroundColor: "#F1F1F3",
            borderTopLeftRadius: 44,
            borderTopRightRadius: 44,
            minHeight: 350,
            paddingTop: 32,
            paddingHorizontal: 28,
            paddingBottom: Math.max(insets.bottom, 20) + 14,
            alignItems: "center",
            borderTopWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.65)",
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            opacity: fadeAnim,
        }}>
          <react_native_1.Text className="font-sans-bold text-center text-black" style={{
            fontSize: 48,
            lineHeight: 54,
            letterSpacing: -0.6,
            marginBottom: 15,
            marginTop: 15,
        }}>
            {"EYELERT"}
          </react_native_1.Text>

          <react_native_1.Text className="font-sans text-center text-black" style={{
            fontSize: 20,
            lineHeight: 20,
            letterSpacing: -0.6,
            marginBottom: 15,
        }}>
            {"Stay alert on the road \nwith smart fatigue detection."}
          </react_native_1.Text>

          <react_native_1.Text className="font-sans text-center text-[#9C2230]" style={{
            fontSize: 13,
            lineHeight: 18,
            letterSpacing: 1.2,
            marginTop: 8,
            marginBottom: 30,
        }}>
            DRIVE SMARTER . RESPOND FASTER
          </react_native_1.Text>

          <react_native_1.View style={{
            width: "100%",
            borderRadius: 999,
            shadowColor: "#5E0006",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.28,
            shadowRadius: 16,
            elevation: 8,
            marginTop: 0,
        }}>
            <react_native_1.Pressable onPress={onNext} accessibilityRole="button" accessibilityLabel="Continue to finish onboarding" style={{
            width: "88%",
            backgroundColor: "#5E0006",
            borderRadius: 999,
            paddingVertical: 10,
            alignItems: "center",
            alignSelf: "center",
        }}>
              <react_native_1.Text className="font-sans text-white" style={{ fontSize: 24, lineHeight: 30, letterSpacing: 0.1 }}>
                Continue
              </react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>
        </react_native_1.Animated.View>
      </react_native_1.ImageBackground>
    </react_native_1.View>);
}
