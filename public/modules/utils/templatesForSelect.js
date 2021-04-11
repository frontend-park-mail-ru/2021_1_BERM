import arrowDown from '@/static/img/Arrow_down.svg';

export const getTemplate = (data = [], placeholder, selectedId, selectorId) => {
    const text = placeholder ?? 'Placeholder по умолчанию';

    const items = data.map((item) => {
        let element = 'select__item ${cls}';
        if (item.type === 'category') {
            element = 'category';
        }
        return `
            <li class="${element}" data-type="${item.type}" data-id="${item.id}">${item.value}</li>`;
    });

    return `
    <div class="select__backdrop" data-type="backdrop"></div>
    <div class="select__input" data-type="input" id="${selectorId}">
      <input data-type="value" class="select__form" disabled value="${text}"/>
      <img src=${arrowDown} class="setting__arrow" data-type="arrow" alt="">
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${items.join('')}
      </ul>
    </div>
  `;
};

// Бухгалтерский учет и консалтинг
export const CAT___BUGH_UCHET_AND_CONSLAT = {id: '1', value: 'Бухгалтерский учет и консалтинг', type: 'category'};
export const BUGH = {id: '2', value: 'Бухгалтерия', type: 'item'};
export const FIN_PLAN = {id: '3', value: 'Финансовое планирование', type: 'item'};
export const ISP_CHELOV_RES = {id: '4', value: 'Использование человеческих ресурсов', type: 'item'};
export const UPR_CONSUL = {id: '5', value: 'Управленческое консультирование', type: 'item'};
export const BUGH_OTHER = {id: '6', value: 'Другое', type: 'item'};

// Администрирование
export const CAT___ADMINISTRATION = {id: '7', value: 'Бухгалтерский учет и консалтинг', type: 'category'};
export const OBR_DATA = {id: '8', value: 'Обработка данных', type: 'item'};
export const PERS_HELP = {id: '9', value: 'Персональная/Виртуальная Помощь', type: 'item'};
export const UPR_PROJECT = {id: '10', value: 'Управление проектом', type: 'item'};
export const WEB_ISSLED = {id: '11', value: 'Веб-исследования', type: 'item'};

// Data Science
export const CAT___DATA_SCIENCE = {id: '12', value: 'Data Science и аналитика', type: 'category'};
export const AB_TESTS = {id: '13', value: 'A/B Тестирование', type: 'item'};
export const IZVLECH_DATA = {id: '14', value: 'Извлечение данных/ETL', type: 'item'};
export const INTELECT_ANALIZ = {id: '15', value: 'Интеллектуальный анализ данных', type: 'item'};
export const VIZUAL_DATA = {id: '17', value: 'Визуализация данных', type: 'item'};
export const MACHINE_LEARNING = {id: '18', value: 'Машинное обучение', type: 'item'};

// IT и сети
export const CAT___IT_AND_NETWORK = {id: '19', value: 'Data Science и аналитика', type: 'category'};
export const ADMIN_DB = {id: '20', value: 'Администрирование баз данных', type: 'item'};
export const PROGRAM_OBESPECH = {id: '21', value: 'Программное обеспечение ERP / CRM', type: 'item'};
export const INF_SEC = {id: '22', value: 'Информационная безопасность', type: 'item'};
export const NETWORK_SYST_ADMIN = {id: '23', value: 'Сетевое и системное администрирование', type: 'item'};

// Веб-разработка, мобильные устройства и программное обеспечение (Web, Mobile & Software Dev)
export const CAT___WMSD = {id: '24', value: 'Программная разработка', type: 'category'};
export const DEV_PROGR_OBECPECH = {id: '25', value: 'Разработка программного обеспечения ПК', type: 'item'};
export const ELECTR_COMMERCH = {id: '26', value: 'Развитие электронной коммерции', type: 'item'};
export const GAME_DEV = {id: '27', value: 'Разработка игр', type: 'item'};
export const MOMILE_DEV = {id: '28', value: 'Мобильная разработка', type: 'item'};
export const UPR_PRODUCT = {id: '29', value: 'Управление продуктом', type: 'item'};
export const QA_TESTS = {id: '30', value: 'QA и тестирование', type: 'item'};
export const SCRIPTS_UTILS = {id: '31', value: 'Скрипты и утилиты', type: 'item'};
export const WEB_MOBILE = {id: '32', value: 'Веб и мобильный дизайн', type: 'item'};
export const WEB_DEV = {id: '33', value: 'Веб-разработка', type: 'item'};

export const listOfServices = [
    CAT___BUGH_UCHET_AND_CONSLAT,
    BUGH,
    FIN_PLAN,
    ISP_CHELOV_RES,
    UPR_CONSUL,
    BUGH_OTHER,
    CAT___ADMINISTRATION,
    OBR_DATA,
    PERS_HELP,
    UPR_PROJECT,
    WEB_ISSLED,
    CAT___DATA_SCIENCE,
    AB_TESTS,
    IZVLECH_DATA,
    INTELECT_ANALIZ,
    VIZUAL_DATA,
    MACHINE_LEARNING,
    CAT___IT_AND_NETWORK,
    ADMIN_DB,
    PROGRAM_OBESPECH,
    INF_SEC,
    NETWORK_SYST_ADMIN,
    CAT___WMSD,
    DEV_PROGR_OBECPECH,
    ELECTR_COMMERCH,
    GAME_DEV,
    MOMILE_DEV,
    UPR_PRODUCT,
    QA_TESTS,
    SCRIPTS_UTILS,
    WEB_MOBILE,
    WEB_DEV,
];
