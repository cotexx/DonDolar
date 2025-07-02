import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PlusCircle, Edit, Trash2, LogOut, Eye, EyeOff, Search, Tag, X, Upload, Loader2, Bitcoin } from 'lucide-react';
import TiptapEditor from '../components/TiptapEditor';
import Navbar from '../components/Navbar';

interface Tag {
  id: string;
  name: string;
}

interface NewsItem {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  type?: string;
  news_tags?: {
    tags: {
      id: string;
      name: string;
    };
  }[];
}

function Admin() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [cryptoNews, setCryptoNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newsType, setNewsType] = useState('regular');
  const [cryptoType, setCryptoType] = useState('market');

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    checkUser();
    fetchNews();
    fetchCryptoNews();
    fetchTags();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title || !content) {
        throw new Error('El título y el contenido son obligatorios');
      }

      const newsData = {
        title,
        subtitle,
        content,
        image_url: imageUrl,
        published,
        type: newsType === 'crypto' ? cryptoType : null
      };

      let response;
      
      if (editingId) {
        if (newsType === 'crypto') {
          response = await supabase
            .from('crypto_news')
            .update(newsData)
            .eq('id', editingId)
            .select()
            .single();
        } else {
          response = await supabase
            .from('news')
            .update(newsData)
            .eq('id', editingId)
            .select()
            .single();

          if (response.data) {
            await supabase
              .from('news_tags')
              .delete()
              .eq('news_id', editingId);

            if (selectedTags.length > 0) {
              const newTags = selectedTags.map(tag => ({
                news_id: editingId,
                tag_id: tag.id
              }));

              await supabase
                .from('news_tags')
                .insert(newTags);
            }
          }
        }
      } else {
        if (newsType === 'crypto') {
          response = await supabase
            .from('crypto_news')
            .insert([newsData])
            .select()
            .single();
        } else {
          response = await supabase
            .from('news')
            .insert([newsData])
            .select()
            .single();

          if (response.data && selectedTags.length > 0) {
            const newTags = selectedTags.map(tag => ({
              news_id: response.data.id,
              tag_id: tag.id
            }));

            await supabase
              .from('news_tags')
              .insert(newTags);
          }
        }
      }

      if (response.error) {
        throw response.error;
      }

      setTitle('');
      setSubtitle('');
      setContent('');
      setImageUrl('');
      setPublished(true);
      setEditingId(null);
      setSelectedTags([]);
      setNewsType('regular');
      setCryptoType('market');

      await Promise.all([fetchNews(), fetchCryptoNews()]);

    } catch (error) {
      console.error('Error saving news:', error);
      alert(error instanceof Error ? error.message : 'Error al guardar la noticia');
    } finally {
      setLoading(false);
    }
  }

  async function fetchNews() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          news_tags (
            tags (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  async function fetchCryptoNews() {
    try {
      const { data, error } = await supabase
        .from('crypto_news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCryptoNews(data || []);
    } catch (error) {
      console.error('Error fetching crypto news:', error);
    }
  }

  async function fetchTags() {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  async function handleDelete(id: string, type: 'regular' | 'crypto') {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      try {
        const { error } = await supabase
          .from(type === 'crypto' ? 'crypto_news' : 'news')
          .delete()
          .eq('id', id);

        if (error) throw error;

        if (type === 'crypto') {
          setCryptoNews(prev => prev.filter(item => item.id !== id));
        } else {
          setNews(prev => prev.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  }

  async function handleEdit(item: NewsItem, type: 'regular' | 'crypto') {
    setTitle(item.title);
    setSubtitle(item.subtitle || '');
    setContent(item.content);
    setImageUrl(item.image_url || '');
    setPublished(item.published);
    setEditingId(item.id);
    setNewsType(type);
    if (type === 'crypto') {
      setCryptoType(item.type || 'market');
    }
    if (item.news_tags) {
      setSelectedTags(item.news_tags.map(nt => nt.tags));
    } else {
      setSelectedTags([]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function togglePublished(id: string, currentStatus: boolean, type: 'regular' | 'crypto') {
    try {
      const { error } = await supabase
        .from(type === 'crypto' ? 'crypto_news' : 'news')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      if (type === 'crypto') {
        setCryptoNews(prev => prev.map(item => 
          item.id === id ? { ...item, published: !currentStatus } : item
        ));
      } else {
        setNews(prev => prev.map(item => 
          item.id === id ? { ...item, published: !currentStatus } : item
        ));
      }
    } catch (error) {
      console.error('Error toggling published status:', error);
      alert('Error al cambiar el estado de publicación');
    }
  }

  async function handleAddTag() {
    if (!newTagName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name: newTagName.trim() }])
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      setNewTagName('');
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Error al crear el tag');
    }
  }

  function handleTagSelect(tag: Tag) {
    setSelectedTags(prev => 
      prev.some(t => t.id === tag.id)
        ? prev.filter(t => t.id !== tag.id)
        : [...prev, tag]
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800'}`}>
      <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Panel de Administración
            </h1>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {editingId ? 'Editar Noticia' : 'Nueva Noticia'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Noticia
                  </label>
                  <select
                    value={newsType}
                    onChange={(e) => setNewsType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="regular">Regular</option>
                    <option value="crypto">Crypto</option>
                  </select>
                </div>

                {newsType === 'crypto' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Noticia Crypto
                    </label>
                    <select
                      value={cryptoType}
                      onChange={(e) => setCryptoType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="market">Mercado</option>
                      <option value="bitcoin">Bitcoin</option>
                      <option value="ethereum">Ethereum</option>
                      <option value="altcoin">Altcoin</option>
                      <option value="defi">DeFi</option>
                      <option value="nft">NFT</option>
                      <option value="regulation">Regulación</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL de la imagen
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {imageUrl && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="published"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Publicar
                  </label>
                </div>
              </div>

              {newsType === 'regular' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Nuevo tag..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagSelect(tag)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedTags.some(t => t.id === tag.id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-end gap-4">
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setTitle('');
                        setSubtitle('');
                        setContent('');
                        setImageUrl('');
                        setPublished(true);
                        setEditingId(null);
                        setSelectedTags([]);
                        setNewsType('regular');
                        setCryptoType('market');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Guardando...
                      </div>
                    ) : (
                      'Guardar'
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contenido
              </label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </form>

          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Buscar
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Buscar noticias..."
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="all">Todas</option>
                    <option value="published">Publicadas</option>
                    <option value="draft">Borradores</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Noticias Regulares
              </h3>
              <div className="space-y-4">
                {news
                  .filter(item => {
                    if (filter === 'published') return item.published;
                    if (filter === 'draft') return !item.published;
                    return true;
                  })
                  .filter(item =>
                    searchTerm
                      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
                      : true
                  )
                  .map(item => (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </h4>
                          {item.subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.subtitle}
                            </p>
                          )}
                          {item.news_tags && item.news_tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.news_tags.map((tag) => (
                                <span
                                  key={tag.tags.id}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-200"
                                >
                                  {tag.tags.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => togglePublished(item.id, item.published, 'regular')}
                            className={`p-1 ${
                              item.published
                                ? 'text-green-500 hover:text-green-600'
                                : 'text-gray-400 hover:text-gray-500'
                            }`}
                          >
                            {item.published ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(item, 'regular')}
                            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'regular')}
                            className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Bitcoin className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Noticias Crypto
                </h3>
              </div>
              <div className="space-y-4">
                {cryptoNews
                  .filter(item => {
                    if (filter === 'published') return item.published;
                    if (filter === 'draft') return !item.published;
                    return true;
                  })
                  .filter(item =>
                    searchTerm
                      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
                      : true
                  )
                  .map(item => (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </h4>
                          {item.subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.subtitle}
                            </p>
                          )}
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mt-2">
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => togglePublished(item.id, item.published, 'crypto')}
                            className={`p-1 ${
                              item.published
                                ? 'text-green-500 hover:text-green-600'
                                : 'text-gray-400 hover:text-gray-500'
                            }`}
                          >
                            {item.published ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(item, 'crypto')}
                            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'crypto')}
                            className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;