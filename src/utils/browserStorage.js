
// Local Storage
// export const getItemLocalStorage = (key) => {
//     const item = localStorage.getItem(key)
//     return item
// }

export const getItemLocalStorage = (key) => {
    if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(key);
    }
    return null; // fallback if running on server
};

export const getJsonObjLocalStorage = (key) => {
    const obj = localStorage.getItem(key)
    return obj && obj !== "undefined" ? JSON.parse(obj) : false
}

export const setItemLocalStorage = (key, value) => {
    localStorage.setItem(key, value)
}

export const removeItemLocalStorage = (key) => {
    localStorage.removeItem(key)
}

export const clearLocalStorage = () => {
    localStorage.clear()
}

// Session Storage
export const setItemSessionStorage = (key, value) => {
    sessionStorage.setItem(key, value)
}

export const getItemSessionStorage = (key) => {
    const item = sessionStorage.getItem(key)
    return item
}

export const clearSessionStorage = ()=>{
    sessionStorage.clear()
}