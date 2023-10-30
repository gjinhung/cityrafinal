import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { authenticate, signUp } from "../../store/session";
import './SignupForm.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { allUsers } from "../../store/users";

function SignupFormPage() {
  const stuRef = useRef(false)
  console.log(stuRef.current)
  const dispatch = useDispatch();
  const multiStepRef = useRef()
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [profile_pic, setProfilePic] = useState('')
  const [card1, setCard1] = useState('active')
  const [card2, setCard2] = useState('')
  const [card3, setCard3] = useState('')
  const [student, setStudent] = useState(false)
  const [graduation_date, setGraduation] = useState("")
  const [errors, setErrors] = useState({});
  const [allowSub, setAllowSub] = useState(false)
  const history = useHistory()

  // if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      if (graduation_date) {
        const data = await dispatch(signUp(username, email, password, first_name, last_name, profile_pic, student, graduation_date));
        if (data) {
          setErrors(data)
          console.log(data)
        }
        else {
          dispatch(allUsers())
          dispatch(authenticate())
          history.push('/')
        }
      } else {
        const data = await dispatch(signUp(username, email, password, first_name, last_name, profile_pic, student));
        console.log('handlesubmit')
        console.log(data)
        if (data) {
          setErrors(data)
          console.log(data)
        }
        else {
          dispatch(allUsers())
          dispatch(authenticate())
          history.push('/')
        }
      }
    } else {
      setErrors({ "confirmPassword": 'Confirm Password field must be the same as the Password field' });
    }
  };

  function handleStudent(e) {
    stuRef.current = !stuRef.current
    setStudent(!student)
    console.log(stuRef.current)
    if (!stuRef.current) {//if not a student
      setAllowSub(false) //not disabled
    }//if student
    if (stuRef.current) {
      setAllowSub(true) //disable
      setGraduation('') //reset date
    }
  }

  function handleGrad(e) {
    setGraduation(e) //set graduation
    setAllowSub(false) //not disabled
  }

  const firstNext = async (e) => {
    if (password !== confirmPassword) {
      setErrors({ "confirmPassword": 'Confirm Password field must be the same as the Password field' })
    } else {
      const data = await dispatch(signUp(username, email, password, first_name, last_name, profile_pic, student, graduation_date));
      console.log('firstnext')
      console.log(data)
      if (data["username"] || data['email'] || data['password']) {
        const errorList = {
          'username': data['username'],
          'email': data['email'],
          'password': data['password']
        }
        setErrors(errorList)
      } else {
        setCard2("active")
        setCard1('')
        setErrors({})
      }
    }
  }

  const secondNext = async () => {
    const data = await dispatch(signUp(username, email, password, first_name, last_name, profile_pic, student, graduation_date));
    if (data["first_name"] || data['last_name'] || data['profile_pic']) {
      console.log('secondnext')
      console.log(data)
      const errorList = {
        'first_name': data['first_name'],
        'last_name': data['last_name'],
        'profile_pic': data['profile_pic']
      }
      setErrors(errorList)
    } else {
      setCard2("")
      setCard3('active')
    }
  }

  function secondPrev() {
    setCard1("active")
    setCard2('')
  }

  function thirdPrev() {
    setCard2("active")
    setCard3('')
  }


  return (
    // <div className="signuppage">
    <form
      ref={multiStepRef}
      onSubmit={handleSubmit}
      className="multi-step-form">
      <div className={`card ${card1}`} >
        <h3 className="step-title">Create Account</h3>
        <div className="form-group">
          <label>
            <label></label>
            <label style={{ color: "red" }}>{errors["email"]}</label>
          </label>
          <input placeholder={"Email"} type='text' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="form-group">
          <label>
            <label style={{ color: "red" }}>{errors["username"]}</label>
          </label>
          <input placeholder={"Username"} type='text' value={username} onChange={(e) => setUsername(e.target.value)}></input>
        </div>
        <div className="form-group">
          <label>
            <label style={{ color: "red" }}>{errors["password"]}</label>
          </label>
          <input placeholder={"Password"} type='password' value={password} autoComplete="off" onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <div className="form-group">
          <label>
            <label style={{ color: "red" }}>{errors["confirmPassword"]}</label>
          </label>
          <input placeholder={"Confirm Password"} type='password' value={confirmPassword} autoComplete="off" onChange={(e) => setConfirmPassword(e.target.value)}></input>
        </div>
        <button type="button"
          className="loginsignup"
          onClick={firstNext}>Next</button>
      </div>
      <div className={`card ${card2}`} >
        <h3 className="step-title">Who are you?</h3>
        <div className="form-group">
          <label>
            <label style={{ color: "red" }}>{errors['first_name']}</label>
          </label>
          <input placeholder="First Name" type='text' value={first_name} onChange={(e) => setFirstName(e.target.value)}></input>
        </div>
        <div className="form-group">
          <label>
            <label style={{ color: "red" }}>{errors['last_name']}</label>
          </label>
          <input placeholder="Last Name" type='text' value={last_name} onChange={(e) => setLastName(e.target.value)}></input>
        </div>
        <div className="form-group">
          <label>
            <label style={{ color: "red" }}>{errors['profile_pic']}</label>
          </label>
          <input placeholder="Profile Picture URL" type='text' value={profile_pic} onChange={(e) => setProfilePic(e.target.value)}></input>
        </div>
        <button
          type="button"
          className="loginsignup"
          onClick={secondPrev}
        >Previous</button>
        <button
          type="button"
          className="loginsignup"
          onClick={secondNext}
        >Next</button>
      </div>
      <div className={`card ${card3}`} >
        <h3 className="step-title">Are you a student?</h3>
        <div className="form-group">
          <label>student</label>
          <input type='checkbox' value={student} onChange={(e) => handleStudent(e.target.value)}></input>
        </div>
        <div className="form-group">
          {student &&
            <>
              <label>graduation</label>
              <input type='date' value={graduation_date} onChange={(e) => handleGrad(e.target.value)}></input>
            </>
          }
        </div>
        <button
          type="button"
          className="loginsignup"
          onClick={thirdPrev}
        >Previous</button>
        <button disabled={allowSub} className="loginsignup" type="submit">Sign Up</button>
      </div>
    </form >
    // </div>
  );
}

export default SignupFormPage;
