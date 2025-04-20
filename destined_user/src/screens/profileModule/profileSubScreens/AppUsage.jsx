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

const AppUsage = () => {
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
          title="Terms & Conditions"
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
          Guidelines for using LoveLink.
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
          By accessing and using LoveLink, you agree to comply with these Terms
          and Conditions. Please read them carefully before using our services.
        </Text>

        <Text
          style={[
            styles.heading,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          User Conduct
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          Users must treat others with respect, refrain from harassment or
          offensive behavior, and use the platform in a lawful manner.
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
            Do not share misleading information or impersonate others.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons
            name="alert-circle-outline"
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
            Inappropriate content or behavior will result in suspension or
            banning of the account.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          Subscription and Payments
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          LoveLink offers optional premium features through subscriptions.
          Charges apply as per selected plans and are non-refundable unless
          stated otherwise.
        </Text>

        <View style={styles.bulletContainer}>
          <Ionicons
            name="card-outline"
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
            Users can cancel subscriptions anytime via account settings.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          Privacy and Safety
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? theme.colors.white : theme.colors.primary,
            },
          ]}>
          Your privacy is important to us. We encourage you to report any
          suspicious activity. Use caution when sharing personal information.
        </Text>

        <View style={styles.bulletContainer}>
          <Ionicons
            name="shield-outline"
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
            LoveLink is not liable for interactions or outcomes from matches.
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
          For support or inquiries, reach out to us at:
        </Text>

        <View style={styles.contactContainer}>
          <Ionicons
            name="mail-outline"
            size={width * 0.06}
            color={theme.colors.primary}
            style={styles.contactIcon}
          />
          <Text
            style={[
              styles.contactText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            support@lovelinkapp.com
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AppUsage;

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
