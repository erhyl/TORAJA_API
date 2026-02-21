import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    year: ''
  })

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await fetch('/students')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  // Load students on component mount
  useEffect(() => {
    fetchStudents()
  }, [])

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.course || !formData.year) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: '', course: '', year: '' })
        fetchStudents()
      } else {
        alert('Error adding student')
      }
    } catch (error) {
      console.error('Error adding student:', error)
      alert('Error adding student')
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/students/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchStudents()
      } else {
        alert('Error deleting student')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Error deleting student')
    }
  }

  return (
    <div className="app">
      <h1>Student Management</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="course">Course:</label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            type="text"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit">Add Student</button>
      </form>

      <div className="students-list">
        <h2>Students</h2>
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              <span>{student.name} - {student.course} ({student.year})</span>
              <button onClick={() => handleDelete(student.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
