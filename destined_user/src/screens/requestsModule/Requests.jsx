import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  StatusBar,
  useColorScheme,
  Dimensions,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import RequestCard from '../../utils/customComponents/customCards/customRequestCard/RequestCard';
import {
  listenToReceiveFriendRequest,
  removeReceiveFriendRequestListener,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingFriendRequests,
  listenToPendingFriendRequestList,
  removePendingFriendRequestListListener,
  listenToFriendRequestAccepted,
  removeFriendRequestAcceptedListener,
  listenToFriendRequestRejected,
  removeFriendRequestRejectedListener,
} from '../../utils/customSocket/socketActions/SocketActions';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '../../redux/slices/userSlice';
import {useNavigation} from '@react-navigation/native';

const {height} = Dimensions.get('screen');

const Requests = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector(state => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    if (userId) dispatch(getUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;

    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [isDark]);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getPendingFriendRequests({userId});

    const handlePendingRequests = res => {
      setRequests(res?.data?.incoming ?? []);
      setLoading(false);
    };

    const handleNewRequest = res => {
      setLoading(true);
      const request = res?.data;
      if (request?.sender) {
        getPendingFriendRequests({userId});
      }
    };

    const handleRequestAccepted = data => {
      getPendingFriendRequests({userId});
    };

    const handleRequestRejected = data => {
      getPendingFriendRequests({userId});
    };

    listenToPendingFriendRequestList(handlePendingRequests);
    listenToReceiveFriendRequest(handleNewRequest);
    listenToFriendRequestAccepted(handleRequestAccepted);
    listenToFriendRequestRejected(handleRequestRejected);

    return () => {
      removeReceiveFriendRequestListener();
      removePendingFriendRequestListListener();
      removeFriendRequestAcceptedListener();
      removeFriendRequestRejectedListener();
    };
  }, [userId]);

  const showToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const acceptRequest = request => {
    const payload = {
      requestId: request.requestId,
      senderId: request.sender?._id,
      receiverId: userId,
    };

    if (!payload.senderId) {
      showToast('Failed to accept request');
      return;
    }

    acceptFriendRequest(payload);
    showToast('Friend request accepted');
    setRequests(prev => prev.filter(req => req.requestId !== request.requestId));
  };

  const rejectRequest = request => {
    const payload = {
      requestId: request.requestId,
      senderId: request.sender?._id,
      receiverId: userId,
    };

    if (!payload.senderId) {
      showToast('Failed to reject request');
      return;
    }

    rejectFriendRequest(payload);
    showToast('Friend request rejected');
    setRequests(prev => prev.filter(req => req.requestId !== request.requestId));
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('User_Detail', {userDetails: item.sender})
      }>
      <RequestCard
        request={item}
        onAccept={() => acceptRequest(item)}
        onDelete={() => rejectRequest(item)}
      />
    </TouchableOpacity>
  );

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
          title="Requests"
        />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              {color: isDark ? theme.colors.white : theme.colors.primary},
            ]}>
            No Requests Yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={item => item.requestId}
          contentContainerStyle={styles.scrollViewContainer}
        />
      )}
    </LinearGradient>
  );
};

export default Requests;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerContainer: {
    paddingTop: height * 0.02,
  },

  scrollViewContainer: {
    paddingTop: height * 0.024,
    paddingBottom: height * 0.024,
    gap: height * 0.02,
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
