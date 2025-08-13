import { Entrypoint } from "uix/providers/entrypoints.ts";
import { register, login, logout, users } from "backend/user-data.ts";

(globalThis as any).users = users; //muss später raus nur für debugg!

const signUpMode = $(false);
const isLoggedIn = $(false);
const loginEmail = $("");
const loginPassword = $("");
const loginError = $("");

const usernameError = $("");
const emailError = $("");

const newUsername = $("");
const newEmail = $("");
const newPassword = $("");
const passwordError = $("");

export default (() => {
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>;

  return (
    <main class={{ container: true, "sign-up-mode": signUpMode.val}}>
      <link rel="stylesheet" href="./Login.css"></link>
      <a class="top-logo" href="/" style="cursor: pointer; z-index: 1001;">
        <img
          src="./img-folder/logo_primary_transparent_white.webp"
          alt="Logo"
          class="top-logo"
          style="background: #fff; cursor: pointer;"
        />
      </a>
      <div class="forms-container">
        <div class="signin-signup-page">
          <form
            action={login}
            method="post"
            class="sign-in-page"
            onsubmit={(e) => {
              e.preventDefault();
              if (!loginEmail.val.trim()) {
                loginError.val = "Email is required";
                return;
              }
              if (!loginPassword.val.trim()) {
                loginError.val = "Password is required";
                return;
              }
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              fetch("/login", {
                method: "POST",
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  if (!data.success) {
                    switch (data.field) {
                      case "email":
                        loginError.val =
                          data.error === "invalid_credentials"
                            ? "Invalid email or password"
                            : "Login error";
                        break;

                      case "password":
                        loginError.val =
                          data.error === "invalid_credentials"
                            ? "Invalid email or password"
                            : "Login error";
                        break;
                    }
                  } else {
                    isLoggedIn.val = false;
                    loginEmail.val = "";
                    loginPassword.val = "";
                    loginError.val = "";
                    if (data.redirect) {
                      window.location.href = data.redirect;
                    }
                  }
                })
                .catch((error) => {
                  loginError.val = "Login failed";
                });
            }}
          >
            <h2 class="title">Sign in</h2>
            <div class="social-media">
              <a href="#" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-x-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-google"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
            <p class="social-text">or sign in using your email and password</p>
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="email"
                value={loginEmail}
                oninput={() => (loginError.val = "")}
              />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="password"
                value={loginPassword}
                oninput={() => (loginError.val = "")}
              />
            </div>
            {loginError.val && <div class="input-error">{loginError.val}</div>}
            <input
              type="submit"
              value="Login"
              class="button glow-effect glow-effect-small"
            />
          </form>

          <form
            action={register}
            method="post"
            class="sign-up-page"
            onsubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              fetch("/register", {
                method: "POST",
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  if (!data.success) {
                    switch (data.field) {
                      case "username":
                        usernameError.val =
                          data.error === "username_exists"
                            ? "Username already exists"
                            : data.error === "username_req"
                            ? "Username is required"
                            : "Invalid username";
                        break;

                      case "email":
                        emailError.val =
                          data.error === "email_exists"
                            ? "Email already in use"
                            : data.error === "email_req"
                            ? "Email is required"
                            : data.error === "invalid_email"
                            ? "Invalid email address"
                            : "Email error";
                        break;

                      case "password":
                        passwordError.val =
                          data.error === "password_req"
                            ? "Password must be at least 8 characters"
                            : "Password error";
                        break;
                    }
                  } else {
                    isLoggedIn.val = false;

                    newUsername.val = "";
                    newEmail.val = "";
                    newPassword.val = "";
                    usernameError.val = "";
                    emailError.val = "";
                    passwordError.val = "";
                    if (data.redirect) {
                      window.location.href = data.redirect;
                    }
                  }
                });
            }}
          >
            <h2 class="title">Sign up</h2>
            <div class="social-media">
              <a href="#" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-x-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-google"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
            <p class="social-text">
              or create a username and use your email for registration
            </p>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input
                type="text"
                placeholder="username"
                name="username"
                value={newUsername}
                oninput={() => (usernameError.val = "")} //falls error, dann weil hier required raus ist
              />
            </div>
            {usernameError.val && (
              <div class="input-error">{usernameError.val}</div>
            )}
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="email"
                name="email"
                value={newEmail}
                oninput={() => (emailError.val = "")} //falls error, dann weil hier required raus ist
              />
            </div>
            {emailError.val && <div class="input-error">{emailError.val}</div>}
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                placeholder="password"
                name="password"
                value={newPassword} //falls error, dann weil hier required raus ist
              />
            </div>
            {passwordError.val && (
              <div class="input-error">{passwordError.val}</div>
            )}
            <input
              type="submit"
              value="Sign up"
              class="button glow-effect glow-effect-small"
            />
          </form>
        </div>
      </div>

      <div class="panels-container">
        <div class="panel panel-left">
          <div class="content">
            <h3>New here?</h3>
            <p>
              Simply create an account in a few steps to enjoy our features and
              manage your tasks.
            </p>
            <button
              type="button"
              onclick={() => (signUpMode.val = !signUpMode.val)}
              class="button transparent glow-effect"
              id="sign-up-button"
            >
              Sign up
            </button>
          </div>
          <img src="./img-folder/Login1.svg" class="image" alt="Sign up" />
        </div>
        <div class="panel panel-right">
          <div class="content">
            <h3>Already got an account?</h3>
            <p>Go ahead and login to continue working on your tasks.</p>
            <button
              type="button"
              onclick={() => (signUpMode.val = !signUpMode.val)}
              class="button transparent glow-effect"
              id="sign-in-button"
            >
              Sign in
            </button>
          </div>
          <img src="./img-folder/SignUp1.svg" class="image" alt="Sign in" />
        </div>
      </div>
      <div id="login-success" class={{ visible: isLoggedIn.val }}>
        <h2>Welcome back!</h2>
        <p>You have successfully logged in.</p>
        <form
          action={logout} //kann man auch mit routing machen good to know
          method="post"
          onsubmit={async (e) => {
            e.preventDefault();
            try {
              const response = await fetch("/logout", {
                method: "POST",
              });
              if (response.redirected) {
                isLoggedIn.val = false;
                window.location.href = response.url;
              }
            } catch (error) {
              console.error("Logout failed:", error);
            }
          }}
        >
          <button type="submit" class="button logout-button">
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}) satisfies Entrypoint;