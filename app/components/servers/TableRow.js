import React from 'react';
import {formatBytes} from '../../helpers/number-helper';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

class TableRowComponent extends React.Component {
    render() {
        let rowData = this.props.rowData;

        function getSpeedClassName(speed) {
            if (speed < 2048) {
                return 'label label-danger';
            } else if (speed >= 2048 && speed < 10240) {
                return 'label label-warning';
            } else if (speed >= 10240 && speed <= 25600) {
                return 'label label-info';
            } else {
                return 'label label-success';
            }
        }

        function getPingClassName(ping) {
            if (ping < 3) {
                return 'label label-success';
            } else if (ping >= 3 && ping < 10) {
                return 'label label-info';
            } else if (ping >= 10 && ping < 25) {
                return 'label label-warning'
            } else {
                return 'label label-danger';
            }
        }

        let speed;
        let speedClassName;

        if (rowData.last_speed_error_status_code === null && rowData.last_speed_error_message === null) {
            if (rowData.speed == null || !rowData.speed) {
                speed = "not checked";
                speedClassName = 'label label-danger';
            } else {
                speed = rowData.speed;
                speedClassName = getSpeedClassName(speed);
                speed = `${formatBytes(speed, true)}/s`;
            }
        } else {
            speed = 'error';
            speedClassName = 'label label-danger';
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

        let tooltip;
        if (rowData.last_speed_error_status_code === null && rowData.last_speed_error_message === null) {
            if (rowData.speed == null || !rowData.speed) {
                tooltip = <Tooltip id="speed-tooltip-not-checked">not checked yet</Tooltip>;
            } else {
                tooltip = <Tooltip id="speed-tooltip-checked-at">checked {rowData.speed_checked_at}</Tooltip>;
            }
        } else {
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
            tooltip = <Tooltip id="speed-tooltip-checked-message">{tooltipText}</Tooltip>;
        }

        let speedSumTooltip;
        let speedSumClassName;
        let speedSumCaption;
        if (rowData.speed_sum > 0) {
            speedSumTooltip = <Tooltip id="speed-tooltip-average-speed">average speed
                ({rowData.speed_success} measurements)</Tooltip>;
            speedSumCaption = `${formatBytes(rowData.speed_sum / rowData.speed_success, true)}/s`;
            speedSumClassName = getSpeedClassName(rowData.speed_sum / rowData.speed_success);
        } else {
            speedSumTooltip = <Tooltip id="speed-tooltip-average-speed">no success measurements ({rowData.speed_error} attempts)</Tooltip>;
            speedSumCaption = `N/A`;
            speedSumClassName = 'label label-danger';
        }

        let uptimeRatioText = `${rowData.ping_success + rowData.speed_success} / ${rowData.ping_error + rowData.speed_error}`;
        if (rowData.is_socks) {
            uptimeRatioText = `${rowData.ping_socks_success + rowData.speed_success} / ${rowData.ping_socks_error + rowData.speed_error}`;
        }

        let checked_at = rowData.checked_at;
        if (rowData.is_socks) {
            checked_at = rowData.socks_checked_at;
        }

        let onlineText = rowData.is_available ? 'online' : 'offline';
        let onlineTextClassName = rowData.is_available ? 'label label-success' : 'label label-danger';

        let lastAvailabilityCaption = `${rowData.last_availability} days ago`;
        if(rowData.last_availability === 0) {
            lastAvailabilityCaption = 'today';
        }

        return (
            <tr>
                <td style={{textAlign: 'center'}}>
                    <img src={rowData.address_img_url}/>
                </td>
                <td>{type}</td>
                <td><span className={onlineTextClassName}>{onlineText}</span></td>
                <td className="text-center">
                    <OverlayTrigger placement="top"
                                    overlay={<Tooltip id="speed-tooltip-last-ping">last measurement
                                        (checked {rowData.checked_at})</Tooltip>}>
                        <span className={getPingClassName(rowData.ping)}>{rowData.ping}s <i
                            className="glyphicon-info-sign glyphicon"/></span>
                    </OverlayTrigger>
                    <br/>
                    <OverlayTrigger placement="top"
                                    overlay={<Tooltip id="speed-tooltip-average-ping">average latency
                                        ({(rowData.is_socks ? rowData.ping_socks_success : rowData.ping_success)}
                                        &nbsp;success attempts)</Tooltip>}>
                        <span
                            className={getPingClassName(rowData.ping_sum / (rowData.is_socks ? rowData.ping_socks_success : rowData.ping_success))}>
                            {(rowData.ping_sum / (rowData.is_socks ? rowData.ping_socks_success : rowData.ping_success)).toFixed(3)}s
                            <i className="glyphicon-info-sign glyphicon"/>
                        </span>
                    </OverlayTrigger>
                </td>
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
                    <br/>
                    <OverlayTrigger placement="top" overlay={speedSumTooltip}>
                        <span className={speedSumClassName}>{speedSumCaption} <i
                            className="glyphicon-info-sign glyphicon"/></span>
                    </OverlayTrigger>
                </td>
                <td style={{maxWidth: '110px'}} className="hidden-sm hidden-xs">
                    {rowData.country}
                </td>
                <td style={{maxWidth: '110px'}} className="hidden-sm hidden-xs">{checked_at}</td>
                <td>{lastAvailabilityCaption}</td>
            </tr>
        );
    }
}

export default TableRowComponent;