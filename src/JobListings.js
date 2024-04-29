import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function removeHtmlTags(html) {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText || '';
}

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = (page) => {
    fetch(`${API_URL}/api/jobs?page=${page}`)
      .then(response => response.json())
      .then(data => {
        const newJobs = data.jobs.map(job => ({
          ...job,
          description: removeHtmlTags(job.description),
        }));
        setJobs(newJobs);
        setTotalPages(data.pageCount);
      })
      .catch(error => console.error('Error fetching jobs:', error));
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <h1>Remote Job Listings</h1>
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
      </div>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <h2>{job.jobTitle} at {job.companyName}</h2>
            <p>Location: {job.location}</p>
            <p>Posted on: {new Date(job.date).toLocaleDateString()}</p>
            <a href={job.url} target="_blank" rel="noopener noreferrer">View Job</a>
            <p>{job.description}</p>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
      </div>
    </div>
  );
}

export default JobListings;