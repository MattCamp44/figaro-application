import React from 'react';
import {Link} from "react-router-dom";

export default function ErrorPage() {
  return (
    <>
      <h1>404 Not found</h1>
      <Link to="/">Homepage</Link>
    </>
  );
}