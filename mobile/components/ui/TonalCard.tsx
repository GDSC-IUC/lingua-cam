import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TonalCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  variant?: 'low' | 'lowest' | 'primary' | 'tertiary';
}

export const TonalCard: React.FC<TonalCardProps> = ({ 
  children, 
  onPress, 
  className = '', 
  variant = 'lowest' 
}) => {
  let bgClass = 'bg-surface-lowest';
  if (variant === 'low') bgClass = 'bg-surface-low';
  if (variant === 'primary') bgClass = 'bg-primary-container';
  if (variant === 'tertiary') bgClass = 'bg-tertiary-fixed';

  // Le border radius est très large selon The Vibrant Griot
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent 
      activeOpacity={0.8}
      onPress={onPress}
      className={`rounded-[32px] p-6 shadow-griot w-full ${bgClass} ${className}`}
    >
      {children}
    </CardComponent>
  );
};
