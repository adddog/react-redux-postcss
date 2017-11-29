import React, {PropTypes} from 'react';
import InvitedForm from '../components/InvitedForm.jsx';

class InvitedPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errors: {},
      user: {
        password: '',
        confirmedpass: '',
        token: props.params.token,
        username: props.params.username
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    // console.log(event);
    // console.log(this.state.user.token);
    // console.log(this.state.user.username);
    event.preventDefault();

    const password = encodeURIComponent(this.state.user.password);
    const token = encodeURIComponent(this.state.user.token);
    const username = encodeURIComponent(this.state.user.username);
    const formData = `password=${password}&token=${token}&username=${username}`;
    // console.log('InvitedPage::processForm:formData-> ', formData);

    //TODO: AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('post', `${process.env.API_HOST}users/invitation/${token}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        // console.log('200 OK!');
        // change the component-container state

        localStorage.setItem('successMessage', xhr.response.message);

        const {router} = this.context;
        router.replace('/login');

        const errors = {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });

        // console.log('The form is valid');
      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  changeUser(event) {
    // console.log('InvitedPage::changeUser:event --> ', event);
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  render() {
    return (
      <InvitedForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }
}

InvitedPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default InvitedPage;
