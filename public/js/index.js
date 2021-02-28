function renderIndex() {
    const root = document.getElementById('root')

    document.title = 'Фриланс'

    root.innerHTML = ''
    root.innerHTML += navbar() + index()
}

renderIndex();
