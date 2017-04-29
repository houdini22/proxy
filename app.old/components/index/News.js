import React from 'react';
import {Link} from 'react-router';

class NewsComponent extends React.Component {
    render() {
        return (
            <div className="flex-child">
                <div className="panel panel-default panel-news">
                    <div className="panel-heading">
                        <h3 className="panel-title"><i className="fa fa-newspaper-o"/> News</h3>
                    </div>
                    <div className="panel-body">
                        <ul>
                            <li>
                                <div className="clearfix">
                                    <Link to="/news/1">First production database testing started.</Link>
                                    <span className="pull-right date">2016.01.01</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewsComponent;