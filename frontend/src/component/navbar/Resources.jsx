import React, { useState, useEffect } from "react";
import { UploadCloud, Download, Plus, Edit, Trash, X } from "lucide-react";
import defaultProfileImage from "../../assets/userLogo.png";
import Constant from "../../utils/Constant";
import "../../style/navbar/Resources.css";

const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
const branchOptions = [
  "IT",
  "CSE",
  "CSD",
  "FPT",
  "AIDS",
];

export default function Resource() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showMyResources, setShowMyResources] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const email = localStorage.getItem("email");
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${Constant.BASE_URL}/api/resources`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        }
      });

      if (!response.ok) throw new Error("Failed to fetch resources");

      const data = await response.json();
      console.log("Fetched resources:", data);

      setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePostResource = async () => {
    if (title && description && file && semester && branch) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `${Constant.BASE_URL}/api/resources?email=${email}&title=${title}&description=${description}&sem=${semester}&branch=${branch}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${jwt}`,
          },
          body: formData
        });

        if (!response.ok) throw new Error("Failed to post resource");
        const newResource = await response.json();
        setResources([...resources, newResource]);
        handleCancel();
      } catch (error) {
        console.error("Error posting resource:", error);
      }
    }
  };


  const handleDownload = (resource) => {
    window.open(resource.resourceUrl, "_blank");
  };

  const handleEditResource = (resource) => {
    setTitle(resource.title);
    setDescription(resource.description);
    setSemester(resource.sem);
    setBranch(resource.branch);
    setEditingResource(resource.id);
    setShowForm(true);
  };

  const handleUpdateResource = async () => {
    if (title && description && semester && branch && editingResource) {
      try {
        const response = await fetch(`${Constant.BASE_URL}/resources/${editingResource}/${email}/${title}/${description}/${semester}/${branch}`, {
          method: "PUT",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${jwt}`,
          },
          body: JSON.stringify({ file: file ? file.name : null })
        });

        if (!response.ok) throw new Error("Failed to update resource");
        const updatedResource = await response.json();
        setResources(resources.map(r => r.id === editingResource ? updatedResource : r));
        handleCancel();
      } catch (error) {
        console.error("Error updating resource:", error);
      }
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      const response = await fetch(`${Constant.BASE_URL}/api/resources/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${jwt}`,
        }
      });
      if (!response.ok) throw new Error("Failed to delete resource");
      const result = await response.json();
      
      setResources(resources.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setSemester("");
    setBranch("");
    setEditingResource(null);
    setShowForm(false);
  };

  const handleFilter = async () => {
    try {
      let url = `${Constant.BASE_URL}/api/resources`;
      if (branchFilter) url += `/by-branch?branch=${branchFilter}`;
      else if (semesterFilter) url += `/by-sem?sem=${semesterFilter}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${jwt}`,
        }
      });
      if (!response.ok) throw new Error("Failed to filter resources");
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Error filtering resources:", error);
    }
  };


  useEffect(() => {
    handleFilter();
  }, [branchFilter, semesterFilter]);

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          <button onClick={() => setShowMyResources(false)} className="resource-header-button">
            All Resources
          </button>
          <button onClick={() => setShowMyResources(true)} className="resource-header-button">
            My Resources
          </button>
        </div>
      </div>
      <div className="resource-main-page">
        {showMyResources && (
          <div className="my-resources-section">
            <button onClick={() => setShowForm(!showForm)} className="add-resource-button">
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
                      placeholder="Enter resource description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-textarea"
                    />
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select Semester</option>
                      {semesterOptions.map((sem) => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select Branch</option>
                      {branchOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="form-input"
                    />
                    <div className="form-buttons">
                      {editingResource ? (
                        <>
                          <button onClick={handleUpdateResource} className="form-button">
                            <Edit size={18} /> Update Resource
                          </button>
                          <button onClick={handleCancel} className="form-button cancel-button">
                            <X size={18} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={handlePostResource} className="form-button">
                            <UploadCloud size={18} /> Post Resource
                          </button>
                          <button onClick={handleCancel} className="form-button cancel-button">
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
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="filter-input"
          >
            <option value="">All Branches</option>
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        <div className="resource-list">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="card-content">
                <div className="user-id">
                  <img
                    src={resource.profileImgUrl || defaultProfileImage}
                    alt="Profile"
                    className="resource-photo"
                  />
                  <h2>{resource.fullName}</h2>
                </div>
                <h4>
                  Sem: {resource.sem}
                  <br />
                  Branch: {resource.branch}
                </h4>
                <h5><u>{resource.title}</u></h5>
                <p>{resource.description}</p>
                <div className="card-buttons">
                  <button onClick={() => handleDownload(resource)} className="card-button">
                    <Download size={18} /> Download
                  </button>
                  {showMyResources && (
                    <>
                      <button onClick={() => handleEditResource(resource)} className="card-button">
                        <Edit size={18} /> Edit
                      </button>
                      <button onClick={() => handleDeleteResource(resource.id)} className="card-button delete-button">
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