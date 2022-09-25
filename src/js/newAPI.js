import axios from "axios";
    
const BASE_URL = 'https://pixabay.com/api/';
const key = '30138739-91917411df1cd3860f7789c37';
const image_type = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';

export default class NewPixabay {
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
        const data = await axios.get(BASE_URL, options);
                this.incrementePage();
                console.log(data);
                return data;
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



// fetchImage() {
//     const url = `https://pixabay.com/api/?key=29818615-eeef91044a0285c2bbb309d67&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
// return fetch(url).then(response => response.json())
//   .then(data => {
//     this.incrementPage();
//     return data;
//   });
// }




// function fetchImage(searchQuerry) {
//     return fetch(`${BASE_URL}`)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(response.status);
//             }
//             return response.json()
//         });

    
    
    
    
    
    //     .then(data => console.log(data))
    //     .catch(err => console.log("Error!"))
    // return data;
// }