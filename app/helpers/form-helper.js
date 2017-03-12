export function getFormData(event) {
    return Array.from(event.target.elements)
        .filter(el => el.name)
        .reduce((a, b) => {
            if (b.getAttribute("type") === 'checkbox') {
                if (b.checked) {
                    return {
                        ...a,
                        [b.name]: b.value
                    };
                } else {
                    return {...a};
                }
            } else {
                return {
                    ...a,
                    [b.name]: b.value
                };
            }
        }, {});
}