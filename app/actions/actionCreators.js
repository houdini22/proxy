// message received
export function messageReceived(message) {
    return {
        type: "MESSAGE_RECEIVED",
        message
    };
}

// user logged in
export function userLoggedIn(nick) {
    return {
        type: "USER_LOGGED_IN",
        nick
    };
}

export function userClick(nick) {
    return {
        type: 'USER_CLICK',
        nick
    };
}

export function windowState(state) {
    return {
        type: 'WINDOW_STATE',
        state
    };
}

export function activeTabClicked(tab) {
    return {
        type: 'ACTIVE_TAB_CLICKED',
        tab
    };
}

export function channelsFetched(channels) {
    return {
        type: 'CHANNELS_FETCHED',
        channels
    };
}

export function pendingMessages(data) {
    return {
        type: 'PENDING_MESSAGE_INC',
        channel: data.channel,
        reset: data.reset,
        important: data.important
    };
}