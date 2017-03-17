import React from 'react';

class Main extends React.Component {
    componentDidMount() {
        this.props.ajax.get('/session')
            .then((response) => {
                // action here
                this.props.actions.sessionChanged(response.data.isLogged, response.data.user);
            })
            .catch((error) => {

            });
    }

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