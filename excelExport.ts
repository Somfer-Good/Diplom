import dayjs from "dayjs";
import * as Excel from "exceljs";
import * as FileSaver from 'file-saver';
import { FiltersState } from "./filters/filters";
import { RowData } from "./dataTable/dataTable";

const blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

// Делает внешнюю границу таблицы
const createOuterBorder = (worksheet, start = { row: 1, col: 1 }, end = { row: 1, col: 1 }, borderWidth = 'medium') => {

    const borderStyle = {
        style: borderWidth
    };
    for (let i = start.row; i <= end.row; i++) {
        const leftBorderCell = worksheet.getCell(i, start.col);
        const rightBorderCell = worksheet.getCell(i, end.col);
        leftBorderCell.border = {
            ...leftBorderCell.border,
            left: borderStyle
        };
        rightBorderCell.border = {
            ...rightBorderCell.border,
            right: borderStyle
        };
    }

    for (let i = start.col; i <= end.col; i++) {
        const topBorderCell = worksheet.getCell(start.row, i);
        const bottomBorderCell = worksheet.getCell(end.row, i);
        topBorderCell.border = {
            ...topBorderCell.border,
            top: borderStyle
        };
        bottomBorderCell.border = {
            ...bottomBorderCell.border,
            bottom: borderStyle
        };
    }
};

// Основная функция экспорта в Excel
export default async function exportExcel(data: RowData[], filters: FiltersState) {
    const fileName = 'Ведомость двойной тяги/подталкивания.xlsx';

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Лист 1');

    // Делим на 2.54 для перевода из дюймов в сантиметры
    ws.pageSetup.margins = {
        left: 1 / 2.54, right: 1 / 2.54,
        top: 1 / 2.54, bottom: 1.2 / 2.54,
        header: 0, footer: 0.7 / 2.54
    }
    ws.pageSetup.orientation = 'landscape' // альбомная ориентация листа
    ws.pageSetup.horizontalCentered = true
    ws.pageSetup.fitToPage = true
    ws.pageSetup.fitToWidth = 1 // Всю таблицу по ширине на одном листе
    ws.pageSetup.fitToHeight = 999 // Максимальное количество строк на листе


    ws.headerFooter.oddFooter = `&LСтраница &P&RДата формирования: ${dayjs().format('DD.MM.YYYY HH:mm')}`;

    // Заголовок таблицы
    ws.getCell('A1').value = 'Ведомость двойной тяги/подталкивания '
    ws.getCell('A1').font = { bold: true, size: 14 }
    ws.mergeCells('A1:N1')
    ws.getCell('A1').alignment = { wrapText: true, horizontal: "center", vertical: 'middle' };

    // Строка с параметрами
    const infobarValues = Array.from(document.querySelectorAll("[data-name='infobar_item']"))
    // Количество строк, которое нужно использовать, если делать по 5 параметров в строке
    const infoRowsCount = Math.ceil(infobarValues.length / 5)
    // Добавляем после каждого 5го фильтра из инфобара && и объединяем все фильтры в одну строку

    let paramsString = infobarValues.map((el) => `${el.textContent}`).join('; ')
    ws.getCell(`A4`).value = paramsString
    ws.getCell(`A4`).font = { size: 12 }
    ws.mergeCells('A4:N4')
    ws.getCell('A4').alignment = { wrapText: true, horizontal: "left", vertical: 'middle' }

    // Задаем ширину колонок
    ws.getColumn(1).width = 25
    ws.getColumn(2).width = 25
    ws.getColumn(3).width = 15
    ws.getColumn(4).width = 10
    ws.getColumn(5).width = 20
    ws.getColumn(6).width = 20
    ws.getColumn(7).width = 25
    ws.getColumn(8).width = 25
    ws.getColumn(9).width = 25
    ws.getColumn(10).width = 15
    ws.getColumn(11).width = 10
    ws.getColumn(12).width = 20
    ws.getColumn(13).width = 20
    ws.getColumn(14).width = 25

    const tableStart = 4 + infoRowsCount + 1
    // Шапка таблицы
    ws.getRow(tableStart).values = [
        'Ведущий (подталкиваемый) локомотив',
        'Ведущий (подталкиваемый) локомотив',
        'Ведущий (подталкиваемый) локомотив',
        'Ведущий (подталкиваемый) локомотив',
        'Ведущий (подталкиваемый) локомотив',
        'Ведущий (подталкиваемый) локомотив',
        'Ведущий (подталкиваемый) локомотив',
        'Ведомый (подталкивающий) локомотив',
        'Ведомый (подталкивающий) локомотив',
        'Ведомый (подталкивающий) локомотив',
        'Ведомый (подталкивающий) локомотив',
        'Ведомый (подталкивающий) локомотив',
        'Ведомый (подталкивающий) локомотив',
        'Ведомый (подталкивающий) локомотив',   
    ]
    ws.getRow(tableStart + 1).values = [
        'Локомотив',
        'Депо бригады',
        '№ ММ',
        '№ поезда',
        'Станции следования',
        'Дата и время следования',
        'Вид следования',
        'Локомотив',
        'Депо бригады',
        '№ ММ',
        '№ поезда',
        'Станции следования',
        'Дата и время следования',
        'Вид следования',
    ]
    ws.getRow(tableStart + 2).values = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
    ]
    ws.mergeCells(`A${tableStart}:G${tableStart}`)
    ws.mergeCells(`H${tableStart}:N${tableStart}`)
    // eachCell идет по всем ячейкам строки
    ws.getRows(tableStart, 3)?.forEach((row) => {
        row.eachCell((cell) => {
            cell.alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' }
            cell.style.font = { size: 10, bold: true }
            // цвет ячеек
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffEFEFF8' }
            }
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        })
    })
    const colorPairError='B0C4DE'
    const colorVslError='C4E5F8'
    const colorTimeError='FF0000'
    const dataStart = tableStart + 3
    // проходим по всем данным 
    data.forEach((el, index) => {
        ws.getRow(dataStart + index).values = [
            el.sec_mod_1 !== null ? el.sec_mod_1 + ' - ' + el.ser_name_1 + ' № ' + el.sec_num_1 : '',
            el.id_org_1 !== null ? el.id_org_1 + ' - ' + el.depo_name_1 : '',
            el.mm_num_1 !== null ? el.mm_num_1 : '',
            el.train_num_1 !== null ? el.train_num_1 : '',
            el.st_beg_1 !== null ? el.st_beg_1 + ' - ' + el.st_beg_name_1 + '\n' + el.st_end_1 + ' - ' + el.st_end_name_1 : '',
            el.ts_beg_1 !== null ?  dayjs(el.ts_beg_1).format("DD.MM.YYYY HH:mm") + '\n' + dayjs(el.ts_end_1).format("DD.MM.YYYY HH:mm"): '',
            el.vsl_1 !== null ? el.vsl_1 : '',
            el.sec_mod_2 !== null ? el.sec_mod_2 + ' - ' + el.ser_name_2 + ' № ' + el.sec_num_2 : '',
            el.id_org_2 !== null ? el.id_org_2 + ' - ' + el.depo_name_2 : '',
            el.mm_num_2 !== null ? el.mm_num_2 : '',
            el.train_num_2 !== null ? el.train_num_2 : '',
            el.st_beg_2 !== null ? el.st_beg_2 + ' - ' + el.st_beg_name_2 + '\n' + el.st_end_2 + ' - ' + el.st_end_name_2 : '',
            el.ts_beg_2 !== null ?  dayjs(el.ts_beg_2).format("DD.MM.YYYY HH:mm") + '\n' + dayjs(el.ts_end_2).format("DD.MM.YYYY HH:mm"): '',
            el.vsl_2 !== null ? el.vsl_2 : '',
        ]
        ws.getRow(dataStart + index).eachCell((cell) => {
            cell.style.font = {
                size: 10
            }
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        })
        if (el.error_pair){
            ws.getRow(dataStart + index).eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: colorPairError }
                }
            })
        }
        if (el.error_vsl){
            ws.getRow(dataStart + index).eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: colorVslError }
                }
            })
        }
        if (el.error_time){
            const time1=ws.getCell(`F${dataStart + index}`);
            const time2=ws.getCell(`M${dataStart + index}`);
            time1.font = {color:{argb: colorTimeError}}
            time2.font = {color:{argb: colorTimeError}}

        }
        // indent отступы
        // wrapText раздвигать высоту строки если текст не влезает
        ws.getCell(`A${dataStart + index}`).style.alignment = { horizontal: 'left', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`B${dataStart + index}`).style.alignment = { horizontal: 'left', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`C${dataStart + index}`).style.alignment = { horizontal: 'right', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`D${dataStart + index}`).style.alignment = { horizontal: 'right', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`E${dataStart + index}`).style.alignment = { horizontal: 'left', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`F${dataStart + index}`).style.alignment = { horizontal: 'center', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`G${dataStart + index}`).style.alignment = { horizontal: 'center', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`H${dataStart + index}`).style.alignment = { horizontal: 'left', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`I${dataStart + index}`).style.alignment = { horizontal: 'left', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`J${dataStart + index}`).style.alignment = { horizontal: 'right', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`K${dataStart + index}`).style.alignment = { horizontal: 'right', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`L${dataStart + index}`).style.alignment = { horizontal: 'left', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`M${dataStart + index}`).style.alignment = { horizontal: 'center', vertical: 'middle', indent: 1, wrapText: true }
        ws.getCell(`N${dataStart + index}`).style.alignment = { horizontal: 'center', vertical: 'middle', indent: 1, wrapText: true }
    })

    
    createOuterBorder(
        ws,
        { row: tableStart, col: 1 },
        { row: data.length + dataStart - 1, col: 14 }
    );

    // Сохранение файла
    wb.xlsx
        .writeBuffer()
        .then(data2 => {
            const blob = new Blob([data2], { type: blobType });
            FileSaver.saveAs(blob, fileName);
        })
        .catch(err => {
            console.log(err.message);
        });
}