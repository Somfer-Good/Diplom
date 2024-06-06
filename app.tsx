import React from 'react';
import Filters, { FiltersState, filtersInitialState } from './filters/filters';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from './dataTable/dataTable';
import './app.css';
import Header from './header/header';
import dayjs from 'dayjs';
import InfoBar from './infoBar/infoBar';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import "dayjs/locale/ru";
import 'antd/dist/antd.min.js';
import exportExcel from './excelExport';
dayjs.locale('ru')


type AppProps = {
}
type AppState = {
    params: FiltersState,
    filtersComponent: any,
    tableComponent: any,
    tableData: any,
    showFilters: boolean,
    excelEnabled: boolean,
}

class App extends React.Component<AppProps, AppState> { //props -то что передали компоненту state - состояние компонента
    constructor(props) {
        super(props)
        this.state = {
            params: filtersInitialState,
            showFilters: true,
            filtersComponent: React.createRef(),
            tableComponent: React.createRef(),
            tableData: React.createRef(),
            excelEnabled: false,
        }
    }

    getFiltersState() {
        console.log(this.state.filtersComponent.current.state)
        this.setState({
            ...this.state,
            params: this.state.filtersComponent.current.state,
            showFilters: !this.state.showFilters,
        })
    }

    toggleFilters() {
        this.setState({
            ...this.state,
            showFilters: !this.state.showFilters,
        })
    }

    enableExcel(isEnable: boolean) {
        this.setState({
            ...this.state,
            excelEnabled: isEnable,
        })
    }

    async onExportClick() {
        const { tableData } = this.state.tableComponent.current.state
        await exportExcel([...tableData] ,this.state.params)
    }

    render() {

        const { params, showFilters } = this.state
        console.log('render App.tsx', this.state)
        return <>
            <ConfigProvider locale={ruRU}>
                <div className="d-flex flex-column justify-content-center h-100">
                    <div className="p-2 repHeader">
                        <Header
                            onToggleFilters={this.toggleFilters.bind(this)}
                            visibleFilters={showFilters}
                            excelEnabled={this.state.excelEnabled}
                            onExportClick={this.onExportClick.bind(this)}
                        />
                    </div>
                    <Filters
                        ref={this.state.filtersComponent}
                        visible={this.state.showFilters}
                        onReportClick={this.getFiltersState.bind(this)}
                        onCloseClick={this.toggleFilters.bind(this)}
                    />
                    <div className='p-2'>
                        <InfoBar
                            reportParams={this.state.params}
                        />
                    </div>
                    <div className='flex-grow-1 overflow-auto'>
                        <DataTable
                            ref={this.state.tableComponent}
                            updateTableWithParams={params}
                            onTableLoaded={this.enableExcel.bind(this)}
                        />
                    </div>
                </div>
            </ConfigProvider>
        </>
    }
}

export default App;