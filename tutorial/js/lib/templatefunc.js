const templating = {};
templating.nodes = new Map();
templating.count = 1;
templating.baseElement = document.createElement('div');

templating.replaceWith = (element, newElement) => {
  if (typeof newElement === 'string') {
    newElement = templating.createElement(newElement);
  }
  templating.parent(element).replaceChild(newElement, element);
  return element;
}

templating.remove = (element) => {
  templating.parent(element).removeChild(element);
  return element;
}

templating.before = (element, newElement) => {
  if (typeof newElement === 'string') {
    newElement = templating.createElement(newElement);
  }
  templating.parent(element).insertBefore(newElement, element);
}

templating.after = (element, newElement) => {
  if (typeof newElement === 'string') {
    newElement = templating.createElement(newElement);
  }
  templating.parent(element).insertBefore(newElement, element.nextSibling);
}

templating.parent = (element) => {
  return element['parentElement'] || element.parent;
}

templating.createElement = (newElement) => {
  templating.baseElement.innerHTML = newElement;
  return templating.baseElement.firstChild;
}

templating.readSnippet = (id) => {
  if (!templating.nodes.has(id)) {
    // read html snippet with given id to use as template
    const tplNode = document.querySelector(`[template=${id}]`);
    const refs = [];

    const childTpl = tplNode.querySelectorAll('[template]');
    if (childTpl.length) {
      for (const child of childTpl) {
        const refId = child.getAttribute('template');
        refs.push(refId);
        templating.nodes.set(refId, {
          template: templating.replaceWith(child, `<tpl${templating.count} style="display: none !important;"/>`).outerHTML.replace(/\stemplate\s*=/, ' -template='),
          replaceno: templating.count,
        });
        templating.count += 1;
      }
    }

    const templateData = {
      refs,
      parent: templating.parent(tplNode),
      next: tplNode.nextSibling,
    };
    templating.nodes.set(id, templateData);
    templateData.template = templating.remove(tplNode).outerHTML.replace(/\stemplate\s*=/, ' -template=');
  } else {
    if (templating.nodes.get(id).refs && templating.nodes.get(id).refs.length) {
      const tpl = templating.nodes.get(id);
      for (const ref of tpl.refs) {
        const refTpl = templating.nodes.get(ref);
        tpl.template = tpl.template.replace(new RegExp(`<tpl${refTpl.replaceno} `), `<tpl${templating.count} `);
        tpl.template = tpl.template.replace(new RegExp(`</tpl${refTpl.replaceno}>`), `</tpl${templating.count}>`);
        refTpl.replaceno = templating.count;
        templating.count += 1;
      }
    }
  }

  return templating.nodes.get(id);
}

const template = (id, ...data) => {
  const templateData = templating.readSnippet(id);
  // merge all JSON data into one JSON object
  let merged = {};
  for (const item of data) {
    merged = Object.assign(merged, item);
  }

  let funcParams = [];
  let funcParamValues = [];
  for (const name in merged) {
    funcParams.push(name);
    funcParamValues.push(merged[name]);
  }

  // execute template function with parameter 'map' that contains all data as JSON
  const result = (new Function(funcParams.join(','), `return \`${templateData.template}\``)(...funcParamValues)).replace(/undefined/g, '');

  // replace html snippet in html document
  if (templateData.replaceno) {
    templating.before(document.getElementsByTagName(`tpl${templateData.replaceno}`)[0], result);
  } else if (templateData.next && templateData.next.length) {
    templating.before(templateData.next, result);
  } else {
    templateData.parent.appendChild(result);
  }
}