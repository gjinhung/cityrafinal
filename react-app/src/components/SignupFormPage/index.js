import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
// import { Redirect } from "react-router-dom";
import { authenticate, signUp } from "../../store/session";
import './SignupForm.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { allUsers } from "../../store/users";

function SignupFormPage() {
  const stuRef = useRef(false)
  // console.log(stuRef.current)
  const dispatch = useDispatch();
  const multiStepRef = useRef()
  // const sessionUser = useSelector((state) => state.session.user);
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
  const [image_url, setImgUrl] = useState("");


  const history = useHistory()

  // if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('profile_pic', profile_pic);
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append("first_name", first_name)
    formData.append('last_name', last_name)
    formData.append('student', student)
    console.log(profile_pic)
    if (graduation_date) {
      formData.append('graduation_date', graduation_date)
    }
    if (password === confirmPassword) {

      const data = await dispatch(signUp(formData));
      console.log('handlesubmit')
      console.log(formData.get(graduation_date))
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
      setErrors({ "confirmPassword": 'Passwords do not match' });
    }
  };

  function handleStudent(e) {
    stuRef.current = !stuRef.current
    setStudent(!student)
    console.log(stuRef.current)
    if (!stuRef.current) {//if not a student
      setGraduation('') //reset date
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
    const formData = new FormData();
    formData.append('profile_pic', profile_pic);
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append("first_name", first_name)
    formData.append('last_name', last_name)
    formData.append('student', student)
    formData.append('graduation_date', graduation_date)
    console.log(email)
    if (password !== confirmPassword) {
      setErrors({ "confirmPassword": 'Passwords do not match' })
    } else {
      const data = await dispatch(signUp(formData));
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

    const formData = new FormData();
    formData.append('profile_pic', profile_pic);
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append("first_name", first_name)
    formData.append('last_name', last_name)
    formData.append('student', student)
    formData.append('graduation_date', graduation_date)

    const data = await dispatch(signUp(formData));
    console.log('secondnext')
    console.log(data)
    if (data["first_name"] || data['last_name'] || data['profile_pic']) {

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
      encType="multipart/form-data"
      className="multi-step-form">
      <div className={`card ${card1}`} >
        <h3 className="step-title">Create Account</h3>
        <div className="form-group">
          <label>
            <label></label>
            {errors.email ? (<label style={{ color: "red" }}>{errors['email']}</label>) : (<div className="empty-space"> </div>)}
          </label>
          <input placeholder={"Email"} type='text' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="form-group">
          <label>
            {errors.username ? (<label style={{ color: "red" }}>{errors['username']}</label>) : (<div className="empty-space"> </div>)}
          </label>
          <input placeholder={"Username"} type='text' value={username} onChange={(e) => setUsername(e.target.value)}></input>
        </div>
        <div className="form-group">
          <label>
            {errors.password ? (<label style={{ color: "red" }}>{errors['password']}</label>) : (<div className="empty-space"> </div>)}
          </label>
          <input placeholder={"Password"} type='password' value={password} autoComplete="off" onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <div className="form-group">
          <label>
            {errors.confirmPassword ? (<label style={{ color: "red" }}>{errors['confirmPassword']}</label>) : (<div className="empty-space"> </div>)}
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
            {errors && errors.first_name ? (<label style={{ color: "red" }}>{errors['first_name']}</label>) : (<div className="empty-space"> </div>)}

            {/* <label style={{ color: "red" }}>{errors['first_name']}</label> */}
          </label>
          <input placeholder="First Name" type='text' value={first_name} onChange={(e) => setFirstName(e.target.value)}></input>
        </div>
        <div className="form-group">
          <label>
            {errors.last_name ? (<label style={{ color: "red" }}>{errors['last_name']}</label>) : (<div className="empty-space"> </div>)}
          </label>
          <input placeholder="Last Name" type='text' value={last_name} onChange={(e) => setLastName(e.target.value)}></input>
        </div>
        <div className="form-group">
          {errors && errors.profile_pic ?
            (<label>
              <label style={{ color: "red" }}>{errors['profile_pic']}</label>
            </label>) : (
              <label>
                Upload a Profile Picture
              </label>)
          }
          <div className="signupwrapper">
            <input
              type="file"
              id='uploadprofile'
              accept="image/*"
              placeholder="Image URL"
              value={image_url}
              onChange={(e) => {
                setProfilePic(e.target.files[0]);
                setImgUrl(e.target.value);
              }}
              // onChange={handleFileChange}
              className="imgurl-input"
              required
            />
            {image_url && <i className="fa-solid fa-xmark" onClick={(e) => {
              setImgUrl('')
              setProfilePic('')
            }}></i>}
            {/* <input type='text' placeholder="Profile Picture URL" value={profile_pic} onChange={(e) => setProfilePic(e.target.value)}></input> */}
          </div>
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
