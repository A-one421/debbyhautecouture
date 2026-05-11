import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Heart, ShoppingBag, Share2, Star, StarHalf, Ruler, ChevronDown, ChevronUp, X, CreditCard, MessageCircle, SlidersHorizontal, ZoomIn } from 'lucide-react'
import { useCart } from './CartContext'
import SizeGuide from './SizeGuide'
import { products, CATEGORIES, COLOR_MAP } from './data'
import { showToast } from './Toast'

/* ─── Product Card ─── */
function ProductCard({ product, onOpen }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const saved = isInWishlist(product.id)
  const tagBg = product.tag==='NEW' ? 'bg-gold-500' : product.tag==='BEST' ? 'bg-black' : 'bg-red-500'

  function quickAdd(e) {
    e.stopPropagation()
    addToCart(product, 'S', product.colors[0], 1)
    showToast(`${product.name} added to cart`)
  }

  return (
    <div className="group cursor-pointer" onClick={() => onOpen(product)}>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e=>e.target.src='https://placehold.co/400x600/f5f5f5/D4AF37?text=Debby'}/>
        <button className="wishlist-icon absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all"
          onClick={e=>{ e.stopPropagation(); const added = toggleWishlist(product); showToast(added ? 'Added to saved items' : 'Removed from saved items') }}>
          <Heart className={`h-4 w-4 ${saved?'fill-red-500 text-red-500':''}`}/>
        </button>
        {product.tag && <div className={`absolute top-3 left-3 ${tagBg} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{product.tag}</div>}
        <div className="quick-add absolute bottom-0 left-0 right-0 p-4">
          <button className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors" onClick={quickAdd}>
            Quick Add
          </button>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gold-600 transition-colors">{product.name}</h3>
        <span className="text-sm font-semibold">₦{product.price.toFixed(2)}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{product.collection}</p>
    </div>
  )
}

/* ─── Product Detail ─── */
function ProductDetail({ product, onBack }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const [mainImg, setMainImg] = useState(product.images[0])
  const [size, setSize] = useState('S')
  const [color, setColor] = useState(product.colors[0])
  const [qty, setQty] = useState(1)
  const [showSG, setShowSG] = useState(false)
  const [accordion, setAccordion] = useState(null)
  const saved = isInWishlist(product.id)

  function share() {
    const text = `${product.name} from DEBBY HAUTE COUTURE! ₦${product.price.toFixed(2)}`
    if (navigator.share) navigator.share({ title:product.name, text })
    else { navigator.clipboard?.writeText(text); showToast('Copied!') }
  }

  function handleAdd() {
    addToCart(product, size, color, qty)
    showToast(`${product.name} added to cart`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <nav className="flex mb-8 text-xs text-gray-500">
        <ol className="flex items-center space-x-2">
          <li><button onClick={onBack} className="hover:text-black">Home</button></li>
          <li><span className="mx-1">/</span></li>
          <li><button onClick={onBack} className="hover:text-black">Women</button></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-black font-medium">{product.name}</li>
        </ol>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative group">
            <img src={mainImg} alt={product.name} className="w-full h-full object-cover" onError={e=>e.target.src='https://placehold.co/600x800/f5f5f5/D4AF37?text=Debby'}/>
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
              <ZoomIn className="h-3 w-3"/> Zoom
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img,i) => (
              <div key={i} onClick={() => setMainImg(img)}
                className={`aspect-square bg-gray-100 cursor-pointer ${img===mainImg?'border border-black':'opacity-60 hover:opacity-100 transition-opacity'}`}>
                <img src={img} className="w-full h-full object-cover" onError={e=>e.target.src='https://placehold.co/200x200/f5f5f5/D4AF37?text=+'}/>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900">{product.name}</h1>
            <div className="flex gap-2">
              <button onClick={share} className="text-gray-400 hover:text-black transition-colors"><Share2 className="h-6 w-6"/></button>
              <button onClick={() => { const added=toggleWishlist(product); showToast(added?'Added to saved items':'Removed from saved items') }} className="text-gray-400 hover:text-red-500 transition-colors">
                <Heart className={`h-6 w-6 ${saved?'fill-red-500 text-red-500':''}`}/>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-medium">₦{product.price.toFixed(2)}</span>
            <div className="flex items-center text-gold-500 text-sm">
              {[...Array(4)].map((_,i)=><Star key={i} className="h-4 w-4 fill-current"/>)}
              <StarHalf className="h-4 w-4 fill-current"/>
              <span className="text-gray-400 ml-2">(42 reviews)</span>
            </div>
          </div>
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description || 'Premium quality fashion item.'}</p>

          {/* Color */}
          <div className="mb-6">
            <span className="text-xs font-bold uppercase text-gray-900 mb-3 block">Color: <span className="font-normal text-gray-600">{color}</span></span>
            <div className="flex space-x-3">
              {product.colors.map(c => (
                <button key={c} title={c} onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${c===color?'ring-2 ring-offset-2 ring-gray-300':'ring-1 ring-gray-200'}`}
                  style={{ background: COLOR_MAP[c] || '#aaa', border: c==='White'||c==='Ivory'?'1px solid #e5e7eb':'none' }}/>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase text-gray-900">Size</span>
              <button onClick={() => setShowSG(true)} className="text-xs text-gray-500 underline hover:text-black flex items-center gap-1"><Ruler className="h-3 w-3"/> Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {(product.sizes||['XS','S','M','L','XL']).map(s => (
                <label key={s} onClick={() => setSize(s)}
                  className={`border rounded py-3 text-center text-sm cursor-pointer hover:border-black transition-colors ${s===size?'bg-black text-white border-black':'border-gray-200'}`}>
                  {s}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Model is 5'9" and wearing size S</p>
          </div>

          {/* Qty + Add */}
          <div className="flex gap-4 mb-8">
            <div className="w-24 border border-gray-200 rounded flex items-center justify-between px-3">
              <button className="text-gray-400 hover:text-black" onClick={() => setQty(q=>Math.max(1,q-1))}>-</button>
              <span className="text-sm font-medium">{qty}</span>
              <button className="text-gray-400 hover:text-black" onClick={() => setQty(q=>q+1)}>+</button>
            </div>
            <button onClick={handleAdd} className="flex-1 bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gold-600 transition-colors shadow-lg">
              Add to Cart
            </button>
          </div>

          {/* Accordions */}
          <div className="border-t border-gray-200 divide-y divide-gray-200">
            {[['Fabric & Care','95% Polyester, 5% Elastane. Dry clean only. Iron on low heat.'],['Shipping & Returns','Free shipping. Returns within 14 days in original condition.']].map(([t,c]) => (
              <div key={t} className="py-4">
                <button className="flex justify-between items-center w-full text-left text-sm font-medium" onClick={() => setAccordion(accordion===t?null:t)}>
                  <span>{t}</span>
                  {accordion===t ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                </button>
                {accordion===t && <div className="mt-2 text-xs text-gray-500 leading-relaxed">{c}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      {showSG && <SizeGuide onClose={() => setShowSG(false)}/>}
    </div>
  )
}

/* ─── Cart View ─── */
function CartView() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQty, subtotal, tax, total, checkoutWhatsApp, payWithPaystack } = useCart()
  const [email, setEmail] = useState(() => localStorage.getItem('debby_customer_email')||'')

  function saveEmail() {
    if (!email.includes('@')) { showToast('Enter a valid email','error'); return }
    localStorage.setItem('debby_customer_email', email); showToast('Email saved ✓')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="font-serif text-3xl mb-2 text-center">Your Shopping Bag</h1>
      <p className="text-gray-500 text-sm text-center mb-8">{cart.reduce((s,i)=>s+i.quantity,0)} items</p>

      <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
        <span className="text-gray-600">Payment email: </span>
        <span className="font-medium text-gray-800">{email||'Not set'}</span>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Add email for payment" className="block w-full mt-2 px-3 py-2 border border-gray-200 rounded text-sm"/>
        <button onClick={saveEmail} className="mt-2 text-xs bg-black text-white px-4 py-1.5 rounded font-medium">Save</button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/shop')} className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gold-400 hover:text-black transition-colors">Start Shopping</button>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            {cart.map(item => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 py-6 border-b border-gray-200 last:border-0">
                <div className="w-24 h-32 flex-shrink-0 bg-gray-200 overflow-hidden rounded">
                  <img src={item.image} className="w-full h-full object-cover" onError={e=>e.target.src='https://placehold.co/200x300/f5f5f5/D4AF37?text=+'}/>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Size: {item.size} | Color: {item.color}</p>
                    </div>
                    <span className="font-medium">₦{(item.price*item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                      <button onClick={() => updateQty(item.id,item.size,item.color,-1)} className="px-2 py-1 text-gray-500 hover:text-black">-</button>
                      <span className="px-2 text-xs">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id,item.size,item.color,1)} className="px-2 py-1 text-gray-500 hover:text-black">+</button>
                    </div>
                    <button onClick={() => { removeFromCart(item.id,item.size,item.color); showToast('Item removed from cart') }} className="text-xs text-red-500 underline">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[['Subtotal',`₦${subtotal.toFixed(2)}`],['Shipping','Free'],['Tax (8%)',`₦${tax.toFixed(2)}`]].map(([l,v])=>(
              <div key={l} className="flex justify-between text-sm">
                <span className="text-gray-600">{l}</span>
                <span className={v==='Free'?'text-green-600':''}>{v}</span>
              </div>
            ))}
            <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
              <span>Total</span><span>₦{total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-4">
              <button onClick={() => payWithPaystack(email)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 font-bold uppercase tracking-widest hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2 rounded">
                <CreditCard className="h-5 w-5"/> Pay with Paystack
              </button>
              <button onClick={() => { checkoutWhatsApp() }}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2 rounded">
                <MessageCircle className="h-5 w-5"/> Order via WhatsApp
              </button>
            </div>
            <button onClick={() => navigate('/shop')} className="w-full text-center text-sm text-gray-500 hover:text-black mt-2">Continue Shopping</button>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Favorites View ─── */
function FavoritesView({ onOpen }) {
  const navigate = useNavigate()
  const { wishlist, toggleWishlist } = useCart()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="font-serif text-3xl mb-2">My Wishlist</h1>
      <p className="text-gray-400 text-lg font-sans font-normal mb-8">({wishlist.length} items)</p>
      {wishlist.length === 0 ? (
        <div className="col-span-4 text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
          <p className="text-gray-500 mb-4">Your saved items will appear here</p>
          <button onClick={() => navigate('/shop')} className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gold-400 hover:text-black transition-colors">Start Shopping</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(p => (
            <div key={p.id} className="group relative">
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3 relative">
                <img src={p.image} className="w-full h-full object-cover" onError={e=>e.target.src='https://placehold.co/400x600/f5f5f5/D4AF37?text=Debby'}/>
                <button onClick={() => { toggleWishlist(p); showToast('Removed from saved items') }} className="absolute top-2 right-2 bg-white p-1.5 rounded-full text-red-500 hover:bg-gray-100">
                  <X className="h-4 w-4"/>
                </button>
              </div>
              <h3 className="text-sm font-medium">{p.name}</h3>
              <p className="text-sm font-semibold text-gray-900">₦{p.price.toFixed(2)}</p>
              <button onClick={() => onOpen(p)} className="mt-2 w-full border border-black text-xs uppercase font-bold py-2 hover:bg-black hover:text-white transition-colors">View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main ShopPage ─── */
export default function ShopPage({ initialView }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { productId } = useParams()
  const q = searchParams.get('q') || ''

  const [selProduct, setSelProduct] = useState(null)
  const [category, setCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState(1000)
  const [sortBy, setSortBy] = useState('newest')
  const [count, setCount] = useState(6)

  // If routed to product detail
  useEffect(() => {
    if (productId) {
      const p = products.find(x => x.id === productId)
      if (p) setSelProduct(p)
    }
  }, [productId])

  const filtered = useMemo(() => {
    let arr = [...products]
    if (category !== 'all') arr = arr.filter(p => p.category === category)
    if (maxPrice < 1000) arr = arr.filter(p => p.price <= maxPrice)
    if (q) { const ql = q.toLowerCase(); arr = arr.filter(p => p.name.toLowerCase().includes(ql) || p.collection.toLowerCase().includes(ql)) }
    if (sortBy === 'price-low') arr.sort((a,b) => a.price - b.price)
    if (sortBy === 'price-high') arr.sort((a,b) => b.price - a.price)
    return arr
  }, [category, maxPrice, sortBy, q])

  function openDetail(product) {
    setSelProduct(product)
    navigate(`/shop/product/${product.id}`)
    window.scrollTo(0,0)
  }

  function backToShop() {
    setSelProduct(null)
    navigate('/shop')
  }

  // Route-based
  if (initialView === 'cart') return <CartView/>
  if (initialView === 'favorites') return <FavoritesView onOpen={openDetail}/>
  if ((initialView === 'product' || productId) && selProduct) return <ProductDetail product={selProduct} onBack={backToShop}/>

  const shown = filtered.slice(0, count)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 hidden md:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-serif text-lg mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {CATEGORIES.map(c => (
                  <li key={c.key} className={`cursor-pointer hover:text-gold-500 transition-colors ${category===c.key?'font-medium text-black':''}`}
                    onClick={() => { setCategory(c.key); setCount(6) }}>
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-lg mb-4">Filter By</h3>
              <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Price Range</label>
              <input type="range" min="0" max="1000" value={maxPrice} onChange={e=>{ setMaxPrice(Number(e.target.value)); setCount(6) }}
                className="w-full accent-gold-500 h-1 rounded-lg appearance-none cursor-pointer"/>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₦0</span><span>₦{maxPrice >= 1000 ? '1000+' : maxPrice}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile chips */}
        <div className="md:hidden w-full flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm whitespace-nowrap">
            <SlidersHorizontal className="h-3 w-3"/> Filters
          </button>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => { setCategory(c.key); setCount(6) }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${category===c.key?'bg-black text-white':'bg-gray-100 hover:bg-gray-200'}`}>
              {c.key==='all'?'All':c.label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl">
              {q ? `"${q}"` : 'New Arrivals'}
              <span className="text-gray-400 text-lg font-sans font-normal ml-2">({filtered.length} items)</span>
            </h2>
            <select className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {shown.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No products found. Try adjusting your filters.</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
              {shown.map(p => <ProductCard key={p.id} product={p} onOpen={openDetail}/>)}
            </div>
          )}

          {filtered.length > 6 && (
            <div className="mt-16 text-center">
              {count < filtered.length
                ? <button onClick={() => setCount(n=>n+6)} className="px-8 py-3 border border-gray-300 text-sm uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all">Load More Products</button>
                : <button onClick={() => setCount(6)} className="px-8 py-3 border border-gray-300 text-sm uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all">Show Less Products</button>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
