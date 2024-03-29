import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "universal-cookie";

// Axios
import axios from "axios";
import { BASEURL } from "../../../App";

// Validators
import { validateEmail, validatePassword } from "./validators";

// Animated Routes
import { motion } from "framer-motion";
import request from "../../../axios/request";

/* Assets */
import heart from "../../../assets/img/heart.png";

function Login() {
  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fields validations
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validForm, setValidForm] = useState(false);
  useEffect(() => {
    setError(false);
  }, [email, password]);
  useEffect(() => {
    setValidEmail(validateEmail(email));
  }, [email]);
  useEffect(() => {
    setValidPassword(validatePassword(password));
  }, [password]);
  useEffect(() => {
    validPassword && validEmail ? setValidForm(true) : setValidForm(false);
  }, [validEmail, validPassword]);

  // Error treatment
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const cookies = new Cookies();

  // Perform verification if user is logged in
  async function checkIfUserIsLoggedIn() {
    await request
      .get("/auth/personal", {
        headers: {
          authorization: cookies.get("jwt"),
        },
      })
      .catch((error) => {
        console.log(error);
        navigate("/login");
      })
      .finally(navigate("/user"));
  }
  useEffect(() => {
    (async () => {
      await checkIfUserIsLoggedIn();
    })();
  }, []);

  // Perform login
  async function handleSubmit(e) {
    e.preventDefault();
    setValidForm(false);
    const url = BASEURL + "/auth/login";
    const response = await axios
      .post(url, { email, password })
      .catch((error) => {
        setError(true);
        if (error.response.status === 401)
          setErrorMsg(error.response.data.message);
        else if (error.response.status === 400)
          setErrorMsg("Please, insert correct data.");
        else setErrorMsg("Server is currently unavailable");
        setValidForm(true);
      })
      .then((response) => {
        return response;
      });
    if (response) {
      cookies.set(
        "jwt",
        response.data.jwt,
        { path: "/" },
        { sameSite: "none" }
      );
      navigate("/user");
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 1 }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center px-5 color_third">
            <h4 className="my-5">
              <strong className="stroked-title">
                Did you know?
                <img className="ms-3" src={heart} width="50px" />
              </strong>
            </h4>
            <p className="font-weight-medium">
              As a comissioner, you receive <strong>Pan Coins!</strong> <br />
            </p>

            <small className="font-weight-medium">
              From every art you buy, you will receive a card containing a code
              <br />
              which can be reedeemed right here on my website.
              <br />
              Pan Coins can be exchanged for raffles and another art products.
            </small>
            <br />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-4 px-4">
            <hr className="mt-4 mb-5" />
            <form className="text-center">
              {error ? (
                <div class="alert alert-danger" role="alert">
                  <strong>Ops!</strong> {errorMsg}
                </div>
              ) : (
                ""
              )}
              <div class="form-group text-center">
                <input
                  autoComplete="off"
                  type="email"
                  placeholder="Email"
                  className="form-control text-center"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3 text-center">
                <input
                  autoComplete="off"
                  type="password"
                  placeholder="Password"
                  className="form-control text-center"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                onClick={(e) => {
                  handleSubmit(e);
                }}
                disabled={validForm ? false : true}
                type="submit"
                className="btn btn-primary btn-lg w-100 hvr-wobble-top mt-3 btn-custom_1 px-4"
              >
                Log in!
              </button>
              <Link to="/user/forgot_password">
                <small className="font-weight-medium color_third">
                  <u>Forgot your password?</u>
                </small>
              </Link>
            </form>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-4 text-center">
            <hr className="mb-4"></hr>
            <p className="color_third font-weight-medium">
              <strong>Wanna meet the art oven?</strong>
            </p>
            <Link
              to="/signup"
              className="btn btn-primary btn-lg w-100 hvr-wobble-top btn-custom_1 px-4"
            >
              Create an Account!
            </Link>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

export default Login;
