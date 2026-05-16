import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const getKey = i => i.cartKey || i._id

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = getKey(action.item)
      const existing = state.find(i => getKey(i) === key)
      if (existing) {
        return state.map(i => getKey(i) === key ? { ...i, qty: i.qty + (action.item.qty || 1) } : i)
      }
      return [...state, { ...action.item, qty: action.item.qty || 1 }]
    }
    case 'REMOVE':
      return state.filter(i => getKey(i) !== action.id)
    case 'UPDATE_QTY':
      return state.map(i => getKey(i) === action.id ? { ...i, qty: Math.max(1, action.qty) } : i)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (item) => dispatch({ type: 'ADD', item })
  const removeItem = (id) => dispatch({ type: 'REMOVE', id })
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = items.reduce((s, i) => s + (i.discountPrice || i.price) * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
