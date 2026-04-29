import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Category from './pages/Category'
import Search from './pages/Search'
import Article from './pages/Article'
import Subscribe from './pages/Subscribe'
import MyList from './pages/MyList'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/search" element={<Search />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/mylist" element={<MyList />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
