import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Strings } from "../../constants";
import styles from "../../styles/authForm.module.css";
import { UserSigninRequest, UserSignupRequest } from "../../types/api";

type Props = {
  signup?: boolean;
};

const AuthForm = ({ signup }: Props) => {
  const [user, setUser] = useState<UserSignupRequest | UserSigninRequest>({
    email: "",
    password: ""
  });
  const userSignUpInfo = user as UserSignupRequest;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <h2 className={`txt-cen ${styles.heading}`}>
        {signup ? Strings.authPage.signUp : Strings.authPage.signIn}
      </h2>
      <form onSubmit={handleSubmit} className="flex-col gap-small">
        {signup && (
          <>
            <input
              name="firstName"
              placeholder={Strings.authPage.inputPlaceholders.firstName}
              className={styles.input}
              type="text"
              value={userSignUpInfo.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder={Strings.authPage.inputPlaceholders.lastName}
              className={styles.input}
              type="text"
              value={userSignUpInfo.lastName}
              onChange={handleChange}
            />
          </>
        )}
        <input
          name="email"
          placeholder={Strings.authPage.inputPlaceholders.email}
          className={styles.input}
          type="email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <PasswordInputField
          name="password"
          placeholder={Strings.authPage.inputPlaceholders.password}
          value={user.password}
          onChange={handleChange}
        />
        {signup && (
          <PasswordInputField
            name="confirmPassword"
            placeholder={Strings.authPage.inputPlaceholders.confirmPassword}
            value={userSignUpInfo.confirmPassword}
            onChange={handleChange}
          />
        )}
        <button type="submit" className={styles.btn_submit}>
          {signup ? "Sign Up" : "Sign In"}
        </button>
      </form>
      {signup ? (
        <p>
          {Strings.authPage.existingUser} <Link to="/signin">{Strings.authPage.signIn}</Link>
        </p>
      ) : (
        <p>
          {Strings.authPage.newUser} <Link to="/signup">{Strings.authPage.signUp}</Link>
        </p>
      )}
    </div>
  );
};

type PasswordInputFieldProps = {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInputField = ({ name, placeholder, value, onChange }: PasswordInputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(prev => !prev);
  return (
    <div className={`flex gap-small ${styles.password_container}`}>
      <input
        name={name}
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required
      />
      <button onClick={toggleShowPassword}>🫣</button>
    </div>
  );
};
export default AuthForm;
