import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function Profile() {
  const [driverName, setDriverName] = useState("Juan Dela Cruz");
  const [driverNickname, setDriverNickname] = useState("JD");
  const [emergencyContactName, setEmergencyContactName] =
    useState("Maria Dela Cruz");
  const [emergencyContactNumber, setEmergencyContactNumber] =
    useState("+63 912 345 6789");

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
            className="mt-1 rounded-xl border border-divider bg-background px-3 py-2 font-sans text-base text-body dark:border-night-border dark:bg-night-background dark:text-night-body"
          />
        </View>

        <View className="mt-4">
          <Text className="font-sans text-xs text-muted dark:text-night-muted">Nickname</Text>
          <TextInput
            value={driverNickname}
            onChangeText={setDriverNickname}
            placeholder="Enter nickname"
            placeholderTextColor="#9CA3AF"
            className="mt-1 rounded-xl border border-divider bg-background px-3 py-2 font-sans text-base text-body dark:border-night-border dark:bg-night-background dark:text-night-body"
          />
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
            className="mt-1 rounded-xl border border-divider bg-background px-3 py-2 font-sans text-base text-body dark:border-night-border dark:bg-night-background dark:text-night-body"
          />
        </View>

        <View className="mt-4">
          <Text className="font-sans text-xs text-muted dark:text-night-muted">Phone Number</Text>
          <TextInput
            value={emergencyContactNumber}
            onChangeText={setEmergencyContactNumber}
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            className="mt-1 rounded-xl border border-divider bg-background px-3 py-2 font-sans text-base text-body dark:border-night-border dark:bg-night-background dark:text-night-body"
          />
        </View>
      </View>
    </View>
  );
}
