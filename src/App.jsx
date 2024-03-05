import {
  useState,
  useEffect,
}                                      from 'react';
import validator                       from '@rjsf/validator-ajv8';
import CompressibleObjectFieldTemplate from './CompressibleObjectFieldTemplate.jsx';
import Form                            from '@rjsf/core';
import JsonView                        from '@uiw/react-json-view';

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

const App = () => {
  const [ schema, setSchema ] = useState();
  const [ data, setData ] = useState({});
  useEffect(() => {
    fetch('schemas/jsonlead_v3.schema.json')
      .then(r => r.json())
      .then(setSchema)
  }, []); 
  return schema ? (
    <div style={{display: 'flex', width: '100%', height: '100vh'}}>
      <div style={{flex: 1, padding: '2em', overflow: 'auto'}}>
        <Form
          schema={schema}
          validator={validator}
          formData={data}
          uiSchema={{
            'customer': {
              'ui:compressible': true,
              'company_information': {'ui:compressible': true},
              'address': {'ui:compressible': true},
            },
            'sales_lead': { 'ui:compressible': true },
            'appraisal_lead': { 'ui:compressible': true },
            'aftersales_lead': { 'ui:compressible': true },
          }}
          liveValidate
          onChange={e => setData(e.formData)}
          templates={{ ObjectFieldTemplate: CompressibleObjectFieldTemplate }}
        />
      </div>
      <div style={{flex: 1, padding: '2em', borderLeft: '1px solid black'}}>
        <JsonView value={removeEmpty(data)} displayDataTypes={false} shortenTextAfterLength={Infinity}/>
      </div>
    </div>
  ) : 'Loading schema...';
}

export default App
