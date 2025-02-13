import React, { useState } from "react";
import { UploadCloud, Download, Plus, Edit, Trash, X } from "lucide-react";
import "../../style/navbar/Resources.css";

const username = "Akash";
const photo = "https://th.bing.com/th/id/OIG3.80EN2JPNx7kp5VqoB5kz";

const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
const branchOptions = [
  "Information Technology",
  "Computer Science",
  "CSD",
  "FPT",
  "AIDS",
];

export default function Resource() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [info, setInfo] = useState("");
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showMyResources, setShowMyResources] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePostResource = () => {
    if (title && info && file) {
      const newResource = { title, info, file, semester, branch };
      setResources([...resources, newResource]);
      setTitle("");
      setInfo("");
      setFile(null);
      setSemester("");
      setBranch("");
      setShowForm(false);
    }
  };

  const handleDownload = (resource) => {
    const url = URL.createObjectURL(resource.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = resource.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditResource = (index) => {
    const resource = resources[index];
    setTitle(resource.title);
    setInfo(resource.info);
    setFile(resource.file);
    setSemester(resource.semester);
    setBranch(resource.branch);
    setEditingResource(index);
    setShowForm(true);
  };

  const handleUpdateResource = () => {
    if (title && info && file && editingResource !== null) {
      const updatedResources = [...resources];
      updatedResources[editingResource] = {
        title,
        info,
        file,
        semester,
        branch,
      };
      setResources(updatedResources);
      setTitle("");
      setInfo("");
      setFile(null);
      setSemester("");
      setBranch("");
      setEditingResource(null);
      setShowForm(false);
    }
  };

  const handleDeleteResource = (index) => {
    const updatedResources = resources.filter((_, i) => i !== index);
    setResources(updatedResources);
  };

  const handleCancel = () => {
    setTitle("");
    setInfo("");
    setFile(null);
    setSemester("");
    setBranch("");
    setEditingResource(null);
    setShowForm(false);
  };

  const filteredResources = resources.filter(
    (resource) =>
      (resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.info.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (semesterFilter === "" || resource.semester === semesterFilter) &&
      (branchFilter === "" || resource.branch === branchFilter)
  );

  return (
    <div className="resource-page">
      <div className="resource-header">
        <h1>Resource Library</h1>
        <div className="resource-search-bar">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="resource-header-buttons">
          <button
            onClick={() => setShowMyResources(false)}
            className="resource-header-button"
          >
            All Resources
          </button>
          <button
            onClick={() => setShowMyResources(true)}
            className="resource-header-button"
          >
            My Resources
          </button>
        </div>
      </div>
      <div className="resource-main-page">
        {showMyResources && (
          <div className="my-resources-section">
            <button
              onClick={() => setShowForm(!showForm)}
              className="add-resource-button"
            >
              <Plus size={18} /> Add Resource
            </button>
            {showForm && (
              <div className="resource-modal-overlay">
                <div className="resource-modal">
                  <div className="resource-form">
                    <input
                      type="text"
                      placeholder="Enter resource title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-input"
                    />
                    <textarea
                      placeholder="Enter resource information"
                      value={info}
                      onChange={(e) => setInfo(e.target.value)}
                      className="form-textarea"
                    />
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select Semester</option>
                      {semesterOptions.map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select Branch</option>
                      {branchOptions.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="form-input"
                    />
                    <div className="form-buttons">
                      {editingResource !== null ? (
                        <>
                          <button
                            onClick={handleUpdateResource}
                            className="form-button"
                          >
                            <Edit size={18} /> Update Resource
                          </button>
                          <button
                            onClick={handleCancel}
                            className="form-button cancel-button"
                          >
                            <X size={18} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handlePostResource}
                            className="form-button"
                          >
                            <UploadCloud size={18} /> Post Resource
                          </button>
                          <button
                            onClick={handleCancel}
                            className="form-button cancel-button"
                          >
                            <X size={18} /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="resource-filters">
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="filter-input"
          >
            <option value="">All Semesters</option>
            {semesterOptions.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="filter-input"
          >
            <option value="">All Branches</option>
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div className="resource-list">
          {filteredResources.map((resource, index) => (
            <div key={index} className="resource-card">
              <div className="card-content">
                <div className="usere-id">
                  <img
                    src={photo}
                    alt="image not found"
                    className="resource-photo"
                  />
                  <h2>{username}</h2>
                </div>
                <h4>
                  Sem:{resource.semester}
                  <br />
                  Branch:{resource.branch}
                </h4>
                <h5>
                  <u>{resource.title}</u>
                </h5>
                <p>{resource.info}</p>
                <div className="card-buttons">
                  <button
                    onClick={() => handleDownload(resource)}
                    className="card-button"
                  >
                    <Download size={18} /> Download
                  </button>
                  {showMyResources && (
                    <>
                      <button
                        onClick={() => handleEditResource(index)}
                        className="card-button"
                      >
                        <Edit size={18} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteResource(index)}
                        className="card-button delete-button"
                      >
                        <Trash size={18} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
