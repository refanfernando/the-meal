const dataMeal = document.querySelector('.row.data-meal');
import axios from '../../../node_modules/axios';

class Modal extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    set resetModalBody(event) {
        this.querySelector('.modal-body .container .row').innerHTML = event;
    }

    set addModalBody(event) {
        this.querySelector('.modal-body .container .row').innerHTML += event;
    }

    getLoading(loading) {
        if (loading) {
            dataMeal.innerHTML = `
               <loading-spinner></loading-spinner>
            `
        } else {
            dataMeal.innerHTML = '';
        }
    }

    render() {
        this.innerHTML = `
        <div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="row"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        const row = this.querySelector('.row');
        row.addEventListener('click', (e) => {
            const clickTrue = e.target.parentElement.classList.contains('onclickOnModal');
            if (clickTrue) {
                let value = e.target.parentElement.children[0].value;
                if (!value) value = e.target.parentElement.parentElement.children[0].value;
                this.getLoading(true);
                this.viewDetails(value);
            }
        })
    }

    card(title, value) {
        let val = '';
        const showValue = () => {
            for (let i = 0; i < value.length; i++) {
                if (title == 'Measure') {
                    val += `${value[i]}</p>`;
                } else {
                    val += `<p>${i + 1}. ${value[i]}</p>`;
                }
            }
            return val;
        }
        return `
        <div class="card w-50 col mr-2">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                ${showValue()}
            </div>
        </div>
        `
    }

    async viewDetails(value) {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`);
            this.getLoading(false);
            const data = response.data.meals[0];
            let ingredient = [];
            let measure = [];

            const val = Object.values(data);

            for (let i = 9; i < 29; i++) {
                if (val[i]) {
                    ingredient.push(val[i]);
                }
            }
            for (let i = 29; i < 48; i++) {
                if (val[i]) {
                    measure.push(val[i]);
                }
            }

            dataMeal.innerHTML = `
            <div class="container">
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${data.strMealThumb}" class="card-img" alt="...">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${data.strMeal}</h5>
                            <div class="row">
                                ${this.card('Ingrediant', ingredient)}
                                ${this.card('Measure', measure)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            `
        } catch (e) {
            dataMeal.innerHTML = e;
            this.getLoading(false);
        }
    }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     this[name] = newValue;
    //     this.render();
    // }

    // static get observedAttributes() {
    //     return ["modal-body"];
    // }
}

customElements.define('modal-overlay', Modal);