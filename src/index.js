import './css/styles.css';
// import NewPixabay from './js/newAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from "axios";

const refs = {
    searchForm: document.querySelector('.search-form'),
    galeryEl: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onFormSubmit)
refs.loadMoreBtn.addEventListener('click', onLoadMore)

const BASE_URL = 'https://pixabay.com/api/';
const key = '30138739-91917411df1cd3860f7789c37';
const image_type = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';

let isShown = 0;

class NewPixabay {
    constructor () {
        this.searchQuery = '';
        this.page = 1;
    }

    
    async fetchImage() {
        const options = {
            params: {
                key,
                q: this.searchQuery,
                image_type,
                orientation,
                safesearch,
                page: this.page,
                per_page: 40,
            }
        }

        try {
        const response = await axios.get(BASE_URL, options);
                this.incrementePage();
                return response.data;
            }
        catch (error) {
            console.error(error);
            }

    }
    
    incrementePage() {
        this.page += 1;
    }
    
    resetPage() {
        this.page = 1;
    }
    
    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

const Pixabay = new NewPixabay();

function onFormSubmit(e) {
    e.preventDefault();
    isShown = 0;

    refs.galeryEl.innerHTML = '';

    Pixabay.query = e.currentTarget.elements.searchQuery.value.trim();
    // console.log(Pixabay.resetPage);
    Pixabay.resetPage();

    if (!Pixabay.query) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    // const form = e.target;
    // const searchQuerry = form.elements.searchQuery.value;
    
    // Pixabay.fetchImage()
    //     .then(data => console.log(data));
    fetchImage();
}

function onLoadMore() {
    Pixabay.incrementePage();
    fetchImage();
}

async function fetchImage() {
    refs.loadMoreBtn.classList.add('is-hidden');
    
    const { hits, total, totalHits } = await Pixabay.fetchImage();    
    
        if (!hits.length) {
            return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }

    renderGallery(hits);

    isShown += hits.length;

    if (isShown < totalHits) {
        refs.loadMoreBtn.classList.remove('is-hidden');
    }

    if (isShown >= totalHits) {
        Notify.info("We're sorry, but you've reached the end of search results.");
    }
}


function renderGallery(hits) {
    const markup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>
  </a>`}).join('');
    refs.galeryEl.insertAdjacentHTML('beforeend', markup);
    
    simpleLightBox.refresh();
}
const simpleLightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });


