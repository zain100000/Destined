import {theme} from './theme';
import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

const scale = size => width * (size / 375);
const verticalScale = size => height * (size / 812);
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textPrimary: {
    color: theme.lightMode.primaryLight,
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  textSecondary: {
    color: theme.lightMode.secondaryLight,
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  textWhite: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  textBlack: {
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamilySemiBold,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  textError: {
    color: theme.colors.error,
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: moderateScale(theme.typography.fontSize.sm),
    left: width * 0.014
  },

  buttonPrimary: {
    backgroundColor: theme.colors.white,
    paddingVertical: verticalScale(theme.spacing(2)),
    paddingHorizontal: scale(theme.spacing(4)),
    borderRadius: moderateScale(theme.borderRadius.large),
    alignItems: 'center',
    minWidth: width * 0.4,
    minHeight: height * 0.06,
  },

  buttonTextPrimary: {
    color: theme.lightMode.primaryLight,
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  inputContainer: {
    marginVertical: verticalScale(theme.spacing(1.5)),
  },

  input: {
    backgroundColor: theme.colors.white,
    borderWidth: moderateScale(3),
    borderColor: theme.lightMode.primaryLight,
    borderRadius: moderateScale(theme.borderRadius.large),
    paddingVertical: verticalScale(theme.spacing(1.6)),
    paddingHorizontal: scale(theme.spacing(4.5)),
    fontSize: moderateScale(theme.typography.fontSize.md),
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.dark,
    minHeight: height * 0.06,
  },

  inputLabel: {
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: moderateScale(theme.typography.fontSize.md),
    left: width * 0.014,
  },

  card: {
    borderRadius: moderateScale(theme.borderRadius.circle),
    padding: moderateScale(theme.spacing(0.14)),
    gap: verticalScale(theme.gap(1)),
    ...theme.elevation.depth2,
    minWidth: width * 0.9,
  },

  cardTitle: {
    fontFamily: theme.typography.fontFamilySemiBold,
    fontSize: moderateScale(theme.typography.fontSize.md),
    color: theme.colors.dark,
    marginBottom: verticalScale(theme.spacing(0.44)),
  },

  cardContent: {
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: moderateScale(theme.typography.fontSize.md),
    color: theme.lightMode.secondaryLight,
    lineHeight: moderateScale(theme.typography.lineHeight.sm),
  },

  divider: {
    height: verticalScale(1),
    backgroundColor: theme.lightMode.primaryLight,
    marginVertical: verticalScale(theme.spacing(0.9)),
  },
});
