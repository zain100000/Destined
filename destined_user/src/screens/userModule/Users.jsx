import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  useColorScheme,
  Dimensions,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import FriendCard from '../../utils/customComponents/customCards/customFriendCard/FriendCard';
import {useSelector} from 'react-redux';
import {
  getFriendsList,
  listenToFriendsList,
  removeFriendsListListener,
  listenToFriendRequestAccepted,
  listenToFriendRequestRejected,
  removeFriendRequestAcceptedListener,
  removeFriendRequestRejectedListener,
} from '../../utils/customSocket/socketActions/SocketActions';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

const Users = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const user = useSelector(state => state.auth.user);
  const userId = user?.id;

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getFriendsList({userId});

    const handleFriendsList = res => {
      setFriends(res?.data?.friends ?? []);
      setLoading(false);
    };

    const refreshFriendsList = () => {
      setLoading(true);
      getFriendsList({userId});
    };

    listenToFriendsList(handleFriendsList);
    listenToFriendRequestAccepted(refreshFriendsList);
    listenToFriendRequestRejected(refreshFriendsList);

    return () => {
      removeFriendsListListener();
      removeFriendRequestAcceptedListener();
      removeFriendRequestRejectedListener();
    };
  }, [userId]);

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;

    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [isDark]);

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const handleFriendPress = friend => {
    navigation.navigate('User_Detail', {userDetails: friend});
  };

  return (
    <LinearGradient
      colors={gradientColors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[globalStyles.container, styles.primaryContainer]}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../assets/icons/heart.png')}
          title="Friends"
        />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : friends.length > 0 ? (
        <FlatList
          data={friends}
          numColumns={2}
          keyExtractor={item => item.friendId}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={{gap: width * 0.04, marginBottom: height * 0.02}}
          renderItem={({item}) => (
            <FriendCard
              name={item.name}
              age={item.age}
              image={{uri: item.profilePicture}}
              totalMedia={item.media?.length ?? 0}
              onPress={() => handleFriendPress(item)}
            />
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            No friends yet
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

export default Users;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerContainer: {
    paddingTop: height * 0.02,
  },

  gridContainer: {
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.02,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilySemiBold,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
