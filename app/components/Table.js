import React from 'react';

import MainHeaderComponent from './header/Main';

class TableComponent extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-12 col-xs-12 col-sm-12 col-lg-12">
                    <div className="panel panel-info panel-table">
                        <div className="panel-heading">
                            <h3 className="panel-title">Servers</h3>
                        </div>
                        <div className="panel-body">
                            <table className="table">
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TableComponent;