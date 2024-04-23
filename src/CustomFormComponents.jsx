import { useState }        from 'react';

import {
  canExpand,
  descriptionId,
  getTemplate,
  getUiOptions,
  ADDITIONAL_PROPERTY_FLAG,
  titleId,
}                          from '@rjsf/utils';

export const CustomObjectFieldTemplate = props => {
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
  const TitleFieldTemplate = getTemplate('TitleFieldTemplate', registry, options);
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

export const CustomWrapIfAdditionalTemplate = props => {
  const { id, classNames, style, disabled, label, onKeyChange, onDropPropertyClick, readonly, required, schema, children, uiSchema, registry } = props;
  const { templates } = registry;
  // Button templates are not overridden in the uiSchema
  const { RemoveButton } = templates.ButtonTemplates;
  const additional = ADDITIONAL_PROPERTY_FLAG in schema;

  if (!additional) {
    return (
      <div className={classNames} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={classNames} style={{...style, marginBottom: '0px' }}>
      <div className='row'>
        <div className='col-xs-5 form-additional'>
          <div className='form-group'>
            <div style={{ display: 'flex', gap: '0.5em', alignItems: 'center' }} className='control-label' htmlFor={id}>
              Key
              {required && <span style={{ color: 'red' }} className='required'>*</span>}
            <input
              className='form-control'
              type='text'
              id={`${id}-key`}
              onBlur={(event) => onKeyChange(event.target.value)}
              defaultValue={label}
            />
            </div>
          </div>
        </div>
        <div className='form-additional form-group col-xs-5'>{children}</div>
        <div className='col-xs-2'>
          <RemoveButton
            className='array-item-remove btn-block'
            style={{ border: '0' }}
            disabled={disabled || readonly}
            onClick={onDropPropertyClick(label)}
            uiSchema={uiSchema}
            registry={registry}
          />
        </div>
      </div>
    </div>
  );
}

export const CustomAddButton = ({
  className,
  onClick,
  disabled,
  title,
}) => {
  return (
    <div className='row'>
      <div className={`text-left ${className}`}>
        <button
          type='button'
          className={`btn btn-info btn-add`}
          icon='plus'
          title={'aaa'}
          onClick={onClick}
          disabled={disabled}
        >
          <span>
            Add {title}
          </span>
        </button>
      </div>
    </div>
  );
}
export const CustomArrayFieldTemplate = props => {
  const { canAdd, className, disabled, idSchema, uiSchema, items, onAddClick, readonly, registry, required, schema, title } = props;
  const uiOptions = getUiOptions(uiSchema);
  const ArrayFieldDescriptionTemplate = getTemplate('ArrayFieldDescriptionTemplate', registry, uiOptions);
  const ArrayFieldItemTemplate = getTemplate('ArrayFieldItemTemplate', registry, uiOptions);
  const ArrayFieldTitleTemplate = getTemplate('ArrayFieldTitleTemplate', registry, uiOptions);
  // Button templates are not overridden in the uiSchema
  const { ButtonTemplates: { AddButton }} = registry.templates;
  return (
    <fieldset className={className} id={idSchema.$id}>
      <ArrayFieldTitleTemplate
        idSchema={idSchema}
        title={uiOptions.title || title}
        required={required}
        schema={schema}
        uiSchema={uiSchema}
        registry={registry}
      />
      <ArrayFieldDescriptionTemplate
        idSchema={idSchema}
        description={uiOptions.description || schema.description}
        schema={schema}
        uiSchema={uiSchema}
        registry={registry}
      />
      <div style={{borderLeft: '1px solid gray', paddingLeft: '2em'}}>
        <div className='row array-item-list'>
          {items &&
            items.map(({ key, ...itemProps }) => (
              <ArrayFieldItemTemplate key={key} {...itemProps} />
            ))}
        </div>
        {canAdd && (
          <AddButton
            title={schema.items?.title ?? title}
            className='array-item-add'
            onClick={onAddClick}
            disabled={disabled || readonly}
            uiSchema={uiSchema}
            registry={registry}
          />
        )}
      </div>
    </fieldset>
  );
};

export const CustomTitleFieldTemplate = ({ id, title, required, compressed, setCompressed }) => {
  return (
    <legend id={id} style={{ borderBottom: '0px', marginBottom: '0px' }}>
      {title}
      {required && <span style={{ color: 'red'}} className='required'>*</span>}
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


export const CustomFieldTemplate = (props) => {
  const { id, label, classNames, style, children, hidden, errors, help, rawDescription, required, displayLabel, uiOptions, registry } = props;
  const WrapIfAdditionalTemplate = getTemplate('WrapIfAdditionalTemplate', registry, uiOptions);
  if (hidden) {
    return <div className='hidden'>{children}</div>;
  }
  return (
    <WrapIfAdditionalTemplate {...props}>
      <div className={classNames} style={{
        ...style,
        display: 'flex',
        gap: '1em',
        alignItems: 'center',
      }}>
        {displayLabel && (
          <label style={{ display: 'flex', alignItems: 'center' }} title={rawDescription} className='control-label' htmlFor={id}>
            {label}
            {required && <span style={{ color: 'red'}}  className='required'>*</span>}
            {rawDescription ? (
              <span style={{ marginLeft: '0.5em', backgroundColor: 'lightgray', borderRadius: '50%', width: '1em', height: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ?
              </span>
            ) : null}
          </label>
        )}
        <div style={{ flex: 1 }}>
          {children}
          {errors}
          {help}
        </div>
      </div>
    </WrapIfAdditionalTemplate>
  );
}
