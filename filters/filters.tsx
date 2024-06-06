import React from 'react';
import { KoobDataService } from "bi-internal/services"
import constants from '../constants';
import { Select, DatePicker, Modal, Button} from 'antd';

import './filters.css';
import dayjs from 'dayjs';

function byField(fieldName: string) {
    return (a: any, b: any) => a[fieldName] > b[fieldName] ? 1 : -1;
}

export type SelectedItem = {
    value?: number | string | undefined,
    label?: string | undefined,
}

type FiltersItemDataType = {
    code?: number | string,
    display_name?: string,
}

type DepoFiltersItemDataType = {
    code?: number,
    display_name?: string,
    dorcode?: number,
}


// Тип для описания того, что приходит компоненту извне
type MyProps = {
    visible: boolean,
    onReportClick: Function,
    onCloseClick: Function,
};

// Описание состояния компонента (какое свойство какого типа данных)
export type FiltersState = {
    dors: FiltersItemDataType[],
    dors_all: FiltersItemDataType[],
    depos: DepoFiltersItemDataType[],
    depos_all: DepoFiltersItemDataType[],
    vt_all: FiltersItemDataType[],
    vsl_all: FiltersItemDataType[],
    series_all: DepoFiltersItemDataType[],
    series: DepoFiltersItemDataType[],
    loading: boolean,
    selected_road: SelectedItem | undefined,
    selected_depo: SelectedItem | undefined,
    selected_vsl: SelectedItem | undefined,
    selected_vt: SelectedItem | undefined,
    selected_series: SelectedItem | undefined,
    periodStartDate: dayjs.Dayjs,
    periodEndDate: dayjs.Dayjs,
};
export const filtersInitialState: FiltersState = {
    dors: [{}],
    dors_all: [{}],
    depos: [{}],
    depos_all: [{}],
    vt_all:[{}],
    vsl_all:[{}],
    series_all:[{}],
    series:[{}],
    selected_road: undefined,
    selected_depo: undefined,
    selected_vsl: undefined,
    selected_vt: undefined,
    selected_series: undefined,
    loading: true,
    periodStartDate: dayjs().startOf('month'),
    periodEndDate: dayjs().subtract(1, 'day')
}

const selectWidth = 150
class Filters extends React.Component<MyProps, FiltersState> {
    // Конструктор класса (вызывается при создании компонента) - инициализирует начальное состояние компонента
    constructor(props) {
        super(props);
        this.state = filtersInitialState;
    }

    // Метод componentDidMount вызывается при первом создании компонента
    // Загружает данные для фильтров из кубов
    componentDidMount() {
        try {
            // Загрузка данных по дорогам
            KoobDataService.koobDataRequest3(constants.dor_koob_id, ['code', 'fname', 'sname'], [], {}).then((res: any) => {
                const allDors=res
                const dors = res.map((el: any) => {
                    return {
                        dor_code: el.code,
                        dor_display_name: `${el.code} - ${el.fname}`,
                    }
                }).sort(byField('dor_code'));

                const dorsPripis = res.map((el:any)=>{
                    return{
                        dor_code: el.code,
                        dor_display_name: el.sname,
                    }
                })
                dorsPripis.unshift({
                    dor_display_name: 'Все',
                    dor_code: 0,
                })
                let prostD=this.state.depos_all.filter((el:any)=> el.dorcode===999)
                prostD.unshift({
                    display_name: 'Все',
                    code: 0,
                })
                // Записываем в состояние компонента список дорог
                this.setState({
                    ...this.state,
                    dors,
                    dors_all: allDors,
                    selected_road: {
                        value: dors[0]?.dor_code,
                        label: dors[0]?.dor_display_name,
                    },
                })

                try {
                    // Загрузка данных по депо
                    KoobDataService.koobDataRequest3(constants.depo_koob_id, ['id', 'code', 'name', 'dorcode'], [], {}, {
                        sort: ['dorcode', 'code']
                    }).then((res: any) => {
                        // res - массив депо, полученных из куба
                        const depos: DepoFiltersItemDataType[] = res.map((el: any) => ({
                            display_name: `${el.code} - ${el.name}`,
                            code: el.id,
                            dorcode: el.dorcode,
                        }));
                        let deposPrip=depos.map((el) => ({
                            code: el.code,
                            display_name: el.display_name,
                        }))
                        deposPrip.unshift({
                            display_name: 'Все',
                            code: 0,
                        })
                        // Фильтрация депо по выбранной дороге при начальной загрузке данных
                        const newDepos: DepoFiltersItemDataType[] = depos.filter((el: any) => el.code > 0 && (el.dorcode === this.state.selected_road?.value || this.state.selected_road?.value === 0)).map((el) => ({
                            code: el.code,
                            display_name: el.display_name,
                        }))
                        newDepos.unshift({
                            display_name: 'Все',
                            code: 0,
                        })

                        // Записываем в состояние компонента список депо
                        this.setState({
                            ...this.state,
                            depos: newDepos,
                            depos_all: depos,
                            selected_depo: {
                                value: newDepos[0]?.code,
                                label: newDepos[0]?.display_name,
                            },
                        })
                    })
                } catch (error) {
                    console.error(error)
                    // Если данные по депо не были загружены, то пишем, что нет данных
                    this.setState({
                        ...this.state,
                        depos: [{
                            display_name: 'Нет данных',
                            code: -1000,
                            dorcode: -1,
                        }],
                        loading: false
                    });
                }
            })
        } catch (error) {
            console.error(error)
            // Если данные по дороге не были загружены, то пишем, что нет данных
            this.setState({
                ...this.state,
                dors: [
                    {
                        display_name: 'Нет данных',
                        code: -1000
                    }
                ], 
                loading: false
            });
        }
        const vsl=[
            {
                code:0,
                display_name:'Все'
            },
            {
                code:1,
                display_name:'Двойная тяга'
            },
            {
                code:2,
                display_name:'Подталкивание в голове'
            },
            {
                code:3,
                display_name:'Подталкивание в хвосте'
            },
            {
                code:4,
                display_name:'Пересылка с бригадой (б/в)',
            },
            {
                code:5,
                display_name:'Соединенные поезда',
            },
        ]
        this.setState({
            ...this.state,
            vsl_all:vsl,
            selected_vsl:{
                value:vsl[0]?.code,
                label: vsl[0]?.display_name,
            }
        })
        try {
            // Загрузка данных по виду тяги
            KoobDataService.koobDataRequest3(constants.vid_tyagi, ['code', 'fname','codeu'], [], {}, {sort:['code']}).then((res: any) => {
                const vid=res.map((el: any) => ({
                    display_name: `${el.code} - ${el.fname}`,
                    code: el.code,
                }))
                vid.unshift({
                    display_name: 'Все',
                    code: '0',
                })
                this.setState({
                    ...this.state,
                    vt_all:vid,
                    selected_vt:{
                        value: vid[0]?.code,
                        label: vid[0]?.display_name,
                    }
                })
                
            })
        } catch (error) {
            console.error(error)
            this.setState({
                ...this.state,
                vt_all: [
                    {
                        display_name: 'Нет данных',
                        code: -1000
                    }
                ], 
                loading: false
            });
        }
        try {
            // Загрузка данных по серии тпс
            KoobDataService.koobDataRequest3(constants.ser_tps, ['code', 'fname', 'vidtu', 'vidt'], [], {}, {sort:['vidtu','code']}).then((res: any) => {
                const tps=res.map((el: any) => ({
                    display_name: `${el.code} - ${el.fname}`,
                    code: el.code,
                    dorcode:el.vidt
                }))
                tps.unshift({
                    display_name: 'Все',
                    code: 0,
                    dorcode:-1
                })
                this.setState({
                    ...this.state,
                    series:tps,
                    series_all:tps,
                    selected_series:{
                        value: tps[0]?.code,
                        label: tps[0]?.display_name,
                    },
                    loading:false
                })
                
            })
        } catch (error) {
            console.error(error)
            this.setState({
                ...this.state,
                series_all: [
                    {
                        display_name: 'Нет данных',
                        code: -1000
                    }
                ], 
                loading:false
            });
            
        }
    }

    // Метод выбора дороги
    selectRoad = (selectedValue, option: SelectedItem | SelectedItem[]) => {
        console.log(selectedValue)
        const newDepos: DepoFiltersItemDataType[] = this.state.depos_all.filter((el: any) => el.code > 0 && (el.dorcode === selectedValue || selectedValue === 0)).map((el) => ({
            code: el.code,
            display_name: el.display_name,
        }))
        newDepos.unshift({
            display_name: 'Все',
            code: 0,
        })

        this.setState({
            ...this.state,
            selected_road: {
                value: selectedValue,
                label: !Array.isArray(option) ? option.label : '',
            },
            selected_depo: {
                value: newDepos[0].code,
                label: newDepos[0].display_name,
            },
            depos: newDepos
        })
    }

    // Метод выбора депо
    selectDepo = (selectedValue) => {
        console.log(selectedValue)
        this.setState({
            ...this.state,
            selected_depo: {
                value: selectedValue,
                label: this.state.depos.find((el: FiltersItemDataType) => el.code === selectedValue)?.display_name,
            },
        })
    }
    // Метод выбора вида следования
    selectVSL = (selectedValue) => {
        console.log(selectedValue)
        this.setState({
            ...this.state,
            selected_vsl: {
                value: selectedValue,
                label: this.state.vsl_all.find((el: FiltersItemDataType) => el.code === selectedValue)?.display_name,
            },
        })
    }
    
    //Метод выбора тяги
    selectTyagi = (selectedValue) => {
        let ser=this.state.series_all.filter((el: DepoFiltersItemDataType) => el.dorcode === selectedValue.toLowerCase())
        ser.unshift({
            display_name: 'Все',
            code: 0
        })
        this.setState({
            ...this.state,
            series:ser,
            selected_series:{
                value:ser[0].code,
                label:ser[0].display_name
            },
            selected_vt: {
                value: selectedValue,
                label: this.state.vt_all.find((el: FiltersItemDataType) => el.code === selectedValue)?.display_name,
            },

        })
    }

    //Метод выбора серии
    selectSeries = (selectedValue) => {
        console.log(selectedValue)
        this.setState({
            ...this.state,
            selected_series: {
                value: selectedValue,
                label: this.state.series.find((el: FiltersItemDataType) => el.code === selectedValue)?.display_name,
            },
        })
    }

    

    // Метод render вызывается при каждом изменении состояния компонента и рисует фильтры
    render() {
        const { dors, depos,vt_all,vsl_all,series,loading, periodStartDate, periodEndDate } = this.state;
        const { RangePicker } = DatePicker;
        console.log('render filters.tsx', this.state, this.props)
        if (loading) {
            return <div>Loading...</div>;
        }

        return (
            <>
                <Modal
                    open={this.props.visible}
                    onCancel={() => this.props.onCloseClick()}
                    width={"auto"}
                    centered
                    title='Фильтры'
                    footer={[
                        <Button key="back" onClick={() => this.props.onCloseClick()}>
                            Назад
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={() => this.props.onReportClick()}>
                            Отчет
                        </Button>
                    ]}>
                    <div className='d-flex justify-content-between'>
                        <div>
                            <div className="d-flex p-2">
                                <div className='px-3 align-self-right d-flex align-items-center'>
                                    Дорога бригады
                                </div>
                                <Select
                                    style={{ width: 250 }}
                                    popupMatchSelectWidth={false}
                                    value={this.state.selected_road}
                                    placeholder="Дорога"
                                    onChange={this.selectRoad}
                                    options={dors.map((el: any) => ({
                                        value: el.dor_code,
                                        label: el.dor_display_name,
                                    }))}
                                    >
                                </Select>
                            </div>
                            <div className="d-flex p-2">
                                <div className='px-3 align-self-right d-flex align-items-center'>
                                    Депо бригады
                                </div>
                                <Select
                                    style={{width:250, marginLeft:13}}
                                    popupMatchSelectWidth={false}
                                    value={this.state.selected_depo?.value}
                                    placeholder="Депо"
                                    onChange={this.selectDepo}
                                    options={depos.map((el: DepoFiltersItemDataType) => ({
                                        value: el.code,
                                        label: el.display_name,
                                    }))}
                                />
                            </div>    
                        </div>
                        <div>
                            <div className="d-flex p-2">
                                <div className='px-3 align-self-right d-flex align-items-center'>
                                    Период 
                                </div>         
                                <RangePicker
                                style={{width:249,marginLeft:53}}
                                onChange={(dates) => {
                                    if (dates && dates[0] && dates[1]) {
                                        this.setState({ ...this.state, periodStartDate: dates[0], periodEndDate: dates[1] })
                                    }
                                }}
                                inputReadOnly={true}
                                allowClear={false}
                                defaultValue={[periodStartDate, periodEndDate]}
                                format={'DD.MM.YYYY'}
                                />
                            </div>
                            <div className="d-flex p-2">
                                <div className='px-3 align-self-right d-flex align-items-center'>
                                    Вид следования
                                </div>
                                <Select
                                    style={{width:250}}
                                    popupMatchSelectWidth={false}
                                    value={this.state.selected_vsl?.value}
                                    placeholder="Вид следования"
                                    onChange={this.selectVSL}
                                    options={vsl_all.map((el: FiltersItemDataType) => ({
                                        value: el.code,
                                        label: el.display_name,
                                    }))}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="d-flex p-2">
                                <div className='px-3 align-self-right d-flex align-items-center'>
                                    Вид тяги
                                </div>
                                <Select
                                    style={{ width: 250 }}
                                    popupMatchSelectWidth={false}
                                    value={this.state.selected_vt?.value}
                                    placeholder="Вид тяги"
                                    onChange={this.selectTyagi}
                                    options={vt_all.map((el: any) => ({
                                        value: el.code,
                                        label: el.display_name,
                                    }))}
                                    >
                                </Select>
                            </div>
                            <div className="d-flex p-2">
                                <div className='px-3 align-self-right d-flex align-items-center'>
                                    Серия
                                </div>
                                <Select
                                    showSearch
                                    style={{width:250, marginLeft:13}}
                                    popupMatchSelectWidth={false}
                                    value={this.state.selected_series?.value}
                                    placeholder="Серия"
                                    onChange={this.selectSeries}
                                    options={series.map((el: DepoFiltersItemDataType) => ({
                                        value: el.code,
                                        label: el.display_name,
                                    }))}
                                />
                            </div>    
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

export default Filters;
