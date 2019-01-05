import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Button, Icon } from 'semantic-ui-react'
import Link from 'next/link'
import Router from 'next/router'

export default class LocalesTable extends Component {
    state = {
        column: null,
        direction: null,
        filteredColumns: null
    };

    handleSort = clickedColumn => () => {
        const { column, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                direction: 'ascending',
            });

            return
        }

        this.setState({
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    };

    handleFilter = (clickedColumn, newVal) => () => {
        const filteredColumns = this.getFilteredColumns();
        const i = filteredColumns.findIndex(({col, val}) => clickedColumn === col);

        if(i !== -1) {
            if(filteredColumns[i].val === newVal){
                filteredColumns.splice(i, 1);
            } else {
                filteredColumns[i].val = newVal;
            }
        } else {
            filteredColumns.push({col: clickedColumn, val: newVal})
        }

        Router.push({
            pathname: '/',
            query: {
                filteredColumns: filteredColumns.map(({val, col}) => col + ':' + val).join(',')
            },
            shallow: true
        });

        this.setState({
            filteredColumns
        });


    };

    getIcon(val){
        return val ? <Icon circular color='green' name='check' /> : <Icon circular color='red' name='close' />;

    }

    getButtons(currentCol){
        const filteredColumns = this.getFilteredColumns();

        return (
            <>
                <Button size='mini' onClick={this.handleFilter(currentCol, true)} secondary={filteredColumns && filteredColumns.findIndex(({col, val}) => col === currentCol && val === true) > -1}>
                    <Icon circular color='green' name='check' />
                </Button>
                <Button size='mini' onClick={this.handleFilter(currentCol, false)} secondary={filteredColumns && filteredColumns.findIndex(({col, val}) => col === currentCol && val === false) > -1}>
                    <Icon circular color='red' name='close' />
                </Button>
            </>
        )
    }

    queryToArray(filteredColumnsQuery){
        let ret = [];

        if(filteredColumnsQuery){
            filteredColumnsQuery.split(',').forEach(col => {
                let colVals = col.split(':');

                ret.push({
                    col: colVals[0],
                    val: colVals[1] === 'true'
                })
            });
        }


        return ret;

    }

    getFilteredColumns(){
        const { filteredColumns: filteredColumnsFromState } = this.state;
        const { filteredColumnsQuery } = this.props;
        return  filteredColumnsFromState || this.queryToArray(filteredColumnsQuery) || [];
    }

    render() {
        const { column, direction } = this.state;
        const { locales } = this.props;
        const filteredColumns = this.getFilteredColumns();

        let data = _.sortBy(locales.filter((locale => {
            return filteredColumns.length === 0 || filteredColumns.every(({col, val}) => {
                return Boolean(locale[col]) === val;
            })

        })), [this.state.column]);

        if(direction === 'descending'){
            data.reverse();
        }

        return (
            <Table sortable celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                            sorted={column === 'name' ? direction : null}
                            onClick={this.handleSort('name')}
                        >
                            Namn
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'type' ? direction : null}
                            onClick={this.handleSort('type')}
                        >
                            Typ
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'pages' ? direction : null}
                            onClick={this.handleSort('pages')}
                        >
                            Antal sidor
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'position' ? direction : null}
                            onClick={this.handleSort('position')}
                        >
                            Position
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'editedPosition' ? direction : null}
                            onClick={this.handleSort('editedPosition')}
                        >
                            Editerad Position
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'hasApprovedPageUrl' ? direction : null}
                            onClick={this.handleSort('hasApprovedPageUrl')}
                        >
                            Godkända sidor
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'hasUneditedPageUrl' ? direction : null}
                            onClick={this.handleSort('hasUneditedPageUrl')}
                        >
                            Oediterade sidor
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'hasDisapprovedPages' ? direction : null}
                            onClick={this.handleSort('hasDisapprovedPages')}
                        >
                            Slängda sidor
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>
                             {data.length} / {locales.length} 
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {this.getButtons('position')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {this.getButtons('editedPosition')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {this.getButtons('hasApprovedPageUrl')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {this.getButtons('hasUneditedPageUrl')}
                        </Table.HeaderCell>
                        <Table.HeaderCell >
                            {this.getButtons('hasDisapprovedPages')}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, ({ id, type, pages, position, editedPosition, name, hasApprovedPageUrl, hasUneditedPageUrl, hasDisapprovedPages}) => (
                        <Table.Row key={id}>
                            <Table.Cell>
                                <Link href={`/locale?id=${id}`}>
                                    <a>{name}</a>
                                </Link>
                            </Table.Cell>
                            <Table.Cell>{type}</Table.Cell>
                            <Table.Cell>{pages.length}</Table.Cell>
                            <Table.Cell>{this.getIcon(position)}</Table.Cell>
                            <Table.Cell>{this.getIcon(editedPosition)}</Table.Cell>
                            <Table.Cell>{this.getIcon(hasApprovedPageUrl)}</Table.Cell>
                            <Table.Cell>{this.getIcon(hasUneditedPageUrl)}</Table.Cell>
                            <Table.Cell>{this.getIcon(hasDisapprovedPages)}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }
};