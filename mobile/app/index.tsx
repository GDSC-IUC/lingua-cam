import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAppLanguageStore } from '../store/appLanguageStore';

export default function SplashScreen() {
  const { t } = useAppLanguageStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/language-selection');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground 
      source={require('../assets/bg-splash-screen.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      {/* Overlay vert semi-transparent pour reproduire la maquette */}
      <View style={styles.overlay} />

      {/* Contenu centré */}
      <View style={styles.content}>
        {/* Cercle translucide + logo */}
        <View style={styles.circle}>
          <View style={styles.logoBox}>
            <Image 
              source={require('../assets/logo-app.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Textes en bas */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t('splash.title')}</Text>
        <Text style={styles.subtitle}>{t('splash.speak')}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 104, 80, 0.82)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(214, 255, 244, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 128,
    height: 128,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  textContainer: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitle: {
    color: '#d6fff4',
    fontSize: 18,
    opacity: 0.9,
  },
});
