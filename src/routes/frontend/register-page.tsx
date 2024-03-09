import { FC, useState } from "hono/jsx";

interface SignUpProps {
  error : string
  username: string
  email: string
  password: string

}

const SignUp: FC<SignUpProps> = () => {
  let signUpInfo = useState({})

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <div className="error"><strong>Error:</strong> {error}</div>}
      <form onSubmit={handleSubmit}>
        <dl>
          <dt>Username:</dt>
          <dd>
            <input
              type="text"
              name="username"
              size={30}
              value={username}
            />
          </dd>
          <dt>E-Mail:</dt>
          <dd>
            <input
              type="text"
              name="email"
              size={30}
              value={email}
            />
          </dd>
          <dt>Password:</dt>
          <dd>
            <input
              type="password"
              name="password"
              size={30}
              value={password}
            />
          </dd>
          <dt>Password <small>(repeat)</small>:</dt>
          <dd>
            <input
              type="password"
              name="password2"
              size={30}
              value={password2}
            />
          </dd>
        </dl>
        <div className="actions">
          <input type="submit" value="Sign Up" />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
