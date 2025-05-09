import socketManager from '../SocketManager';
import {FRIEND_REQUEST_EVENTS} from '../socketEvents/SocketEvents';

// ======================
// Events to EMIT (send)
// ======================

// Send a friend request
export const sendFriendRequest = data => {
  socketManager.emit(FRIEND_REQUEST_EVENTS.SEND_REQUEST, data);
};

// Accept a friend request
export const acceptFriendRequest = data => {
  socketManager.emit(FRIEND_REQUEST_EVENTS.ACCEPT_REQUEST, data);
};

// Reject a friend request
export const rejectFriendRequest = data => {
  socketManager.emit(FRIEND_REQUEST_EVENTS.REJECT_REQUEST, data);
};

// Get pending friend requests
export const getPendingFriendRequests = data => {
  socketManager.emit(FRIEND_REQUEST_EVENTS.GET_PENDING_REQUESTS, data);
};

// Get the friends list
export const getFriendsList = data => {
  socketManager.emit(FRIEND_REQUEST_EVENTS.GET_FRIENDS_LIST, data);
};

// ======================
// Events to LISTEN (receive)
// ======================

// Listen for a received friend request
export const listenToReceiveFriendRequest = callback => {
  socketManager.on(FRIEND_REQUEST_EVENTS.RECEIVE_REQUEST, callback);
};

// Listen for when a friend request is accepted
export const listenToFriendRequestAccepted = callback => {
  socketManager.on(FRIEND_REQUEST_EVENTS.REQUEST_ACCEPTED, callback);
};

// Listen for when a friend request is rejected
export const listenToFriendRequestRejected = callback => {
  socketManager.on(FRIEND_REQUEST_EVENTS.REQUEST_REJECTED, callback);
};

// Listen for pending friend requests
export const listenToPendingFriendRequestList = callback => {
  socketManager.on(FRIEND_REQUEST_EVENTS.PENDING_REQUEST_LIST, callback);
};

// Listen for the friends list
export const listenToFriendsList = callback => {
  socketManager.on(FRIEND_REQUEST_EVENTS.FRIENDS_LIST, callback);
};

// ======================
// Clean up (to remove listeners)
// ======================

// Remove the listener for received friend requests
export const removeReceiveFriendRequestListener = () => {
  socketManager.off(FRIEND_REQUEST_EVENTS.RECEIVE_REQUEST);
};

// Remove the listener for accepted friend requests
export const removeFriendRequestAcceptedListener = () => {
  socketManager.off(FRIEND_REQUEST_EVENTS.REQUEST_ACCEPTED);
};

// Remove the listener for rejected friend requests
export const removeFriendRequestRejectedListener = () => {
  socketManager.off(FRIEND_REQUEST_EVENTS.REQUEST_REJECTED);
};

// Remove the listener for pending friend requests list
export const removePendingFriendRequestListListener = () => {
  socketManager.off(FRIEND_REQUEST_EVENTS.PENDING_REQUEST_LIST);
};

// Remove the listener for friends list
export const removeFriendsListListener = () => {
  socketManager.off(FRIEND_REQUEST_EVENTS.FRIENDS_LIST);
};
