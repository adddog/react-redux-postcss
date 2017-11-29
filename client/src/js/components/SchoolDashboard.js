import React, {PropTypes} from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import {TextField} from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

const dashBoardForm = (props) => (
  <form>
    <div className="form-group ">
      <div className="col-md-8 align-items-md-start field-line">
        <input id="startdate" ref="startdate" className="form-control input-group-lg reg_name" type="text"
               title="Start Date (YYYY-MM-DD)" placeholder="Start Date (YYYY-MM-DD)"/>
        <input id="enddate" ref="enddate" className="form-control input-group-lg reg_name" type="text"
               title="End Date (YYYY-MM-DD)" placeholder="End Date (YYYY-MM-DD)"/>
        <RaisedButton className="lookup-button" type="submit" label="Lookup" primary onClick={this.onSubmit}/>
        {props.data.length > 0 &&
        <RaisedButton className="lookup-button" label="Export" onClick={this.onExport}/>
        }
        {props.data.length > 0 &&
        <RaisedButton className="lookup-button" label="Purge" onClick={this.onPurge}/>
        }
      </div>
    </div>
  </form>
);

const dashboardTable = () => (
  <div className="sign-up-inquire-container align-content-center">
    <BootstrapTable data={this.state.data}>
      <TableHeaderColumn dataField='customer_id' isKey={true} width='150'>Customer</TableHeaderColumn>
      <TableHeaderColumn dataField='firstName' width='150'>First Name</TableHeaderColumn>
      <TableHeaderColumn dataField='lastName' width='150'>Last Name</TableHeaderColumn>
      <TableHeaderColumn dataField='email' width='250'>Email</TableHeaderColumn>
      <TableHeaderColumn dataField="app_type" width='150'>Platform</TableHeaderColumn>
    </BootstrapTable>
  </div>
);

const SchoolDashboard = (props) => {
  //
  const check = false;

  return (
    props.isAuth
    ? <Card>
      {props.schoolName && <CardTitle />}
      {dashBoardForm}
      {check && <CircularProgress size={80} thickness={5}/>}
      {props.data.length > 0 && <dashboardTable data={prop.data} />}
    </Card>
    : <Card className="container-fluid align-content-center">
    </Card>
  );
}

export default SchoolDashboard;