/******************************************************************************
* Программа   : spaom152                                                      *
* Комментарий : Ведомость двойной тяги/подталкивания                          *
* Автор       : Фурманец Сергей                                               *
******************************************************************************/

import React from 'react';
import { KoobDataService } from "bi-internal/services"
import './dataTable.css'
import { FiltersState, SelectedItem } from '../filters/filters';
import constants from '../constants';
import { Empty, Spin } from 'antd';
import dayjs from "dayjs";

type MyProps = {
    updateTableWithParams: FiltersState,
    onTableLoaded: Function,
};

export type RowData = {
    sec_mod_1: number,
	sec_num_1: number,
	ser_name_1: string,
	id_org_1: number,
	depo_name_1: string,
	id_1: number,
	mm_num_1: number,
	train_num_1: number,
	st_beg_1: number,
	st_beg_name_1: string,
	st_end_1: string,
	st_end_name_1: string,
	ts_beg_1: string,
	ts_end_1: string,
	vsl_1:string,
	sec_mod_2: number,
	sec_num_2: number,
	ser_name_2: string,
	id_org_2: number,
	depo_name_2: string,
	id_2: number,
	mm_num_2: number,
	train_num_2: number,
	st_beg_2: number,
	st_beg_name_2: string,
	st_end_2: string,
	st_end_name_2: string,
	ts_beg_2: string,
	ts_end_2: string,
	vsl_2:string,
	error_pair: number,
	error_time: number,
	error_vsl:number
}

type MyState = {
    tableData: RowData[] | null | undefined,
    isModalOpen: boolean,
    modalParams: {
        rowData?: RowData,
        currCell?: string,
        docType?: number,
        sign?: number,
    },
};

class DataTable extends React.Component<MyProps, MyState> {
    constructor(props) {
        super(props);
        this.state = {
            tableData: undefined,
            isModalOpen: false,
            modalParams: {},
        };
    }

    closeModal() {
        this.setState({ isModalOpen: false })
    }

    onCellClick(rowData) {
        this.setState({
            ...this.state,
            isModalOpen: true,
            modalParams: {
                rowData
            }
        })
    }


    loadTableData(props: { updateTableWithParams: FiltersState }) {
        this.setState({
            ...this.state,
            tableData: null,
        });
        this.props.onTableLoaded(false)
        try {
            KoobDataService.koobDataRequest3(constants.table_koob, [
                'sec_mod_1',
			     'sec_num_1',
			     'ser_name_1' ,
			     'id_org_1' ,
			     'depo_name_1' ,
			     'id_1' ,
			     'mm_num_1' ,
			     'train_num_1' ,
			     'st_beg_1' ,
			     'st_beg_name_1' ,
			     'st_end_1' ,
			     'st_end_name_1' ,
			     'ts_beg_1' ,
			     'ts_end_1' ,
			     'vsl_1' ,
			     'sec_mod_2' ,
			     'sec_num_2' ,
			     'ser_name_2' ,
			     'id_org_2' ,
			     'depo_name_2' ,
			     'id_2' ,
			     'mm_num_2' ,
			     'train_num_2' ,
			     'st_beg_2' ,
			     'st_beg_name_2' ,
			     'st_end_2' ,
			     'st_end_name_2' ,
			     'ts_beg_2' ,
			     'ts_end_2' ,
			     'vsl_2' ,
			     'error_pair' ,
			     'error_time' ,
			     'error_vsl'
            ], ['ts_beg_1','ts_end_1','ts_beg_2','ts_end_2'],
                {
                    parDATEFROM : ["=", props.updateTableWithParams.periodStartDate.format('YYYY-MM-DD')],
                    parDATETO: ["=", props.updateTableWithParams.periodEndDate.format('YYYY-MM-DD')],
                    parROAD: ["=", props.updateTableWithParams?.selected_road?.value],
                    parDEPOBR: ["=", props.updateTableWithParams.selected_depo?.value],
                    parVSL: ["=", props.updateTableWithParams.selected_vsl?.value],
                    parVT: ["=", props.updateTableWithParams.selected_vt?.value],
                    parSERIES: ["=", props.updateTableWithParams.selected_series?.value],
                    parType: ["=", 2], 
                },
                ).then((res: any[]) => {
                    let result=JSON.parse(JSON.stringify(res))
                    this.setState({
                        ...this.state,
                        tableData:result
                    });
                    
                    if (res.length > 0) {
                        this.props.onTableLoaded(true)
                    }
                })
            } catch (error) {
               this.setState({
                   ...this.state,
                   tableData: null,
               });
               this.props.onTableLoaded(false)
           }
        // Запрос для Python
        // for (const depo of props.updateTableWithParams.selected_depo) {
        //      fetch(`http://127.0.0.1:5000/getTable?depo=${depo}&dor=${props.updateTableWithParams.selected_road}`, {}).then(el => console.log(el))
        // }

    }

    componentDidUpdate(previousProps, previousState) {
        if (previousProps.updateTableWithParams !== this.props.updateTableWithParams) {
           this.loadTableData(this.props)
        }
    }

    render() {
        const { tableData } = this.state;
        console.log('render dataTable.tsx', this.state, this.props)
    

        if (tableData === undefined) {
            return <div></div>;
        }

        if (tableData === null) {
            return <>
                <div className='position-absolute top-50 start-50'>
                    <Spin size='large' spinning={true} />
                </div>
            </>
        }

        if (tableData.length === 0) {
            return <>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </>
        }
        const colorPairError='#B0C4DE'
        const colorVslError='#C4E5F8'
        const colorTimeError='#FF0000'
        return (  
            <>
                <table id='sheet1' className='table table-ligth table-bordered table1'>
                    <thead className="text-center">
                        <tr>
                            <th colSpan={7}>Ведущий (подталкиваемый) локомотив</th>
                            <th colSpan={7}>Ведомый (подталкивающий) локомотив</th>
                        </tr>
                        <tr>
                            <th>Локомотив</th>
                            <th>Депо бригады</th>
                            <th>№ ММ</th>
                            <th>№ поезда</th>
                            <th>Станции следования</th>
                            <th>Дата и время следования</th>
                            <th>Вид следования</th>
                            <th>Локомотив</th>
                            <th>Депо бригады</th>
                            <th>№ ММ</th>
                            <th>№ поезда</th>
                            <th>Станции следования</th>
                            <th>Дата и время следования</th>
                            <th>Вид следования</th>
                        </tr>
                        <tr>
                            <th style={{'width': 150}}>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th style={{'width': 150}}>5</th>
                            <th>6</th>
                            <th style={{'width': 150}}>7</th>
                            <th style={{'width': 150}}>8</th>
                            <th>9</th>
                            <th>10</th>
                            <th>11</th>
                            <th style={{'width': 150}}>12</th>
                            <th>13</th>
                            <th style={{'width': 150}}>14</th>
                        </tr>
                    </thead>
                    <tbody className='text-end'>
                    {   
                        tableData?.map((el) => {
                            const url = new URL(document.location.href)
                            return (
                                <> 
                                    <tr title={el.error_pair ? 'Пара не найдена' : el.error_vsl ? 'Не совпадают виды следований в двух маршрутах' : ''}>
                                        {   el.sec_mod_1 !== null ? 
                                            <td className="align-left" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}>{el.sec_mod_1 + ' - ' + el.ser_name_1 + ' № ' + el.sec_num_1 }</td>
                                            : <td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.id_org_1 !== null ?
                                            <td className="align-left" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}>{el.id_org_1 + ' - ' + el.depo_name_1}</td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.id_1 !== null ?
                                            <td className="align-rigth btn-link" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}} title='Открыть форму ТУЗ-ВЦУ' role="button" ><a href={`${url.protocol}//${url.hostname}:${url.port == '' ? '80' : url.port}/#/ds/ds_spaomtu3/dashboards?dboard=1&displayMode=dashboard&id=${el.id_1}`} target="_blank">{el.mm_num_1}</a></td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.train_num_1 !== null ?
                                            <td className="align-rigth" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}>{el.train_num_1}</td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.st_beg_1 !== null ?
                                            <td className="align-left" style={{background: el.error_pair ? colorPairError : el.error_vsl ? colorVslError : ''}}>
                                            {el.st_beg_1 + ' - ' + el.st_beg_name_1}<br />
                                            {el.st_end_1 + ' - ' + el.st_end_name_1}
                                            </td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.ts_beg_1 !== null ?
                                            <td className="text-center" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : '',
                                                                                color: el.error_time ? colorTimeError : 'black'
                                                                                }}>{dayjs(el.ts_beg_1).format("DD.MM.YYYY HH:mm")}<br/> 
                                                                                    {dayjs(el.ts_end_1).format("DD.MM.YYYY HH:mm")}
                                                                                    </td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.vsl_1 !== null ?
                                            <td className="text-center" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}>{el.vsl_1}</td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   el.sec_mod_2 !== null ?
                                            <td className="align-left" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}>{el.sec_mod_2 + ' - ' + el.ser_name_2 + ' № ' + el.sec_num_2 }</td>
                                            : <td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.id_org_2 !== null ?
                                            <td className="align-left" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}>{el.id_org_2 + ' - ' + el.depo_name_2}</td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.id_2 !== null ?
                                            <td className="align-rigth btn-link" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}} title='Открыть форму ТУЗ-ВЦУ' role="button" ><a href={`${url.protocol}//${url.hostname}:${url.port == '' ? '80' : url.port}/#/ds/ds_spaomtu3/dashboards?dboard=1&displayMode=dashboard&id=${el.id_2}`} target="_blank">{el.mm_num_2}</a></td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.train_num_2 !== null ?
                                            <td className="align-rigth" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}>{el.train_num_2}</td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.st_beg_2 !== null ?
                                            <td className="align-left" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}>
                                                {el.st_beg_2 + ' - ' + el.st_beg_name_2} <br/> 
                                                {el.st_end_2 + ' - ' + el.st_end_name_2}</td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.ts_beg_2 !== null ?
                                            <td className="text-center" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : '',
                                            color: el.error_time ? colorTimeError : 'black'
                                            }}>{dayjs(el.ts_beg_2).format("DD.MM.YYYY HH:mm")}<br/> 
                                                {dayjs(el.ts_end_2).format("DD.MM.YYYY HH:mm")}</td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                        {   
                                            el.vsl_2 !== null ?
                                            <td className="text-center" style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}>{el.vsl_2}</td>
                                            :<td style={{background: el.error_pair ? colorPairError: el.error_vsl ? colorVslError : ''}}></td>
                                        }
                                    </tr>
                                </>
                            );
                        })
                    }
                    </tbody>
                </table>
            </>
        );
    }
}

export default DataTable;
