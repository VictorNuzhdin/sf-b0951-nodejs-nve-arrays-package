"use strict";

/**
 *=КЛАСС ОБРАБОТКИ СПИСКА ОБЪЕКТОВ ТИПА "EMPLOYEE" (Сотрудники)
 * - реализованы методы возвращающие CSV и JSON структуры по полученному списку/массиву объектов;
 * 
 */
 const moment = require('moment');

 // Класс по работе с массивами объектов типа "Сотрудник"
 class EmpArrays {
    static classTitle = "EmpArrays";

    /**
     *=Метод формирует CSV структуру из списка объектов без CSV заголовка или с ним
     * @param {*} objList   - список объектов класса Employee;
     * @param {*} isHeader  - выводить (true) или нет CSV заголовок (false). По-умолчанию false;
     * @returns empDataCSV  - CSV строковая структура
     *                        Пример вывода с заголовком:
     *                        empId, empName, empAge, empSalary
     *                        1001, John Does, 42, 4000
     *                        1002, Eric Jobs, 27, 2000
     */
    static getInfoFromListObjectsCSV(objList, isHeader = false) {

        //=DEBUG:
        //console.log(objList);
        //console.log(objList[0].getID(), objList[0].getName());
        // OUTPUT1: [ Employee {}, Employee {}, Employee {}, Employee {}, Employee {}, Employee {} ]
        // OUTPUT2: 1001 John Does

        // isHeader: default - false
        // csv delimeter
        const dlm = ", ";
        let empDataCSV = "";
        let empDataCSVHeader = "empId" + dlm + "empName" + dlm + "empAge" + dlm + "empSalary";
        empDataCSV += isHeader ? empDataCSVHeader + "\n" : "";
        for (let emp of objList) {
            // private поля не доступны из внешнего класса (будет или ошибка доступа, или результат будет "undefined")
            //empDataCSV += emp.#gid + dlm + emp.#name + dlm + emp.#age + dlm + emp.#salary;
            //empDataCSV += emp.gid + dlm + emp.name + dlm + emp.age + dlm + emp.salary;
            //
            // Поэтому нужно вызывать соотвествующие getter методы для доступа к полям
            empDataCSV += emp.getID() + dlm + emp.getName() + dlm + emp.getAge() + dlm + emp.getSalary();
            empDataCSV += "\n";
        }
        //return isHeader ? empDataCSVHeader + "\n" + empDataCSV : empDataCSV;
        return empDataCSV;
    }

    /**
     *=Метод формирует JSON структуру из списка объектов + добавляет доп. ключи и поля
     * @param {*} objList   - список объектов класса Employee;
     * @returns empDataJSON - строка с JSON данными по списку объектов;
     *          Пример вывода с форматированием:
     *          {
     *              "emp1001":{
     *                  "empId": 1001,
     *                  "empName": "John Does",
     *                  "empAge": 42,
     *                  "empSalary": 4000,
     *                  "ts0": "20230401190246",
     *                  "ts1": "2023-04-01 19:02:46"
     *              },"emp1002":{
     *              ..
     *              }
     *          }
     */
    static getInfoFromListObjectsJSON(objList) {
        let empDataJSON = "{";

        //..обходим список/массив объектов Employee и формируем JSON структуру
        let arrLen = objList.length;
        let currentPos = 0;

        for (let emp of objList) {
            empDataJSON += '"emp'+ emp.getID() +'":';
            let singleJSON = {
                "empId": emp.getID(),
                "empName": emp.getName(),
                "empAge": emp.getAge(),
                "empSalary": emp.getSalary(),
                "ts0": moment(new Date()).format('YYYYMMDDHHmmss'),
                "ts1": moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
            currentPos += 1;
            //..если объект последний в списке то запятую в конце JSON структуры не ставим
            //empDataJSON += JSON.stringify(singleJSON) + (currentPos==arrLen ? '' : ',');
            empDataJSON += JSON.stringify(singleJSON, null, 4) + (currentPos==arrLen ? '' : ',');
        }
        empDataJSON += "}";
        //
        return empDataJSON;
    }

    /**
     *=Метод формирует JSON структуру содержащую статистические данные по списку объектов
     * @param {*} objList    - список объектов класса Employee;
     * @returns statDataJSON - строка с JSON данными содержащая статистику по списку объектов;
     *          Пример вывода с форматированием:
     *          {
     *              "classTitle":"Class Employee",
     *              "totalQuantity":6,
     *              "totalSalary":27000,
     *              "totalAvgSalary":4500,
     *              "ts":"20230401190246"
     *          }
     */
    static getStatFromListObjectsJSON(objList) {
        const classTitle = objList[0].getClassTitle();
        const totalQuantity = objList.length;
        let totalSalary = 0;

        for (let emp of objList) {
            totalSalary += emp.getSalary();
        }
        let statDataJSON = {
            "classTitle": classTitle,
            "totalQuantity": totalQuantity,
            "totalSalary": totalSalary,
            "totalAvgSalary": totalSalary / totalQuantity,
            "ts": moment(new Date()).format('YYYYMMDDHHmmss')
        }
        //return JSON.stringify(statDataJSON);
        return JSON.stringify(statDataJSON, null, 4);
    }
}
// Экспортируем Класс (без экспорта Класс невозможно будет вызвать при импорте через "require")
module.exports = EmpArrays
