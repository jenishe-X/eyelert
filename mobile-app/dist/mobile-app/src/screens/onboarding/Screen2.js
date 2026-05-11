"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screen2 = Screen2;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const ChevronButton_1 = require("./ChevronButton");
function Screen2({ onNext }) {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    return (<react_native_1.View className="flex-1 bg-royal">
      <react_native_1.StatusBar barStyle="light-content" backgroundColor="#5E0006"/>

      <react_native_1.View className="flex-1 px-9" style={{
            paddingTop: insets.top + 20,
            paddingBottom: Math.max(insets.bottom, 20),
            justifyContent: "space-between",
        }}>
        <react_native_1.View>
          <react_native_1.View className="flex-row items-center justify-between" style={{ marginBottom: 20 }}>
            <react_native_1.Text className="font-sans-bold text-white" style={{ fontSize: 50, lineHeight: 58, letterSpacing: -0.6,
            marginTop: 20,
        }}>
              {"Tired? We\u2019ll\nLet You Know."}
            </react_native_1.Text>
          </react_native_1.View>

          <react_native_1.Text className="font-sans text-white" style={{ fontSize: 22, lineHeight: 40, maxWidth: 680, fontStyle: 'italic' }}>
            {"Our device detects the\nearliest signs of fatigue\u2014\neven before you feel them."}
          </react_native_1.Text>
        </react_native_1.View>

        <react_native_1.Image source={require("../../../assets/screen2.png")} accessibilityIgnoresInvertColors resizeMode="contain" blurRadius={3} style={{ width: "165%", height: 620, alignSelf: "center", marginLeft: -200 }}/>
      </react_native_1.View>

      <react_native_1.View pointerEvents="box-none" style={{
            position: "absolute",
            right: 18,
            bottom: Math.max(insets.bottom, 20),
            zIndex: 999,
            elevation: 999,
            marginBottom: 570,
            marginRight: 20,
        }}>
        <ChevronButton_1.ChevronButton onPress={onNext} accessibilityLabel="Continue to next onboarding step" size={64} textColor="#FFFFFF"/>
      </react_native_1.View>
    </react_native_1.View>);
}
