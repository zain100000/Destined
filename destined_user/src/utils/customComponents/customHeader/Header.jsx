import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const Header = ({
  title,
  logo,
  rightIcon,
  onPressRight,
  profile,
  onPressProfile,
  isOnline,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          transform: [{scale: scaleAnim}],
          opacity: fadeAnim,
        },
      ]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.tertiary]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.logoContainer}>
          {logo && <Image source={logo} style={styles.logo} />}
          <Text style={[styles.title, {color: theme.colors.white}]}>
            {title}
          </Text>
        </View>

        <View style={styles.rightGroup}>
          {rightIcon && (
            <TouchableOpacity onPress={onPressRight} activeOpacity={0.8}>
              <Image
                source={rightIcon}
                style={[styles.icon, {tintColor: theme.colors.white}]}
              />
            </TouchableOpacity>
          )}

          {profile && (
            <TouchableOpacity onPress={onPressProfile} activeOpacity={0.8}>
              <View style={styles.profileWrapper}>
                <Image source={profile} style={styles.profile} />
                <View
                  style={[
                    styles.onlineIndicator,
                    {
                      backgroundColor: isOnline
                        ? theme.colors.success
                        : theme.colors.disabled,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    borderBottomLeftRadius: theme.borderRadius.large,
    borderBottomRightRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.elevation.depth2,
  },

  gradientBackground: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
  },

  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: width * 0.12,
    height: width * 0.12,
    resizeMode: 'contain',
    top: height * 0.005,
  },

  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },

  icon: {
    width: width * 0.065,
    height: width * 0.065,
    resizeMode: 'contain',
  },

  profileWrapper: {
    position: 'relative',
  },

  profile: {
    width: width * 0.12,
    height: width * 0.12,
    resizeMode: 'cover',
    borderRadius: theme.borderRadius.circle,
    marginLeft: width * 0.02,
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: -height * 0,
    right: -width * 0.0,
    width: width * 0.028,
    height: width * 0.028,
    borderRadius: theme.borderRadius.circle,
  },

  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilyBold,
  },
});
