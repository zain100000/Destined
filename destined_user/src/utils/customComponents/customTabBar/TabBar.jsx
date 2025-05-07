import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const TabBar = ({tabs, activeTab, onTabChange}) => {
  const colorScheme = useColorScheme();
  const [textWidths, setTextWidths] = useState({});
  const isDark = colorScheme === 'dark';

  const colors = {
    activeText: '#E91E63',
    inactiveText: isDark ? '#FFFFFF' : '#3F51B5',
    underline: isDark ? '#E91E63' : '#3F51B5',
  };

  return (
    <View style={styles.tabContainer}>
      {tabs.map(tab => {
        const isActive = tab.value === activeTab;
        return (
          <TouchableOpacity
            key={tab.value}
            style={styles.tabButton}
            onPress={() => onTabChange(tab.value)}>
            <Icon
              name={tab.icon}
              size={24}
              color={isActive ? colors.activeText : colors.inactiveText}
              style={styles.icon}
            />
            <Text
              onLayout={e => {
                const textWidth = e.nativeEvent.layout.width;
                setTextWidths(prev => ({...prev, [tab.value]: textWidth}));
              }}
              style={[
                styles.tabText,
                {color: isActive ? colors.activeText : colors.inactiveText},
              ]}>
              {tab.label}
            </Text>
            {isActive && (
              <View
                style={[
                  styles.underline,
                  {
                    width: textWidths[tab.value] || 0,
                    backgroundColor: colors.underline,
                  },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    gap: width * 0.08,
    paddingVertical: height * 0.015,
  },

  tabButton: {
    alignItems: 'center',
  },

  icon: {
    marginBottom: height * 0.01,
  },

  tabText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  underline: {
    marginTop: height * 0.008,
    height: height * 0.0034,
  },
});
