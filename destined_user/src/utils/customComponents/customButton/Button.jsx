import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, View} from 'react-native';
import {globalStyles} from '../../../styles/globalStyles';
import {theme} from '../../../styles/theme';

const Button = ({
  onPress,
  title,
  loading,
  style,
  textStyle,
  width,
  disabled,
  backgroundColor,
  textColor,
}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
          globalStyles.buttonPrimary,
          style,
          {
            width: width || 'auto',
            backgroundColor: disabled ? theme.colors.gray : backgroundColor,
          },
        ]}
        activeOpacity={disabled ? 1 : 0.7}>
        {loading ? (
          <ActivityIndicator color={textColor} size={width * 0.06} />
        ) : (
          <Text
            style={[globalStyles.buttonTextPrimary, textStyle, {color: textColor}]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;
