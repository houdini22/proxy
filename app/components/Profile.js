import React from 'react';
import {
    Form,
    FormGroup,
    Col,
    Button,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import MainHeaderComponent from './header/Main';
import Permission from './Permission';
import {getFormData} from '../helpers/form-helper';

class ProfileComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            import_count: null
        };
    }

    componentWillMount() {
        if (this.props.state.session.isLoggedIn === false) {
            this.props.router.push('/');
        }
    }

    handleImportSubmit(e) {
        e.preventDefault();
        let values = getFormData(e.target);
        this.props.ajax.post('/import', values)
            .then((response) => {
                this.setState({
                    import_count: response.data.count
                });
            })
            .catch((error) => {
                this.setState({
                    import_count: -1
                });
            });
    }

    render() {
        let alert = <div className="alert alert-success">
            <p>
                <i className="fa fa-info-circle"/>
                {this.state.import_count} imported.
            </p>
        </div>;

        return (
            <div className="page page-profile">
                <MainHeaderComponent {...this.props} />
                <div className="container" role="main">
                    <div className="well">
                        Profile
                    </div>
                </div>
                <Permission {...this.props} permission="server.import">
                    <div className="container">
                        <div className="panel panel-default panel-import">
                            <div className="panel-heading">
                                <h3 className="panel-title"><i className="fa fa-upload"/> Import</h3>
                            </div>
                            <div className="panel-body">

                                {alert}

                                <Form horizontal onSubmit={this.handleImportSubmit.bind(this)}>
                                    <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                        <Col componentClass={ControlLabel} sm={3} md={3}>
                                            HTML / text
                                        </Col>
                                        <Col sm={9} md={9}>
                                            <FormControl
                                                name="import_text"
                                                componentClass="textarea"
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                        <Col componentClass={ControlLabel} sm={3} md={3}>

                                        </Col>
                                        <Col sm={9} md={9}>
                                            <Button type="submit" className="btn-xs btn">
                                                Import
                                            </Button>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Permission>
            </div>
        );
    }
}

export default ProfileComponent;