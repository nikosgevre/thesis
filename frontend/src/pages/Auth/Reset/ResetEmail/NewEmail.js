import React, { Component } from 'react';

import Input from '../../../../components/Form/Input/Input';
import { required, email } from '../../../../util/validators';
import Auth from '../../Auth';

class NewPassword extends Component {
  state = {
    resetForm: {
      email: {
          value: '',
          valid: false,
          touched: false,
          validators: [required, email]
        },
      formIsValid: false
    },
    user: null,
    userId: '',
    emailToken: ''
  };

  componentDidMount() {
    const rstToken = this.props.match.params.token;
    // console.log(rstToken);
    fetch('http://localhost:8080/auth/reset/' + rstToken, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Failed to fetch post');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('resData: ' + resData.post.creator.name);
      this.setState({
        // user: resData.user,
        userId: resData.userId,
        emailToken: resData.resetToken
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.resetForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.resetForm,
        [input]: {
          ...prevState.resetForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        resetForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        resetForm: {
          ...prevState.resetForm,
          [input]: {
            ...prevState.resetForm[input],
            touched: true
          }
        }
      };
    });
  };

  render() {
    return (
      <Auth>
        <form
          onSubmit={e =>
            this.props.onSetNewEmail(e, {
              email: this.state.resetForm.email.value,
              userId: this.state.userId,
              emailToken: this.state.emailToken,
              type: 'email'
            })
          }
        >
          <fieldset>
            <p >Set A New Email</p>
            <Input
              id="email"
              label="Your New Email"
              type="email"
              control="input"
              onChange={this.inputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'email')}
              value={this.state.resetForm['email'].value}
              valid={this.state.resetForm['email'].valid}
              touched={this.state.resetForm['email'].touched}
            />
            <div>
              <input type="hidden" name="userId" value={this.state.userId} />
              <input type="hidden" name="emailToken" value={this.state.emailToken} />
              <input type="hidden" name="_csrf" value={this.props.token} />
              <input type="submit" value="Register" />
            </div>
          </fieldset>
        </form>
      </Auth>
    );
  }
}

export default NewPassword;
