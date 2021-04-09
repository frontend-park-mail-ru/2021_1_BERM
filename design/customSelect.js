const getTemplate = (data = [], placeholder, selectedId, selectorId) => {
    let text = placeholder ?? 'Placeholder по умолчанию'
    let type = 'category';

    const items = data.map(item => {
        let cls = ''
        let element = "select__item ${cls}";
        if (item.type === 'category') {
            element = 'category';
        }
        if (item.id === selectedId) {
            text = item.value
            cls = 'selected';
            type = item.type;
        }
        return `
      <li class="${element}" data-type="${item.type}" data-id="${item.id}">${item.value}</li>
    `
    })

    return `
    <div class="select__backdrop" data-type="backdrop"></div>
    <div class="select__input" data-type="input" id="${selectorId}">
      <span data-type="value">${text}</span>
      <i class="fa fa-chevron-down" data-type="arrow"></i>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${items.join('')}
      </ul>
    </div>
  `
}

class Select {
    constructor(selector, options, idSelector) {
        this.$el = document.querySelector(selector)
        this.options = options
        this.selectedId = options.selectedId
        this.idSelectorDoc = null;
        this.idSelector = idSelector;

        this.render()
        this.setup()
    }

    render() {
        const {placeholder, data} = this.options
        this.$el.classList.add('select')
        this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId, this.idSelector)
        this.idSelectorDoc = document.getElementById(this.idSelector);
    }

    setup() {
        this.clickHandler = this.clickHandler.bind(this)
        this.$el.addEventListener('click', this.clickHandler)
        this.$arrow = this.$el.querySelector('[data-type="arrow"]')
        this.$value = this.$el.querySelector('[data-type="value"]')
    }

    clickHandler(event) {
        const {type} = event.target.dataset
        console.log(event.target.dataset)

        if (type !== undefined ) {
            console.log(type.type)
        }

        if (type === 'input') {
            this.toggle()
        } else if (type === 'item') {
            const id = event.target.dataset.id
            this.select(id)
        } else if (type === 'backdrop') {
            this.close()
        }
    }

    get isOpen() {
        return this.$el.classList.contains('open')
    }

    get current() {
        return this.options.data.find(item => item.id === this.selectedId)
    }

    select(id) {
        this.selectedId = id
        this.$value.textContent = this.current.value

        this.$el.querySelectorAll('[data-type="item"]').forEach(el => {
            el.classList.remove('selected')
        })
        this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')

        this.options.onSelect ? this.options.onSelect(this.current) : null

        this.close()
    }

    toggle() {
        this.isOpen ? this.close() : this.open()
    }

    open() {
        this.idSelectorDoc.style.borderRadius = '8px 8px 0 8px'
        this.$el.classList.add('open')
        this.$arrow.classList.remove('fa-chevron-down')
        this.$arrow.classList.add('fa-chevron-up')
    }

    close() {
        this.idSelectorDoc.style.borderRadius = '8px'
        this.$el.classList.remove('open')
        this.$arrow.classList.add('fa-chevron-down')
        this.$arrow.classList.remove('fa-chevron-up')
    }

    destroy() {
        this.$el.removeEventListener('click', this.clickHandler)
        this.$el.innerHTML = ''
    }
}

const bizarro = new Select('#select', {
    placeholder: 'Категория',
    // selectedId: '2',
    data: [
        {id: '1', value: 'Гей Стриптиз', type: 'category'},
        {id: '2', value: 'Фронтенд', type: 'item'},
        {id: '3', value: 'Бекенд', type: 'category'},
        {id: '4', value: 'Бизарро', type: 'item'},
        {id: '5', value: 'Зарф', type: 'category'},
        {id: '6', value: 'For Привет', type: 'item'}
    ],
    onSelect(item) {
        console.log('Selected Item', item)
    },
}, 'dynamic-style')

let data = [
    {id: '1', value: 'Гей Стриптиз'},
    {id: '2', value: 'Фронтенд'},
    {id: '3', value: 'Бекенд'},
    {id: '4', value: 'Бизарро'},
    {id: '5', value: 'Зарф'},
    {id: '6', value: 'For Привет'}
];

console.log(data[0].id);