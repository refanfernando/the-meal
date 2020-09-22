class SearchBar extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    set clickEvent(event) {
        this._clickEvent = event;
        this.render();
    }

    get value() {
        return this.querySelector('.searchElement').value;
    }

    render() {
        this.innerHTML = `
            <form class="form-inline my-2 my-lg-0">
                <input class="form-control mr-sm-2 searchElement" type="search" placeholder="Search (category, area, etc)" aria-label="Search">
                <button class="btn btn-outline-success my-2 my-sm-0">Search</button>
            </form>
        `;
        const btn = this.querySelector(".btn");
        const clickEvent = this._clickEvent;
        btn.addEventListener('click', function (e) {
            clickEvent();
            e.preventDefault();
        });
    }
}

customElements.define('search-bar', SearchBar);