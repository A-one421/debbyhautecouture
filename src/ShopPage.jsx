import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Share2,
  Star,
  StarHalf,
  Ruler,
  ChevronDown,
  ChevronUp,
  X,
  CreditCard,
  MessageCircle,
  SlidersHorizontal,
  ZoomIn,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Check,
  Layers,
} from "lucide-react";
import { useCart } from "./CartContext";
import SizeGuide from "./SizeGuide";
import { products, CATEGORIES } from "./data";
import { showToast } from "./Toast";

/* ─── Variant Card (sub-product) ─── */
function VariantCard({ variant, onSelect, isSelected }) {
  return (
    <div
      onClick={() => onSelect(variant)}
      className={`group cursor-pointer relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
        isSelected
          ? "border-black shadow-lg scale-[1.02]"
          : "border-gray-100 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 bg-black text-white rounded-full p-1">
          <Check className="h-3 w-3" />
        </div>
      )}
      <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
        <img
          src={variant.image}
          alt={variant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/300x400/f5f5f5/D4AF37?text=Debby")
          }
        />
      </div>
      <div className="p-3 bg-white">
        <h4 className="text-xs font-semibold text-gray-900 leading-tight mb-1">
          {variant.name}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            ₦{variant.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Variants Modal (sub-products overlay) ─── */
function VariantsModal({ product, onClose, onSelectVariant }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-3xl md:rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-0.5">
              Choose a Style
            </p>
            <h3 className="font-serif text-xl text-gray-900">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Sub-products grid */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-5 text-xs text-gray-500">
            <Layers className="h-4 w-4" />
            <span>
              {product.variants.length} styles available — tap to explore
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {product.variants.map((v) => (
              <VariantCard
                key={v.id}
                variant={v}
                isSelected={hovered === v.id}
                onSelect={(variant) => {
                  onSelectVariant(variant);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-6 pb-6">
          <p className="text-xs text-center text-gray-400">
            Tap a style to view full details & add to cart
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Card ─── */
function ProductCard({ product, onOpen, onOpenVariants }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const saved = isInWishlist(product.id);
  const tagBg =
    product.tag === "NEW"
      ? "bg-gold-500"
      : product.tag === "BEST"
        ? "bg-black"
        : "bg-red-500";
  const hasVariants = product.variants && product.variants.length > 0;

  function quickAdd(e) {
    e.stopPropagation();
    addToCart(product, "S", "", 1);
    showToast(`${product.name} added to cart`);
  }

  return (
    <div className="group cursor-pointer" onClick={() => onOpen(product)}>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/400x600/f5f5f5/D4AF37?text=Debby")
          }
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist */}
        <button
          className="wishlist-icon absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm z-10"
          onClick={(e) => {
            e.stopPropagation();
            const added = toggleWishlist(product);
            showToast(
              added ? "Added to saved items" : "Removed from saved items",
            );
          }}
        >
          <Heart
            className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`}
          />
        </button>

        {/* Tag */}
        {product.tag && (
          <div
            className={`absolute top-3 left-3 ${tagBg} text-white text-xs font-bold px-2.5 py-1 rounded-full z-10`}
          >
            {product.tag}
          </div>
        )}

        {/* Variants badge */}
        {hasVariants && (
          <div
            className="absolute top-3 left-3 mt-8 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 z-10 shadow-sm"
            style={{ marginTop: product.tag ? "2.2rem" : "0.75rem" }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenVariants(product);
            }}
          >
            <Sparkles className="h-3 w-3 text-yellow-500" />
            {product.variants.length} styles
          </div>
        )}

        {/* Bottom actions */}
        <div className="quick-add absolute bottom-0 left-0 right-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            className="flex-1 bg-white text-black py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded"
            onClick={quickAdd}
          >
            Quick Add
          </button>
          {hasVariants && (
            <button
              className="bg-black/80 text-white px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1 whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation();
                onOpenVariants(product);
              }}
            >
              <Layers className="h-3 w-3" /> Styles
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
          {hasVariants && (
            <p className="text-xs text-gray-400 mt-0.5">
              {product.variants.length} styles available
            </p>
          )}
        </div>
        <span className="text-sm font-bold text-gray-900">
          ₦{product.price.toFixed(2)}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{product.collection}</p>
    </div>
  );
}

/* ─── Product Detail ─── */
function ProductDetail({ product, onBack, isVariant, parentProduct }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [mainImg, setMainImg] = useState(product.images[0]);
  const [size, setSize] = useState("S");
  const [qty, setQty] = useState(1);
  const [showSG, setShowSG] = useState(false);
  const [accordion, setAccordion] = useState(null);
  const [showVariants, setShowVariants] = useState(false);
  const saved = isInWishlist(product.id);

  // reset when product changes
  useEffect(() => {
    setMainImg(product.images[0]);
    setSize("S");
    setQty(1);
  }, [product.id]);

  function share() {
    const text = `${product.name} from DEBBY HAUTE COUTURE! ₦${product.price.toFixed(2)}`;
    if (navigator.share) navigator.share({ title: product.name, text });
    else {
      navigator.clipboard?.writeText(text);
      showToast("Copied!");
    }
  }

  function handleAdd() {
    addToCart(product, size, "", qty);
    showToast(`${product.name} added to cart`);
  }

  // Related variants from parent
  const hasVariants =
    !isVariant && product.variants && product.variants.length > 0;
  const siblingVariants =
    isVariant && parentProduct?.variants
      ? parentProduct.variants.filter((v) => v.id !== product.id)
      : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-xs text-gray-400">
        <ol className="flex items-center space-x-1.5 flex-wrap">
          <li>
            <button
              onClick={onBack}
              className="hover:text-black transition-colors"
            >
              Shop
            </button>
          </li>
          <li>
            <ChevronRight className="h-3 w-3" />
          </li>
          {isVariant && parentProduct && (
            <>
              <li>
                <span
                  className="hover:text-black transition-colors cursor-pointer"
                  onClick={onBack}
                >
                  {parentProduct.name}
                </span>
              </li>
              <li>
                <ChevronRight className="h-3 w-3" />
              </li>
            </>
          )}
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* Back + styles row */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {hasVariants && (
          <button
            onClick={() => setShowVariants(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold hover:bg-black hover:text-white transition-all"
          >
            <Layers className="h-3.5 w-3.5" />
            View all {product.variants.length} styles
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative group rounded-xl">
            <img
              src={mainImg}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/600x800/f5f5f5/D4AF37?text=Debby")
              }
            />
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
              <ZoomIn className="h-3 w-3" /> Zoom
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImg(img)}
                className={`aspect-square bg-gray-100 cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${img === mainImg ? "ring-2 ring-black ring-offset-1" : "opacity-60 hover:opacity-100"}`}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/200x200/f5f5f5/D4AF37?text=+")
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {/* Variant badge */}
          {isVariant && (
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 w-fit">
              <Sparkles className="h-3 w-3" /> Style from {parentProduct?.name}
            </div>
          )}

          <div className="flex justify-between items-start mb-2">
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <button
                onClick={share}
                className="text-gray-300 hover:text-black transition-colors p-1"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  const added = toggleWishlist(product);
                  showToast(
                    added ? "Added to saved items" : "Removed from saved items",
                  );
                }}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
              >
                <Heart
                  className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Price + rating */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-3xl font-bold text-gray-900">
              ₦{product.price.toFixed(2)}
            </span>
            <div className="flex items-center text-amber-400 text-sm">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <StarHalf className="h-4 w-4 fill-current" />
              <span className="text-gray-400 ml-2 text-xs">(42 reviews)</span>
            </div>
          </div>

          <p className="text-gray-500 mb-8 leading-relaxed text-sm">
            {product.description || "Premium quality fashion item."}
          </p>

          {/* Size */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase text-gray-900 tracking-wider">
                Size
              </span>
              <button
                onClick={() => setShowSG(true)}
                className="text-xs text-gray-400 underline hover:text-black flex items-center gap-1"
              >
                <Ruler className="h-3 w-3" /> Size Guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(product.sizes || ["XS", "S", "M", "L", "XL"]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`border rounded-lg py-2.5 text-center text-sm font-medium cursor-pointer transition-all ${s === size ? "bg-black text-white border-black shadow-sm" : "border-gray-200 hover:border-gray-400 text-gray-700"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Model is 5'9" and wearing size S
            </p>
          </div>

          {/* Qty + Add */}
          <div className="flex gap-3 mb-8">
            <div className="w-28 border border-gray-200 rounded-lg flex items-center justify-between px-3 bg-gray-50">
              <button
                className="text-gray-400 hover:text-black text-lg font-light py-3"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="text-sm font-semibold text-gray-900">{qty}</span>
              <button
                className="text-gray-400 hover:text-black text-lg font-light py-3"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all rounded-lg shadow-lg"
            >
              Add to Cart
            </button>
          </div>

          {/* Accordions */}
          <div className="border-t border-gray-100 divide-y divide-gray-100">
            {[
              [
                "Fabric & Care",
                "95% Polyester, 5% Elastane. Dry clean only. Iron on low heat.",
              ],
              [
                "Shipping & Returns",
                "Free shipping on all orders. Returns accepted within 14 days in original, unworn condition.",
              ],
              [
                "Sizing",
                "This item fits true to size. We recommend ordering your usual size. See the size guide for detailed measurements.",
              ],
            ].map(([t, c]) => (
              <div key={t} className="py-4">
                <button
                  className="flex justify-between items-center w-full text-left text-sm font-medium text-gray-900"
                  onClick={() => setAccordion(accordion === t ? null : t)}
                >
                  <span>{t}</span>
                  {accordion === t ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {accordion === t && (
                  <div className="mt-3 text-xs text-gray-500 leading-relaxed pb-1">
                    {c}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Other Styles Section ─── */}
      {hasVariants && (
        <div className="mt-16 border-t border-gray-100 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                More from this collection
              </p>
              <h3 className="font-serif text-2xl text-gray-900">
                Available Styles
              </h3>
            </div>
            <button
              onClick={() => setShowVariants(true)}
              className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.variants.map((v) => (
              <VariantCard
                key={v.id}
                variant={v}
                isSelected={false}
                onSelect={(variant) => {
                  // Open the variant as its own detail view — handled by parent
                  window._openVariant && window._openVariant(variant, product);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sibling styles (when viewing a variant) */}
      {isVariant && siblingVariants.length > 0 && (
        <div className="mt-16 border-t border-gray-100 pt-12">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              Also available
            </p>
            <h3 className="font-serif text-2xl text-gray-900">Other Styles</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {siblingVariants.map((v) => (
              <VariantCard
                key={v.id}
                variant={v}
                isSelected={false}
                onSelect={(variant) => {
                  window._openVariant &&
                    window._openVariant(variant, parentProduct);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {showSG && <SizeGuide onClose={() => setShowSG(false)} />}
      {showVariants && (
        <VariantsModal
          product={product}
          onClose={() => setShowVariants(false)}
          onSelectVariant={(variant) => {
            setShowVariants(false);
            window._openVariant && window._openVariant(variant, product);
          }}
        />
      )}
    </div>
  );
}

/* ─── Cart View ─── */
function CartView() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQty,
    subtotal,
    tax,
    total,
    checkoutWhatsApp,
    payWithPaystack,
  } = useCart();
  const [email, setEmail] = useState(
    () => localStorage.getItem("debby_customer_email") || "",
  );

  function saveEmail() {
    if (!email.includes("@")) {
      showToast("Enter a valid email", "error");
      return;
    }
    localStorage.setItem("debby_customer_email", email);
    showToast("Email saved ✓");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="font-serif text-3xl mb-2 text-center">
        Your Shopping Bag
      </h1>
      <p className="text-gray-500 text-sm text-center mb-8">
        {cart.reduce((s, i) => s + i.quantity, 0)} items
      </p>

      <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
        <span className="text-gray-600">Payment email: </span>
        <span className="font-medium text-gray-800">{email || "Not set"}</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Add email for payment"
          className="block w-full mt-2 px-3 py-2 border border-gray-200 rounded text-sm"
        />
        <button
          onClick={saveEmail}
          className="mt-2 text-xs bg-black text-white px-4 py-1.5 rounded font-medium"
        >
          Save
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gold-400 hover:text-black transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-4 py-6 border-b border-gray-200 last:border-0"
              >
                <div className="w-24 h-32 flex-shrink-0 bg-gray-200 overflow-hidden rounded">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src =
                        "https://placehold.co/200x300/f5f5f5/D4AF37?text=+")
                    }
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size}
                      </p>
                    </div>
                    <span className="font-medium">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                      <button
                        onClick={() =>
                          updateQty(item.id, item.size, item.color, -1)
                        }
                        className="px-2 py-1 text-gray-500 hover:text-black"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQty(item.id, item.size, item.color, 1)
                        }
                        className="px-2 py-1 text-gray-500 hover:text-black"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.id, item.size, item.color);
                        showToast("Item removed from cart");
                      }}
                      className="text-xs text-red-500 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[
              ["Subtotal", `₦${subtotal.toFixed(2)}`],
              ["Shipping", "Free"],
              ["Tax (8%)", `₦${tax.toFixed(2)}`],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-gray-600">{l}</span>
                <span className={v === "Free" ? "text-green-600" : ""}>
                  {v}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-4">
              <button
                onClick={() => payWithPaystack(email)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 font-bold uppercase tracking-widest hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2 rounded"
              >
                <CreditCard className="h-5 w-5" /> Pay with Paystack
              </button>
              <button
                onClick={() => {
                  checkoutWhatsApp();
                }}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2 rounded"
              >
                <MessageCircle className="h-5 w-5" /> Order via WhatsApp
              </button>
            </div>
            <button
              onClick={() => navigate("/shop")}
              className="w-full text-center text-sm text-gray-500 hover:text-black mt-2"
            >
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Favorites View ─── */
function FavoritesView({ onOpen }) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useCart();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="font-serif text-3xl mb-2">My Wishlist</h1>
      <p className="text-gray-400 text-lg font-sans font-normal mb-8">
        ({wishlist.length} items)
      </p>
      {wishlist.length === 0 ? (
        <div className="col-span-4 text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            Your saved items will appear here
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gold-400 hover:text-black transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((p) => (
            <div key={p.id} className="group relative">
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3 relative rounded-lg">
                <img
                  src={p.image}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/400x600/f5f5f5/D4AF37?text=Debby")
                  }
                />
                <button
                  onClick={() => {
                    toggleWishlist(p);
                    showToast("Removed from saved items");
                  }}
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full text-red-500 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-sm font-medium">{p.name}</h3>
              <p className="text-sm font-semibold text-gray-900">
                ₦{p.price.toFixed(2)}
              </p>
              <button
                onClick={() => onOpen(p)}
                className="mt-2 w-full border border-black text-xs uppercase font-bold py-2 hover:bg-black hover:text-white transition-colors rounded"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main ShopPage ─── */
export default function ShopPage({ initialView }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { productId } = useParams();
  const q = searchParams.get("q") || "";

  const [selProduct, setSelProduct] = useState(null);
  const [parentProduct, setParentProduct] = useState(null);
  const [isVariantView, setIsVariantView] = useState(false);
  const [variantsModalProduct, setVariantsModalProduct] = useState(null);
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("newest");
  const [count, setCount] = useState(6);

  // Expose variant opener globally so sub-components can call it
  useEffect(() => {
    window._openVariant = (variant, parent) => {
      setSelProduct(variant);
      setParentProduct(parent);
      setIsVariantView(true);
      window.scrollTo(0, 0);
    };
    return () => {
      delete window._openVariant;
    };
  }, []);

  // If routed to product detail
  useEffect(() => {
    if (productId) {
      const p = products.find((x) => x.id === productId);
      if (p) {
        setSelProduct(p);
        setIsVariantView(false);
        setParentProduct(null);
      }
    }
  }, [productId]);

  const filtered = useMemo(() => {
    let arr = [...products];
    if (category !== "all") arr = arr.filter((p) => p.category === category);
    if (maxPrice < 1000) arr = arr.filter((p) => p.price <= maxPrice);
    if (q) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(ql) ||
          p.collection.toLowerCase().includes(ql),
      );
    }
    if (sortBy === "price-low") arr.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [category, maxPrice, sortBy, q]);

  function openDetail(product) {
    setSelProduct(product);
    setIsVariantView(false);
    setParentProduct(null);
    navigate(`/shop/product/${product.id}`);
    window.scrollTo(0, 0);
  }

  function openVariantsModal(product) {
    setVariantsModalProduct(product);
  }

  function backToShop() {
    setSelProduct(null);
    setIsVariantView(false);
    setParentProduct(null);
    navigate("/shop");
  }

  // Route-based views
  if (initialView === "cart") return <CartView />;
  if (initialView === "favorites") return <FavoritesView onOpen={openDetail} />;
  if ((initialView === "product" || productId) && selProduct) {
    return (
      <>
        <ProductDetail
          product={selProduct}
          onBack={
            isVariantView
              ? () => {
                  setIsVariantView(false);
                  setSelProduct(parentProduct);
                  setParentProduct(null);
                }
              : backToShop
          }
          isVariant={isVariantView}
          parentProduct={parentProduct}
        />
        {variantsModalProduct && (
          <VariantsModal
            product={variantsModalProduct}
            onClose={() => setVariantsModalProduct(null)}
            onSelectVariant={(variant) => {
              setVariantsModalProduct(null);
              window._openVariant &&
                window._openVariant(variant, variantsModalProduct);
            }}
          />
        )}
      </>
    );
  }

  const shown = filtered.slice(0, count);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page header */}
      <div className="mb-10 border-b border-gray-100 pb-8">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
          Debby Haute Couture
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-2">
          The Collection
        </h1>
        <p className="text-sm text-gray-400">
          Exclusively tailored pieces for every occasion
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0 hidden md:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Categories
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                {CATEGORIES.map((c) => (
                  <li
                    key={c.key}
                    className={`cursor-pointer hover:text-black transition-colors py-1 ${category === c.key ? "font-semibold text-black" : ""}`}
                    onClick={() => {
                      setCategory(c.key);
                      setCount(6);
                    }}
                  >
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Price Range
              </h3>
              <input
                type="range"
                min="0"
                max="1000"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCount(6);
                }}
                className="w-full accent-black h-1 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>₦0</span>
                <span>{maxPrice >= 1000 ? "₦1000+" : `₦${maxPrice}`}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile chips */}
        <div className="md:hidden w-full flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm whitespace-nowrap">
            <SlidersHorizontal className="h-3 w-3" /> Filters
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setCategory(c.key);
                setCount(6);
              }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${category === c.key ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              {c.key === "all" ? "All" : c.label.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-xl text-gray-900">
              {q
                ? `"${q}"`
                : category === "all"
                  ? "All Products"
                  : CATEGORIES.find((c) => c.key === category)?.label}
              <span className="text-gray-400 text-base font-sans font-normal ml-2">
                ({filtered.length})
              </span>
            </h2>
            <select
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-0 focus:border-gray-400 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {shown.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No products found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-14">
              {shown.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpen={openDetail}
                  onOpenVariants={openVariantsModal}
                />
              ))}
            </div>
          )}

          {filtered.length > 6 && (
            <div className="mt-16 text-center">
              {count < filtered.length ? (
                <button
                  onClick={() => setCount((n) => n + 6)}
                  className="px-10 py-3.5 border border-gray-200 text-sm uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all rounded-lg"
                >
                  Load More
                </button>
              ) : (
                <button
                  onClick={() => setCount(6)}
                  className="px-10 py-3.5 border border-gray-200 text-sm uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all rounded-lg"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Variants modal (from grid) */}
      {variantsModalProduct && (
        <VariantsModal
          product={variantsModalProduct}
          onClose={() => setVariantsModalProduct(null)}
          onSelectVariant={(variant) => {
            setVariantsModalProduct(null);
            setSelProduct(variant);
            setParentProduct(variantsModalProduct);
            setIsVariantView(true);
            navigate(`/shop/product/${variantsModalProduct.id}`);
            window.scrollTo(0, 0);
          }}
        />
      )}
    </div>
  );
}
