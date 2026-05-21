import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { View, Platform } from 'react-native';
import { Home, BookOpen, Dumbbell, User } from 'lucide-react-native';
import { useAppLanguageStore } from '../../store/appLanguageStore';

export default function TabLayout() {
  const { t } = useAppLanguageStore();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: 'rgba(214, 255, 244, 0.7)', // surface with opacity
          borderRadius: 30,
          height: 70,
          borderWidth: 0,
          shadowColor: '#00362e',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          ...Platform.select({
            ios: {
              backgroundColor: 'transparent',
            }
          })
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={60} tint="light" style={{ flex: 1, borderRadius: 30, overflow: 'hidden' }} />
          ) : null
        ),
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#006850', // primary
        tabBarInactiveTintColor: '#6B7280', // gray-500
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_700Bold',
          fontSize: 10,
          marginTop: -5,
          marginBottom: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('tabs.library'),
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: t('tabs.practice'),
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
