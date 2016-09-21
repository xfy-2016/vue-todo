const STORAGE_KEY = 'todos-vuejs'
export default {
	fetch (items) {
		return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || items 
	},
	save (items) {
		console.log("save")
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
	}
}