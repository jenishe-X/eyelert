import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type FaceEnrollmentProps = {
  onBack: () => void;
};

export function FaceEnrollment({ onBack }: FaceEnrollmentProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });
      setCapturedPhotoUri(photo?.uri ?? null);
      setIsVerified(false);
    } catch (error) {
      console.warn("Failed to capture face photo.", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setCapturedPhotoUri(null);
    setIsVerified(false);
    setIsVerifying(false);
  };

  const handleVerify = async () => {
    if (!capturedPhotoUri || isVerifying) return;

    try {
      setIsVerifying(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsVerified(true);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-night-background">
        <Text className="font-sans text-base text-body dark:text-night-body">
          Loading camera permission...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        className="flex-1 bg-background px-6 py-8 dark:bg-night-background"
        style={{ marginTop: 50, marginBottom: 10 }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onBack}
          className="mb-4 h-10 w-10 items-center justify-center rounded-full border border-divider bg-surface dark:border-night-border dark:bg-night-surface"
        >
          <MaterialIcons name="arrow-back" size={22} color="#5E0006" />
        </TouchableOpacity>
        <Text className="font-sans-bold text-2xl text-heading dark:text-night-heading">
          Face Enrollment
        </Text>
        <Text className="mt-2 font-sans text-sm text-muted dark:text-night-muted">
          Camera access is required to capture your face profile.
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={requestPermission}
          className="mt-6 items-center rounded-xl bg-[#5E0006] px-4 py-3"
        >
          <Text className="font-sans-semibold text-sm text-white">Allow Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background px-6 py-8 dark:bg-night-background"
      style={{ marginTop: 50, marginBottom: 10 }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onBack}
        className="mb-4 h-10 w-10 items-center justify-center rounded-full border border-divider bg-surface dark:border-night-border dark:bg-night-surface"
      >
        <MaterialIcons name="arrow-back" size={22} color="#5E0006" />
      </TouchableOpacity>

      <Text className="font-sans-bold text-2xl text-heading dark:text-night-heading">
        Face Enrollment
      </Text>
      <Text className="mt-2 font-sans text-sm text-muted dark:text-night-muted">
        Position your face inside the frame, capture, then verify.
      </Text>

      <View className="mt-6 overflow-hidden rounded-2xl border border-divider bg-surface dark:border-night-border dark:bg-night-surface">
        {capturedPhotoUri ? (
          <Image source={{ uri: capturedPhotoUri }} className="h-80 w-full" resizeMode="cover" />
        ) : (
          <CameraView ref={cameraRef} style={{ height: 320, width: "100%" }} facing="front" />
        )}
      </View>

      <View className="mt-4 rounded-2xl border border-divider bg-surface p-4 dark:border-night-border dark:bg-night-surface">
        <Text className="font-sans-semibold text-sm text-body dark:text-night-body">
          1. Align your face in good lighting
        </Text>
        <Text className="mt-1 font-sans-semibold text-sm text-body dark:text-night-body">
          2. Tap capture to take a photo
        </Text>
        <Text className="mt-1 font-sans-semibold text-sm text-body dark:text-night-body">
          3. Verify to finish enrollment
        </Text>
      </View>

      <View className="mt-5 flex-row gap-3">
        {!capturedPhotoUri ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCapture}
            className="flex-1 items-center rounded-xl bg-[#5E0006] px-4 py-3"
          >
            <Text className="font-sans-semibold text-sm text-white">
              {isCapturing ? "Capturing..." : "Capture Face"}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRetake}
              className="flex-1 items-center rounded-xl border border-divider bg-background px-4 py-3 dark:border-night-border dark:bg-night-background"
            >
              <Text className="font-sans-semibold text-sm text-body dark:text-night-body">Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleVerify}
              className="flex-1 items-center rounded-xl bg-[#5E0006] px-4 py-3"
            >
              <Text className="font-sans-semibold text-sm text-white">
                {isVerifying ? "Verifying..." : "Verify Face"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {isVerified && (
        <View className="mt-4 flex-row items-center rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <MaterialIcons name="check-circle" size={20} color="#15803D" />
          <Text className="ml-2 font-sans-semibold text-sm text-green-700">
            Face verified successfully.
          </Text>
        </View>
      )}
    </View>
  );
}
