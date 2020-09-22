import "../components/modal-overlay.js";
import axios from "../../../node_modules/axios";
import "../components/loading-spinner"
const modal = document.querySelector('modal-overlay');

class Figure extends HTMLElement {
    connectedCallback() {
        this.src = this.getAttribute('src') || null
        this.caption = this.getAttribute('caption') || null
        this.render()
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

    async getData(categories) {
        modal.resetModalBody = '';
        modal.addModalBody = `<div class="col"><loading-spinner></loading-spinner></div>`;
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categories}`);
            const responseJson = await response.data.meals;
            modal.resetModalBody = '';
            responseJson.map(e => (
                this.modalFigure(e)
            ))
            document.querySelector('.modal-title').innerHTML = categories
        } catch (e) {
            modal.category = e;
            modal.resetModalBody = '';
            modal.modalBody = e;
        }
    }

    render() {
        this.innerHTML = `
        <figure class="figure mr-1 show-modal" data-toggle="modal" data-target="#staticBackdrop">
            <img src="${this.src}" class="figure-img img-fluid rounded" alt="...">
            <figcaption class="figure-caption"><h4 class="text-center">${this.caption}</h4></figcaption>
        </figure>
        `

        this.querySelector('figure').addEventListener('click', () => {
            this.getData(this.caption);
        })
    }
}

customElements.define('show-figure', Figure);