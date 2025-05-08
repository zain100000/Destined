import React, {useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  useColorScheme,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {theme} from '../../styles/theme';
import Home from '../../screens/homeModule/Home';
import Users from '../../screens/userModule/Users';
import Chats from '../../screens/chatModule/Chats';
import Profile from '../../screens/profileModule/Profile';
import LinearGradient from 'react-native-linear-gradient';
import Requests from '../../screens/requestsModule/Requests';

const Tab = createBottomTabNavigator();

const {width, height} = Dimensions.get('screen');

const AnimatedTabIcon = ({focused, source, isDark}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: focused ? 1.2 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={[styles.iconWrapper, {transform: [{scale: scaleValue}]}]}>
      {focused && (
        <LinearGradient
          colors={
            isDark
              ? [
                  theme.darkMode.gradientPrimary,
                  theme.darkMode.gradientSecondary,
                ]
              : [
                  theme.darkMode.gradientPrimary,
                  theme.darkMode.gradientSecondary,
                ]
          }
          style={styles.iconGlow}
          start={{x: 0.2, y: 0.2}}
          end={{x: 0.8, y: 0.8}}
        />
      )}
      <Image
        source={source}
        style={[styles.icon, {width: width * 0.06, height: width * 0.06}]}
      />
    </Animated.View>
  );
};

const BottomNavigator = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark
              ? theme.darkMode.secondaryDark
              : theme.lightMode.gradientPrimary,
            ...theme.elevation.depth3,
          },
        ],
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon
              focused={focused}
              isDark={isDark}
              source={
                focused
                  ? require('../../assets/navigatorIcons/home-filled.png')
                  : require('../../assets/navigatorIcons/home.png')
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="Users"
        component={Users}
        options={{
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon
              focused={focused}
              isDark={isDark}
              source={
                focused
                  ? require('../../assets/navigatorIcons/user-filled.png')
                  : require('../../assets/navigatorIcons/user.png')
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="Requests"
        component={Requests}
        options={{
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon
              focused={focused}
              isDark={isDark}
              source={
                focused
                  ? require('../../assets/navigatorIcons/inbox-filled.png')
                  : require('../../assets/navigatorIcons/inbox.png')
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={Chats}
        options={{
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon
              focused={focused}
              isDark={isDark}
              source={
                focused
                  ? require('../../assets/navigatorIcons/chat-filled.png')
                  : require('../../assets/navigatorIcons/chat.png')
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon
              focused={focused}
              isDark={isDark}
              source={
                focused
                  ? require('../../assets/navigatorIcons/profile-filled.png')
                  : require('../../assets/navigatorIcons/profile.png')
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: width * 0.04,
    right: width * 0.04,
    height: height * 0.085,
    paddingTop: height * 0.02,
  },

  iconWrapper: {
    width: width * 0.04,
    height: height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  icon: {
    width: width * 0.065,
    height: height * 0.035,
    resizeMode: 'contain',
    zIndex: 10,
  },

  iconGlow: {
    position: 'absolute',
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: theme.borderRadius.circle,
    opacity: 0.4,
    zIndex: 1,
  },
});
