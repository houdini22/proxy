import React from 'react';
import {formatBytes} from '../../helpers/number-helper';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

class TableRowComponent extends React.Component {
    render() {
        let rowData = this.props.rowData;

        let speed;
        let speedClassName;

        if (rowData.is_checked_speed && rowData.speed !== null) {
            speed = rowData.speed;
            if (speed < 2048) {
                speedClassName = 'label label-danger';
            } else if (speed >= 2048 && speed < 10240) {
                speedClassName = 'label label-warning';
            } else if (speed >= 10240 && speed <= 25600) {
                speedClassName = 'label label-info';
            } else {
                speedClassName = 'label label-success';
            }
            speed = `${formatBytes(speed, true)}/s`;
        } else {
            if (rowData.speed_checked_at === null) {
                speed = "not checked"
            } else {
                speed = 'error';
            }
            speedClassName = 'label label-danger';
        }


        let pingClassName;
        if (rowData.ping < 3) {
            pingClassName = 'label label-success';
        } else if (rowData.ping >= 3 && rowData.ping < 10) {
            pingClassName = 'label label-info';
        } else if (rowData.ping >= 10 && rowData.ping < 25) {
            pingClassName = 'label label-warning'
        } else {
            pingClassName = 'label label-danger';
        }

        let pingRatio = (rowData.ping_success + rowData.speed_success) / (rowData.speed_error + rowData.ping_error);
        if (rowData.is_socks) {
            pingRatio = (rowData.ping_socks_success + rowData.speed_success) / (rowData.ping_socks_error + rowData.speed_error);
        }

        let uploadRatioClassName;
        if (pingRatio > 0.75) {
            uploadRatioClassName = 'label label-success';
        } else if (pingRatio <= 0.75 && pingRatio > 0.50) {
            uploadRatioClassName = 'label label-info';
        } else if (pingRatio <= 0.50 && pingRatio > 0.25) {
            uploadRatioClassName = 'label label-warning';
        } else {
            uploadRatioClassName = 'label label-danger';
        }

        let type;
        if (rowData.is_socks) {
            type = 'SOCKS5 ';
        } else {
            type = 'HTTP ';
        }
        type += rowData.type;

        let checked = `checked ${rowData.speed_checked_at}`;
        if (rowData.speed_checked_at === null) {
            checked = 'not checked yet';
        }

        let tooltip;
        if (rowData.speed === null) {
            let tooltipText = '';
            if (rowData.last_speed_error_status_code !== null) {
                tooltipText = `Status code: [${rowData.last_speed_error_status_code}] `;
            }
            if (rowData.last_speed_error_message !== null) {
                tooltipText += `Message: ${rowData.last_speed_error_message}`;
            }
            if (tooltipText.length === 0) {
                tooltipText = 'No error message specified.';
            }
            tooltip = <Tooltip id="speed-tooltip">{tooltipText}</Tooltip>;
        } else {
            tooltip = <Tooltip id="speed-tooltip">{checked}</Tooltip>;
        }

        let uptimeRatioText = `${rowData.ping_success + rowData.speed_success} / ${rowData.ping_error + rowData.speed_error}`;
        if(rowData.is_socks) {
            uptimeRatioText = `${rowData.ping_socks_success + rowData.speed_success} / ${rowData.ping_socks_error + rowData.speed_error}`;
        }

        let checked_at = rowData.checked_at;
        if(rowData.is_socks) {
            checked_at = rowData.socks_checked_at;
        }

        let onlineText = rowData.is_available ? 'online' : 'offline';
        let onlineTextClassName = rowData.is_available ? 'label label-success' : 'label label-danger';

        return (
            <tr>
                <td style={{textAlign: 'center'}}>
                    <img src={rowData.address_img_url}/>
                </td>
                <td>{type}</td>
                <td><span className={onlineTextClassName}>{onlineText}</span></td>
                <td className="text-center"><span className={pingClassName}>{rowData.ping}s</span></td>
                <td className="text-center">
                    <span
                        className={uploadRatioClassName}>
                        {uptimeRatioText}
                    </span>
                </td>
                <td className="text-center">
                    <OverlayTrigger placement="top" overlay={tooltip}>
                        <span className={speedClassName}>{speed} <i className="glyphicon-info-sign glyphicon"/></span>
                    </OverlayTrigger>
                </td>
                <td style={{maxWidth: '110px'}} className="hidden-sm hidden-xs">
                    {rowData.country}
                </td>
                <td style={{maxWidth: '110px'}} className="hidden-sm hidden-xs">{rowData.city}</td>
                <td style={{maxWidth: '110px'}} className="hidden-sm hidden-xs">{checked_at}</td>
            </tr>
        );
    }
}

export default TableRowComponent;