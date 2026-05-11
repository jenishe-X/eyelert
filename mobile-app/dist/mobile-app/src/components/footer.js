"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = Footer;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const vector_icons_1 = require("@expo/vector-icons");
const FOOTER_ITEMS = [
    { key: "dashboard", icon: "home", label: "Home" },
    { key: "start-alert", icon: "remove-red-eye", label: "Simulate" },
    { key: "trips", icon: "history", label: "Trips" },
    { key: "profile", icon: "person", label: "Profile" },
];
function Footer({ onItemPress }) {
    return (<react_native_1.View className="border-t border-divider bg-surface px-4 py-3 dark:border-night-border dark:bg-night-surface">
      <react_native_1.View className="flex-row items-center justify-between">
        {FOOTER_ITEMS.map((item) => (<react_native_1.TouchableOpacity key={item.key} activeOpacity={0.8} className="min-w-[72px] items-center justify-center py-1" onPress={() => onItemPress?.(item.key)}>
            <vector_icons_1.MaterialIcons name={item.icon} size={24} color="#5E0006"/>
            <react_native_1.Text className="mt-1 text-center font-sans-semibold text-[11px] text-body dark:text-night-body">
              {item.label}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>))}
      </react_native_1.View>
    </react_native_1.View>);
}
