const deleteProduct = (button) => {
    const id = button.parentNode.querySelector('[name=id]').value;
    const csrf = button.parentNode.querySelector('[name=_csrf]').value;
    const productDOM = button.closest('article');

    fetch('/admin/product/' + id, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            return result.json();
        })
        .then(data => {
            productDOM.parentNode.removeChild(productDOM);
        })
        .catch(error => {
            console.log(error);
        })
};
