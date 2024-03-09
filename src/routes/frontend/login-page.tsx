import React, { useState } from 'react';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <div className="error"><strong>Error:</strong> {error}</div>}
      <form onSubmit={handleSubmit}>
        <dl>
          <dt>Username:</dt>
          <dd>
            <input
              type="text"
              name="username"
              size="30"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </dd>
          <dt>Password:</dt>
          <dd>
            <input
              type="password"
              name="password"
              size="30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </dd>
        </dl>
        <div className="actions">
          <input type="submit" value="Sign In" />
        </div>
      </form>
    </div>
  );
}

export default SignIn;
