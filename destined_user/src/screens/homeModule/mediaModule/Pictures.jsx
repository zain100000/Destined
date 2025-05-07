import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {theme} from '../../../styles/theme';
import {globalStyles} from '../../../styles/globalStyles';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../../../utils/customComponents/customButton/Button';
import {fileUpload} from '../../../redux/slices/uploadMediaSlice';
import CustomModal from '../../../utils/customModals/CustomModal';
import ImageUploadModal from '../../../utils/customModals/ImageUploadModal';
import {useDispatch} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const Pictures = () => {
  const route = useRoute();
  const {userDetails} = route.params;
  const {user} = route.params;
  const isCurrentUser = !!user;
  const dispatch = useDispatch();

  const [imageMedia, setImageMedia] = useState(
    isCurrentUser
      ? user?.media?.filter(item => item.type === 'IMAGE')
      : userDetails?.media?.filter(item => item.type === 'IMAGE'),
  );
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

  const handleFullScreenPress = url => {
    setFullscreenImage(url);
  };

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = async images => {
    setShowImageUploadModal(false);
    const imagePaths = images.map(image => ({uri: image.path}));
    setSelectedImages(imagePaths);

    await handleUploadPicture(imagePaths);
  };

  const handleUploadPicture = async (images = selectedImages) => {
    if (images.length === 0) {
      console.warn('No images selected for upload');
      return;
    }

    setLoading(true);
    setShowAuthModal(true);

    try {
      const resultAction = await dispatch(fileUpload({mediaImages: images}));

      if (fileUpload.fulfilled.match(resultAction)) {
        const newMedia = resultAction.payload.media || [];

        // Update the image media to include the newly uploaded media
        setImageMedia(prevMedia => [...prevMedia, ...newMedia]);

        setShowAuthModal(false);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        setShowAuthModal(false);
      }
    } catch (err) {
      console.error('Error in upload process:', err);
      setShowAuthModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.primaryContainer]}>
      <View style={styles.sliderContainer}>
        {(imageMedia && imageMedia.length > 0) || isCurrentUser ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {imageMedia?.map(item => (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.8}
                style={styles.sliderImageWrapper}
                onPress={() => handleFullScreenPress(item.url)}>
                <Image
                  source={{uri: item.url}}
                  style={styles.sliderImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}

            {isCurrentUser && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.sliderImageWrapper, styles.addButtonWrapper]}
                onPress={handleImagePress}>
                <Icon
                  name="add"
                  size={width * 0.1}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            )}
          </ScrollView>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateBox}>
              <Icon
                name="photo-camera"
                size={width * 0.1}
                color={theme.colors.gray}
              />
              <Text style={styles.emptyStateText}>No pictures added yet</Text>
              {isCurrentUser && (
                <Button
                  title="Add Images"
                  width={width * 0.45}
                  onPress={handleImagePress}
                  backgroundColor={theme.colors.primary}
                  textColor={theme.colors.white}
                />
              )}
            </View>
          </View>
        )}
      </View>

      <Modal
        visible={!!fullscreenImage}
        transparent={true}
        onRequestClose={() => setFullscreenImage(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={0.8}
            onPress={() => setFullscreenImage(null)}>
            <Icon name="close" size={width * 0.06} color={theme.colors.dark} />
          </TouchableOpacity>
          <Image
            source={{uri: fullscreenImage}}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      <CustomModal
        visible={showAuthModal}
        title="Uploading"
        description="Please wait while we upload your file"
        animationSource={require('../../../assets/animations/loading.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Files uploaded successfully"
        animationSource={require('../../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <ImageUploadModal
        visible={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        onImageUpload={handleImageUpload}
        title="Upload Image"
        description="Choose a new profile picture"
      />
    </SafeAreaView>
  );
};

export default Pictures;

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

  addButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
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
    height: width * 0.45,
    alignItems: 'center',
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.lightBackground,
    justifyContent: 'center',
  },

  emptyStateText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.gray,
    marginTop: height * 0.024,
    marginBottom: height * 0.024,
    textAlign: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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

  fullscreenImage: {
    width: width * 1,
    height: height * 1,
  },

  addButton: {
    marginTop: height * 0.02,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.small,
  },

  addButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: theme.typography.fontSize.sm,
  },
});
