import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserSigninRequest, UserSignupRequest } from "../../types/api";

type Props = {
  signup?: boolean;
};

const AuthForm = ({ signup }: Props) => {
  const [user, setUser] = useState<UserSignupRequest | UserSigninRequest>({
    email: "",
    password: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const userSignUpInfo = user as UserSignupRequest;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {signup && (
          <div>
            <input
              name="firstName"
              type="text"
              value={userSignUpInfo.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              type="text"
              value={userSignUpInfo.lastName}
              onChange={handleChange}
            />
          </div>
        )}
        <input name="email" type="email" value={user.email} onChange={handleChange} />
        <input name="password" type="password" value={user.password} onChange={handleChange} />
        {signup && (
          <input
            name="confirmPassword"
            type="password"
            value={userSignUpInfo.confirmPassword}
            onChange={handleChange}
          />
        )}
        <button type="submit">{signup ? "Sign Up" : "Sign In"}</button>
      </form>
      {signup ? (
        <p>
          Existing User? <Link to="/signin">Sign In</Link>
        </p>
      ) : (
        <p>
          New User? <Link to="/signup">Sign Up</Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
