import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {theme} from '../styles/theme';

/* Shared Imports */
import Splash from '../screens/shared/Splash';
import OnBoarding from '../screens/shared/OnBoarding';

/* Auth Imports */
import Signin from '../screens/auth/Signin';
import Signup from '../screens/auth/Signup';

// Main Imports
import BottomNavigator from './bottomNavigator/BottomNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [statusBarColor, setStatusBarColor] = useState(theme.colors.primary);

  return (
    <>
      <StatusBar backgroundColor={statusBarColor} barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        {/* Shared Routes */}
        <Stack.Screen name="Splash">
          {props => <Splash {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="OnBoard">
          {props => (
            <OnBoarding {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        {/* Auth Routes */}
        <Stack.Screen name="Signin">
          {props => <Signin {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>
        <Stack.Screen name="Signup">
          {props => <Signup {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        {/* Main Routes */}
        <Stack.Screen name="Main">
          {props => (
            <BottomNavigator {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
