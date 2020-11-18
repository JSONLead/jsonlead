const init = async () => {
  const markdown = await fetch('md/jsonlead_v2.md').then(r => r.text())
  document.getElementById('content').innerHTML = marked(markdown);
}

document.addEventListener('DOMContentLoaded', init);
