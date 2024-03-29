import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label, Select } from "semantic-ui-react";

interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}
const SelectInput: React.FC<IProps> = ({
  input,
  width,
  options,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <Select
        // value={input.value}
        {...input}
        onChange={(e, data) => input.onChange(data.value)}
        placeholder={placeholder}
        options={options}
      ></Select>
      {touched && !!error && (
        <Label basic color="red" data-cy="error-label">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default SelectInput;
