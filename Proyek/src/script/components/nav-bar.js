import "./search-bar";
import "../view/main"
const modal = document.querySelector('modal-overlay');

class NavBar extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute: ${name} changed!`);
    }

    set dropdownToModal(event) {
        this.getData(event.data);
    }

    modalFigure(e) {
        modal.addModalBody = `
        <div class="col-lg-2 col-md-4 col-sm-6">
            <figure class="figure mr-1 btn onclickOnModal" data-toggle="modal" data-target="#staticBackdrop">
                <input type="hidden" value=${e.idMeal}>
                <img src="${e.strMealThumb}" class="figure-img img-fluid rounded" alt="...">
                <figcaption class="figure-caption onclickOnModal"><h6 class="text-center">${e.strMeal}</h6></figcaption>
            </figure>
        </div>
        `;
    }

    async getData(event) {
        console.log('e', event)
        modal.resetModalBody = '';
        event.meals.map(e => (
            this.modalFigure(e)
        ))
    }

    refresh() {
        location.reload();
    }

    render() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light fixed-top" >
                <div class="container">
                <a class="navbar-brand" href="#"><span class="home">Home</span> <span class="breadcrumb-item active d-inline text-primary" aria-current="page"></span></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Select category by area
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown"> </div>
                        </li>
                    </ul>
                <search-bar></search-bar>
                </div>
                </div>
            </nav>
            <div class="jumbotron mt-5">
                <h1 class="display-4 text-dark ">The Meal</h1>
                <p class="lead text-danger">Get what you want</p>
            </div>
        `;
        this.querySelector('.home').addEventListener('click', this.refresh);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
        this.render();
    }

    static get observedAttributes() {
        return ["src"];
    }

}

customElements.define('nav-bar', NavBar);