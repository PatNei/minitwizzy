import React, { useState } from 'react';

interface SignUpProps {
  error?: string;
}

const SignUp: React.FC<SignUpProps> = ({ error }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here
  };

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
              onChange={(e) => setUsername(e.target.value)}
            />
          </dd>
          <dt>E-Mail:</dt>
          <dd>
            <input
              type="text"
              name="email"
              size={30}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </dd>
          <dt>Password:</dt>
          <dd>
            <input
              type="password"
              name="password"
              size={30}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </dd>
          <dt>Password <small>(repeat)</small>:</dt>
          <dd>
            <input
              type="password"
              name="password2"
              size={30}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
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
