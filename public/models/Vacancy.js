import {imgUrl} from '@/modules/constants/constants';

/** Класс для хранения откликов */
class Vacancy {
    /**
     * Конструктор
     */
    constructor() {
        this.currentVacancyId = -1;
        this.vacancysMap = new Map([]);
    }

    /**
     * Установка атрибутов пользователя
     *
     * @param {Object} attr - результат запроса
     */
    setAttributes(attr) {
        this.vacancysMap.set(Number(attr.id), attr);
        this.currentVacancyId = Number(attr.id);
    }

    /**
     * Устанавливаем вакансии
     *
     * @param {Object} data - массив вакансий
     */
    setVacancys(data) {
        data.forEach((res) => {
            this.setAttributes({
                isArchived: res.is_archived,
                id: res.id,
                avatar: res.user_img ? imgUrl + res.user_img : undefined,
                login: res.login,
                name: res.vacancy_name,
                customerId: res.customer_id,
                category: res.category,
                definition: res.description,
                salary: res.salary,
                selectExecutor: res.executor_id?res.executor_id:null,
            });
        });
    }

    /**
     * Получаем информацию о вакансии
     *
     * @param {number} id - уникальный номер вакансии
     *
     * @return {Object} - информация о вакансии
     */
    getVacancyById(id) {
        return this.vacancysMap.get(id);
    }

    /**
     * Устанавливаем отклики
     *
     * @param {number} id - уникальный номер вакансии
     * @param {Response} res - все отклики
     */
    setResponses(id, res) {
        const responses = [];

        res.forEach((item) => {
            responses.push(this.pushResponse(id, item));
        });

        this.vacancysMap.get(id).responses = responses;
    }

    /**
     * Возвращаем структурированный отклик
     *
     * @param {number} id - уникальный номер вакансии
     * @param {Object} item - информация отклика
     *
     * @return {Object}
     */
    pushResponse(id, item) {
        return {
            id: item.id,
            creatorId: item.user_id,
            avatar: item.user_img ? imgUrl + item.user_img : undefined,
            login: item.user_login,
            rate: item.rate,
            text: item.text,
        };
    }

    /**
     * Устанавливаем один отклик
     *
     * @param {number} id - уникальный номер заказа
     * @param {Object} item - информация отклика
     */
    push(id, item) {
        this.vacancysMap.get(id).responses.push(this.pushResponse(id, item));
    }

    // /**
    //  * Ищем ставку по уникальным номерам
    //  *
    //  * @param {number} id - уникальный номер вакансии
    //  * @param {Object} creatorId - уникальный номер автора отклика
    //  *
    //  * @return {Object} rate - найденная ставка
    //  */
    // findRate(id, creatorId) {
    //     let rate = 0;
    //     this.vacancysMap.get(id).responses.forEach((item) => {
    //         if (item.creatorId === creatorId) {
    //             rate = item.rate;
    //         }
    //     });
    //     return rate;
    // }

    /**
     * Ищем ставку по уникальным номерам
     *
     * @param {number} id - уникальный номер вакансии
     * @param {Object} creatorId - уникальный номер автора отклика
     *
     * @return {Object} text - найденная ставка
     */
    findTextRate(id, creatorId) {
        let text = '';
        this.vacancysMap.get(id).responses.forEach((item) => {
            if (item.creatorId === creatorId) {
                text = item.text;
            }
        });
        return text;
    }

    /**
     * Удаляем ставку
     *
     * @param {number} id - уникальный номер вакансии
     * @param {Object} creatorId - уникальный номер автора отклика
     */
    deleteResponse(id, creatorId) {
        let pos;
        this.vacancysMap.get(id).responses.forEach((item, index) => {
            if (item.creatorId === creatorId) {
                pos = index;
            }
        });

        this.vacancysMap.get(id).responses.splice(pos, 1);
    }

    /**
     * Ищем отклик
     *
     * @param {Object} vacancy - уникальный номер вакансии
     * @param {number} id - уникальный номер отклика
     *
     * @return {Object} select - информацию по отклику
     */
    getSelectResponse(vacancy, id) {
        if (!id || !vacancy) {
            return null;
        }

        let select = null;
        this.vacancysMap.get(vacancy).responses.forEach((item) => {
            if (item.creatorId === id) {
                select = item;
            }
        });
        return select;
    }

    /** Обнуляем вакансии */
    clear() {
        this.currentVacancyId = -1;
        this.vacancysMap = new Map([]);
    }
}

export default new Vacancy();
