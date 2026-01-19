import { Pressable, Text } from "react-native";
import { COLORS } from "@/constants/colors.js";

const Button = ({ title, onPress, disabled = false, style = {} }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled} // disable Pressable when needed
      style={[
        {
          backgroundColor: disabled ? COLORS.textLight : COLORS.primary,
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginVertical: 8,
          opacity: disabled ? 0.6 : 1, // visual cue
        },
        style, // merge additional styles passed from parent
      ]}
    >
      <Text
        style={{
          color: COLORS.white,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;
