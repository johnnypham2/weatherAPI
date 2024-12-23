


function SaveToLocalStorageByCityName(cityName, favorites){
    favorites.push(cityName);
    localStorage.setItem('Favorites',JSON.stringify(favorites));
}
function GetLocalStorage(){
    const localStorageData = localStorage.getItem('Favorites');
    let favorites;
    if(localStorageData === null){
        favorites =[];
    }else{

        favorites = JSON.parse(localStorageData);
    }
    return favorites
}

function RemoveFromLocalStorage(cityName, favorites){
    let cityIndex = favorites.indexOf(cityName);
    favorites.splice(cityIndex,1);
    localStorage.setItem('Favorites',JSON.stringify(favorites));
}


export {SaveToLocalStorageByCityName, GetLocalStorage, RemoveFromLocalStorage}