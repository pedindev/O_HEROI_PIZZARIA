import React, { useState } from 'react';
import ModelViewer from './components/ModelViewer';
import Modal3D from './components/Modal3D';
import RatingsModal from './components/RatingsModal';
import RatingForm from './components/RatingForm';
import { useRatings } from './hooks/useRatings';
import './App.css'

function App() {
  // Usar o hook useRatings para gerenciar avaliações com Firebase
  const { ratings, productRatings, addRating, loading } = useRatings();
  
  const [selectedModel, setSelectedModel] = useState('/torta_doce.glb');
  const [selectedModelName, setSelectedModelName] = useState('torta_doce');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalModel, setModalModel] = useState(null);
  const [modalProductName, setModalProductName] = useState('');
  const [ratingsModalOpen, setRatingsModalOpen] = useState(false);
  const [selectedProductRatings, setSelectedProductRatings] = useState([]);
  const [selectedProductNameForRatings, setSelectedProductNameForRatings] = useState('');
  const [selectedProductIdForRatings, setSelectedProductIdForRatings] = useState('');
  
  // Estado para o formulário de avaliação
  const [ratingFormOpen, setRatingFormOpen] = useState(false);

  // Dados dos produtos com informações completas
  const products = [
    {
      id: 'Super_Burguer',
      name: 'Super_Burguer',
      nameDisplay: 'Super Burguer',
      image: '/super_burguer.glb',
      imageUrl: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Bolo+de+Cenoura',
      category: 'doces',
      price: 19.00,
      description: 'Pão brioche, blend bovino , tomate, alface, queijo, molho especial',
      ingredients: 'Farinha de trigo, açúcar, ovos, cenoura, chocolate'
    },
    {
      id: 'torta_doce',
      name: 'torta_doce',
      nameDisplay: 'Torta de Leite',
      image: '/torta_doce.glb',
      imageUrl: 'https://via.placeholder.com/300x300/FFB347/FFFFFF?text=Torta+de+Leite',
      category: 'doces',
      price: 15.00,
      description: 'Uma torta cremosa de leite condensado com base de biscoito.',
      ingredients: 'Leite condensado, creme de leite, biscoito, manteiga'
    },
    {
      id: 'cuscuz',
      name: 'prato_cuscuz',
      nameDisplay: 'Cuscuz com Ovo',
      image: '/prato_cuscuz.glb',
      imageUrl: 'https://via.placeholder.com/300x300/FFE66D/FFFFFF?text=Cuscuz+com+Ovo',
      category: 'salgados',
      price: 12.00,
      description: 'O tradicional café da manhã nordestino.',
      ingredients: 'Cuscuz de milho, ovo frito'
    },
    {
      id: 'bomba',
      name: 'bomba',
      nameDisplay: 'Bomba',
      image: '/bomba.glb',
      imageUrl: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Bomba',
      category: 'salgados',
      price: 8.00,
      description: 'Salgado Típico da cidade de Teresina.',
      ingredients: 'Queijo e Presunto'
    }
  ];

  const handleModelSelect = (modelName) => {
    const product = products.find(p => p.name === modelName);
    if (product) {
      setSelectedModel(product.image);
      setSelectedModelName(product.name);
    }
  };

  const handleOpenModal = (product) => {
    setModalModel(product.image);
    setModalProductName(product.nameDisplay);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenRatingsModal = (product) => {
    setSelectedProductRatings(productRatings[product.id] || []);
    setSelectedProductNameForRatings(product.nameDisplay);
    setSelectedProductIdForRatings(product.id);
    setRatingsModalOpen(true);
  };

  const handleCloseRatingsModal = () => {
    setRatingsModalOpen(false);
  };

  const handleOpenRatingForm = () => {
    setRatingFormOpen(true);
  };

  const handleCloseRatingForm = () => {
    setRatingFormOpen(false);
  };

  const handleSubmitRating = async (newRating) => {
    // Usar o addRating do hook para salvar no Firebase
    const success = await addRating(selectedProductIdForRatings, newRating);
    
    if (success) {
      // Atualizar a lista de avaliações no modal
      setSelectedProductRatings(prev => [...prev, newRating]);
      console.log('✅ Avaliação enviada com sucesso!');
    } else {
      console.error('❌ Erro ao enviar avaliação');
    }
  };


  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'doces', name: 'Doces' },
    { id: 'salgados', name: 'Salgados' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="app">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-image">
          <div className="store-image-placeholder">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p>Imagem da Loja</p>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="restaurant-info">
        <div className="logo-placeholder">
          <div className="logo-circle">🍔</div>
        </div>
        <h1 className="restaurant-name">O HERÓI HAMBÚRGUERES</h1>
      </div>

      {/* Category Menu */}
      <div className="category-menu">
        <div className="category-list">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <main className="products-section">
        <div className="section-header">
          <h2>{selectedCategory === 'all' ? 'Produtos em Destaque' : categories.find(c => c.id === selectedCategory)?.name}</h2>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className={`product-card ${selectedModelName === product.name ? 'selected' : ''}`}
              onClick={() => handleModelSelect(product.name)}
            >
              <div className="product-image">
                <img src={product.imageUrl} alt={product.nameDisplay} />
                <button 
                  className="view-3d-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(product);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  Ver 3D
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.nameDisplay}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-rating">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = ratings[product.id];
                      const fillPercentage = rating > 0 ? Math.max(0, Math.min(100, ((rating - (star - 1)) / 1) * 100)) : 0;
                      
                      return (
                        <div key={star} className="star-container">
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="#ddd"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          {rating > 0 && (
                            <svg 
                              className="star-fill"
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="#FFD700"
                              style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button 
                    className="rate-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenRatingsModal(product);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    Avaliações
                  </button>
                </div>
                <div className="product-footer">
                  <span className="product-price">R$ {product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal 3D */}
      <Modal3D 
        isOpen={modalOpen}
        onClose={handleCloseModal}
        modelPath={modalModel}
        productName={modalProductName}
      />

      {/* Modal de Avaliações */}
      <RatingsModal
        isOpen={ratingsModalOpen}
        onClose={handleCloseRatingsModal}
        productName={selectedProductNameForRatings}
        ratings={selectedProductRatings}
        onOpenRatingForm={handleOpenRatingForm}
      />

      {/* Formulário de Avaliação */}
      <RatingForm
        isOpen={ratingFormOpen}
        onClose={handleCloseRatingForm}
        productName={selectedProductNameForRatings}
        onSubmit={handleSubmitRating}
      />
    </div>
  )
}

export default App
