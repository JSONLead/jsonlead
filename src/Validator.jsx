import {
  useState,
  useCallback,
  useMemo,
  useEffect,
}                 from 'react';
import Ajv2019    from 'ajv/dist/2019';
import addFormats from "ajv-formats"
import JsonView   from '@uiw/react-json-view';

const ajv = addFormats(new Ajv2019());


import {
  useQueryParam,
  StringParam,
  withDefault,
} from 'use-query-params';


const VERSIONS = {
  '1.0.0': { default: { version: '1.0.0', client: {} }},
  '2.0.0': { default: { }},
}

const jsonPrettyfier = json => json.split('').reduce((acc, ch) => {
  const prev_char = acc.processed[acc.processed.length - 1];
  if (prev_char === "\\")
    return {in_string: acc.in_string, indentation_level: acc.indentation_level, processed: `${acc.processed}${ch}`};
  if (ch === '"')
    return {in_string: !acc.in_string, indentation_level: acc.indentation_level, processed: `${acc.processed}${ch}`};
  if (!acc.in_string && (ch === "{" || ch === "[")) {
    return {indentation_level: acc.indentation_level + 1, processed: `${acc.processed}${ch}\n${Array((acc.indentation_level + 1)*2).fill(' ').join('')}`};
  }
  if (!acc.in_string && (ch === "}" || ch === "]"))
    return {indentation_level: Math.max(0, acc.indentation_level - 1), processed: `${acc.processed}\n${Array(((acc.indentation_level || 1) - 1)*2).fill(' ').join('')}${ch}`};
  if (!acc.in_string && ch === ",")
    return {indentation_level: acc.indentation_level, processed: `${acc.processed}${ch}\n${Array(acc.indentation_level *2).fill(' ').join('')}`};
  return {in_string: acc.in_string, indentation_level: acc.indentation_level, processed: `${acc.processed}${ch}`};
}, {in_string: false, indentation_level: 0, processed: ''}).processed;


const Validator = () => {
  const [ schema, setSchema ] = useState();
  const [ data, setData ] = useState('');
  const [ validated_data, setValidatedData ] = useState('');
  const [ valid, setValid ] = useState();
  const [ errors, setErrors ] = useState([]);
  const [ version, setVersion ] = useQueryParam('version', withDefault(StringParam, '2.0.0'));
  const validate = useMemo(() => schema && ajv.compile(schema), [ schema ]);
  useEffect(() => {
    fetch(`schemas/jsonlead_v${version}.schema.json`)
      .then(r => r.json())
      .then(setSchema)
  }, [ version ]);
  const doValidate = useCallback((data) => {
    const pretty_json = jsonPrettyfier(data);
    try {
      const json_data = JSON.parse(pretty_json);
      const valid = validate(json_data);
      setValidatedData(json_data);
      if(valid){
        setValid(true);
        setErrors([]);
      } else {
        setValid(false);
        setErrors(validate.errors.map(err => `${err.instancePath} ${err.message}`));
      }
    } catch(err) {
      setValid(false);
      setValidatedData(pretty_json);
      setErrors(['Invalid JSON: '+err]);
    }
  }, [ validate ]);
  const getJSONErrors = () => {
    const [ error ] = errors;
    if (error?.startsWith('Invalid JSON')) {
      const x = error.toString().indexOf('position');
      const tmp1 = error.toString().slice(x + 'position'.length + 1);
      const tmp2 = tmp1.indexOf('at');
      const tmp3 = tmp2 > 0 ? tmp1.slice(0, tmp2) : tmp1;
      const error_index = parseInt(tmp3);
      const error_message = error.toString();
      const valid_json = validated_data.slice(0, error_index);
      const invalid_json = validated_data.slice(error_index);
      return (
        <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
          {valid_json}
          <span title={error_message} style={{ fontWeight: 'bold', color: 'red' }}>{invalid_json}</span>
        </pre>
      );
    } else return (
      <JsonView value={validated_data} displayDataTypes={false} shortenTextAfterLength={Infinity}/>
    );
  }
  useEffect(() => {doValidate(data)}, [doValidate, data]);
  return schema ? (
    <div style={{width: '100%', height: '100vh', padding: '3em', gap: '2em', display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '1em', backgroundColor: (() => {
        if (!data) return 'gray';
        if (valid) return 'green';
        else return 'crimson';
      })(), borderRadius: '3px'}}>
        {!data && "Paste a JSONLead in the text box below to validate it"}
        {valid ? "The JSONLead is valid" : (<div>
          The JSONLead is not valid. Errors are:
          {errors.map(error => (
            <div>
              {error}
            </div>
          ))}
        </div> )}
      </div>
      <div style={{ display: 'flex', gap: '1em', maxWidht: '100%', flex: 1 }}>
        <div style={{ width: '50%', flex: '1 0'}}>
          <textarea
            style={{width: '100%', height: '100%', resize: 'none'}}
            value={data}
            onChange={e => setData(e.target.value)}
            rows={15}
            placeholder='Place your JSONLead here...'
          />
        </div>
        <div style={{ width: '50%', flex: '1 0'}}>
          {getJSONErrors(data)}
        </div>
      </div>
    </div>
  ) : 'Loading schema...';
}

export default Validator;
