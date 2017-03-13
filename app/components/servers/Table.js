import React from 'react';
import TableRowComponent from './TableRow';
import TablePaginationComponent from './TablePagination';

class TableComponent extends React.Component {
    componentDidMount() {
        this.autoRefresh = false;
    }

    componentWillUnmount() {
        clearInterval(this.autoRefreshInterval);
    }

    handlePrevPageClick(e) {
        e.preventDefault();
        this.props.goToPrevPage();
    }

    handleNextPageClick(e) {
        e.preventDefault();
        this.props.goToNextPage();
    }

    handleButtonAutoRefreshClick(e) {
        e.preventDefault();
        this.props.refresh();
        this.autoRefresh = !this.autoRefresh;
        if (this.autoRefresh) {
            this.autoRefreshInterval = setInterval(() => {
                this.props.refresh();
            }, 30 * 1000);
        } else {
            clearInterval(this.autoRefreshInterval);
        }
        this.forceUpdate();
    }

    render() {
        let servers = this.props.state.servers.data || [];

        let playButtonClassNames;
        if (this.autoRefresh) {
            playButtonClassNames = "btn btn-danger btn-xs";
        } else {
            playButtonClassNames = "btn btn-success btn-xs";
        }

        return (
            <div className="row">
                <div className="col-md-12 col-xs-12 col-sm-12 col-lg-12">
                    <div className="panel panel-primary panel-table">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                <i className="fa fa-server"/> Servers
                            </h3>
                            <div className="panel-tools">
                                <a
                                    href="#"
                                    className={playButtonClassNames}
                                    onClick={this.handleButtonAutoRefreshClick.bind(this)}
                                >
                                    <span className="glyphicon glyphicon-refresh"/>
                                    Auto Refresh
                                </a>
                            </div>
                        </div>
                        <div className="panel-body">
                            <table className="proxy-table table table-condensed table-striped">
                                <thead>
                                <tr>
                                    <th style={{width: "160px"}}>Address</th>
                                    <th style={{width: "120px"}}>Type</th>
                                    <th style={{width: "60px"}}>Status</th>
                                    <th style={{width: "65px"}}>Ping</th>
                                    <th style={{width: "65px"}}>Uptime Ratio</th>
                                    <th style={{width: "100px"}}>Speed</th>
                                    <th style={{width: "100px"}} className="hidden-sm hidden-xs">Country</th>
                                    <th style={{width: "100px"}} className="hidden-sm hidden-xs">City</th>
                                    <th style={{width: "100px"}} className="hidden-sm hidden-xs">Checked at</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    servers.map((obj) => {
                                        return <TableRowComponent {...this.props} key={obj.address_img_url}
                                                                  rowData={obj}/>
                                    })
                                }
                                </tbody>
                            </table>
                            <TablePaginationComponent {...this.props}
                                                      handlePrevPageClick={this.handlePrevPageClick.bind(this)}
                                                      handleNextPageClick={this.handleNextPageClick.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TableComponent;