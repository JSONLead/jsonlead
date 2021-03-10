const setValidInfo = (i, valid) => {
  const node = document.querySelector('#info');
  node.innerText = i;
  node.style.backgroundColor = valid ? '#2ba20d' : '#bb0f0f';
  node.style.color = 'white';
}

const jsonPrettyfier = json => json.split('').reduce((acc, ch) => {
  const prev_char = acc.processed[acc.processed.length - 1];
  if(ch === "{" || ch === "[")
    return {indentation_level: acc.indentation_level + 1, processed: `${acc.processed}${ch}\n${Array((acc.indentation_level + 1)*2).fill(' ').join('')}`};
  if(ch === "}" || ch === "]")
    return {indentation_level: acc.indentation_level - 1, processed: `${acc.processed}\n${Array(((acc.indentation_level || 1) - 1)*2).fill(' ').join('')}${ch}`};
  if(ch === ",")
    return {indentation_level: acc.indentation_level, processed: `${acc.processed}${ch}\n${Array(acc.indentation_level *2).fill(' ').join('')}`};
  return {indentation_level: acc.indentation_level, processed: `${acc.processed}${ch}`}
}, {indentation_level: 0, processed: ''}).processed;

const extractFailingPosition = str => {
  try{
    JSON.parse(str);
    return -1;
  }catch(err){
    return Number(err.message.match(/position (?<pos>\d+)/).groups.pos);
  }
}


const init = async () => {
  const schema = await fetch('schemas/jsonlead_v2.schema.json').then(r => r.json());
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const json = document.getElementById('json');
  const checkChange = data => {
    try{
      const json_data = JSON.parse(data);
      json.innerHTML = prettyPrintJson.toHtml(json_data, {
        indent: 2,
        quoteKeys: true,
      });
      const valid = validate(json_data);
      if(valid){
        setValidInfo(`Valid`, true)
      } else {
        setValidInfo('Invalid: '.concat(validate.errors.map(err => `${err.dataPath} ${err.message}`)), false);
      }
    } catch(err){
      setValidInfo('Invalid JSON'.concat(err), false);
      const p = jsonPrettyfier(jsonPrettyfier(data).split('\n').map(a => a.trim()).join(''));
      const fail_pos = extractFailingPosition(p);
      json.innerHTML = p
        .slice(0, fail_pos)
        .concat('<span class=error>')
        .concat(p.slice(fail_pos).concat('</span>'));
    }
  }
  document.querySelector('#input').addEventListener('input', e => checkChange(e.target.value))
}

document.addEventListener('DOMContentLoaded', init);
