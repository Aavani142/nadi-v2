import Photo from './Photo.jsx'
import { assets } from '../data/assets.js'

export default function Logo({ className = '' }) {
  return <Photo src={assets.logo} label="NADI logo" alt="NADI Foundation logo" tone="#FFFBEA" className={`object-contain ${className}`} />
}
