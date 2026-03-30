// import React, { useState } from "react";

// export default function Login() {
//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       });

//       const token = await res.text();

//       localStorage.setItem("token", token);

//       window.location.href = "/"; // dashboard
//     } catch (err) {
//       alert("Login failed");
//     }
//   };

//   return (
//     <div style={{ width: "300px", margin: "100px auto" }}>
//       <h2>Login</h2>

//       <input name="username" placeholder="Username" onChange={handleChange} />
//       <input type="password" name="password" placeholder="Password" onChange={handleChange} />

//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }
import React, { useState } from "react";
import "../styles/allPatients.css"; // same css use karo

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    // 🔥 IMPORTANT: check status
    if (!res.ok) {
      const errorMsg = await res.text(); // backend se message
      alert(errorMsg || "Invalid username or password");
      return;
    }

    const token = await res.text();

    localStorage.setItem("token", token);

    window.location.href = "/";
  } catch (err) {
    alert("Server error. Please try again.");
  }
};

  return (
   <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="card" style={{ width: "400px" }}>
        
        {/* HEADER same as Users */}
        <div
          className="card-header text-center"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Login</h5>
        </div>

        <div className="card-body">

          {/* Username */}
          <div className="mb-3">
            <label>Username</label>
            <input
              className="form-control"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <div className="d-grid">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}