import Clipboard from 'clipboard';

const preElements = document.querySelectorAll('pre');

for (const element of preElements) {
  const mermaid = element.getElementsByClassName('language-mermaid')[0];

  if (mermaid == null) {
    element.insertAdjacentHTML('afterbegin', '<button class="btn btn-copy"></button>');
  }
}

const clipboard = new Clipboard('.btn-copy', {

  target: function(trigger) {
    return trigger.nextElementSibling;
  },

});

clipboard.on('success', function(e) {
    e.clearSelection();
});

clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
