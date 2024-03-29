export function getFormData(form) {
    return Array.from(form.elements)
        .filter(el => el.name)
        .reduce((a, b) => {
            if (b.getAttribute("type") === 'checkbox' || b.getAttribute("type") === 'radio') {
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

export function clearFormData(event) {
    return Array.from(event.target.elements)
        .filter(el => el.name)
        .map((a) => {
            if (a.getAttribute('type') === 'checkbox') {
                e.checked = false;
            } else {
                e.value = '';
            }
        }, {});
}