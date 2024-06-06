import React from 'react';

import { FiltersState, filtersInitialState } from '../filters/filters';

// Тип для описания того, что приходит компоненту извне
type MyProps = {
    reportParams: FiltersState,
};
// Описание состояния компонента (какое свойство какого типа данных)
export type InfoBarState = {
};


class InfoBar extends React.Component<MyProps, FiltersState> {
    // Конструктор класса (вызывается при создании компонента) - инициализирует начальное состояние компонента
    constructor(props) {
        super(props);
        this.state = filtersInitialState;
    }

    // Метод componentDidMount вызывается при первом создании компонента
    // Загружает данные для фильтров из кубов
    componentDidMount() {

    }

    // Метод render вызывается при каждом изменении состояния компонента и рисует фильтры
    render() {

        console.log('render infobar.tsx', this.state)
        if (
            !this.props.reportParams.selected_road ||
            !this.props.reportParams.selected_depo
        ) {
            return <></>
        } else
            return (
                <>
                    <div className='d-flex flex-wrap align-items-center'>
                        <div className='p-2' data-name="infobar_item">
                            <span>Период: {this.props.reportParams.periodStartDate.format('DD.MM.YYYY')} - {this.props.reportParams.periodEndDate.format('DD.MM.YYYY')} </span>
                        </div>
                        <div className='p-2' data-name="infobar_item">
                            Дорога: {this.props.reportParams.selected_road?.label}
                        </div>
                        <div className='p-2' data-name="infobar_item">
                            Депо бригады: {this.props.reportParams.selected_depo?.label}
                        </div>
                        {   
                            this.props.reportParams.selected_vsl?.value !== 0?
                                <div className='p-2' data-name="infobar_item">
                                    Вид следования: {this.props.reportParams.selected_vsl?.label}
                                </div>
                            :<></>
                        }
                        {   
                            this.props.reportParams.selected_vt?.value !== '0'?
                                <div className='p-2' data-name="infobar_item">
                                    Вид тяги: {this.props.reportParams.selected_vt?.label}
                                </div>
                            :<></>
                        }

                        {   
                            this.props.reportParams.selected_series?.value !== 0?
                                <div className='p-2' data-name="infobar_item">
                                    Серия:  {this.props.reportParams.selected_series?.label}
                                </div>
                            :<></>
                        }
                    </div>
                </>
            );
    }
}

export default InfoBar;
