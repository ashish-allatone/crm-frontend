
import { useEffect, useRef, useState } from "react";
import { FaClock, FaExclamationTriangle, FaSignOutAlt, FaArrowRight } from "react-icons/fa";

import "../styles/navbar.css";

const IDLE_TIME = 5 * 60 * 1000;
const WARNING_TIME = 30 * 1000;

export default function IdleTimeout() {
  const idleTimer = useRef(null);
  const logoutTimer = useRef(null);
  const showModalRef = useRef(false);

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    showModalRef.current = showModal;
  }, [showModal]);

  const logout = () => {
    clearTimeout(idleTimer.current);
    clearInterval(logoutTimer.current);
    localStorage.clear();
    window.location.replace("/crm/login");
  };

  const startIdleTimer = () => {
    clearTimeout(idleTimer.current);
    clearInterval(logoutTimer.current);

    idleTimer.current = setTimeout(() => {
      setShowModal(true);

      let sec = 30;
      setCountdown(sec);

      logoutTimer.current = setInterval(() => {
        sec--;
        setCountdown(sec);

        if (sec <= 0) {
          clearInterval(logoutTimer.current);
          logout();
        }
      }, 1000);
    }, IDLE_TIME - WARNING_TIME);
  };

  const resetTimer = () => {
    if (showModalRef.current) return;

    setCountdown(30);
    startIdleTimer();
  };

  const continueSession = () => {
    clearInterval(logoutTimer.current);
    setShowModal(false);
    setCountdown(30);
    startIdleTimer();
  };

  useEffect(() => {
    document.body.classList.toggle("modal-open", showModal);

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showModal]);

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "click"
    ];

    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      clearTimeout(idleTimer.current);
      clearInterval(logoutTimer.current);

      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  if (!localStorage.getItem("token")) return null;

  return (
    showModal && (
      <div className="idle-overlay">
        <div className="idle-modal">

          <div className="idle-icon-wrapper">
            <FaExclamationTriangle />
          </div>

          <div className="idle-heading">
            <span className="idle-label">SESSION TIMEOUT</span>
            <h3>Your Session is Expiring</h3>
            <p>
              For your security, you will be automatically logged out
              due to inactivity.
            </p>
          </div>

          <div className="idle-countdown-box">
            <div className="idle-clock-icon">
              <FaClock />
            </div>

            <div className="idle-countdown-content">
              <span>Time remaining</span>
              <strong>{countdown} seconds</strong>
            </div>

            <div className="idle-countdown-number">
              {String(countdown).padStart(2, "0")}
            </div>
          </div>

          <div className="idle-progress-track">
            <div
              className="idle-progress-bar"
              style={{ width: `${(countdown / 30) * 100}%` }}
            />
          </div>

          <div className="idle-buttons">
            <button
              type="button"
              className="idle-continue-btn"
              onClick={continueSession}
            >
              Continue Session
              <FaArrowRight />
            </button>

            <button
              type="button"
              className="idle-logout-btn"
              onClick={logout}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          <div className="idle-security-note">
            Your account security is important to us.
          </div>

        </div>
      </div>
    )
  );
}


// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const IDLE_TIME = 5 * 60 * 1000;      // 5 Minutes
// const WARNING_TIME = 30 * 1000;       // Last 30 Seconds

// export default function IdleTimeout() {

//     const navigate = useNavigate();

//     const idleTimer = useRef(null);
//     const logoutTimer = useRef(null);

//     const [showModal, setShowModal] = useState(false);
//     const [countdown, setCountdown] = useState(30);

//     const showModalRef = useRef(false);

//     useEffect(() => {
//     showModalRef.current = showModal;
// }, [showModal]);

// useEffect(() => {

//     if(showModal){

//         document.body.classList.add("modal-open");

//     }else{

//         document.body.classList.remove("modal-open");

//     }

// },[showModal]);

//     const logout = () => {

//     localStorage.clear();

//     window.location.replace("/crm/login");

// };

   

    

//     const startIdleTimer = () => {

//     clearTimeout(idleTimer.current);
//     clearInterval(logoutTimer.current);

//     idleTimer.current = setTimeout(() => {

//         setShowModal(true);

//         let sec = 30;

//         logoutTimer.current = setInterval(() => {

//             sec--;

//             setCountdown(sec);

//             if (sec <= 0) {

//                 clearInterval(logoutTimer.current);

//                 logout();

//             }

//         },1000);

//     }, IDLE_TIME - WARNING_TIME);

// };

// const resetTimer = () => {

//     if (showModalRef.current) return;

//     setCountdown(30);

//     startIdleTimer();

// };

// const continueSession = () => {

//     setShowModal(false);

//     setCountdown(30);

//     startIdleTimer();

// };



//     useEffect(() => {

//         const events = [
//             "mousemove",
//             "mousedown",
//             "keypress",
//             "scroll",
//             "touchstart",
//             "click"
//         ];

//         events.forEach(e =>
//             window.addEventListener(e, resetTimer)
//         );

//         resetTimer();

//         return () => {

//             clearTimeout(idleTimer.current);
//             clearInterval(logoutTimer.current);

//             events.forEach(e =>
//                 window.removeEventListener(e, resetTimer)
//             );

//         };

//     }, []);

//     if (!localStorage.getItem("token"))
//         return null;

//     return (

//         showModal && (

//             <div className="idle-overlay">

//                 <div className="idle-modal">

//                     <h3>Session Expiring</h3>

//                     <p>

//                         Your session will expire in

//                         <b> {countdown} seconds</b>

//                     </p>

//                     <div className="idle-buttons">

//                         <button
//     onClick={continueSession}
// >
//     Continue Session
// </button>

//                         <button
//                             onClick={logout}
//                         >
//                             Logout
//                         </button>

//                     </div>

//                 </div>

//             </div>

//         )

//     );

// }