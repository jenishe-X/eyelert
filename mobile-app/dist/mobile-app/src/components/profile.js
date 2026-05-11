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
exports.Profile = Profile;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const DRIVER_PROFILE_STORAGE_KEY = "driver-profile";
function validateName(value, label) {
    const trimmed = value.trim();
    if (!trimmed)
        return `${label} is required.`;
    if (trimmed.length < 2)
        return `${label} must be at least 2 characters.`;
    return "";
}
function validateNickname(value) {
    const trimmed = value.trim();
    if (!trimmed)
        return "Nickname is required.";
    if (trimmed.length < 2)
        return "Nickname must be at least 2 characters.";
    if (trimmed.length > 20)
        return "Nickname must not exceed 20 characters.";
    return "";
}
function validatePhoneNumber(value) {
    const trimmed = value.trim();
    if (!trimmed)
        return "Phone number is required.";
    const digitsOnly = trimmed.replace(/\D/g, "");
    if (digitsOnly.length !== 11)
        return "Phone number must be exactly 11 digits.";
    if (!/^\d{11}$/.test(digitsOnly))
        return "Enter digits only for phone number.";
    return "";
}
function getProfileErrors(params) {
    return {
        driverName: validateName(params.driverName, "Name"),
        driverNickname: validateNickname(params.driverNickname),
        emergencyContactName: validateName(params.emergencyContactName, "Contact name"),
        emergencyContactNumber: validatePhoneNumber(params.emergencyContactNumber),
    };
}
function Profile({ onNicknameChange, onOpenFaceEnrollment }) {
    const [driverName, setDriverName] = (0, react_1.useState)("Juan Dela Cruz");
    const [driverNickname, setDriverNickname] = (0, react_1.useState)("Driver");
    const [emergencyContactName, setEmergencyContactName] = (0, react_1.useState)("Maria Dela Cruz");
    const [emergencyContactNumber, setEmergencyContactNumber] = (0, react_1.useState)("+63 912 345 6789");
    const [isProfileLoaded, setIsProfileLoaded] = (0, react_1.useState)(false);
    const [errors, setErrors] = (0, react_1.useState)({
        driverName: "",
        driverNickname: "",
        emergencyContactName: "",
        emergencyContactNumber: "",
    });
    (0, react_1.useEffect)(() => {
        const loadProfile = async () => {
            try {
                const savedProfile = await async_storage_1.default.getItem(DRIVER_PROFILE_STORAGE_KEY);
                if (!savedProfile) {
                    setIsProfileLoaded(true);
                    return;
                }
                const parsedProfile = JSON.parse(savedProfile);
                setDriverName(parsedProfile.driverName ?? "Juan Dela Cruz");
                setDriverNickname(parsedProfile.driverNickname ?? "JD");
                setEmergencyContactName(parsedProfile.emergencyContactName ?? "Maria Dela Cruz");
                setEmergencyContactNumber(parsedProfile.emergencyContactNumber ?? "+63 912 345 6789");
            }
            catch (error) {
                console.warn("Failed to load driver profile from local storage.", error);
            }
            finally {
                setIsProfileLoaded(true);
            }
        };
        loadProfile();
    }, []);
    (0, react_1.useEffect)(() => {
        setErrors(getProfileErrors({
            driverName,
            driverNickname,
            emergencyContactName,
            emergencyContactNumber,
        }));
    }, [driverName, driverNickname, emergencyContactName, emergencyContactNumber]);
    (0, react_1.useEffect)(() => {
        if (!isProfileLoaded)
            return;
        const hasValidationErrors = Object.values(errors).some(Boolean);
        if (hasValidationErrors)
            return;
        const saveProfile = async () => {
            try {
                await async_storage_1.default.setItem(DRIVER_PROFILE_STORAGE_KEY, JSON.stringify({
                    driverName,
                    driverNickname,
                    emergencyContactName,
                    emergencyContactNumber,
                }));
            }
            catch (error) {
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
    (0, react_1.useEffect)(() => {
        onNicknameChange(driverNickname);
    }, [driverNickname, onNicknameChange]);
    const inputClassName = "mt-1 h-11 rounded-xl border border-divider bg-background px-3 py-0 font-sans text-base text-body dark:border-night-border dark:bg-night-background dark:text-night-body";
    return (<react_native_1.View className="flex-1 bg-background px-6 py-8 dark:bg-night-background" style={{ marginTop: 50, marginBottom: 10 }}>
      <react_native_1.Text className="font-sans-bold text-2xl text-heading dark:text-night-heading">
        Driver Profile
      </react_native_1.Text>

      <react_native_1.View className="mt-6 rounded-2xl border border-divider bg-surface p-5 dark:border-night-border dark:bg-night-surface">
        <react_native_1.Text className="font-sans-semibold text-sm uppercase tracking-wide text-muted dark:text-night-muted">
          Driver Information
        </react_native_1.Text>

        <react_native_1.View className="mt-4">
          <react_native_1.Text className="font-sans text-xs text-muted dark:text-night-muted">Name</react_native_1.Text>
          <react_native_1.TextInput value={driverName} onChangeText={setDriverName} placeholder="Enter driver name" placeholderTextColor="#9CA3AF" textAlignVertical="center" className={inputClassName}/>
          {!!errors.driverName && (<react_native_1.Text className="mt-1 font-sans text-xs text-red-500">{errors.driverName}</react_native_1.Text>)}
        </react_native_1.View>

        <react_native_1.View className="mt-4">
          <react_native_1.Text className="font-sans text-xs text-muted dark:text-night-muted">Nickname</react_native_1.Text>
          <react_native_1.TextInput value={driverNickname} onChangeText={setDriverNickname} placeholder="Enter nickname" placeholderTextColor="#9CA3AF" textAlignVertical="center" className={inputClassName}/>
          {!!errors.driverNickname && (<react_native_1.Text className="mt-1 font-sans text-xs text-red-500">{errors.driverNickname}</react_native_1.Text>)}
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View className="mt-5 rounded-2xl border border-divider bg-surface p-5 dark:border-night-border dark:bg-night-surface">
        <react_native_1.Text className="font-sans-semibold text-sm uppercase tracking-wide text-muted dark:text-night-muted">
          Emergency Contact
        </react_native_1.Text>

        <react_native_1.View className="mt-4">
          <react_native_1.Text className="font-sans text-xs text-muted dark:text-night-muted">Contact Name</react_native_1.Text>
          <react_native_1.TextInput value={emergencyContactName} onChangeText={setEmergencyContactName} placeholder="Enter contact name" placeholderTextColor="#9CA3AF" textAlignVertical="center" className={inputClassName}/>
          {!!errors.emergencyContactName && (<react_native_1.Text className="mt-1 font-sans text-xs text-red-500">
              {errors.emergencyContactName}
            </react_native_1.Text>)}
        </react_native_1.View>

        <react_native_1.View className="mt-4">
          <react_native_1.Text className="font-sans text-xs text-muted dark:text-night-muted">Phone Number</react_native_1.Text>
          <react_native_1.TextInput value={emergencyContactNumber} onChangeText={setEmergencyContactNumber} placeholder="Enter phone number" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" returnKeyType="done" blurOnSubmit onSubmitEditing={react_native_1.Keyboard.dismiss} textAlignVertical="center" className={inputClassName}/>
          {!!errors.emergencyContactNumber && (<react_native_1.Text className="mt-1 font-sans text-xs text-red-500">
              {errors.emergencyContactNumber}
            </react_native_1.Text>)}
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
}
