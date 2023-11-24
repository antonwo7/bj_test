export function objectToFormData (data: any) {
    const formData = new FormData();

    if (typeof data === 'object') {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key])
            }
        }
    }

    return formData
}