import {View} from '@/views/view';
import searchTemplate from '@/components/pages/search/search.pug';

/** View страницы поиска */
export class SearchView extends View {
    /**
     * Отображение страницы и получение с нее данных
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        super.renderHtml(
            isAuthorized,
            isExecutor,
            'Поиск',
            searchTemplate(),
            [],
        );
    }
}
