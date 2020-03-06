import React from "react";
import GoogleLogin from 'react-google-login';

class Login extends React.Component{
    render(){
        const responseGoogle = (response) => {
          console.log(response);

              this.props.history.push({
                pathname: '/admin',
                state: { oAuth2Client: response }
            })

        }

        return (

            <div className="loginForm">

                <GoogleLogin
                clientId="11717529596-3jltgpsg2lji7qslj986mnligtfen11h.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
            </div>
        )
    }
}

export default Login;