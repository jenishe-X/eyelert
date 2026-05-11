"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeScreen = WelcomeScreen;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const ChevronButton_1 = require("./ChevronButton");
function WelcomeScreen({ onNext }) {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    return (<react_native_1.View className="flex-1 bg-royal">
      <react_native_1.StatusBar barStyle="light-content" backgroundColor="#5E0006"/>

      <react_native_1.View className="flex-1 px-7" style={{
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, 24),
            justifyContent: "flex-end",
        }}>
        <react_native_1.View className="flex-row items-center" style={{ paddingBottom: 155, paddingLeft: 10 }}>
          <react_native_1.Text className="font-sans-bold text-white" style={{
            fontSize: 44,
            lineHeight: 50,
            letterSpacing: -0.5,
            marginBottom: 20,
        }}>
            {"Your safety\nmatters."}
          </react_native_1.Text>

          <react_native_1.View style={{ marginLeft: 40 }}>
            <ChevronButton_1.ChevronButton onPress={onNext} accessibilityLabel="Continue to next onboarding step" size={62}/>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
}
