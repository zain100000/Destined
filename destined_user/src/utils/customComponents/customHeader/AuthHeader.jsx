import React from 'react';
import {Text, StyleSheet, Dimensions} from 'react-native';
import {useColorScheme} from 'react-native';
import {theme} from '../../../styles/theme';
import * as Animatable from 'react-native-animatable';

const {width, height} = Dimensions.get('screen');

const AuthHeader = ({title, description}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Animatable.View
      animation="fadeInDown"
      duration={800}
      style={styles.primaryContainer}>
      <Text
        style={[
          styles.title,
          {color: isDark ? theme.colors.white : theme.colors.dark},
        ]}>
        {title}
      </Text>

      <Text
        style={[
          styles.description,
          {color: isDark ? theme.colors.white : theme.colors.gray},
        ]}>
        {description}
      </Text>
    </Animatable.View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  primaryContainer: {
    marginBottom: height * 0.02,
    padding: height * 0.016,
  },

  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamilyBold,
    marginBottom: height * 0.01,
  },

  description: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
  },
});
