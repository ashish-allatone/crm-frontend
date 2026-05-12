// import React, { useState } from "react";
// import "../styles/allPatients.css";
// export default function Login() {
//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async () => {
//   try {
//     const res = await fetch("http://localhost:8080/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(form),
//     });

//     if (!res.ok) {
//       const errorMsg = await res.text();
//       alert(errorMsg || "Invalid username or password");
//       return;
//     }

//     const token = await res.text();

//     // ✅ SAVE TOKEN
//     localStorage.setItem("token", token);

//     // 🔥 STEP 1: Get current user
//     const userRes = await fetch("http://localhost:8080/api/users/me", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const userData = await userRes.json();

//     const roleId = userData.data.roles[0].id;

//     // 🔥 STEP 2: Get permissions
//     const permRes = await fetch(`http://localhost:8080/api/permissions/${roleId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const permData = await permRes.json();

//     // 🔥 STEP 3: SAVE permissions
//     localStorage.setItem("permissions", JSON.stringify(permData.data));

//     // optional: save user also
//     localStorage.setItem("user", JSON.stringify(userData.data));

//     window.location.href = "/";

//   } catch (err) {
//     alert("Server error. Please try again.");
//   }
// };

//   return (
//     <div style={{ width: "300px", margin: "100px auto" }}>
//       <h2>Login</h2>

//       <input name="username" placeholder="Username" onChange={handleChange} />
//       <input type="password" name="password" placeholder="Password" onChange={handleChange} />

//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }
// import React, { useState } from "react";
// import "../styles/allPatients.css"; // same css use karo

// export default function Login() {
//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

// //   const handleLogin = async () => {
// //   try {
// //     const res = await fetch("http://localhost:8080/api/auth/login", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify(form),
// //     });

// //     // 🔥 IMPORTANT: check status
// //     if (!res.ok) {
// //       const errorMsg = await res.text(); // backend se message
// //       alert(errorMsg || "Invalid username or password");
// //       return;
// //     }

// //     const token = await res.text();

// //     localStorage.setItem("token", token);

// //     window.location.href = "/";
// //   } catch (err) {
// //     alert("Server error. Please try again.");
// //   }
// // };
// const handleLogin = async () => {
//   try {
//     const res = await fetch("http://localhost:8080/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(form),
//     });

//     if (!res.ok) {
//       const errorMsg = await res.text();
//       alert(errorMsg || "Invalid username or password");
//       return;
//     }

//     const token = await res.text();
//     localStorage.setItem("token", token);

//     // ✅ USER
//     const userRes = await fetch("http://localhost:8080/api/users/me", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!userRes.ok) {
//       alert("Failed to fetch user");
//       return;
//     }

//     const userData = await userRes.json();
//     localStorage.setItem("user", JSON.stringify(userData.data));

//     const roleId = userData.data.roles[0].id;

//     // ✅ PERMISSIONS
//     const permRes = await fetch(`http://localhost:8080/api/permissions/${roleId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!permRes.ok) {
//       alert("Failed to load permissions");
//       return;
//     }

//     const permData = await permRes.json();

//     localStorage.setItem(
//       "permissions",
//       JSON.stringify(permData.data || [])
//     );

//     window.location.href = "/";

//   } catch (err) {
//     alert("Server error. Please try again.");
//   }
// };

//   return (
//    <div className="vh-100 d-flex justify-content-center align-items-center">
//       <div className="card" style={{ width: "400px" }}>
        
//         {/* HEADER same as Users */}
//         <div
//           className="card-header text-center"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Login</h5>
//         </div>

//         <div className="card-body">

//           {/* Username */}
//           <div className="mb-3">
//             <label>Username</label>
//             <input
//               className="form-control"
//               name="username"
//               placeholder="Enter username"
//               value={form.username}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-3">
//             <label>Password</label>
//             <input
//               type="password"
//               className="form-control"
//               name="password"
//               placeholder="Enter password"
//               value={form.password}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Button */}
//           <div className="d-grid">
//             <button className="btn btn-primary" onClick={handleLogin}>
//               Login
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
// import "../styles/allPatients.css";

// ── Injected Styles ───────────────────────────────────────────────────────────
const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #f0f2f5;
    padding: 1rem;
    font-family: 'DM Sans', sans-serif;
  }

  .login-wrapper {
    display: flex;
    width: 100%;
    max-width: 960px;
    min-height: 600px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  /* ── LEFT PANEL ── */
  .lp-left {
    flex: 1.1;
    background: #0a2d4a;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 2.5rem;
    overflow: hidden;
  }

  .lp-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, #0e3d66 0%, #0a2d4a 50%, #061d30 100%);
  }

  .lp-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .lp-content {
    position: relative;
    z-index: 2;
  }

  .lp-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.1);
    border: 0.5px solid rgba(255,255,255,0.2);
    border-radius: 20px;
    padding: 6px 14px;
    margin-bottom: 1.25rem;
  }

  .lp-badge span {
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .lp-heading {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    line-height: 1.3;
    margin-bottom: 0.75rem;
  }

  .lp-sub {
    font-size: 13.5px;
    color: rgba(255,255,255,0.6);
    line-height: 1.6;
    max-width: 300px;
  }

  .lp-stats {
    display: flex;
    gap: 2rem;
    margin-top: 1.75rem;
  }

  .lp-stat { display: flex; flex-direction: column; gap: 2px; }
  .lp-stat-num { font-size: 20px; font-weight: 500; color: #5bbfff; }
  .lp-stat-label { font-size: 11px; color: rgba(255,255,255,0.5); letter-spacing: 0.04em; }

  /* ── RIGHT PANEL ── */
  .lp-right {
    flex: 0.9;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 2.75rem;
  }

  .lp-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 2.25rem;
  }

  .lp-logo-icon {
    width: 36px;
    height: 36px;
    background: #0a2d4a;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lp-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    color: #111;
  }

  .lp-title { font-size: 22px; font-weight: 500; color: #111; margin-bottom: 6px; }
  .lp-desc  { font-size: 13.5px; color: #888; margin-bottom: 2rem; }

  .lp-form-group { margin-bottom: 1.25rem; }

  .lp-label {
    display: block;
    font-size: 12.5px;
    font-weight: 500;
    color: #666;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 7px;
  }

  .lp-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .lp-icon {
    position: absolute;
    left: 12px;
    opacity: 0.4;
    pointer-events: none;
    color: #111;
    display: flex;
    align-items: center;
  }

  .lp-input {
    width: 100%;
    height: 42px;
    border: 0.5px solid #ccc;
    border-radius: 8px;
    padding: 0 12px 0 38px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #111;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .lp-input:focus {
    border-color: #185fa5;
    box-shadow: 0 0 0 3px rgba(24,95,165,0.1);
  }

  .lp-input::placeholder { color: #bbb; }

  .lp-eye {
    position: absolute;
    right: 12px;
    cursor: pointer;
    opacity: 0.4;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    color: #111;
    transition: opacity 0.15s;
  }
  .lp-eye:hover { opacity: 0.7; }

  .lp-error {
    font-size: 12.5px;
    color: #c0392b;
    margin-top: 5px;
    display: block;
  }

  .lp-btn {
    width: 100%;
    height: 44px;
    background: #0a2d4a;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    margin-top: 1.5rem;
    letter-spacing: 0.03em;
    transition: background 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .lp-btn:hover:not(:disabled) { background: #0e3d66; }
  .lp-btn:active:not(:disabled) { transform: scale(0.98); }
  .lp-btn:disabled { opacity: 0.75; cursor: not-allowed; }
  .lp-btn.lp-btn--loading { background: #0e3d66; }
  .lp-btn.lp-btn--success { background: #0f6e56; }

  .lp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 1.25rem 0;
  }
  .lp-divider-line { flex: 1; height: 0.5px; background: #e5e5e5; }
  .lp-divider-text { font-size: 12px; color: #aaa; }

  .lp-sso {
    width: 100%;
    height: 42px;
    background: #f5f5f5;
    border: 0.5px solid #ddd;
    border-radius: 8px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s;
  }
  .lp-sso:hover { background: #ececec; }

  .lp-help {
    font-size: 12px;
    color: #aaa;
    text-align: center;
    margin-top: 1.5rem;
  }
  .lp-help a { color: #185fa5; text-decoration: none; }
  .lp-help a:hover { text-decoration: underline; }

  @media (max-width: 700px) {
    .lp-left { display: none; }
    .login-wrapper { max-width: 420px; }
    .lp-right { padding: 2.5rem 1.75rem; }
  }
`;

// ── Hospital SVG Illustration ─────────────────────────────────────────────────
function HospitalScene() {
  return (
    <svg className="lp-svg" viewBox="0 0 420 600" xmlns="http://www.w3.org/2000/svg">
      {[120, 240, 360].map((y) => (
        <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {[140, 280].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="600" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* Building */}
      <rect x="110" y="180" width="200" height="200" fill="rgba(255,255,255,0.06)" rx="4" />
      <rect x="175" y="310" width="70"  height="70"  fill="rgba(255,255,255,0.08)" rx="3" />

      {/* Windows row 1 */}
      {[{ x:130,o:.15},{x:175,o:.20},{x:220,o:.12},{x:265,o:.18}].map(({x,o})=>(
        <rect key={x} x={x} y="200" width="30" height="25" fill={`rgba(91,191,255,${o})`} rx="3"/>
      ))}
      {/* Windows row 2 */}
      {[{ x:130,o:.10},{x:175,o:.22},{x:220,o:.08},{x:265,o:.15}].map(({x,o})=>(
        <rect key={x} x={x} y="245" width="30" height="25" fill={`rgba(91,191,255,${o})`} rx="3"/>
      ))}
      {/* Windows row 3 */}
      <rect x="130" y="290" width="30" height="25" fill="rgba(91,191,255,0.14)" rx="3"/>
      <rect x="265" y="290" width="30" height="25" fill="rgba(91,191,255,0.10)" rx="3"/>

      {/* Roof */}
      <rect x="130" y="140" width="160" height="42" fill="rgba(255,255,255,0.07)" rx="3"/>

      {/* Roof cross */}
      <rect x="198" y="100" width="24" height="8"  fill="rgba(91,191,255,0.6)" rx="2"/>
      <rect x="208" y="90"  width="8"  height="28" fill="rgba(91,191,255,0.6)" rx="2"/>

      {/* Flag */}
      <line x1="210" y1="85" x2="210" y2="65" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <rect x="210" y="65" width="18" height="11" fill="rgba(91,191,255,0.5)" rx="1"/>

      {/* Ambulance */}
      <rect x="40" y="370" width="80" height="40" fill="rgba(255,255,255,0.08)" rx="5"/>
      <rect x="40" y="370" width="28" height="40" fill="rgba(91,191,255,0.12)" rx="5"/>
      {[55,102].map(cx=>(
        <g key={cx}>
          <circle cx={cx} cy="412" r="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
          <circle cx={cx} cy="412" r="4" fill="rgba(255,255,255,0.2)"/>
        </g>
      ))}
      <rect x="80" y="381" width="14" height="4"  fill="rgba(91,191,255,0.5)" rx="1"/>
      <rect x="85" y="376" width="4"  height="14" fill="rgba(91,191,255,0.5)" rx="1"/>

      {/* Data card – top right */}
      <rect x="295" y="85" width="110" height="58" fill="rgba(255,255,255,0.06)" rx="8" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
      <circle cx="313" cy="103" r="8" fill="rgba(91,191,255,0.2)"/>
      <rect x="325" y="98"  width="55" height="5"  fill="rgba(255,255,255,0.25)" rx="2"/>
      <rect x="325" y="108" width="35" height="4"  fill="rgba(255,255,255,0.12)" rx="2"/>
      <rect x="305" y="120" width="85" height="14" fill="rgba(91,191,255,0.12)" rx="3"/>
      <rect x="305" y="120" width="40" height="14" fill="rgba(91,191,255,0.25)" rx="3"/>

      {/* Data card – left mid */}
      <rect x="15" y="200" width="85" height="70" fill="rgba(255,255,255,0.05)" rx="8" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <rect x="25" y="212" width="30" height="4"  fill="rgba(255,255,255,0.2)"  rx="2"/>
      <rect x="25" y="222" width="55" height="18" fill="rgba(91,191,255,0.15)" rx="3"/>
      <text x="35" y="235" fontSize="11" fill="rgba(91,191,255,0.9)" fontFamily="DM Sans,sans-serif" fontWeight="500">98.4%</text>
      <rect x="25" y="248" width="45" height="3"  fill="rgba(255,255,255,0.1)"  rx="2"/>
      <rect x="25" y="255" width="32" height="3"  fill="rgba(255,255,255,0.07)" rx="2"/>

      {/* Heartbeat */}
      <polyline points="15,450 55,450 70,420 85,480 100,430 115,450 160,450"
        stroke="rgba(91,191,255,0.4)" strokeWidth="1.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* Dots */}
      <circle cx="310" cy="170" r="2"   fill="rgba(91,191,255,0.3)"/>
      <circle cx="335" cy="180" r="1.5" fill="rgba(91,191,255,0.2)"/>
      <circle cx="320" cy="195" r="1"   fill="rgba(91,191,255,0.15)"/>
      <circle cx="70"  cy="155" r="2"   fill="rgba(255,255,255,0.1)"/>
      <circle cx="88"  cy="168" r="1.5" fill="rgba(255,255,255,0.08)"/>

      {/* Road */}
      <line x1="0" y1="480" x2="420" y2="480" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

      {/* Trees */}
      <ellipse cx="360" cy="440" rx="16" ry="20" fill="rgba(255,255,255,0.05)"/>
      <rect    x="357"  y="455"  width="6"  height="18" fill="rgba(255,255,255,0.05)"/>
      <ellipse cx="385" cy="445" rx="13" ry="16" fill="rgba(255,255,255,0.04)"/>
      <rect    x="382"  y="457"  width="5"  height="15" fill="rgba(255,255,255,0.04)"/>
    </svg>
  );
}

// ── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconCrossWhite = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="7" y="1" width="4" height="16" rx="1.5" fill="white"/>
    <rect x="1" y="7" width="16" height="4" rx="1.5" fill="white"/>
  </svg>
);
const IconCrossBlue = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="5.5" y="1"   width="3"  height="12" rx="1" fill="rgba(91,191,255,0.9)"/>
    <rect x="1"   y="5.5" width="12" height="3"  rx="1" fill="rgba(91,191,255,0.9)"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2 13c0-2.5 2.7-4.5 6-4.5s6 2 6 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 7V5a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
  </svg>
);
const IconEyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const IconEyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 2l12 12M6.5 6.6A2 2 0 0 0 9.4 9.5M4 4.3C2.4 5.4 1 8 1 8s2.5 5 7 5c1.4 0 2.6-.4 3.7-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.6 1.2-1.6 2.4"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M10 11l3-3-3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="13" y1="8" x2="6" y2="8" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l4 4 6-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconSSO = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

// ── Main Login Component ──────────────────────────────────────────────────────
export default function Login() {
  // ── your original state ──
  const [form, setForm] = useState({ username: "", password: "" });

  // ── new UI state ──
  const [showPass, setShowPass]   = useState(false);
  const [status,   setStatus]     = useState("idle"); // idle | loading | success
  const [errors,   setErrors]     = useState({});

  // ── your original handler (unchanged) ──
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  // ── your original API call (unchanged) — wrapped with UI state ──
  // const handleLogin = async () => {
  //   // client-side validation
  //   const e = {};
  //   if (!form.username.trim()) e.username = "Username is required.";
  //   if (!form.password)        e.password = "Password is required.";
  //   if (Object.keys(e).length) { setErrors(e); return; }

  //   setStatus("loading");

  //   try {
  //     const res = await fetch("http://localhost:8080/api/auth/login", {
  //     // const res = await fetch("https://uatdms.healncare.in/api/auth/login", {
  //       // https://uatdms.healncare.in
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(form),
  //     });

  //     if (!res.ok) {
  //       const errorMsg = await res.text();
  //       alert(errorMsg || "Invalid username or password");
  //       setStatus("idle");
  //       return;
  //     }

  //     const token = await res.text();
  //     localStorage.setItem("token", token);

  //     setStatus("success");
  //     setTimeout(() => { window.location.href = "/"; }, 800);

  //   } catch (err) {
  //     alert("Server error. Please try again.");
  //     setStatus("idle");
  //   }
  // };
  const handleLogin = async () => {
  // validation (UI wala same rahega)
  const e = {};
  if (!form.username.trim()) e.username = "Username is required.";
  if (!form.password) e.password = "Password is required.";
  if (Object.keys(e).length) {
    setErrors(e);
    return;
  }

  setStatus("loading");

  try {
    // ✅ LOGIN
    const res = await fetch("http://localhost:9090/crm/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    // if (!res.ok) {
    //   const errorMsg = await res.text();
    //   alert(errorMsg || "Invalid username or password");
    //   setStatus("idle");
    //   return;
    // }
    if (!res.ok) {
  const errorData = await res.json();
  alert(errorData.message || "Login failed");
  setStatus("idle");
  return;
}

    const token = await res.text();
    localStorage.setItem("token", token);

    // ✅ USER FETCH
    const userRes = await fetch("http://localhost:9090/crm/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      alert("Failed to fetch user");
      setStatus("idle");
      return;
    }

    const userData = await userRes.json();
    localStorage.setItem("user", JSON.stringify(userData.data));

    const roleId = userData.data.roles[0].id;

    // ✅ PERMISSIONS FETCH
    const permRes = await fetch(
      `http://localhost:9090/crm/permissions/${roleId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!permRes.ok) {
      alert("Failed to load permissions");
      setStatus("idle");
      return;
    }

    const permData = await permRes.json();

    localStorage.setItem(
      "permissions",
      JSON.stringify(permData.data || [])
    );

    // ✅ SUCCESS UI + REDIRECT
    setStatus("success");
    setTimeout(() => {
      window.location.href = "/";
    }, 800);

  } catch (err) {
    alert("Server error. Please try again.");
    setStatus("idle");
  }
};

  // ── button label helper ──
  const btnLabel = () => {
    if (status === "loading") return "Signing in...";
    if (status === "success") return <><IconCheck /> Signed in</>;
    return <><IconArrow /> Login</>;
  };

  const btnClass = [
    "lp-btn",
    status === "loading" ? "lp-btn--loading" : "",
    status === "success" ? "lp-btn--success" : "",
  ].filter(Boolean).join(" ");

  

  return (
    <>
      <style>{loginStyles}</style>

      <div className="login-page">
        <div className="login-wrapper">

          {/* ══════════ LEFT PANEL ══════════ */}
          <div className="lp-left">
            <HospitalScene />

            <div className="lp-content">
              <div className="lp-badge">
                <IconCrossBlue />
                <span>MediCore CRM</span>
              </div>

              <h1 className="lp-heading">
                Smarter care<br />starts with better data
              </h1>
              <p className="lp-sub">
                Manage patients, staff, and hospital operations from a single unified platform.
              </p>

              <div className="lp-stats">
                {[
                  { num: "12k+",  label: "Patients managed" },
                  { num: "98.4%", label: "Uptime"           },
                  { num: "340+",  label: "Hospitals"        },
                ].map(({ num, label }) => (
                  <div className="lp-stat" key={label}>
                    <span className="lp-stat-num">{num}</span>
                    <span className="lp-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════ RIGHT PANEL ══════════ */}
          <div className="lp-right">

            {/* Logo */}
            <div className="lp-logo">
              <div className="lp-logo-icon"><IconCrossWhite /></div>
              <span className="lp-logo-text">MediCore</span>
            </div>

            <h2 className="lp-title">Welcome back</h2>
            <p className="lp-desc">Sign in to your hospital dashboard</p>

            {/* Username — name="username" preserved from your original */}
            <div className="lp-form-group">
              <label className="lp-label" htmlFor="username">Username</label>
              <div className="lp-input-wrap">
                <span className="lp-icon"><IconUser /></span>
                <input
                  id="username"
                  className="lp-input"
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
              {errors.username && <span className="lp-error">{errors.username}</span>}
            </div>

            {/* Password — name="password" preserved from your original */}
            <div className="lp-form-group">
              <label className="lp-label" htmlFor="password">Password</label>
              <div className="lp-input-wrap">
                <span className="lp-icon"><IconLock /></span>
                <input
                  id="password"
                  className="lp-input"
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  className="lp-eye"
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <IconEyeOpen /> : <IconEyeClosed />}
                </button>
              </div>
              {errors.password && <span className="lp-error">{errors.password}</span>}
            </div>

            {/* Login button — calls your original handleLogin */}
            <button
              className={btnClass}
              onClick={handleLogin}
              disabled={status === "loading" || status === "success"}
              type="button"
            >
              {btnLabel()}
            </button>

            {/* Divider */}
            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-text">or</span>
              <div className="lp-divider-line" />
            </div>

            {/* SSO */}
            <button className="lp-sso" type="button">
              <IconSSO />
              Continue with SSO
            </button>

            <p className="lp-help">
              Need access? <a href="#contact">Contact your administrator</a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
