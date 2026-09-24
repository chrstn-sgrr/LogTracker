import type { ReactNode } from "react";
import type { TextInputProps } from "react-native";
import { Pressable, Text, TextInput, View } from "react-native";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <View
      className={`rounded-2xl border border-zinc-800 bg-zinc-900 p-4 ${className ?? ""}`}
    >
      {children}
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  className,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
}) {
  const state = variant === "primary"
    ? "bg-zinc-50 active:bg-zinc-300"
    : "border border-zinc-700 bg-zinc-900 active:bg-zinc-800";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-xl px-4 py-3.5 items-center ${state} ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
    >
      <Text
        className={`text-base font-semibold ${variant === "primary" ? "text-zinc-950" : "text-zinc-100"}`}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Input({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      className={`rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-base text-zinc-50 ${className ?? ""}`}
      placeholderTextColor="#71717a"
      {...props}
    />
  );
}

export function Title({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Text className={`text-lg font-semibold text-zinc-50 ${className ?? ""}`}>
      {children}
    </Text>
  );
}

export function Muted({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Text className={`text-sm text-zinc-500 ${className ?? ""}`}>{children}</Text>
  );
}
