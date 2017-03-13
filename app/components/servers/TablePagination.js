import React from 'react';

class TablePaginationComponent extends React.Component {
    render() {
        let currentPage = this.props.state.servers.current_page || 0;
        let lastPage = this.props.state.servers.last_page || 0;
        return (
            <nav>
                <ul className="pagination">
                    <li>
                        <a href="#" onClick={this.props.handlePrevPageClick}>
                            <span>&laquo;</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                        }}>
                            <span>{currentPage} / {lastPage}</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={this.props.handleNextPageClick}>
                            <span>&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default TablePaginationComponent;