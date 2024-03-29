import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { Form, Label } from "semantic-ui-react";

interface IProps extends FieldRenderProps<string, HTMLElement> {}

const TextAreaInput: React.FC<IProps> = ({
  input,
  width,
  rows,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} {...{ width }}>
      <textarea rows={rows} {...input} {...{ placeholder }}></textarea>
      {touched && !!error && (
        <Label basic color="red" data-cy="error-label">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default TextAreaInput;
