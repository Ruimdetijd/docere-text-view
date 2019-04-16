function fetchXml(url: string): Promise<any> {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest
		xhr.open('GET', url)
		xhr.responseType = 'document'
		xhr.overrideMimeType('text/xml')

		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				if (xhr.responseXML == null) {
					reject(`Fetching XML of "${url}" failed`)
					return
				}
				resolve(xhr.responseXML)
			}
		}

		xhr.send()
	})
}

function wrap(node: Text, index: number, found: string) {
	const textRange = document.createRange()
	textRange.setStart(node, index)
	textRange.setEnd(node, index + found.length)
	const el = document.createElement('mark')
	textRange.surroundContents(el)
}

export {
	fetchXml,
	wrap,
}
