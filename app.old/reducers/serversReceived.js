export default function serversReceived(state = [], action) {
    switch (action.type) {
        case 'SERVERS_RECEIVED':
            return action.servers;

        default:
            return state
    }
}