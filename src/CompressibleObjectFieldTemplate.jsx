import { useState }        from 'react';
import ObjectFieldTemplate from '@rjsf/core/lib/components/templates/ObjectFieldTemplate';
import {
  canExpand,
  descriptionId,
  getTemplate,
  getUiOptions,
  titleId,
}                          from '@rjsf/utils';


const TitleFieldTemplate = ({ id, title, required, compressed, setCompressed }) => {
  return (
    <legend id={id}>
      {title}
      {required && <span className='required'>*</span>}
      {setCompressed && <span
        style={{
          marginLeft: '1em',
          backgroundColor: 'gray',
          borderRadius: '50%',
          width: '1em',
          height: '1em',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          color: 'white',
        }}
        onClick={() => setCompressed(d => !d)}
      >
        {compressed ? '+' : '-'}
      </span>}
    </legend>
  );
}

const CompressibleObjectFieldTemplate = props => {
  const {
    description,
    disabled,
    formData,
    idSchema,
    onAddClick,
    properties,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema,
  } = props;
  const options = getUiOptions(uiSchema);
  const { compressible = true } = options ?? {}
  const [ compressed, setCompressed ] = useState(compressible);
  const DescriptionFieldTemplate = getTemplate('DescriptionFieldTemplate', registry, options);
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;
  return (
    <fieldset id={idSchema.$id}>
      {title && (
        <TitleFieldTemplate
          id={titleId(idSchema)}
          title={title}
          required={required}
          compressed={compressed}
          setCompressed={compressible && setCompressed}
        />
      )}
      {!compressed && description && (
        <DescriptionFieldTemplate
          id={descriptionId(idSchema)}
          description={description}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {compressed ? null : (
        <div style={{borderLeft: '1px solid gray', paddingLeft: '2em'}}>
          {properties.map((prop) => prop.content)}
          {canExpand(schema, uiSchema, formData) && (
            <AddButton
              className='object-property-expand'
              onClick={onAddClick(schema)}
              disabled={disabled || readonly}
              uiSchema={uiSchema}
              registry={registry}
            />
          )}
        </div>
      )}
    </fieldset>
  );
}

export default CompressibleObjectFieldTemplate;
