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
                        <div>
                            I'm news
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewsComponent;