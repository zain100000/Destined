export const FRIEND_REQUEST_EVENTS = {
  // ======================
  // Events to EMIT (send)
  // ======================

  // Client emits to send a friend request
  SEND_REQUEST: 'sendFriendRequest',

  // Client emits to accept a friend request
  ACCEPT_REQUEST: 'acceptFriendRequest',

  // Client emits to reject a friend request
  REJECT_REQUEST: 'rejectFriendRequest',

  // Client emits to get pending friend requests
  GET_PENDING_REQUESTS: 'getPendingFriendRequests',

  // Client emits to get friends list
  GET_FRIENDS_LIST: 'getFriendsList',

  // ======================
  // Events to LISTEN (receive)
  // ======================

  // Server emits when user receives a friend request
  RECEIVE_REQUEST: 'receiveFriendRequest',

  // Server emits when a request is accepted
  REQUEST_ACCEPTED: 'friendRequestAccepted',

  // Server emits when a request is rejected
  REQUEST_REJECTED: 'friendRequestRejected',

  // Server emits the list of pending requests
  PENDING_REQUEST_LIST: 'pendingFriendRequestList',

  // Server emits the friends list
  FRIENDS_LIST: 'friendsList',
};
