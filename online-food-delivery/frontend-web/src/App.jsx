import React, { useState } from 'react';
import axios from 'axios';

// ==========================================
// 1. DỮ LIỆU & CẤU HÌNH
// ==========================================
const FOOD_MENU = [
  { id: 1, name: "Phở Bò Đặc Biệt", price: 55000, category: "Món Nước", img: "🍜", desc: "Thịt bò tái lăn, nước dùng truyền thống" },
  { id: 2, name: "Cơm Tấm Sườn Bì", price: 45000, category: "Món Cơm", img: "🍛", desc: "Sườn nướng mật ong, bì chả tự làm" },
  { id: 3, name: "Bánh Mì Thịt Nướng", price: 25000, category: "Ăn Vặt", img: "🥖", desc: "Pate gan, xá xíu và rau đồ chua" },
  { id: 4, name: "Cà Phê Sữa Đá", price: 30000, category: "Đồ Uống", img: "☕", desc: "Hạt Robusta nguyên chất từ Đắk Lắk" },
  { id: 5, name: "Trà Đào Cam Sả", price: 35000, category: "Đồ Uống", img: "🍹", desc: "Sả tươi, cam vàng và đào miếng giòn" },
  { id: 6, name: "Bún Đậu Mắm Tôm", price: 65000, category: "Món Bún", img: "🍱", desc: "Mắm tôm Thanh Hóa, đậu hũ chiên giòn" }
];

const API_BASE_URL = "http://localhost:8080/api/orders";

// ==========================================
// 2. COMPONENT APP
// ==========================================
function App() {
  const [cart, setCart] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const categories = ["Tất cả", ...new Set(FOOD_MENU.map(f => f.category))];

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN');
    setLogs(prev => [{ id: Date.now(), msg: `${time} - ${message}`, type }, ...prev]);
  };

  const addToCart = (food) => {
    setCart(prev => {
      const exist = prev.find(item => item.id === food.id);
      if (exist) return prev.map(item => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...food, quantity: 1 }];
    });
    addLog(`Đã thêm "${food.name}"`, 'info');
  };

  const removeFromCart = (id, force = false) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (force || item.quantity === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    const summary = cart.map(i => `${i.name} (x${i.quantity})`).join(', ');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    try {
      await axios.post(API_BASE_URL, {
        customerName: "Nguyen Khanh Luan",
        foodName: `${summary} | Tổng: ${total.toLocaleString()}đ`
      });
      addLog(`✅ ĐẶT HÀNG THÀNH CÔNG`, 'success');
      alert("Đơn hàng đã được gửi thành công!");
      setCart([]);
    } catch (err) {
      addLog(`❌ LỖI KẾT NỐI: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredMenu = activeCategory === "Tất cả" ? FOOD_MENU : FOOD_MENU.filter(f => f.category === activeCategory);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>Food Express</h1>
        <p style={styles.subtitle}>Chào mừng, <strong>Nguyen Khanh Luan</strong></p>
      </header>

      {/* FILTER BAR */}
      <nav style={styles.filterBar}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            style={{...styles.filterBtn, ...(activeCategory === cat ? styles.filterBtnActive : {})}}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* MAIN LAYOUT */}
      <div style={styles.mainLayout}>
        {/* MENU GRID */}
        <section style={styles.menuSection}>
          <div style={styles.foodGrid}>
            {filteredMenu.map(food => (
              <div key={food.id} style={styles.foodCard}>
                <div style={styles.foodEmoji}>{food.img}</div>
                <div>
                    <h3 style={styles.foodName}>{food.name}</h3>
                    <p style={styles.foodDesc}>{food.desc}</p>
                    <div style={styles.cardFooter}>
                      <span style={styles.priceTag}>{food.price.toLocaleString()}đ</span>
                      <button onClick={() => addToCart(food)} style={styles.addBtn}>Thêm</button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CART SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.cartBox}>
            <h2 style={styles.sectionHeading}>Đơn hàng của bạn</h2>
            {cart.length === 0 ? (
                <div style={styles.emptyContainer}>
                    <p style={styles.emptyText}>Chưa có món nào</p>
                </div>
            ) : (
              <>
                <div style={styles.cartList}>
                    {cart.map(item => (
                    <div key={item.id} style={styles.cartItem}>
                        <div style={{flex: 1}}>
                            <div style={{fontWeight: '500', fontSize: '0.95rem'}}>{item.name}</div>
                            <div style={styles.cartItemPrice}>{(item.price * item.quantity).toLocaleString()}đ</div>
                        </div>
                        <div style={styles.cartControls}>
                            <button onClick={() => removeFromCart(item.id)} style={styles.qtyBtn}>-</button>
                            <span style={{minWidth: '20px', textAlign: 'center'}}>{item.quantity}</span>
                            <button onClick={() => addToCart(item)} style={styles.qtyBtn}>+</button>
                        </div>
                    </div>
                    ))}
                </div>
                <div style={styles.totalBox}>
                  <span>Tổng cộng</span>
                  <span>{cart.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()}đ</span>
                </div>
                <button onClick={handleCheckout} disabled={loading} style={styles.checkoutBtn}>
                  {loading ? "Đang xử lý..." : "Thanh toán ngay"}
                </button>
              </>
            )}
          </div>

          {/* SYSTEM LOGS (Mini) */}
          <div style={styles.logSection}>
            <div style={styles.logHeader}>
              <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b'}}>HỆ THỐNG</span>
              <button onClick={() => setLogs([])} style={styles.clearBtn}>Xóa</button>
            </div>
            <div style={styles.console}>
              {logs.length === 0 && <div style={{color: '#94a3b8', fontStyle: 'italic'}}>Chờ lệnh...</div>}
              {logs.map(log => (
                <div key={log.id} style={{...styles.logLine, color: styles.colors[log.type]}}>{log.msg}</div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ==========================================
// 3. MODERN STYLES (Minimalist & Clean)
// ==========================================
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },

  header: {
    textAlign: 'left',
    marginBottom: '40px'
  },

  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    letterSpacing: '-0.025em',
    color: '#0f172a',
    margin: 0
  },

  subtitle: {
    color: '#64748b',
    fontSize: '1rem',
    marginTop: '4px'
  },

  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    overflowX: 'auto',
    paddingBottom: '8px'
  },

  filterBtn: {
    padding: '10px 20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
    color: '#64748b'
  },

  filterBtnActive: {
    background: '#4f46e5',
    color: '#fff',
    borderColor: '#4f46e5',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
  },

  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '32px',
    alignItems: 'flex-start'
  },

  menuSection: {
    flex: 1
  },

  sidebar: {
    position: 'sticky',
    top: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  foodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },

  foodCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },

  foodEmoji: {
    fontSize: '2.5rem',
    background: '#f1f5f9',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px'
  },

  foodName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#1e293b'
  },

  foodDesc: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
    minHeight: '42px'
  },

  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9'
  },

  priceTag: {
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#0f172a'
  },

  addBtn: {
    background: '#f1f5f9',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'all 0.2s'
  },

  cartBox: {
    background: '#fff',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)'
  },

  sectionHeading: {
    margin: '0 0 20px 0',
    fontSize: '1.2rem',
    fontWeight: '700'
  },

  emptyContainer: {
    textAlign: 'center',
    padding: '40px 0'
  },

  emptyText: {
    color: '#94a3b8',
    fontSize: '0.9rem'
  },

  cartList: {
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: '20px'
  },

  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9'
  },

  cartItemPrice: {
    fontSize: '0.8rem',
    color: '#64748b',
    marginTop: '2px'
  },

  cartControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#f8fafc',
    padding: '4px 8px',
    borderRadius: '8px'
  },

  qtyBtn: {
    width: '24px',
    height: '24px',
    border: 'none',
    background: 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#4f46e5'
  },

  totalBox: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: '700',
    padding: '20px 0',
    fontSize: '1.1rem',
    borderTop: '2px dashed #f1f5f9'
  },

  checkoutBtn: {
    width: '100%',
    padding: '14px',
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'transform 0.1s',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
  },

  logSection: {
    background: '#fff',
    borderRadius: '20px',
    padding: '16px',
    border: '1px solid #f1f5f9'
  },

  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },

  clearBtn: {
    background: 'none',
    color: '#94a3b8',
    border: 'none',
    fontSize: '0.7rem',
    cursor: 'pointer',
    textDecoration: 'underline'
  },

  console: {
    height: '80px',
    overflowY: 'auto',
    fontSize: '0.75rem',
    fontFamily: 'Menlo, monospace',
    lineHeight: '1.4'
  },

  logLine: {
    marginBottom: '4px'
  },

  colors: {
    info: '#64748b',
    success: '#10b981',
    error: '#ef4444'
  }
};

export default App;