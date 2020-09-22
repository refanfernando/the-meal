const dataMeal = document.querySelector('.row.data-meal');
import "../components/modal-overlay.js";
import axios from "../../../node_modules/axios";
import "../components/loading-spinner"

class SearchFigure extends HTMLElement {
    connectedCallback() {
        this.id = this.getAttribute('id') || null
        this.src = this.getAttribute('src') || null
        this.caption = this.getAttribute('caption') || null
        this.render()
    }

    set data(event) {
        this._data = event;
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

    async getData(id) {
        this.getLoading(true);
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            this.getLoading(false);
            const data = response.data.meals[0];
            console.log(data)
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

    render() {
        this.innerHTML = `
        <figure class="figure mr-1">
            <input type="hidden" value="${this.id}"/>
            <img src="${this.src}" class="figure-img img-fluid rounded" alt="...">
            <figcaption class="figure-caption"><h4 class="text-center">${this.caption}</h4></figcaption>
        </figure>
        `

        this.querySelector('figure').addEventListener('click', () => {
            this.getData(this.id);
        })
    }
}

customElements.define('show-figure-search', SearchFigure);