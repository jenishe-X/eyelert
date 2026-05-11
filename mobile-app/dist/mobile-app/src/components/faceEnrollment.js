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
exports.FaceEnrollment = FaceEnrollment;
const expo_camera_1 = require("expo-camera");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const vector_icons_1 = require("@expo/vector-icons");
function FaceEnrollment({ onBack }) {
    const [permission, requestPermission] = (0, expo_camera_1.useCameraPermissions)();
    const cameraRef = (0, react_1.useRef)(null);
    const [capturedPhotoUri, setCapturedPhotoUri] = (0, react_1.useState)(null);
    const [isCapturing, setIsCapturing] = (0, react_1.useState)(false);
    const [isVerifying, setIsVerifying] = (0, react_1.useState)(false);
    const [isVerified, setIsVerified] = (0, react_1.useState)(false);
    const handleCapture = async () => {
        if (!cameraRef.current || isCapturing)
            return;
        try {
            setIsCapturing(true);
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
            });
            setCapturedPhotoUri(photo?.uri ?? null);
            setIsVerified(false);
        }
        catch (error) {
            console.warn("Failed to capture face photo.", error);
        }
        finally {
            setIsCapturing(false);
        }
    };
    const handleRetake = () => {
        setCapturedPhotoUri(null);
        setIsVerified(false);
        setIsVerifying(false);
    };
    const handleVerify = async () => {
        if (!capturedPhotoUri || isVerifying)
            return;
        try {
            setIsVerifying(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsVerified(true);
        }
        finally {
            setIsVerifying(false);
        }
    };
    if (!permission) {
        return (<react_native_1.View className="flex-1 items-center justify-center bg-background px-6 dark:bg-night-background">
        <react_native_1.Text className="font-sans text-base text-body dark:text-night-body">
          Loading camera permission...
        </react_native_1.Text>
      </react_native_1.View>);
    }
    if (!permission.granted) {
        return (<react_native_1.View className="flex-1 bg-background px-6 py-8 dark:bg-night-background" style={{ marginTop: 50, marginBottom: 10 }}>
        <react_native_1.TouchableOpacity activeOpacity={0.8} onPress={onBack} className="mb-4 h-10 w-10 items-center justify-center rounded-full border border-divider bg-surface dark:border-night-border dark:bg-night-surface">
          <vector_icons_1.MaterialIcons name="arrow-back" size={22} color="#5E0006"/>
        </react_native_1.TouchableOpacity>
        <react_native_1.Text className="font-sans-bold text-2xl text-heading dark:text-night-heading">
          Face Enrollment
        </react_native_1.Text>
        <react_native_1.Text className="mt-2 font-sans text-sm text-muted dark:text-night-muted">
          Camera access is required to capture your face profile.
        </react_native_1.Text>
        <react_native_1.TouchableOpacity activeOpacity={0.85} onPress={requestPermission} className="mt-6 items-center rounded-xl bg-[#5E0006] px-4 py-3">
          <react_native_1.Text className="font-sans-semibold text-sm text-white">Allow Camera Access</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    }
    return (<react_native_1.View className="flex-1 bg-background px-6 py-8 dark:bg-night-background" style={{ marginTop: 50, marginBottom: 10 }}>
      <react_native_1.TouchableOpacity activeOpacity={0.8} onPress={onBack} className="mb-4 h-10 w-10 items-center justify-center rounded-full border border-divider bg-surface dark:border-night-border dark:bg-night-surface">
        <vector_icons_1.MaterialIcons name="arrow-back" size={22} color="#5E0006"/>
      </react_native_1.TouchableOpacity>

      <react_native_1.Text className="font-sans-bold text-2xl text-heading dark:text-night-heading">
        Face Enrollment
      </react_native_1.Text>
      <react_native_1.Text className="mt-2 font-sans text-sm text-muted dark:text-night-muted">
        Position your face inside the frame, capture, then verify.
      </react_native_1.Text>

      <react_native_1.View className="mt-6 overflow-hidden rounded-2xl border border-divider bg-surface dark:border-night-border dark:bg-night-surface">
        {capturedPhotoUri ? (<react_native_1.Image source={{ uri: capturedPhotoUri }} className="h-80 w-full" resizeMode="cover"/>) : (<expo_camera_1.CameraView ref={cameraRef} style={{ height: 320, width: "100%" }} facing="front"/>)}
      </react_native_1.View>

      <react_native_1.View className="mt-4 rounded-2xl border border-divider bg-surface p-4 dark:border-night-border dark:bg-night-surface">
        <react_native_1.Text className="font-sans-semibold text-sm text-body dark:text-night-body">
          1. Align your face in good lighting
        </react_native_1.Text>
        <react_native_1.Text className="mt-1 font-sans-semibold text-sm text-body dark:text-night-body">
          2. Tap capture to take a photo
        </react_native_1.Text>
        <react_native_1.Text className="mt-1 font-sans-semibold text-sm text-body dark:text-night-body">
          3. Verify to finish enrollment
        </react_native_1.Text>
      </react_native_1.View>

      <react_native_1.View className="mt-5 flex-row gap-3">
        {!capturedPhotoUri ? (<react_native_1.TouchableOpacity activeOpacity={0.85} onPress={handleCapture} className="flex-1 items-center rounded-xl bg-[#5E0006] px-4 py-3">
            <react_native_1.Text className="font-sans-semibold text-sm text-white">
              {isCapturing ? "Capturing..." : "Capture Face"}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>) : (<>
            <react_native_1.TouchableOpacity activeOpacity={0.85} onPress={handleRetake} className="flex-1 items-center rounded-xl border border-divider bg-background px-4 py-3 dark:border-night-border dark:bg-night-background">
              <react_native_1.Text className="font-sans-semibold text-sm text-body dark:text-night-body">Retake</react_native_1.Text>
            </react_native_1.TouchableOpacity>
            <react_native_1.TouchableOpacity activeOpacity={0.85} onPress={handleVerify} className="flex-1 items-center rounded-xl bg-[#5E0006] px-4 py-3">
              <react_native_1.Text className="font-sans-semibold text-sm text-white">
                {isVerifying ? "Verifying..." : "Verify Face"}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </>)}
      </react_native_1.View>

      {isVerified && (<react_native_1.View className="mt-4 flex-row items-center rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <vector_icons_1.MaterialIcons name="check-circle" size={20} color="#15803D"/>
          <react_native_1.Text className="ml-2 font-sans-semibold text-sm text-green-700">
            Face verified successfully.
          </react_native_1.Text>
        </react_native_1.View>)}
    </react_native_1.View>);
}
