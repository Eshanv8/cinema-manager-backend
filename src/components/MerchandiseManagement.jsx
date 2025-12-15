import React, { useState, useEffect } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            <label>Image URL *</label>
            <input
              type="url"
              name="imageUrl"
              value={currentMerchandise.imageUrl}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/image.jpg"
            />
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
