import axios from 'axios'
import "../components/search-bar.js"
import "../components/loading-spinner.js"
import "../components/show-figure"
import "../components/show-figure-search"
import "../components/nav-bar"
import "../components/show-figure-search"

const Main = () => {
    const url = 'https://www.themealdb.com/api/json/v1/1';
    const urlByArea = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=';
    const dataMeal = document.querySelector('.row.data-meal');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const seacrhElement = document.querySelector('search-bar');
    const breadcrumb = document.querySelector('.breadcrumb-item');
    const navBar = document.querySelector('nav-bar');
    const modal = document.querySelector('modal-overlay');

    const constructor = () => {
        getLoading(true);
        getData();
    }

    const filter = async (filterBy, value) => {
        try {
            const res = await axios.get(`${filterBy}${value}`);
            return res;
        } catch (message) {
            fallbackResult(message);
            return false;
        }
    }

    const onButtonSearchClicked = async () => {
        try {
            getLoading(true);
            const filterByCategory = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';
            const filterByArea = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=';
            const filterFirstLetter = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';
            const filterByName = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
            let res;
            res = await filter(filterByCategory, seacrhElement.value);
            if (!res.data.meals) {
                res = await filter(filterByArea, seacrhElement.value);
                if (!res.data.meals) {
                    res = await filter(filterFirstLetter, seacrhElement.value);
                    if (!res.data.meals) {
                        res = await filter(filterByName, seacrhElement.value);
                    }
                }
            }
            getLoading(false)
            console.log(res.data);
            if (!res.data.meals) {
                return dataMeal.innerHTML = '<h1>No result :(</h1>'
            }
            showDataBySearch(seacrhElement.value, res.data)

        } catch (message) {
            getLoading(false)
            fallbackResult(message);
        }

    }

    const getLoading = (loading) => {
        if (loading) {
            dataMeal.innerHTML = `
               <loading-spinner></loading-spinner>
            `
        } else {
            dataMeal.innerHTML = '';
        }
    }

    const getData = async () => {
        try {
            await getDataDropdownMenu();
            const response = await axios.get(`${url}/categories.php`);
            const responseJson = response.data;
            getLoading(false)
            showDataByCategories(responseJson)
        } catch (error) {
            getLoading(false)
            alert(error);
        }
    }

    const getDataDropdownMenu = async () => {
        try {
            const response = await fetch(`${url}/list.php?a=list`);
            const responseJson = await response.json();
            showDataDropdownMenu(responseJson)
        } catch (error) {
            getLoading(false)
            alert(error);
        }
    }

    const showDataByCategories = (data) => {
        const categories = data.categories;
        categories.map(e => (
            dataMeal.innerHTML += `
            <show-figure 
                src="${e.strCategoryThumb}"
                caption="${e.strCategory}">
            </show-figure>
            `
        ))
        breadcrumb.innerHTML = '/ All category'
    }

    const showDataBySearch = (title, data) => {
        const value = data.meals;
        dataMeal.innerHTML = '';
        value.map(e => (
            dataMeal.innerHTML += `
            <show-figure-search
                id="${e.idMeal}"
                src="${e.strMealThumb}"
                caption="${e.strMeal}">
            </show-figure-search>
            `
        ))
        breadcrumb.innerHTML = `/ ${title}`
    }

    const showDataDropdownMenu = (data) => {
        const meals = data.meals;
        meals.map(e => (
            dropdownMenu.innerHTML += `
            <a class="dropdown-item show-modal" href="#" data-toggle="modal" data-target="#staticBackdrop">${e.strArea}</a>
        `
        ))
        const dropdownItem = document.querySelectorAll('.dropdown-item');
        dropdownItem.forEach(a => {
            a.addEventListener('click', async function (e) {
                try {
                    document.querySelector('.modal-title').innerHTML = '';
                    modal.resetModalBody = '';
                    const res = await axios.get(`${urlByArea}${a.innerHTML}`);
                    navBar.dropdownToModal = res;
                    document.querySelector('.modal-title').innerHTML = a.innerHTML;
                    breadcrumb.innerHTML = `/ By ${a.innerHTML}`;
                } catch (e) {
                    modal.addModalBody = e;
                    console.log(e)
                }
            })
        })
    }

    $(window).scroll(function () {
        const wScroll = $(this).scrollTop();
        $('.jumbotron').css({
            'height': `${(200 - wScroll)}px`
        })
        console.log(wScroll)
    })

    constructor();
    seacrhElement.clickEvent = onButtonSearchClicked;

}

export default Main