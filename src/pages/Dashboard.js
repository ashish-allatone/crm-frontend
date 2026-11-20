import React, { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import { FaUserInjured, FaFlask, FaFileAlt, FaClock } from "react-icons/fa";
import { hasPermission } from "./permissionUtil";

const Dashboard = () => {
  const canView = hasPermission("Dashboard", "VIEW");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (canView) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [canView]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboard();
      setData(res.data.data || {});
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!canView) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-access-denied">Access Denied ❌</div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Patient Registered",
      value: data.totalPatients ?? 0,
      icon: <FaUserInjured />,
      tone: "navy",
      description: "Registered patients",
      size: "large",
    },
    {
      title: "Total Samples Collected",
      value: data.totalSamples ?? 0,
      icon: <FaFlask />,
      tone: "blue",
      description: "Samples collected",
      size: "large",
    },
    {
      title: "Total Reports Done",
      value: data.totalReports ?? 0,
      icon: <FaFileAlt />,
      tone: "green",
      description: "Completed reports",
      size: "large",
    },
    {
      title: "Average Turn Around Time",
      value: data.avgTat || "-",
      icon: <FaClock />,
      tone: "amber",
      description: "Overall average TAT",
      size: "large",
    },
  ];

  const tatCards = [
    {
      title: "Today Turn Around Time",
      value: data.todayTat || "-",
      icon: <FaClock />,
      tone: "cyan",
      description: "Today's turnaround",
    },
    {
      title: "This Week Turn Around Time",
      value: data.weekTat || "-",
      icon: <FaClock />,
      tone: "violet",
      description: "Weekly turnaround",
    },
    {
      title: "This Month Turn Around Time",
      value: data.monthTat || "-",
      icon: <FaClock />,
      tone: "teal",
      description: "Monthly turnaround",
    },
  ];

  return (
    <div className="container-fluid dashboard-page">
      <style>{`
        .dashboard-page {
          --dash-text: #18243a;
          --dash-muted: #718096;
          --dash-border: #e4eaf1;
          padding: 20px 18px 30px;
          color: var(--dash-text);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .dashboard-page .dashboard-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          margin: 2px 0 21px;
        }
        .dashboard-page .dashboard-title {
          margin: 0;
          color: #182f49;
          font-size: 22px;
          font-weight: 750;
          letter-spacing: -.35px;
        }
        .dashboard-page .dashboard-subtitle {
          margin: 5px 0 0;
          color: var(--dash-muted);
          font-size: 12.5px;
        }
        .dashboard-page .dashboard-section-label {
          margin: 0 0 12px;
          color: #526176;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .75px;
          text-transform: uppercase;
        }
        .dashboard-page .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .dashboard-page .dashboard-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 145px;
          overflow: hidden;
          padding: 23px 24px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 14px;
          color: #fff;
          box-shadow: 0 7px 18px rgba(17, 42, 69, .10);
          transition: transform .2s ease, box-shadow .2s ease;
          isolation: isolate;
        }
        .dashboard-page .dashboard-card::after {
          position: absolute;
          z-index: -1;
          right: -27px;
          bottom: -58px;
          width: 160px;
          height: 160px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 50%;
          content: "";
        }
        .dashboard-page .dashboard-card::before {
          position: absolute;
          z-index: -1;
          right: 22px;
          bottom: -78px;
          width: 160px;
          height: 160px;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 50%;
          content: "";
        }
        .dashboard-page .dashboard-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 11px 24px rgba(17, 42, 69, .15);
        }
        .dashboard-page .dashboard-card-content { min-width: 0; }
        .dashboard-page .dashboard-card-label {
          margin: 0 0 11px;
          color: rgba(255,255,255,.88);
          font-size: 12px;
          font-weight: 650;
          letter-spacing: .15px;
        }
        .dashboard-page .dashboard-card-value {
          margin: 0;
          color: #fff;
          font-size: clamp(25px, 3vw, 34px);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -.5px;
          overflow-wrap: anywhere;
          font-variant-numeric: tabular-nums;
        }
        .dashboard-page .dashboard-card-description {
          display: block;
          margin-top: 9px;
          color: rgba(255,255,255,.72);
          font-size: 11px;
        }
        .dashboard-page .dashboard-card-icon {
          display: grid;
          width: 54px;
          height: 54px;
          flex: 0 0 54px;
          place-items: center;
          margin-left: 14px;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 14px;
          background: rgba(255,255,255,.14);
          color: #fff;
          font-size: 25px;
        }
        .dashboard-page .tone-navy { background: linear-gradient(125deg, #164e78 0%, #0b2d4c 100%); }
        .dashboard-page .tone-blue { background: linear-gradient(125deg, #397ca8 0%, #205477 100%); }
        .dashboard-page .tone-green { background: linear-gradient(125deg, #29976e 0%, #176347 100%); }
        .dashboard-page .tone-amber { background: linear-gradient(125deg, #d9942e 0%, #a95e16 100%); }
        .dashboard-page .dashboard-tat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .dashboard-page .dashboard-tat-card {
          min-height: 130px;
          padding: 19px 20px;
        }
        .dashboard-page .dashboard-tat-card .dashboard-card-value { font-size: clamp(21px, 2.3vw, 27px); }
        .dashboard-page .dashboard-tat-card .dashboard-card-icon {
          width: 46px;
          height: 46px;
          flex-basis: 46px;
          border-radius: 12px;
          font-size: 21px;
        }
        .dashboard-page .tone-cyan { background: linear-gradient(125deg, #288eaa 0%, #176078 100%); }
        .dashboard-page .tone-violet { background: linear-gradient(125deg, #7168bb 0%, #49428c 100%); }
        .dashboard-page .tone-teal { background: linear-gradient(125deg, #249b87 0%, #17695c 100%); }
        .dashboard-page .dashboard-loading {
          display: flex;
          min-height: 260px;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #718096;
          font-size: 13px;
        }
        .dashboard-page .dashboard-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid #dce6ef;
          border-top-color: #0e3d66;
          border-radius: 50%;
          animation: dashboard-spin .8s linear infinite;
        }
        @keyframes dashboard-spin { to { transform: rotate(360deg); } }
        .dashboard-page .dashboard-access-denied {
          padding: 50px 20px;
          color: #a33d49;
          text-align: center;
          font-size: 17px;
          font-weight: 700;
        }
        @media (max-width: 767px) {
          .dashboard-page { padding: 14px 9px 24px; }
          .dashboard-page .dashboard-heading { margin-bottom: 17px; }
          .dashboard-page .dashboard-title { font-size: 20px; }
          .dashboard-page .dashboard-grid { gap: 11px; margin-bottom: 20px; }
          .dashboard-page .dashboard-card { min-height: 125px; padding: 16px 14px; border-radius: 11px; }
          .dashboard-page .dashboard-card-label { font-size: 11px; margin-bottom: 8px; }
          .dashboard-page .dashboard-card-value { font-size: 25px; }
          .dashboard-page .dashboard-card-icon { width: 40px; height: 40px; flex-basis: 40px; margin-left: 8px; font-size: 19px; }
          .dashboard-page .dashboard-tat-grid { grid-template-columns: 1fr; gap: 11px; }
          .dashboard-page .dashboard-tat-card { min-height: 105px; }
          .dashboard-page .dashboard-tat-card .dashboard-card-value { font-size: 23px; }
        }
        @media (max-width: 420px) {
          .dashboard-page .dashboard-grid { grid-template-columns: 1fr; }
          .dashboard-page .dashboard-card { min-height: 112px; }
        }
      `}</style>

      <div className="dashboard-heading">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">A snapshot of patient activity, samples and report turnaround</p>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <span className="dashboard-spinner" aria-hidden="true" />
          Loading dashboard...
        </div>
      ) : (
        <>
          <section aria-label="Dashboard summary">
            <h2 className="dashboard-section-label">Overall Summary</h2>
            <div className="dashboard-grid">
              {summaryCards.map((card) => (
                <div key={card.title} className={`dashboard-card tone-${card.tone}`}>
                  <div className="dashboard-card-content">
                    <h3 className="dashboard-card-label">{card.title}</h3>
                    <p className="dashboard-card-value">{card.value}</p>
                    <span className="dashboard-card-description">{card.description}</span>
                  </div>
                  <div className="dashboard-card-icon" aria-hidden="true">{card.icon}</div>
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Turnaround time summary">
            <h2 className="dashboard-section-label">Turn Around Time</h2>
            <div className="dashboard-tat-grid">
              {tatCards.map((card) => (
                <div key={card.title} className={`dashboard-card dashboard-tat-card tone-${card.tone}`}>
                  <div className="dashboard-card-content">
                    <h3 className="dashboard-card-label">{card.title}</h3>
                    <p className="dashboard-card-value">{card.value}</p>
                    <span className="dashboard-card-description">{card.description}</span>
                  </div>
                  <div className="dashboard-card-icon" aria-hidden="true">{card.icon}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;

// import React , {useState,useEffect} from "react";
// import "../styles/dashboard.css";
// import { getDashboard } from "../services/dashboardService";
// import { FaUserInjured, FaFlask, FaFileAlt, FaClock } from "react-icons/fa";
// import { hasPermission } from "./permissionUtil";

// const Dashboard = () => {
//   const canView = hasPermission("Dashboard", "VIEW");

//     const [data, setData] = useState({});
//     useEffect(() => {
//   loadDashboard();
// }, []);

// if (!canView) {
//   return <h3>Access Denied ❌</h3>;
// }
// // const loadDashboard = async () => {
// //   try {
// //     const res = await getDashboard();

// //     console.log("🔥 DASHBOARD:", res.data);

// //     setData(res.data.data || {});
// //   } catch (err) {
// //     console.error(err);
// //   }
// // };
// const loadDashboard = async () => {
//   try {
//     const res = await getDashboard();
//     setData(res.data.data || {});
//   } catch (err) {
//     if (err.response?.status === 403) {
//       alert("Access Denied ❌");
//     }
//   }
// };
//   return (
//     <div className="container-fluid mt-4">
//       {/* FIRST ROW */}

//       <div className="row g-4">
//         <div className="col-md-6">
//           <div className="dashboard-card teal">
//             <div>
//               <h6>Total Patient Registered</h6>
//               <h3>{data.totalPatients || 0}</h3>
//             </div>

//             <FaUserInjured className="card-icon" />
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="dashboard-card red">
//             <div>
//               <h6>Total Samples Collected</h6>
//              <h3>{data.totalSamples || 0}</h3>
//             </div>

//             <FaFlask className="card-icon" />
//           </div>
//         </div>
//       </div>

//       {/* SECOND ROW */}

//       <div className="row g-4 mt-1">
//         <div className="col-md-6">
//           <div className="dashboard-card green">
//             <div>
//               <h6>Total Reports Done</h6>
//               <h3>{data.totalReports || 0}</h3>
//             </div>

//             <FaFileAlt className="card-icon" />
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="dashboard-card orange">
//             <div>
//               <h6>Average Turn Around Time</h6>
//               <h4>{data.avgTat || "-"}</h4>
//             </div>

//             <FaClock className="card-icon" />
//           </div>
//         </div>
//       </div>

//       {/* THIRD ROW */}

//       <div className="row g-4 mt-1">
//         <div className="col-md-4">
//           <div className="dashboard-card cyan">
//             <div>
//               <h6>Today Turn Around Time</h6>
//               <h5>{data.todayTat || "-"}</h5>
//             </div>

//             <FaClock className="card-icon" />
//           </div>
//         </div>

//         <div className="col-md-4">
//           <div className="dashboard-card purple">
//             <div>
//               <h6>This Week Turn Around Time</h6>
//               <h5>{data.weekTat || "-"}</h5>
//             </div>

//             <FaClock className="card-icon" />
//           </div>
//         </div>

//         <div className="col-md-4">
//           <div className="dashboard-card green2">
//             <div>
//               <h6>This Month Turn Around Time</h6>
//               <h5>{data.monthTat || "-"}</h5>
//             </div>

//             <FaClock className="card-icon" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
