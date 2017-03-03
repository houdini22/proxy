import React from 'react';

class Main extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                {React.cloneElement(this.props.children, {...this.props})}
            </div>
        );
    }
}

export default Main;