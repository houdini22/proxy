export default function statisticsReceived(state = [], action) {
    switch (action.type) {
        case 'STATISTICS_RECEIVED':
            return action.statistics;

        default:
            return state
    }
}