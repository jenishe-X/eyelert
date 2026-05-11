"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trips = Trips;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
function Trips() {
    return (<react_native_1.View className="flex-1 items-center justify-center px-6">
      <react_native_1.Text className="text-center font-sans-bold text-2xl text-heading dark:text-night-heading">
        Trips
      </react_native_1.Text>
      <react_native_1.Text className="mt-2 text-center font-sans text-base text-body dark:text-night-body">
        This is the trips screen.
      </react_native_1.Text>
    </react_native_1.View>);
}
