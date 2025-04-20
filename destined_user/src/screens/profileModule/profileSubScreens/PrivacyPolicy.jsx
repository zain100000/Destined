import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ScrollView,
  useColorScheme,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../../../styles/theme';
import Header from '../../../utils/customComponents/customHeader/Header';
import {globalStyles} from '../../../styles/globalStyles';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

const PrivacyPolicy = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [colorScheme]);

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[globalStyles.container, styles.primaryContainer]}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../../assets/icons/heart.png')}
          title="Privacy Policy"
        />
      </View>

      <View style={styles.headerTextContainer}>
        <Text
          style={[
            styles.headerDescriptionText,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          How we handle your data at Destined.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text
          style={[
            styles.heading,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          Introduction
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          Welcome to Destined! We care about your privacy and are committed to
          protecting your personal data. This Privacy Policy outlines how we
          collect, use, and protect your information while you connect with
          others through our dating platform.
        </Text>

        <Text
          style={[
            styles.heading,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          Information Collection
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          We collect the following information:
        </Text>

        <View style={styles.bulletContainer}>
          <Ionicons
            name="person-outline"
            size={width * 0.06}
            color={theme.colors.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            Profile Details: Name, age, gender, photos, preferences.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={width * 0.06}
            style={styles.bulletIcon}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.bulletText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            Conversations: Messages exchanged with other users.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons
            name="location-outline"
            size={width * 0.06}
            style={styles.bulletIcon}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.bulletText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            Location Data: To show matches near you.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          How We Use Your Information
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          Your information is used to:
        </Text>

        <View style={styles.bulletContainer}>
          <Ionicons
            name="heart-outline"
            size={width * 0.06}
            style={styles.bulletIcon}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.bulletText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            Match you with compatible users based on your preferences.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons
            name="notifications-outline"
            size={width * 0.06}
            style={styles.bulletIcon}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.bulletText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            Send you updates, match alerts, and important notifications.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={width * 0.06}
            style={styles.bulletIcon}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.bulletText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            Ensure the safety and authenticity of user profiles and
            communications.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          Contact Us
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          If you have any questions about our Privacy Policy, contact us at:
        </Text>

        <View style={styles.contactContainer}>
          <Ionicons
            name="mail-outline"
            size={width * 0.06}
            style={styles.contactIcon}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.contactText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            support@destined.com
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerTextContainer: {
    marginTop: height * 0.04,
    marginHorizontal: width * 0.04,
  },

  headerTitleText: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamilyBold,
  },

  headerDescriptionText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyMedium,
    top: height * 0.01,
  },

  contentContainer: {
    marginTop: height * 0.02,
    marginHorizontal: width * 0.04,
  },

  heading: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilySemiBold,
    marginVertical: height * 0.02,
  },

  description: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    marginBottom: height * 0.02,
    lineHeight: theme.typography.lineHeight.md,
    textAlign: 'justify',
  },

  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.04,
  },

  bulletIcon: {
    right: width * 0.05,
  },

  bulletText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    lineHeight: theme.typography.lineHeight.md,
    textAlign: 'justify',
  },

  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.03,
  },

  contactIcon: {
    marginRight: width * 0.03,
  },

  contactText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    lineHeight: theme.typography.lineHeight.md,
  },
});
