import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../store/userStore';
import { useAppLanguageStore } from '../store/appLanguageStore';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const { setUserName } = useUserStore();
  const { t } = useAppLanguageStore();
  const inputRef = useRef<TextInput>(null);

  const isValid = name.trim().length >= 2;

  const handleContinue = () => {
    if (isValid) {
      setUserName(name.trim());
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Emoji + Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>👋</Text>
            <Text style={styles.title}>{t('onboarding.title')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
          </View>

          {/* Input */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            style={styles.inputWrapper}
          >
            <TextInput
              ref={inputRef}
              value={name}
              onChangeText={setName}
              placeholder={t('onboarding.placeholder')}
              placeholderTextColor="rgba(0,104,80,0.35)"
              style={styles.input}
              autoFocus
              maxLength={30}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </TouchableOpacity>

          {/* Hint */}
          <Text style={styles.hint}>{t('onboarding.hint')}</Text>

          {/* Button — dans le scroll, naturellement sous le champ */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isValid}
            activeOpacity={0.8}
            style={[styles.btnWrapper, !isValid && styles.btnDisabled]}
          >
            <LinearGradient
              colors={isValid ? ['#006850', '#90efcd'] : ['#b0c8c0', '#c8e8e0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>{t('onboarding.continue')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#d6fff4',
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#006850',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(0,54,46,0.65)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#90efcd',
    shadowColor: '#00362e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 10,
  },
  input: {
    fontSize: 20,
    fontWeight: '600',
    color: '#006850',
    paddingHorizontal: 20,
    paddingVertical: 18,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    color: 'rgba(0,104,80,0.45)',
    marginBottom: 32,
    textAlign: 'center',
  },
  btnWrapper: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#00362e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  btn: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
