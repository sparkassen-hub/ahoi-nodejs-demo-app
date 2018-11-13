
const toggleSubmitButton = (activeClass, activeAttribute, callback) => {
  const forms = document.querySelectorAll('form[required]');
  for (const form of forms) {
    addListeners(form.querySelectorAll('[required]'), 'change keyup', (event) => {
      let isValid = true;
      for (const inputField of form.querySelectorAll('[required]')) {
        const type = (inputField.type || '').toLowerCase();
        if (type === 'radio' || type === 'checkbox') {
          isValid = !inputField.checked ? false : isValid;
        } else if (inputField.tagName.toLowerCase() === 'select') {
          isValid = !inputField.selectedIndex === -1 ? false : isValid;
        } else {
          isValid = !inputField['value'] ? false : isValid;
        }
      }
      const submitButton = form.querySelector('[type=submit]') || form.querySelector('input.submit')
      if (submitButton) {
        if (activeClass) {
          isValid ? submitButton.classList.remove(activeClass) : submitButton.classList.add(activeClass);
        } else if (activeAttribute) {
          isValid ? submitButton.removeAttribute(activeAttribute) : submitButton.setAttribute(activeAttribute, activeAttribute);
        } else if (callback) {
          callback(isValid, submitButton);
        }
      }
    });
  }
}


const initAutocomplete = (bankList, name) => {
  return new autoComplete({
    selector: `input[name="${name}"]`,
    delay: 75,
    minChars: 1,
    source: autocompleteCallback(bankList.map(value => `${value.name} (BLZ ${value.bankCode})`)),
    onSelect: function (e, term, item) {
      // enable or disable next link depending whether a bank is selected
      if (term) {
        $find('.banklistsearch input.button').removeAttribute('disabled');
      } else {
        $find('.banklistsearch input.button').setAttribute('disabled');
      }
    }
  });
}

const autocompleteCallback = (list) => {
  return (term, responseCallback) => {
    const lowerTerm = term.toLowerCase();
    const regexTerm = new RegExp(lowerTerm.replace(/([a-z])/gi, '$1.*'));
    responseCallback(list.filter(((data) => {
      if (typeof data === 'string') {
        const value = data.toLowerCase();
        return value.includes(lowerTerm) || regexTerm.test(value);
      }

      if (!names || names.length === 0) {
        for (const key in data) {
          const value = data[key].toLowerCase();
          if ((typeof data[key] === 'string') &&
            (value.includes(lowerTerm) || regexTerm.test(value))) {
            return true;
          }
        }
        return false;
      }

      for (const name of names) {
        const value = data[name].toLowerCase();
        if (value.includes(lowerTerm) || regexTerm.test(value)) {
          return true;
        }
      }
      return false;
    })));
  }
}