import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  title: string;
  user: any;
  flashes: string[];
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, user, flashes, children }) => {
  return (
    <html>
      <head>
        <title>{title} | MiniTwit</title>
        <link rel="stylesheet" type="text/css" href="/static/style.css" />
      </head>
      <body>
        <div className="page">
          <h1>MiniTwit</h1>
          {flashes && flashes.length > 0 && (
            <ul className="flashes">
              {flashes.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
          <div className="body">{children}</div>

        </div>
      </body>
    </html>
  );
};

export default Layout;
