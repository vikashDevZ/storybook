const getSpinElement = () => {
  let spinElement = document.createElement('div');
  spinElement.setAttribute(
    'style',
    'color:white;font-size:15px;position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;background: rgba(255, 255, 255, 0.6);text-align: center;display:flex;justify-content:center;align-items: center;'
  );
  spinElement.className = 'loader';
  spinElement.innerHTML = "<div class='spinner'></div>";
  return spinElement;
};
const startSpinning = (element) => {
  if(!element){
    return;
  }
  if (typeof element == 'string') {
    let elements = document.querySelectorAll(element);
    elements.forEach((ele) => {
      ele.appendChild(getSpinElement());
    });
  } else {
    element.appendChild(getSpinElement());
  }
};

const stopSpinning = (element) => {
  if(!element){
    return;
  }
  let loader;
  if (typeof element == 'string') {
    let elements = document.querySelectorAll(element);
    elements.forEach((ele) => {
      loader = ele.querySelector(':scope > .loader');
      if (loader) {
        loader.remove();
      }
    });
  } else {
    loader = element.querySelector(':scope > .loader');
    if (loader) {
      loader.remove();
    }
  }
};

const stopSpinningAll = () => {
  let elements = document.querySelectorAll('.loader');
  elements.forEach((ele) => {
    ele.remove();
  });
};
window.startSpinning = startSpinning;
window.stopSpinning = stopSpinning;
window.stopSpinningAll = stopSpinningAll;
