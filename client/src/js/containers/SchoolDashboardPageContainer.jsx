import React, {PropTypes} from 'react';
import Auth from '../modules/Auth';
import Table from 'rc-table';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import {TextField} from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Base from 'components/base';
import util from 'util';
var jsonToCsv = require('json2csv');
var startDate = '';
var endDate = '';

class SchoolDashboardPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      startDate: '',
      endDate: '',
      schoolId: this.props.params.schoolId,
      data: [],
      isAuth: false,
      schoolName: '',
      selected: [],
      exportObjects: [],
      lookupPressed: false,
      dataEmpty: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onExport = this.onExport.bind(this);
    this.download = this.download.bind(this);
  }

  onChange(event) {
    // console.log(util.inspect(event.target));
  }

/*  onRowSelect(row, isSelected) {
    if (isSelected) {
      console.log('selected id: -> ', row.customer_id);
      this.setState({
        selected: [...this.state.selected, row.customer_id].sort(),
        exportObjects: [...this.state.exportObjects, row]
      });
      console.log('Rows');
    } else {
      console.log('deselected id: -> ', row.customer_id);
      this.setState({
        selected: this.state.selected.filter(function (it) {
          if (it === row.customer_id) {
            return true;
          } else {
            return false;
          }
        }),
        exportObjects: this.state.exportObjects.filter(it => it.customer_id !== row.customer_id)
      });
    }
    console.log(util.inspect(this.state.selected));
    return false;
  }*/

/*  onSelectAll(isSelected) {
    if (!isSelected) {
      console.log('Deselect All');
      this.setState({
        selected: [],
        exportObjects: []
      });
    } else {
      console.log('Select All');
      this.setState({
        exportObjects: this.state.data
      });
      return true;
    }
    return false;
  }*/

  download(filename, text) {
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([text], {type: 'text/csv'}));
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  }

  onExport(event) {
    event.preventDefault();
    try {
      var result = jsonToCsv({data: this.state.data});
      this.download(`${this.state.schoolName}_userhearts.csv`, result);
    } catch (error) {
      console.error(error.message);
    }

    /*var xhr = new XMLHttpRequest();
     xhr.open('get', `/api/exportuserheartsjoin?id=${this.state.schoolId}&start=${this.refs.startdate.value}&end=${this.refs.enddate.value}`);
     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
     xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
     xhr.responseType = 'json';
     xhr.addEventListener('load', () => {
     if (xhr.status === 200) {
     //TODO: OK.
     console.log(xhr.response.output);
     this.download(`${this.state.schoolName}_userhearts.csv`, xhr.response.output);
     } else {
     //TODO: Error.
     console.log('Uh oh!');
     }
     });
     xhr.send();*/
  }

  onSubmit(event) {
    event.preventDefault();
    // console.log('Start Date: ', this.refs.startdate.value);
    // console.log('End Date: ', this.refs.enddate.value);
    this.setState({
      startDate: this.refs.startdate.value.toString(),
      endDate: this.refs.enddate.value.toString(),
      data: [],
      lookupPressed: true
    });

    var xhr = new XMLHttpRequest();
    xhr.open('get', `${process.env.API_HOST}api/userheartsjoin?id=${this.state.schoolId}&start=${this.refs.startdate.value}&end=${this.refs.enddate.value}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        //TODO: OK.
        if (xhr.response.data.length === 0) {
          this.setState({
            data: xhr.response.data,
            lookupPressed: false,
            dataEmpty: true
          });
        } else {
          this.setState({
            data: xhr.response.data,
            selected: [],
            exportObjects: [],
            lookupPressed: false,
            dataEmpty: true
          });
        }
      } else {
        //TODO: Error.
        console.log('Uh oh!');
      }
    });
    xhr.send();
  }

  componentDidMount() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', `${process.env.API_HOST}api/school/${this.props.params.schoolId}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // console.log(xhr.response.school.name);
        this.setState({
          isAuth: true,
          schoolName: xhr.response.school.name
        });
        // console.log(`SchooldId: ${this.state.schoolId}`);
        // xhr.open('get',)
      } else {
        const {router} = this.context;
        router.replace('/login');
      }
    });
    xhr.send();
  }

  render() {
    if (this.state.isAuth) {
      const selectRowProp = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: this.onRowSelect,
        onSelectAll: this.onSelectAll,
        selected: this.state.selected
      };
      return (
        <Card className="container" style="float: none; margin: 0 auto;">
          {this.state.schoolName && <CardTitle title={this.state.schoolName} className="align-content-center"/>}
          <form name="date_range" id="date_range" className="form-inline">
            <div className="form-group ">
              <div className="col-md-8 align-items-md-start field-line">
                <input id="startdate" ref="startdate" className="form-control input-group-lg reg_name" type="text"
                       title="Start Date (YYYY-MM-DD)" placeholder="Start Date (YYYY-MM-DD)"/>
                <input id="enddate" ref="enddate" className="form-control input-group-lg reg_name" type="text"
                       title="End Date (YYYY-MM-DD)" placeholder="End Date (YYYY-MM-DD)"/>
                <RaisedButton className="lookup-button" type="submit" label="Lookup" primary onClick={this.onSubmit}/>
                {this.state.data.length > 0 &&
                <RaisedButton className="lookup-button" label="Export" onClick={this.onExport}/>
                }
              </div>
            </div>
          </form>
          {this.state.data.length === 0 && this.state.lookupPressed &&
          <CircularProgress size={80} thickness={5}/>
          }
          {this.state.dataEmtpy &&
            <div><h2>Purged All Users</h2></div>
          }
          {this.state.data.length > 0 &&
          <div className="sign-up-inquire-container align-content-center">
            <BootstrapTable data={this.state.data}>
              <TableHeaderColumn dataField='customer_id' isKey={true} width='150'>Customer</TableHeaderColumn>
              <TableHeaderColumn dataField='firstName' width='150'>First Name</TableHeaderColumn>
              <TableHeaderColumn dataField='lastName' width='150'>Last Name</TableHeaderColumn>
              <TableHeaderColumn dataField='email' width='250'>Email</TableHeaderColumn>
            </BootstrapTable>
          </div>}
        </Card>
      )
    } else {
      return (
        <Card className="container-fluid align-content-center">
        </Card>
      );
    }
  }
}

export default SchoolDashboardPage;