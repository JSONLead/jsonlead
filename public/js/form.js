const e = React.createElement;
const { default: Form } = JSONSchemaForm;
const { useEffect, useState, useRef } = React;
const setValidInfo = (i, valid) => {
  const node = document.querySelector('#info');
  node.innerText = i;
  node.style.backgroundColor = valid ? '#2ba20d' : '#bb0f0f';
  node.style.color = 'white';
}
const Preview = ({ data }) => {
  const ref = useRef();
  return e('pre', {dangerouslySetInnerHTML: {__html: prettyPrintJson.toHtml(data, {
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
    e('div', {style: {flex: 1}}, e(Preview, {data})),
  ]) || null;
};

const init = async () => {
  ReactDOM.render(e(App), document.querySelector('#container'));
  /* const schema = await fetch('schemas/jsonlead_v2.schema.json').then(r => r.json());
   * const ajv = new Ajv();
   * const validate = ajv.compile(schema);
   * const BrutusinForms = brutusin["json-forms"];
   * const bf = BrutusinForms.create(schema);
   * const container = document.getElementById('container');
   * const json = document.getElementById('json');
   * bf.render(container, {version: '1.0.0', client: {first_name: "Name"}});
   * let prev_data = null;
   * const checkChange = data => {
   *   try{
   *     const json_data = JSON.parse(data);
   *     const valid = validate(json_data);
   *     if(valid){
   *       setValidInfo(`Valid`, true)
   *     } else {
   *       setValidInfo('Invalid: '.concat(validate.errors.map(err => `${err.dataPath} ${err.message}`)), false);
   *     }
   *   } catch(err){
   *     setValidInfo('Invalid JSON', false);
   *   }
   * }
   * setInterval(() => {
   *   const data = bf.getData();
   *   if(JSON.stringify(data) !== JSON.stringify(prev_data)){
   *     prev_data = data;
   *     json.innerHTML = prettyPrintJson.toHtml(data, {
   *       indent: 2,
   *       quoteKeys: true,
   *     });
   *     checkChange(JSON.stringify(data))
   *   }
   * }, 300);

   * document.querySelector('#json').addEventListener('input', e => checkChange(e.target.innerText)) */
}

document.addEventListener('DOMContentLoaded', init);
