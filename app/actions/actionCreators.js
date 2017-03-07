// statistics received
export function statisticsReceived(statistics) {
    return {
        type: "STATISTICS_RECEIVED",
        statistics
    };
}

// servers received
export function serversReceived(servers) {
    return {
        type: 'SERVERS_RECEIVED',
        servers
    };
}
