import {
  useState,
  useEffect,
}                                      from 'react';
import { customizeValidator }          from '@rjsf/validator-ajv8';
import Ajv2019                         from 'ajv/dist/2019';
import CompressibleObjectFieldTemplate from './CompressibleObjectFieldTemplate.jsx';
import Form                            from '@rjsf/core';
import JsonView                        from '@uiw/react-json-view';

const validator = customizeValidator({ AjvClass: Ajv2019 });

const VERSIONS = {
  '1.0.0': { default: { version: '1.0.0', client: {} }},
  '2.0.0': { default: { }},
}
const DEFAULT_VERSION = '2.0.0';

const removeEmpty = obj => Object
  .keys(obj)
  .map(key => {
    const v = obj[key];
    if(typeof v === 'object' && !Array.isArray(v) && Object(v) === v) {
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
    } else if (v != null && !(Array.isArray(v) && !v.length)) {
      return {[key]: v};
    } else return null;

  })
  .filter(f => f)
  .reduce((p,c) => Object.assign({}, p, c),{});

const Builder = () => {
  const [ schema, setSchema ] = useState();
  const [ data, setData ] = useState({});
  const [ version, setVersion ] = useState(DEFAULT_VERSION);
  useEffect(() => {
    fetch(`schemas/jsonlead_v${version}.schema.json`)
      .then(r => r.json())
      .then(s => {
        setData(VERSIONS[version].default);
        setSchema(s);
      })
  }, [ version ]); 
  return schema ? (
    <div style={{display: 'flex', width: '100%', height: '100vh'}}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '1em', padding: '2em', overflow: 'auto'}}>
        <button onClick={() => setData(JSON.parse(prompt('Manual json?')))}>Import</button>
        <select className='form-control' value={version} onChange={e => setVersion(e.target.value)}>
          <option value="1.0.0">Version 1.0.0</option>
          <option value="2.0.0">Version 2.0.0</option>
        </select>
        <Form
          schema={schema}
          validator={validator}
          formData={data}
          uiSchema={{
            'ui:compressible': false,
            'customer': {
              'ui:compressible': true,
              'company_information': {'ui:compressible': true},
              'address': {'ui:compressible': true},
            },
            'client': { 'ui:compressible': true },
            'sales_lead': { 'ui:compressible': true },
            'appraisal_lead': { 'ui:compressible': true },
            'aftersales_lead': { 'ui:compressible': true },
          }}
          liveValidate
          onChange={e => setData(e.formData)}
          templates={{ ObjectFieldTemplate: CompressibleObjectFieldTemplate }}
        />
      </div>
      <div style={{flex: 1, padding: '2em', borderLeft: '1px solid black', overflow: 'auto'}}>
        <JsonView value={removeEmpty(data)} displayDataTypes={false} shortenTextAfterLength={Infinity}/>
      </div>
    </div>
  ) : 'Loading schema...';
}

export default Builder;
