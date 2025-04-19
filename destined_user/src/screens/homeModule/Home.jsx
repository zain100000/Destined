import React, {useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  useColorScheme,
  Dimensions,
  View,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '../../redux/slices/userSlice';

const {width, height} = Dimensions.get('screen');

const Home = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const user = useSelector(state => state.auth.user);
  const userProfile = useSelector(state => state.user.user);

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [colorScheme]);

  useEffect(() => {
    if (user && user.id) {
      dispatch(getUser(user.id));
    }
  }, [dispatch, user]);

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
          logo={require('../../assets/icons/heart.png')}
          title="Destined"
          rightIcon={require('../../assets/icons/bell.png')}
          profile={
            userProfile?.profilePicture
              ? {uri: userProfile?.profilePicture}
              : require('../../assets/placeholders/default-avatar.png')
          }
        />
      </View>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.024,
  },
});
