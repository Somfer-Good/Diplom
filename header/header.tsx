import React from 'react';
import './header.css';
import abountIcon from '../abountIcon.png';
import docsIcon from '../docsIcon.png';
import excelIcon from '../excelIcon.png';
import filtersIcon from '../filtersIcon.png';
import { DevAboutModal } from '../devAboutModal/devAboutModal';
import Filters, { FiltersState, filtersInitialState } from '../filters/filters';

import { UrlState } from 'bi-internal/core';
import { LeftOutlined } from '@ant-design/icons'

// Тип для описания того, что приходит компоненту извне
type MyProps = {
    onToggleFilters: Function,
    onExportClick: Function,
    visibleFilters: boolean,
    excelEnabled: boolean,
};
// Описание состояния компонента (какое свойство какого типа данных)
type MyState = {
    isAboutDevModalOpen: boolean;
    isFiltersOpen: boolean;
    filtersState: FiltersState,
};


class Header extends React.Component<MyProps, MyState> {
    // Конструктор класса (вызывается при создании компонента) - инициализирует начальное состояние компонента
    constructor(props) {
        super(props);
        this.state = {
            isAboutDevModalOpen: false,
            isFiltersOpen: false,
            filtersState: filtersInitialState,
        };
    }

    // Метод componentDidMount вызывается при первом создании компонента
    // Загружает данные для фильтров из кубов
    componentDidMount() {

    }

    openDocs = () => {

    }

    openAboutDev = () => {
        this.setState({
            ...this.state,
            isAboutDevModalOpen: true,
        })
    }
    closeAboutDev = () => {
        this.setState({ ...this.state, isAboutDevModalOpen: false })
    }

    openFilters = () => {
        this.setState({
            ...this.state,
            isFiltersOpen: true,
        })
    }
    closeFilters = () => {
        this.setState({ ...this.state, isFiltersOpen: false })
    }

    // Метод render вызывается при каждом изменении состояния компонента и рисует фильтры
    render() {
        return (
            <>
                <div className="d-flex  align-self-center align-items-center">
                <div
                            onClick={() => UrlState.navigate({ path: ['ds', 'ds_spaomport', 'dashboards'], displayMode: 'dashboard' })}
                            className={`p-1 border-secondary`}
                            title='Стартовая страница КИХ ЦОММ НП'
                        >
                            <LeftOutlined style={{ height: '25px', width: '25px', cursor: 'pointer' }} className='m-2 pe-auto d-flex justify-content-center' />
                        </div>
                    <div className="p-1 flex-grow-1  headstyle fs-2">
                        Ведомость двойной тяги/подталкивания
                    </div>
                    <div className="vr"></div>
                    <div className="m-1  header-button">
                        <div
                            onClick={() => { this.props.onToggleFilters() }}
                            className="p-1 border-secondary"
                            title='Фильтры'
                        >
                            <img src={filtersIcon} width={25} className='m-2 pe-auto' />
                        </div>
                    </div>
                    <div className="vr"></div>
                    <div className={`m-1 header-button ${!this.props.excelEnabled ? 'disabled' : ''}`}>
                        <div
                            onClick={this.props.excelEnabled ? () => { this.props.onExportClick() } : undefined}
                            className={`p-1 border-secondary`}
                            title='Экспорт в Excel'
                        >
                            <img src={excelIcon} width={25} className={`m-2 ${!this.props.excelEnabled ? '' : 'pe-auto'}`} />
                        </div>
                    </div>
                    <div className="vr"></div>
                    <div className="m-1 header-button">
                        <div
                            onClick={() => { this.openDocs() }}
                            className={`p-1 border-secondary`}
                            title='Документация'
                        >
                            <img src={docsIcon} width={25} className='m-2 pe-auto' />
                        </div>
                    </div>
                    <div className="vr"></div>
                    <div className="m-1 header-button">
                        <div
                            onClick={() => { this.openAboutDev() }}
                            className={'p-1 border-secondary'}
                            title='О разработчике'
                        >
                            <img src={abountIcon} width={25} className='m-2 pe-auto' />
                        </div>
                    </div>
                </div >
                <DevAboutModal
                    isOpen={this.state.isAboutDevModalOpen}
                    onCancel={this.closeAboutDev.bind(this)}
                    devFIO='Фурманец Сергей Владленович'
                    version='12.02.2024'
                    email='sergey.furmanec@OCRV.RU'
                />
            </>
        );
    }
}

export default Header;
