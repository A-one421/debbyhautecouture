import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Instagram, Facebook, Twitter } from 'lucide-react'
import { showToast } from './Toast'
import { PHONE, EMAIL, ADDRESS } from './data'

export default function Footer() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const nav = path => { navigate(path); window.scrollTo(0,0) }

  function subscribe() {
    if (!email || !email.includes('@')) { showToast('Please enter a valid email address', 'error'); return }
    showToast(`Thanks for joining! 10% off code sent to ${email} ✨`); setEmail('')
  }

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          <div>
            <span className="font-serif text-2xl tracking-tight">DEBBY<span className="text-gold-400"> CA</span></span>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">Redefining luxury fashion for the modern woman. Quality, sustainability, and style in every stitch.</p>
            <div className="flex space-x-5 mt-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-gold-400 transition"><Icon className="w-5 h-5"/></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gold-400">SHOP</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {['New Arrivals','Dresses','Evening Wear','Accessories'].map(l => (
                <li key={l}><button onClick={() => nav('/shop')} className="footer-link">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gold-400">SERVICES</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[['Bespoke Tailoring','/bespoke'],['Custom Orders','/bespoke'],['Consultations','/bespoke'],['Ready-to-Wear','/shop']].map(([l,p]) => (
                <li key={l}><button onClick={() => nav(p)} className="footer-link">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gold-400">STAY CONNECTED</h4>
            <p className="text-gray-400 text-xs mb-3">Get exclusive offers & style inspiration</p>
            <div className="flex border-b border-gray-700 pb-2 mb-5">
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&subscribe()} placeholder="Your email" className="bg-transparent border-none focus:ring-0 w-full text-sm placeholder-gray-500 outline-none text-white"/>
              <button onClick={subscribe} className="text-gold-400 text-xs font-bold tracking-wider hover:text-white transition">JOIN →</button>
            </div>
            <div className="flex flex-col gap-2 text-gray-400 text-xs">
              <span>📞 {PHONE}</span>
              <span>✉ {EMAIL}</span>
              <span>📍 {ADDRESS}</span>
            </div>
          </div>
        </div>
        <div className="pt-6 text-center text-gray-500 text-xs flex flex-col md:flex-row justify-between">
          <p>© 2026 Debby Couture Atelier. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Luxury fashion crafted with elegance</p>
        </div>
      </div>
    </footer>
  )
}
