import React, { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DRIVER_PROFILE_STORAGE_KEY = "driver-profile";
type ProfileErrors = {
  driverName?: string;
  driverNickname?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
};

function validateName(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) return `${label} is required.`;
  if (trimmed.length < 2) return `${label} must be at least 2 characters.`;
  return "";
}

function validateNickname(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Nickname is required.";
  if (trimmed.length < 2) return "Nickname must be at least 2 characters.";
  if (trimmed.length > 20) return "Nickname must not exceed 20 characters.";
  return "";
}

function validatePhoneNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Phone number is required.";
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (digitsOnly.length !== 11) return "Phone number must be exactly 11 digits.";
  if (!/^\d{11}$/.test(digitsOnly)) return "Enter digits only for phone number.";
  return "";
}

function getProfileErrors(params: {
  driverName: string;
  driverNickname: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
}): ProfileErrors {
  return {
    driverName: validateName(params.driverName, "Name"),
    driverNickname: validateNickname(params.driverNickname),
    emergencyContactName: validateName(params.emergencyContactName, "Contact name"),
    emergencyContactNumber: validatePhoneNumber(params.emergencyContactNumber),
  };
}

export function Profile({ onNicknameChange }: { onNicknameChange: (nickname: string) => void }) {
  const [driverName, setDriverName] = useState("Juan Dela Cruz");
  const [driverNickname, setDriverNickname] = useState("Driver");
  const [emergencyContactName, setEmergencyContactName] =
    useState("Maria Dela Cruz");
  const [emergencyContactNumber, setEmergencyContactNumber] =
    useState("+63 912 345 6789");
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [errors, setErrors] = useState<ProfileErrors>({
    driverName: "",
    driverNickname: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem(DRIVER_PROFILE_STORAGE_KEY);
        if (!savedProfile) {
          setIsProfileLoaded(true);
          return;
        }

        const parsedProfile: {
          driverName?: string;
          driverNickname?: string;
          emergencyContactName?: string;
          emergencyContactNumber?: string;
        } = JSON.parse(savedProfile);

        setDriverName(parsedProfile.driverName ?? "Juan Dela Cruz");
        setDriverNickname(parsedProfile.driverNickname ?? "JD");
        setEmergencyContactName(parsedProfile.emergencyContactName ?? "Maria Dela Cruz");
        setEmergencyContactNumber(parsedProfile.emergencyContactNumber ?? "+63 912 345 6789");
      } catch (error) {
        console.warn("Failed to load driver profile from local storage.", error);
      } finally {
        setIsProfileLoaded(true);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    setErrors(
      getProfileErrors({
        driverName,
        driverNickname,
        emergencyContactName,
        emergencyContactNumber,
      })
    );
  }, [driverName, driverNickname, emergencyContactName, emergencyContactNumber]);

  useEffect(() => {
    if (!isProfileLoaded) return;
    const hasValidationErrors = Object.values(errors).some(Boolean);
    if (hasValidationErrors) return;

    const saveProfile = async () => {
      try {
        await AsyncStorage.setItem(
          DRIVER_PROFILE_STORAGE_KEY,
          JSON.stringify({
            driverName,
            driverNickname,
            emergencyContactName,
            emergencyContactNumber,
          })
        );
      } catch (error) {
        console.warn("Failed to save driver profile to local storage.", error);
      }
    };

    saveProfile();
  }, [
    driverName,
    driverNickname,
    emergencyContactName,
    emergencyContactNumber,
    isProfileLoaded,
    errors,
  ]);

  useEffect(() => {
    onNicknameChange(driverNickname);
  }, [driverNickname, onNicknameChange]);

  const inputClassName =
    "mt-1 h-11 rounded-xl border border-divider bg-background px-3 py-0 font-sans text-base text-body dark:border-night-border dark:bg-night-background dark:text-night-body";

  return (
    <View className="flex-1 bg-background px-6 py-8 dark:bg-night-background"
    style={{ marginTop: 50, marginBottom: 10 }}
    >
      <Text className="font-sans-bold text-2xl text-heading dark:text-night-heading">
        Driver Profile
      </Text>

      <View className="mt-6 rounded-2xl border border-divider bg-surface p-5 dark:border-night-border dark:bg-night-surface">
        <Text className="font-sans-semibold text-sm uppercase tracking-wide text-muted dark:text-night-muted">
          Driver Information
        </Text>

        <View className="mt-4">
          <Text className="font-sans text-xs text-muted dark:text-night-muted">Name</Text>
          <TextInput
            value={driverName}
            onChangeText={setDriverName}
            placeholder="Enter driver name"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="center"
            className={inputClassName}
          />
          {!!errors.driverName && (
            <Text className="mt-1 font-sans text-xs text-red-500">{errors.driverName}</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="font-sans text-xs text-muted dark:text-night-muted">Nickname</Text>
          <TextInput
            value={driverNickname}
            onChangeText={setDriverNickname}
            placeholder="Enter nickname"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="center"
            className={inputClassName}
          />
          {!!errors.driverNickname && (
            <Text className="mt-1 font-sans text-xs text-red-500">{errors.driverNickname}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        className="mt-5 flex-row items-center justify-between rounded-2xl border border-divider bg-surface px-5 py-4 dark:border-night-border dark:bg-night-surface"
      >
        <View className="flex-row items-center">
          <View className="mr-3 rounded-lg bg-[#F6EDEE] p-2">
            <MaterialIcons name="face-retouching-natural" size={22} color="#5E0006" />
          </View>
          <View>
            <Text className="font-sans-semibold text-base text-body dark:text-night-body">
              Face Enrollment
            </Text>
            <Text className="font-sans text-xs text-muted dark:text-night-muted">
              Set up your face profile
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#5E0006" />
      </TouchableOpacity>

      <View className="mt-5 rounded-2xl border border-divider bg-surface p-5 dark:border-night-border dark:bg-night-surface">
        <Text className="font-sans-semibold text-sm uppercase tracking-wide text-muted dark:text-night-muted">
          Emergency Contact
        </Text>

        <View className="mt-4">
          <Text className="font-sans text-xs text-muted dark:text-night-muted">Contact Name</Text>
          <TextInput
            value={emergencyContactName}
            onChangeText={setEmergencyContactName}
            placeholder="Enter contact name"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="center"
            className={inputClassName}
          />
          {!!errors.emergencyContactName && (
            <Text className="mt-1 font-sans text-xs text-red-500">
              {errors.emergencyContactName}
            </Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="font-sans text-xs text-muted dark:text-night-muted">Phone Number</Text>
          <TextInput
            value={emergencyContactNumber}
            onChangeText={setEmergencyContactNumber}
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={Keyboard.dismiss}
            textAlignVertical="center"
            className={inputClassName}
          />
          {!!errors.emergencyContactNumber && (
            <Text className="mt-1 font-sans text-xs text-red-500">
              {errors.emergencyContactNumber}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
