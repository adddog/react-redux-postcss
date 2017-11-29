import React, {PropTypes} from 'react';
import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const InvitedForm = ({
  onSubmit,
  onChange,
  errors,
  user
}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Configure User</h2>
      {errors.summary && <p className="error-message">{errors.summary}</p>}
      <div className="field-line">
        <TextField
          floatingLabelText="Create Password"
          type="password"
          name="password"
          errorText={errors.password}
          onChange={onChange}
          value={user.password}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Repeat Password"
          type="password"
          name="confirmedpass"
          errorText={errors.nomatch}
          onChange={onChange}
          value={user.confirmedpass}
        />
      </div>
      <div className="button-line">
        <RaisedButton type="submit" label="Save New User" primary/>
      </div>
    </form>
  </Card>
);

export default InvitedForm;
