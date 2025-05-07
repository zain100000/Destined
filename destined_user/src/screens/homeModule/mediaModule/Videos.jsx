import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import {theme} from '../../../styles/theme';
import {globalStyles} from '../../../styles/globalStyles';
import {useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../utils/customComponents/customButton/Button';

const {width, height} = Dimensions.get('screen');

const Videos = () => {
  const route = useRoute();
  const {userDetails} = route.params;
  const {user} = route.params;
  const isCurrentUser = !!user;

  const videoMedia = isCurrentUser
    ? user?.media?.filter(item => item.type === 'VIDEO')
    : userDetails?.media?.filter(item => item.type === 'VIDEO');

  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [paused, setPaused] = useState(true);
  const videoRef = useRef(null);

  const getThumbnailUrl = videoUrl => {
    return videoUrl.replace(
      '/upload/',
      '/upload/w_300,h_300,c_fill,q_auto,f_jpg/',
    );
  };

  const getVideoUrl = videoUrl => {
    return videoUrl.replace('/upload/', '/upload/q_auto,f_auto/');
  };

  const handleFullscreenOpen = videoUrl => {
    const processedUrl = getVideoUrl(videoUrl);
    setFullscreenVideo(processedUrl);
    setPaused(false);
  };

  const handleAddVideo = () => {
    console.log('Add video pressed');
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.primaryContainer]}>
      <View style={styles.sliderContainer}>
        {videoMedia && videoMedia.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {videoMedia.map(item => (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.8}
                style={styles.sliderImageWrapper}
                onPress={() => handleFullscreenOpen(item.url)}>
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{uri: getThumbnailUrl(item.url)}}
                    style={styles.sliderImage}
                    resizeMode="cover"
                  />
                  <View style={styles.playIconOverlay}>
                    <MaterialCommunityIcons
                      name="play-circle"
                      size={width * 0.06}
                      color="rgba(255,255,255,0.9)"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {isCurrentUser && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.sliderImageWrapper, styles.addButtonWrapper]}
                onPress={handleAddVideo}>
                <MaterialCommunityIcons
                  name="plus"
                  size={width * 0.1}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            )}
          </ScrollView>
        ) : isCurrentUser ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateBox}>
              <MaterialCommunityIcons
                name="video"
                size={width * 0.1}
                color={theme.colors.gray}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyStateText}>No videos added yet</Text>
              <Button
                title="Add Videos"
                width={width * 0.45}
                onPress={handleAddVideo}
                backgroundColor={theme.colors.primary}
                textColor={theme.colors.white}
              />
            </View>
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateBox}>
              <MaterialCommunityIcons
                name="video"
                size={width * 0.1}
                color={theme.colors.gray}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyStateText}>No videos added yet</Text>
            </View>
          </View>
        )}
      </View>

      <Modal
        visible={!!fullscreenVideo}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setFullscreenVideo(null);
          setPaused(true);
        }}>
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setFullscreenVideo(null);
              setPaused(true);
            }}>
            <MaterialCommunityIcons
              name="close"
              size={width * 0.06}
              color={theme.colors.dark}
            />
          </TouchableOpacity>
          <Video
            ref={videoRef}
            source={{uri: fullscreenVideo}}
            style={styles.fullscreenVideo}
            resizeMode="contain"
            controls={true}
            paused={paused}
            fullscreen={false}
            ignoreSilentSwitch="obey"
            playWhenInactive={false}
            playInBackground={false}
            onLoad={() => {
              setPaused(false);
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Videos;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    paddingTop: height * 0.02,
  },

  sliderContainer: {
    minHeight: width * 0.3,
  },

  horizontalScroll: {
    paddingLeft: width * 0.03,
    alignItems: 'center',
    paddingRight: width * 0.03,
  },

  sliderImageWrapper: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: width * 0.03,
    backgroundColor: theme.colors.lightGray,
  },

  sliderImage: {
    width: width * 0.25,
    height: width * 0.25,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
  },

  emptyStateBox: {
    width: '100%',
    alignItems: 'center',
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.lightBackground,
    padding: height * 0.04,
  },

  emptyIcon: {
    marginBottom: height * 0.015,
  },

  emptyStateText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.gray,
    marginBottom: height * 0.02,
    textAlign: 'center',
  },

  thumbnailContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  playIconOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: theme.borderRadius.circle,
    padding: 5,
  },

  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },

  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },

  closeButton: {
    position: 'absolute',
    top: height * 0.04,
    right: width * 0.04,
    zIndex: 10,
    backgroundColor: theme.lightMode.gradientPrimary,
    borderRadius: theme.borderRadius.circle,
    padding: height * 0.012,
  },
});
