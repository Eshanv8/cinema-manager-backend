https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=500https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=500import React, { useState, useEffect } from 'react';
import merchandiseService from '../services/merchandiseService';
import './MerchandiseManagement.css';

const MerchandiseManagement = () => {
  const [merchandiseList, setMerchandiseList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMerchandise, setCurrentMerchandise] = useState({
    name: '',
    description: '',
    price: '',
    category: 'TOYS',
    imageUrl: '',
    stock: '',
    relatedMovie: '',
    characterName: '',
    active: true
  });

  const categories = [
    'TOYS',
    'ACTION_FIGURES',
    'PLUSHIES',
    'POSTERS',
    'T-SHIRTS',
    'MUGS',
    'COLLECTIBLES'
  ];

  useEffect(() => {
    fetchMerchandise();
  }, []);

  const fetchMerchandise = async () => {
    try {
      const data = await merchandiseService.getAllMerchandiseAdmin();
      console.log('Fetched merchandise:', data);
      console.log('First item image URL:', data[0]?.imageUrl);
      setMerchandiseList(data);
    } catch (error) {
      console.error('Error fetching merchandise:', error);
      alert('Failed to fetch merchandise');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentMerchandise({
      ...currentMerchandise,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentMerchandise({
          ...currentMerchandise,
          imageUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentMerchandise.imageUrl) {
      alert('Please provide an image URL or upload an image');
      return;
    }
    
    try {
      const merchandiseData = {
        ...currentMerchandise,
        price: parseFloat(currentMerchandise.price),
        stock: parseInt(currentMerchandise.stock)
      };

      if (editMode) {
        await merchandiseService.updateMerchandise(currentMerchandise.id, merchandiseData);
        alert('Merchandise updated successfully!');
      } else {
        await merchandiseService.createMerchandise(merchandiseData);
        alert('Merchandise created successfully!');
      }

      resetForm();
      fetchMerchandise();
    } catch (error) {
      console.error('Error saving merchandise:', error);
      alert('Failed to save merchandise');
    }
  };

  const handleEdit = (merchandise) => {
    setCurrentMerchandise(merchandise);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this merchandise?')) {
      try {
        await merchandiseService.deleteMerchandise(id);
        alert('Merchandise deleted successfully!');
        fetchMerchandise();
      } catch (error) {
        console.error('Error deleting merchandise:', error);
        alert('Failed to delete merchandise');
      }
    }
  };

  const handleStockUpdate = async (id, currentStock) => {
    const quantity = prompt('Enter quantity to add (use negative number to reduce):');
    if (quantity !== null) {
      try {
        await merchandiseService.updateStock(id, parseInt(quantity));
        alert('Stock updated successfully!');
        fetchMerchandise();
      } catch (error) {
        console.error('Error updating stock:', error);
        alert('Failed to update stock');
      }
    }
  };

  const resetForm = () => {
    setCurrentMerchandise({
      name: '',
      description: '',
      price: '',
      category: 'TOYS',
      imageUrl: '',
      stock: '',
      relatedMovie: '',
      characterName: '',
      active: true
    });
    setEditMode(false);
    setShowForm(false);
  };

  return (
    <div className="merchandise-management">
      <div className="merchandise-header">
        <h2>Merchandise Management</h2>
        <button 
          className="btn-add-merchandise"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Merchandise'}
        </button>
      </div>

      {showForm && (
        <form className="merchandise-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={currentMerchandise.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Batman Action Figure"
              />
            </div>
            <div className="form-group">
              <label>Character Name</label>
              <input
                type="text"
                name="characterName"
                value={currentMerchandise.characterName}
                onChange={handleInputChange}
                placeholder="e.g., Batman"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Related Movie</label>
              <input
                type="text"
                name="relatedMovie"
                value={currentMerchandise.relatedMovie}
                onChange={handleInputChange}
                placeholder="e.g., The Dark Knight"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={currentMerchandise.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={currentMerchandise.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Detailed description of the merchandise"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (Rs) *</label>
              <input
                type="number"
                name="price"
                value={currentMerchandise.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={currentMerchandise.stock}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Upload Toy Image *</label>
            <div style={{ 
              padding: '30px', 
              background: '#2a2a2a', 
              borderRadius: '10px', 
              border: '2px dashed #e50914',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📷</div>
              <label style={{ 
                display: 'block', 
                marginBottom: '15px', 
                fontSize: '1.1rem', 
                color: '#fff',
                fontWeight: 'bold'
              }}>
                Click to Upload Image from Your Desktop
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageUpload}
                style={{ 
                  padding: '12px', 
                  background: '#e50914', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px',
                  width: '100%',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              />
              <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '10px' }}>
                📁 Supported formats: PNG, JPG, JPEG (Max 5MB)
              </p>
            </div>
            
            {currentMerchandise.imageUrl && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                background: '#1a1a1a', 
                borderRadius: '10px',
                textAlign: 'center',
                border: '2px solid #4CAF50'
              }}>
                <p style={{ color: '#4CAF50', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  ✓ Image Uploaded Successfully!
                </p>
                <img 
                  src={currentMerchandise.imageUrl} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '300px', 
                    maxHeight: '300px', 
                    border: '3px solid #4CAF50', 
                    borderRadius: '10px',
                    objectFit: 'contain',
                    boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="active"
                checked={currentMerchandise.active}
                onChange={handleInputChange}
              />
              Active (visible to customers)
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editMode ? 'Update Merchandise' : 'Create Merchandise'}
            </button>
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="merchandise-list">
        <h3>All Merchandise ({merchandiseList.length})</h3>
        <div className="merchandise-grid">
          {merchandiseList.map(item => (
            <div key={item.id} className={`merchandise-card ${!item.active ? 'inactive' : ''}`}>
              <div className="merchandise-image">
                <img 
                  src={item.imageUrl || 'https://via.placeholder.com/300x250?text=No+Image'} 
                  alt={item.name}
                  onLoad={() => console.log('Image loaded:', item.imageUrl)}
                  onError={(e) => {
                    console.error('Image failed to load:', item.imageUrl);
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x250?text=Image+Not+Found';
                  }}
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
                {!item.active && <div className="inactive-badge">Inactive</div>}
                {item.stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}
              </div>
              <div className="merchandise-info">
                <h4>{item.name}</h4>
                {item.characterName && <p className="character-name">Character: {item.characterName}</p>}
                {item.relatedMovie && <p className="related-movie">Movie: {item.relatedMovie}</p>}
                <p className="category">{item.category.replace('_', ' ')}</p>
                <p className="description">{item.description}</p>
                <div className="merchandise-details">
                  <span className="price">Rs. {item.price.toFixed(2)}</span>
                  <span className="stock">Stock: {item.stock}</span>
                  <span className="sales">Sales: {item.salesCount || 0}</span>
                </div>
                <div className="merchandise-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-stock"
                    onClick={() => handleStockUpdate(item.id, item.stock)}
                  >
                    Update Stock
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchandiseManagement;
