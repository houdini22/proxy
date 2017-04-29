import React from 'react';

class Permission extends React.Component {
    getUserPermissions() {
        if (!!this.props.state.session.user.permissions)
            return this.props.state.session.user.permissions;
        else
            return {};
    }

    hasPermission() {
        let permission = this.getUserPermissions()[this.props.permission];
        if (this.props.value === false) {
            return !permission;
        }
        return permission;
    }

    render() {
        if (this.hasPermission()) {
            return this.props.children;
        }
        return null;
    }
}

export default Permission;