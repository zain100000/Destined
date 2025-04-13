export const theme = {
  colors: {
    primary: '#6454a4',
    secondary: '#645c74',
    tertiary: '#ac949c',
    white: '#FFFFFF',
    dark: '#000000',
    success: '#008000',
    warning: '#FBAE05',
    error: '#ff0000',
    gray: '#999999',
  },

  lightMode: {
    primaryLight: '#6454a4',
    secondaryLight: '#645c74',
    tertiaryLight: '#ac949c',
    gradientPrimary: '#f2fcfc',
    gradientSecondary: '#dee4ec',
  },

  darkMode: {
    primaryDark: '#21005d',
    secondaryDark: '#1d192b',
    tertiaryDark: '#34141c',
    gradientPrimary: '#1c052e',
    gradientSecondary: '#14043c',
  },

  typography: {
    fontFamilyBold: 'WorkSans-Bold',
    fontFamilyLight: 'WorkSans-Medium',
    fontFamilyMedium: 'WorkSans-Medium',
    fontFamilyRegular: 'WorkSans-Regular',
    fontFamilySemiBold: 'WorkSans-SemiBold',
    fontSize: {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 22,
      xl: 26,
      xxl: 36,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 40,
    },
  },

  spacing: factor => factor * 8,

  gap: factor => factor * 8,

  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    circle: 50,
  },

  elevation: {
    depth1: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    depth2: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 6,
    },
    depth3: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 12,
    },
  },
};
