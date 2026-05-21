import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GriotButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

export const GriotButton: React.FC<GriotButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  className = '',
  textClassName = '',
  disabled = false,
}) => {
  if (variant === 'primary') {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={disabled} className={`rounded-full shadow-griot ${className}`} style={{ borderRadius: 999, opacity: disabled ? 0.5 : 1 }}>
        <LinearGradient
          colors={['#006850', '#90efcd']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 999, paddingHorizontal: 32, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
        >
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text className={`text-white font-jakarta-bold text-lg ${textClassName}`}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={onPress} 
        className={`bg-surface-lowest rounded-full px-8 py-4 flex-row justify-center items-center shadow-griot ${className}`}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <Text className={`text-primary font-jakarta-bold text-lg ${textClassName}`}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      className={`rounded-md px-4 py-2 flex-row justify-center items-center ${className}`}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Text className={`text-primary font-jakarta-semibold text-base ${textClassName}`}>{title}</Text>
    </TouchableOpacity>
  );
};
