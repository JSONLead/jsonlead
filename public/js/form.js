const e = React.createElement;
const { default: Form } = JSONSchemaForm;
const { useEffect, useState, useRef } = React;
const setValidInfo = (i, valid) => {
  const node = document.querySelector('#info');
  node.innerText = i;
  node.style.backgroundColor = valid ? '#2ba20d' : '#bb0f0f';
  node.style.color = 'white';
}

const removeEmpty = obj => Object
  .keys(obj)
  .map(key => {
    const v = obj[key];
    if(typeof v === 'object' && !Array.isArray(v) && Object(v) === v){
      if(Object.keys(v).length > 0){
        const emptied = removeEmpty(v);
        if(Object.keys(emptied).length > 0){
          return {[key]: emptied};
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else if(v != null) {
      return {[key]: v};
    } else return null;

  })
  .filter(f => f)
  .reduce((p,c) => Object.assign({}, p, c),{});

const Preview = ({ data }) => {
  const ref = useRef();
  console.log(data);
  return e('pre', {dangerouslySetInnerHTML: {__html: prettyPrintJson.toHtml(removeEmpty(data), {
    indent: 2,
    quoteKeys: true,
  })}});
}


const App = () => {
  const [ schema, setSchema ] = useState();
  const [ data, setData ] = useState({ version: '1.0.0', client: {} });
  useEffect(() => {
    fetch('schemas/jsonlead_v2.schema.json')
      .then(r => r.json())
      .then(setSchema)
  }, [])
  return schema && e('div', {style: {
    'display': 'flex',
    'gap': '1em',
  }}, [
    e('div', {style: {flex: 1}}, e(Form, {
      schema: schema,
      formData: data,
      onChange: e => setData(e.formData),
      liveValidate: true,
    })),
    e('div', {style: {flex: 1, overflowX: 'scroll'}}, e(Preview, {data})),
  ]) || null;
};

const init = async () => {
  ReactDOM.render(e(App), document.querySelector('#container'));
}

document.addEventListener('DOMContentLoaded', init);
