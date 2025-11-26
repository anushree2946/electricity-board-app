import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../api"; 
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";

function Home() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // ===========================
  // Fetch Data from Django API
  // ===========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ⭐ FINAL FIXED URL ⭐
        let url = `${API_BASE_URL}/api/getApplicantsData?page=${currentPage}`;

        if (startDate && endDate) {
          url += `&start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate
            .toISOString()
            .split("T")[0]}`;
        }

        if (searchQuery.trim()) {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }

        console.log("Fetching data from:", url);

        const response = await axios.get(url);
        const jsonData = response.data;

        console.log("API Response:", jsonData);

        setData(jsonData.data || []);
        setTotalPages(jsonData.total_pages || 1);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, startDate, endDate, searchQuery]);

  return (
    <div className="container mt-2">
      <h1>Applicant Details</h1>
      <hr />

      {/* Filters */}
      <Row>
        <p>Filter By Date of Application</p>
        <Col md={2}>
          <DatePicker
            selected={startDate}
            className="form-control date"
            onChange={setStartDate}
            placeholderText="From Date"
          />
        </Col>
        <Col md={2}>
          <DatePicker
            selected={endDate}
            className="form-control date"
            onChange={setEndDate}
            placeholderText="To Date"
          />
        </Col>

        <Col md={3}></Col>

        <Col md={5}>
          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search By Applicant ID.."
          />
        </Col>
      </Row>
      <hr />

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p className="text-center">Loading data...</p>
        ) : (
          <table className="table table-bordered">
            <thead className="sticky-header">
              <tr>
                <th>ID</th>
                <th>Applicant Name</th>
                <th>Gender</th>
                <th>District</th>
                <th>State</th>
                <th>Pincode</th>
                <th>Ownership</th>
                <th>Govt ID Type</th>
                <th>ID Number</th>
                <th>Category</th>
                <th>Load Applied</th>
                <th>Date of Application</th>
                <th>Status</th>
                <th>Reviewer ID</th>
                <th>Reviewer Name</th>
                <th>Reviewer Comments</th>
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((connection) => (
                  <tr key={connection.id}>
                    <td>{connection.id}</td>
                    <td>{connection.Applicant?.Applicant_Name || "N/A"}</td>
                    <td>{connection.Applicant?.Gender || "N/A"}</td>
                    <td>{connection.Applicant?.District || "N/A"}</td>
                    <td>{connection.Applicant?.State || "N/A"}</td>
                    <td>{connection.Applicant?.Pincode || "N/A"}</td>
                    <td>{connection.Applicant?.Ownership || "N/A"}</td>
                    <td>{connection.Applicant?.GovtID_Type || "N/A"}</td>
                    <td>{connection.Applicant?.ID_Number || "N/A"}</td>
                    <td>{connection.Applicant?.Category || "N/A"}</td>
                    <td>{connection.Load_Applied || "N/A"}</td>
                    <td>{connection.Date_of_Application || "N/A"}</td>
                    <td>{connection.Status || "N/A"}</td>
                    <td>{connection.Reviewer_ID || "N/A"}</td>
                    <td>{connection.Reviewer_Name || "N/A"}</td>
                    <td>{connection.Reviewer_Comments || "N/A"}</td>
                    <td>
                      <Link
                        to={`/editApplicant/${connection.id}`}
                        className="btn btn-outline-success btn-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="17" className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="container">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button onClick={() => setCurrentPage(1)} className="page-link">
              Go to First
            </button>
          </li>

          {Array.from({ length: totalPages }).map((_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button onClick={() => setCurrentPage(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button onClick={() => setCurrentPage(totalPages)} className="page-link">
              Go to Last
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
