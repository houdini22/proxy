export default function sessionChanged(state = {}, action) {
    switch (action.type) {
        case 'LOGGED_IN':
            return {
                isLoggedIn: action.isLoggedIn,
                user: action.user
            };

        default:
            return state
    }
}