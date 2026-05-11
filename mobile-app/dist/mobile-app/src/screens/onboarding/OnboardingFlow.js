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
exports.OnboardingFlow = OnboardingFlow;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const Screen2_1 = require("./Screen2");
const Screen3_1 = require("./Screen3");
const WelcomeScreen_1 = require("./WelcomeScreen");
/**
 * Multi-step onboarding container. Owns the step index and renders the
 * current screen. Add new screens here as the flow grows (screen 2 / 3).
 */
function OnboardingFlow({ onComplete }) {
    const [step, setStep] = (0, react_1.useState)(0);
    const [isTransitioning, setIsTransitioning] = (0, react_1.useState)(false);
    const totalSteps = 3;
    const transitionOpacity = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const transitionTranslateX = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const goNext = (0, react_1.useCallback)(() => {
        if (isTransitioning)
            return;
        const next = step + 1;
        if (next >= totalSteps) {
            onComplete();
            return;
        }
        setIsTransitioning(true);
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(transitionOpacity, {
                toValue: 0,
                duration: 160,
                easing: react_native_1.Easing.out(react_native_1.Easing.quad),
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(transitionTranslateX, {
                toValue: -18,
                duration: 160,
                easing: react_native_1.Easing.out(react_native_1.Easing.quad),
                useNativeDriver: true,
            }),
        ]).start(() => {
            setStep(next);
            transitionTranslateX.setValue(18);
            transitionOpacity.setValue(0);
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(transitionOpacity, {
                    toValue: 1,
                    duration: 240,
                    easing: react_native_1.Easing.out(react_native_1.Easing.cubic),
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(transitionTranslateX, {
                    toValue: 0,
                    duration: 240,
                    easing: react_native_1.Easing.out(react_native_1.Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsTransitioning(false);
            });
        });
    }, [
        isTransitioning,
        onComplete,
        transitionOpacity,
        transitionTranslateX,
        totalSteps,
    ]);
    let content;
    switch (step) {
        case 0:
            content = <WelcomeScreen_1.WelcomeScreen onNext={goNext}/>;
            break;
        case 1:
            content = <Screen2_1.Screen2 onNext={goNext}/>;
            break;
        case 2:
            content = <Screen3_1.Screen3 onNext={goNext}/>;
            break;
        default:
            content = <Screen3_1.Screen3 onNext={goNext}/>;
            break;
    }
    return (<react_native_1.Animated.View style={{
            flex: 1,
            opacity: transitionOpacity,
            transform: [{ translateX: transitionTranslateX }],
        }}>
      {content}
    </react_native_1.Animated.View>);
}
