import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'react-native-linear-gradient';
import {initializeSocket} from '../../utils/customSocket/Socket'; 
import {useDispatch} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark'
        ? theme.darkMode.gradientPrimary
        : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const token = await AsyncStorage.getItem('authToken');

        if (token) {
          // Initialize socket connection if token exists
          initializeSocket(token);

          navigation.reset({
            index: 0,
            routes: [{name: 'Main'}],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'OnBoard'}],
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
        navigation.reset({
          index: 0,
          routes: [{name: 'OnBoard'}],
        });
      }
    };

    checkSession();
  }, [navigation, dispatch]);

  return (
    <View style={[globalStyles.container, styles.primaryContainer]}>
      <Animatable.View
        animation="fadeIn"
        duration={2000}
        style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={
            isDark
              ? [
                  theme.darkMode.gradientPrimary,
                  theme.darkMode.gradientSecondary,
                ]
              : [
                  theme.lightMode.gradientPrimary,
                  theme.lightMode.gradientSecondary,
                ]
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <Animatable.View
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          duration={3000}
          style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={
              isDark
                ? [theme.darkMode.gradientPrimary, 'transparent']
                : [theme.lightMode.gradientPrimary, 'transparent']
            }
            start={{x: 0.8, y: 0}}
            end={{x: 0.2, y: 1}}
            style={StyleSheet.absoluteFill}
          />
        </Animatable.View>
      </Animatable.View>

      <Animatable.View
        animation="fadeIn"
        duration={2000}
        delay={500}
        style={styles.secondaryContainer}>
        <Animatable.View
          animation="zoomIn"
          duration={1500}
          delay={300}
          style={styles.imgContainer}>
          <Animatable.Image
            source={require('../../assets/splashScreen/splash-logo.png')}
            animation="pulse"
            duration={2000}
            delay={1000}
            iterationCount="infinite"
            easing="ease-out"
            style={styles.Img}
          />
          <View style={styles.overlay}>
            <Animatable.Text
              style={[
                styles.splashTitle,
                {color: isDark ? theme.colors.white : theme.colors.dark},
              ]}
              animation="bounceIn"
              delay={800}
              duration={1200}>
              Destined
            </Animatable.Text>
            <Animatable.Text
              style={[
                styles.splashDescription,
                {color: isDark ? theme.colors.white : theme.colors.error},
              ]}
              animation="fadeInUp"
              delay={1200}
              duration={1500}>
              Online Dating App
            </Animatable.Text>
          </View>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  secondaryContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.gap(2),
  },

  imgContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Img: {
    width: width * 0.9,
    height: height * 0.54,
  },

  splashTitle: {
    fontSize: theme.typography.fontSize.xxl,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamilyBold,
  },

  splashDescription: {
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamilyRegular,
  },
});
