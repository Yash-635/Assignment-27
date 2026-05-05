import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const API_URL = 'http://localhost:5000';

  // ============ ONE-TO-MANY STATE (Users & Posts) ============
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserName, setEditingUserName] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostTitle, setEditingPostTitle] = useState('');

  // ============ MANY-TO-MANY STATE (Students & Courses) ============
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingStudentName, setEditingStudentName] = useState('');
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingCourseTitle, setEditingCourseTitle] = useState('');

  // ============ LOAD DATA ============
  useEffect(() => {
    fetchUsers();
    fetchStudents();
    fetchCourses();
  }, []);

  // ============ USER & POST API CALLS ============
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
      if (response.data.length > 0 && !selectedUserId) {
        setSelectedUserId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    }
  };

  const addUser = async () => {
    if (!newUserName.trim()) {
      alert('Please enter a user name');
      return;
    }
    try {
      await axios.post(`${API_URL}/users`, { name: newUserName });
      setNewUserName('');
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
  };

  const updateUser = async (userId) => {
    if (!editingUserName.trim()) {
      alert('Please enter a user name');
      return;
    }
    try {
      await axios.put(`${API_URL}/users/${userId}`, { name: editingUserName });
      setEditingUserId(null);
      setEditingUserName('');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user and all their posts?')) return;
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      fetchUsers();
      if (selectedUserId === userId) setSelectedUserId('');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const addPost = async () => {
    if (!newPostTitle.trim() || !selectedUserId) {
      alert('Please select a user and enter a post title');
      return;
    }
    try {
      await axios.post(`${API_URL}/users/${selectedUserId}/posts`, { title: newPostTitle });
      setNewPostTitle('');
      fetchUsers();
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post');
    }
  };

  const updatePost = async (userId, postId) => {
    if (!editingPostTitle.trim()) {
      alert('Please enter a post title');
      return;
    }
    try {
      await axios.put(`${API_URL}/users/${userId}/posts/${postId}`, { title: editingPostTitle });
      setEditingPostId(null);
      setEditingPostTitle('');
      fetchUsers();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const deletePost = async (userId, postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`${API_URL}/users/${userId}/posts/${postId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  // ============ STUDENT & COURSE API CALLS ============
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
      if (response.data.length > 0 && !selectedStudentId) {
        setSelectedStudentId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/students/courses`);
      setCourses(response.data);
      if (response.data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to fetch courses');
    }
  };

  const addStudent = async () => {
    if (!newStudentName.trim()) {
      alert('Please enter a student name');
      return;
    }
    try {
      await axios.post(`${API_URL}/students/student`, { name: newStudentName });
      setNewStudentName('');
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student');
    }
  };

  const updateStudent = async (studentId) => {
    if (!editingStudentName.trim()) {
      alert('Please enter a student name');
      return;
    }
    try {
      await axios.put(`${API_URL}/students/${studentId}`, { name: editingStudentName });
      setEditingStudentId(null);
      setEditingStudentName('');
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student');
    }
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm('Delete this student and remove from all courses?')) return;
    try {
      await axios.delete(`${API_URL}/students/${studentId}`);
      fetchStudents();
      fetchCourses();
      if (selectedStudentId === studentId) setSelectedStudentId('');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  const addCourse = async () => {
    if (!newCourseTitle.trim()) {
      alert('Please enter a course title');
      return;
    }
    try {
      await axios.post(`${API_URL}/students/course`, { title: newCourseTitle });
      setNewCourseTitle('');
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    }
  };

  const updateCourse = async (courseId) => {
    if (!editingCourseTitle.trim()) {
      alert('Please enter a course title');
      return;
    }
    try {
      await axios.put(`${API_URL}/students/courses/${courseId}`, { title: editingCourseTitle });
      setEditingCourseId(null);
      setEditingCourseTitle('');
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course and remove all students?')) return;
    try {
      await axios.delete(`${API_URL}/students/courses/${courseId}`);
      fetchCourses();
      fetchStudents();
      if (selectedCourseId === courseId) setSelectedCourseId('');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const enrollStudent = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      alert('Please select both a student and a course');
      return;
    }
    try {
      await axios.post(`${API_URL}/students/enroll`, {
        studentId: selectedStudentId,
        courseId: selectedCourseId
      });
      fetchStudents();
      fetchCourses();
      alert('Enrollment successful!');
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll student');
    }
  };

  const unenrollStudent = async (studentId, courseId) => {
    if (!window.confirm('Remove student from this course?')) return;
    try {
      await axios.delete(`${API_URL}/students/${studentId}/courses/${courseId}`);
      fetchStudents();
      fetchCourses();
    } catch (error) {
      console.error('Error unenrolling:', error);
      alert('Failed to unenroll student');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 MERN CRUD App - Relationship Demonstration</h1>
        <p className="subtitle">MongoDB, Express, React, Node.js</p>
      </header>

      <main className="main-content">
        {/* ============ ONE-TO-MANY SECTION ============ */}
        <section className="relationship-section one-to-many">
          <div className="section-header">
            <h2>1️⃣➡️📄 ONE-TO-MANY Relationship</h2>
            <p className="relationship-info">One User can have Many Posts</p>
          </div>

          <div className="content-grid">
            {/* CREATE USER */}
            <div className="card">
              <h3>Create User</h3>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter user name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addUser()}
                />
                <button className="btn btn-primary" onClick={addUser}>Add User</button>
              </div>
            </div>

            {/* CREATE POST */}
            <div className="card">
              <h3>Create Post</h3>
              <div className="form-group">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">Select User</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Enter post title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPost()}
                />
                <button className="btn btn-success" onClick={addPost}>Add Post</button>
              </div>
            </div>
          </div>

          {/* USERS & POSTS DIRECTORY */}
          <div className="directory">
            <h3>Users & Posts Directory</h3>
            <div className="users-grid">
              {users.length === 0 ? (
                <p className="empty-message">No users yet. Create one to get started!</p>
              ) : (
                users.map(user => (
                  <div key={user._id} className="user-card">
                    {editingUserId === user._id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editingUserName}
                          onChange={(e) => setEditingUserName(e.target.value)}
                        />
                        <div className="edit-buttons">
                          <button
                            className="btn btn-small btn-success"
                            onClick={() => updateUser(user._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-small btn-secondary"
                            onClick={() => setEditingUserId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="user-header">
                        <h4>{user.name}</h4>
                        <div className="actions">
                          <button
                            className="btn btn-small btn-edit"
                            onClick={() => {
                              setEditingUserId(user._id);
                              setEditingUserName(user.name);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="posts-section">
                      <strong>Posts ({user.posts?.length || 0}):</strong>
                      {user.posts && user.posts.length > 0 ? (
                        <ul className="posts-list">
                          {user.posts.map(post => (
                            <li key={post._id} className="post-item">
                              {editingPostId === post._id ? (
                                <div className="edit-post">
                                  <input
                                    type="text"
                                    value={editingPostTitle}
                                    onChange={(e) => setEditingPostTitle(e.target.value)}
                                  />
                                  <button
                                    className="btn btn-tiny btn-success"
                                    onClick={() => updatePost(user._id, post._id)}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="btn btn-tiny btn-secondary"
                                    onClick={() => setEditingPostId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="post-content">
                                  <span>{post.title}</span>
                                  <div className="post-actions">
                                    <button
                                      className="btn btn-tiny btn-edit"
                                      onClick={() => {
                                        setEditingPostId(post._id);
                                        setEditingPostTitle(post.title);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-tiny btn-danger"
                                      onClick={() => deletePost(user._id, post._id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-items">No posts</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ============ MANY-TO-MANY SECTION ============ */}
        <section className="relationship-section many-to-many">
          <div className="section-header">
            <h2>🔀 MANY-TO-MANY Relationship</h2>
            <p className="relationship-info">Many Students can take Many Courses</p>
          </div>

          <div className="content-grid">
            {/* CREATE STUDENT */}
            <div className="card">
              <h3>Create Student</h3>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter student name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                />
                <button className="btn btn-primary" onClick={addStudent}>Add Student</button>
              </div>
            </div>

            {/* CREATE COURSE */}
            <div className="card">
              <h3>Create Course</h3>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter course title"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCourse()}
                />
                <button className="btn btn-primary" onClick={addCourse}>Add Course</button>
              </div>
            </div>

            {/* ENROLL STUDENT */}
            <div className="card">
              <h3>Enroll Student</h3>
              <div className="form-group">
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
                <button className="btn btn-success" onClick={enrollStudent}>Enroll</button>
              </div>
            </div>
          </div>

          {/* STUDENTS DIRECTORY */}
          <div className="directory">
            <h3>Students Directory</h3>
            <div className="students-grid">
              {students.length === 0 ? (
                <p className="empty-message">No students yet. Create one to get started!</p>
              ) : (
                students.map(student => (
                  <div key={student._id} className="student-card">
                    {editingStudentId === student._id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editingStudentName}
                          onChange={(e) => setEditingStudentName(e.target.value)}
                        />
                        <div className="edit-buttons">
                          <button
                            className="btn btn-small btn-success"
                            onClick={() => updateStudent(student._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-small btn-secondary"
                            onClick={() => setEditingStudentId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="student-header">
                        <h4>{student.name}</h4>
                        <div className="actions">
                          <button
                            className="btn btn-small btn-edit"
                            onClick={() => {
                              setEditingStudentId(student._id);
                              setEditingStudentName(student.name);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => deleteStudent(student._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="courses-section">
                      <strong>Courses ({student.courses?.length || 0}):</strong>
                      {student.courses && student.courses.length > 0 ? (
                        <ul className="courses-list">
                          {student.courses.map(course => (
                            <li key={course._id} className="course-item">
                              <span>{course.title}</span>
                              <button
                                className="btn btn-tiny btn-danger"
                                onClick={() => unenrollStudent(student._id, course._id)}
                              >
                                Unenroll
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-items">No courses</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COURSES DIRECTORY */}
          <div className="directory">
            <h3>Courses Directory</h3>
            <div className="courses-grid">
              {courses.length === 0 ? (
                <p className="empty-message">No courses yet. Create one to get started!</p>
              ) : (
                courses.map(course => (
                  <div key={course._id} className="course-card">
                    {editingCourseId === course._id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editingCourseTitle}
                          onChange={(e) => setEditingCourseTitle(e.target.value)}
                        />
                        <div className="edit-buttons">
                          <button
                            className="btn btn-small btn-success"
                            onClick={() => updateCourse(course._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-small btn-secondary"
                            onClick={() => setEditingCourseId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="course-header">
                        <h4>{course.title}</h4>
                        <div className="actions">
                          <button
                            className="btn btn-small btn-edit"
                            onClick={() => {
                              setEditingCourseId(course._id);
                              setEditingCourseTitle(course.title);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => deleteCourse(course._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="students-section">
                      <strong>Enrolled Students ({course.students?.length || 0}):</strong>
                      {course.students && course.students.length > 0 ? (
                        <ul className="students-list">
                          {course.students.map(student => (
                            <li key={student._id} className="student-item">
                              {student.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-items">No students enrolled</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Full CRUD operations with MongoDB relationships | One-to-Many & Many-to-Many</p>
      </footer>
    </div>
  );
}

export default App;
