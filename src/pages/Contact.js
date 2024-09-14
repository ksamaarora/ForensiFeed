import './Contact.css';
import React from 'react';

function Contact() {
  const students = [
    { rollNumber: 'A011', name: 'Atharv Kapoor' },
    { rollNumber: 'A018', name: 'Dhruv Thanawala' },
    { rollNumber: 'A024', name: 'Ira Malik' },
    { rollNumber: 'A030', name: 'Kayan Irani' },
    { rollNumber: 'A034', name: 'Ksama Arora' },
  ];

  const branch = 'BTech IT Year 3';

  return (
    <div className="App">
      <h2 className="table-title">Student Information</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.rollNumber}</td>
              <td>{student.name}</td>
              <td>{branch}</td>
              <td><div className="photo-placeholder">Photo</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Contact;
