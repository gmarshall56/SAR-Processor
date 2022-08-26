import React from 'react'
import { Auth, Hub } from "aws-amplify";
import { Button } from "react-bootstrap";

// from https://stackoverflow.com/questions/62916906/customize-layout-of-amplifysignout
// and: https://github.com/aws-amplify/amplify-js/issues/7039; nathanielrindlaub
// Did this because styling the AWS AmplifySignOut button was proving to be impossible

function SignOutButton() {

  const signOut = (e) => {
    e.preventDefault();
    try {
      Auth.signOut();
      Hub.dispatch('UI Auth', {   // channel must be 'UI Auth'
          event: 'AuthStateChange',    // event must be 'AuthStateChange'
          message: 'signedout'    // message must be 'signedout'
      });
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }

  return (
      <Button variant="success" onClick={signOut}>
          Sign out
      </Button>
  )
}

export default SignOutButton;