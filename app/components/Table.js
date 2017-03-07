import React from 'react';

import MainHeaderComponent from './header/Main';

class TableComponent extends React.Component {
    componentDidMount() {
        this.props.ajax('/servers').then((response) => {
            this.props.actions.serversReceived(response.data);
        });
    }

    renderRow(obj, i) {
        let speed;
        let speedClassName;

        if (obj.is_checked_speed) {
            speed = obj.speed;
            if (speed < 2048) {
                speedClassName = 'label label-danger';
            } else if (speed > 20480) {
                speedClassName = 'label label-success';
            } else {
                speedClassName = 'label label-info';
            }
            speed = `${speed} bytes / sec`;
        } else {
            speed = 'ERROR';
            speedClassName = 'label label-danger';
        }


        let pingClassName;
        if (obj.ping < 3) {
            pingClassName = 'label label-success';
        } else if (obj.ping > 20) {
            pingClassName = 'label label-danger';
        } else {
            pingClassName = 'label label-info';
        }

        let pingRatio = obj.ping_success / obj.ping_error;
        let pingRatioClassName;
        if (pingRatio > 0.75) {
            pingRatioClassName = 'label label-success';
        } else if (pingRatio < 0.25) {
            pingRatioClassName = 'label label-danger';
        } else {
            pingRatioClassName = 'label label-info';
        }

        let type;
        if (obj.is_socks) {
            type = 'SOCKS5 ';
        } else {
            type = 'HTTP ';
        }
        type += obj.type;

        return (
            <tr key={i}>
                <td style={{width: "160px"}}>
                    <img src={obj.address_img_url}/>
                </td>
                <td>{type}</td>
                <td><span className={pingClassName}>{obj.ping} sec</span></td>
                <td><span className={speedClassName}>{speed}</span></td>
                <td><span className={pingRatioClassName}>{obj.ping_success} / {obj.ping_error}</span></td>
                <td>{obj.country}</td>
                <td>{obj.city}</td>
            </tr>
        );
    }

    render() {
        let servers = this.props.state.servers.data || [];
        return (
            <div className="row">
                <div className="col-md-12 col-xs-12 col-sm-12 col-lg-12">
                    <div className="panel panel-info panel-table">
                        <div className="panel-heading">
                            <h3 className="panel-title">Servers</h3>
                        </div>
                        <div className="panel-body">
                            <table className="proxy-table">
                                <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Type</th>
                                    <th>Ping</th>
                                    <th>Speed</th>
                                    <th>Country</th>
                                    <th>City</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    servers.map((obj, i) => {
                                        return this.renderRow(obj, i);
                                    })
                                }
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