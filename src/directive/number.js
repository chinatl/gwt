export default {
	bind(el, binding) {
		el.addEventListener('keydown', e => {
			console.log(1);
		}, false)
	}
}
