
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Headphones, MessageCircle, Star, Clock, Users, Download, Filter, Play, Pause, Volume2, Bookmark, Share2, Eye, ThumbsUp, Calendar, Tag, TrendingUp, Book } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const UniversityLibrary = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [readingMode, setReadingMode] = useState('text'); // text, audio

  // Simulated data
  const categories = [
    { id: 'all', name: 'All', count: 1247 },
    { id: 'science', name: 'Science', count: 324 },
    { id: 'literature', name: 'Literature', count: 189 },
    { id: 'history', name: 'History', count: 156 },
    { id: 'math', name: 'Mathematics', count: 142 },
    { id: 'cs', name: 'Computer Science', count: 201 },
    { id: 'philosophy', name: 'Philosophy', count: 98 }
  ];

  const books = [
    {
      id: 1,
      title: "Modern Artificial Intelligence",
      author: "Dr. Marie Dubois",
      category: "cs",
      rating: 4.8,
      reviews: 156,
      pages: 420,
      duration: "12h 30min",
      cover: "https://placehold.co/400x600/6366f1/ffffff.png",
      coverHint: "robot brain",
      description: "A comprehensive guide to modern AI and its applications.",
      hasAudio: true,
      downloadCount: 2341,
      views: 15420,
      trending: true,
      comments: [
        { id: 1, user: "Julie M.", text: "Excellent book for understanding AI!", rating: 5, date: "2024-07-28" },
        { id: 2, user: "Marc L.", text: "Very well explained, I recommend it.", rating: 4, date: "2024-07-25" }
      ]
    },
    {
      id: 2,
      title: "History of the Renaissance",
      author: "Prof. Jean Martin",
      category: "history",
      rating: 4.6,
      reviews: 89,
      pages: 380,
      duration: "10h 15min",
      cover: "https://placehold.co/400x600/a855f7/ffffff.png",
      coverHint: "renaissance painting",
      description: "An in-depth exploration of the Renaissance period.",
      hasAudio: true,
      downloadCount: 1876,
      views: 8932,
      trending: false,
      comments: [
        { id: 1, user: "Sophie R.", text: "Captivating from start to finish!", rating: 5, date: "2024-07-26" }
      ]
    },
    {
      id: 3,
      title: "Advanced Differential Calculus",
      author: "Dr. Pierre Laurent",
      category: "math",
      rating: 4.9,
      reviews: 203,
      pages: 520,
      duration: "15h 45min",
      cover: "https://placehold.co/400x600/f59e0b/ffffff.png",
      coverHint: "mathematical equations",
      description: "Advanced concepts in differential calculus.",
      hasAudio: false,
      downloadCount: 3201,
      views: 12045,
      trending: true,
      comments: []
    },
    {
      id: 4,
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      category: "science",
      rating: 4.9,
      reviews: 530,
      pages: 512,
      duration: "15h 17min",
      cover: "https://placehold.co/400x600/10b981/ffffff.png",
      coverHint: "human evolution",
      description: "A captivating look at the history of our species.",
      hasAudio: true,
      downloadCount: 8432,
      views: 45102,
      trending: true,
      comments: []
    },
    {
      id: 5,
      title: "Things Fall Apart",
      author: "Chinua Achebe",
      category: "literature",
      rating: 4.7,
      reviews: 312,
      pages: 209,
      duration: "6h 5min",
      cover: "https://placehold.co/400x600/ef4444/ffffff.png",
      coverHint: "african village",
      description: "A landmark in African literature depicting pre-colonial life.",
      hasAudio: true,
      downloadCount: 4102,
      views: 18453,
      trending: false,
      comments: []
    },
    {
      id: 6,
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "cs",
      rating: 4.8,
      reviews: 450,
      pages: 464,
      duration: "14h 20min",
      cover: "https://placehold.co/400x600/3b82f6/ffffff.png",
      coverHint: "clean code",
      description: "A handbook of agile software craftsmanship.",
      hasAudio: false,
      downloadCount: 6781,
      views: 29870,
      trending: true,
      comments: []
    },
    {
      id: 7,
      title: "The Republic",
      author: "Plato",
      category: "philosophy",
      rating: 4.5,
      reviews: 198,
      pages: 416,
      duration: "11h 45min",
      cover: "https://placehold.co/400x600/8b5cf6/ffffff.png",
      coverHint: "greek statue",
      description: "A foundational text of Western philosophy concerning justice.",
      hasAudio: true,
      downloadCount: 2011,
      views: 9870,
      trending: false,
      comments: []
    },
     {
      id: 8,
      title: "Guns, Germs, and Steel",
      author: "Jared Diamond",
      category: "history",
      rating: 4.7,
      reviews: 410,
      pages: 480,
      duration: "16h 10min",
      cover: "https://placehold.co/400x600/d97706/ffffff.png",
      coverHint: "ancient map",
      description: "The fates of human societies, exploring why Eurasian peoples conquered others.",
      hasAudio: true,
      downloadCount: 3890,
      views: 16421,
      trending: false,
      comments: []
    },
    {
      id: 9,
      title: "How Not to Be Wrong",
      author: "Jordan Ellenberg",
      category: "math",
      rating: 4.6,
      reviews: 150,
      pages: 480,
      duration: "13h 55min",
      cover: "https://placehold.co/400x600/ec4899/ffffff.png",
      coverHint: "graphs charts",
      description: "The power of mathematical thinking in everyday life.",
      hasAudio: true,
      downloadCount: 1530,
      views: 7543,
      trending: false,
      comments: []
    }
  ];

  const trainingCourses = [
    {
      id: 1,
      title: "Effective Research Methods",
      duration: "2h 30min",
      lessons: 12,
      level: "Beginner",
      instructor: "Dr. Sarah Wilson",
      rating: 4.7,
      students: 1542,
      icon: "🔍"
    },
    {
      id: 2,
      title: "Speed Reading and Comprehension",
      duration: "3h 15min",
      lessons: 18,
      level: "Intermediate",
      instructor: "Prof. Alex Chen",
      rating: 4.8,
      students: 2103,
      icon: "⚡"
    },
    {
      id: 3,
      title: "Digital Note-Taking",
      duration: "1h 45min",
      lessons: 8,
      level: "Beginner",
      instructor: "Lisa Martinez",
      rating: 4.6,
      students: 987,
      icon: "📝"
    }
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookSelect = (book: any) => {
    setSelectedBook(book);
    setShowComments(false);
    setReadingMode('text');
  };

  const handleAudioToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedBook) {
      const comment = {
        id: Date.now(),
        user: "You",
        text: newComment,
        rating: 5,
        date: new Date().toISOString().split('T')[0]
      };
      selectedBook.comments.push(comment);
      setNewComment('');
    }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentAudioTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-headline">
                University Library
              </h1>
              <p className="text-gray-600 mt-2">Discover, learn, and share knowledge</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">1,247</div>
                <div className="text-sm text-gray-500">Resources</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">15,430</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
            </div>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for books, authors, subjects..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'books'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Book className="w-5 h-5 mr-2 inline" /> Books
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'training'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Star className="w-5 h-5 mr-2 inline" /> Training
          </button>
        </div>

        {activeTab === 'books' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-indigo-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        selectedCategory === category.id
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold mb-4 flex items-center text-orange-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trending
                  </h4>
                  <div className="space-y-3">
                    {books.filter(book => book.trending).map((book) => (
                      <div key={book.id} onClick={() => handleBookSelect(book)} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <Image src={book.cover} alt={book.title} width={40} height={60} className="rounded-md object-cover" data-ai-hint={book.coverHint} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{book.title}</div>
                          <div className="text-xs text-gray-500">{book.views} views</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {!selectedBook ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => handleBookSelect(book)}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                    >
                      <div className="p-6">
                          <Image src={book.cover} alt={book.title} width={400} height={600} className="w-full h-48 object-cover rounded-lg mb-4" data-ai-hint={book.coverHint} />
                        
                        <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors h-14">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{book.rating}</span>
                            <span className="ml-1 text-sm text-gray-500">({book.reviews})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Eye className="w-4 h-4 mr-1" />
                            {book.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-8">
                    <button
                      onClick={() => setSelectedBook(null)}
                      className="text-indigo-600 hover:text-indigo-800 mb-6 flex items-center"
                    >
                      ← Back to books
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1 text-center">
                        <Image src={selectedBook.cover} alt={selectedBook.title} width={200} height={300} className="rounded-lg mb-4 mx-auto" data-ai-hint={selectedBook.coverHint} />
                        <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                        <p className="text-gray-600 mb-4">{selectedBook.author}</p>
                        
                        <div className="flex items-center justify-center mb-4">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{selectedBook.rating}</span>
                          <span className="ml-1 text-gray-500">({selectedBook.reviews} reviews)</span>
                        </div>

                        <div className="space-y-3 mb-6">
                          <button
                            onClick={() => setReadingMode('text')}
                            className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center ${
                              readingMode === 'text'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <BookOpen className="w-5 h-5 mr-2" />
                            Read Text
                          </button>
                          {selectedBook.hasAudio && (
                            <button
                              onClick={() => setReadingMode('audio')}
                              className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center ${
                                readingMode === 'audio'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Headphones className="w-5 h-5 mr-2" />
                              Listen to Audio
                            </button>
                          )}
                        </div>

                        <div className="flex space-x-2 mb-6">
                          <button className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center justify-center">
                            <Bookmark className="w-4 h-4 mr-1" />
                            Save
                          </button>
                          <button className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center justify-center">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        {readingMode === 'text' && (
                          <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold mb-4">Description</h3>
                            <p className="text-gray-700 mb-6">{selectedBook.description}</p>
                            
                            <div className="bg-gray-50 p-6 rounded-xl mb-6">
                              <h4 className="font-semibold mb-4">Information</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Pages:</span>
                                  <span className="ml-2 font-medium">{selectedBook.pages}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Category:</span>
                                  <span className="ml-2 font-medium capitalize">{selectedBook.category}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Downloads:</span>
                                  <span className="ml-2 font-medium">{selectedBook.downloadCount}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Views:</span>
                                  <span className="ml-2 font-medium">{selectedBook.views}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                              <h4 className="font-semibold mb-2">Start Reading</h4>
                              <p className="text-gray-600 mb-4">Dive into this enriching content and expand your knowledge.</p>
                              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                                Open Full Book
                              </button>
                            </div>
                          </div>
                        )}

                        {readingMode === 'audio' && selectedBook.hasAudio && (
                          <div>
                            <h3 className="text-xl font-semibold mb-6">Audio Player</h3>
                            
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <div className="font-semibold">Chapter 1: Introduction</div>
                                  <div className="text-sm text-gray-600">Duration: {selectedBook.duration}</div>
                                </div>
                                <div className="text-2xl">🎧</div>
                              </div>

                              <div className="flex items-center space-x-4 mb-4">
                                <button
                                  onClick={handleAudioToggle}
                                  className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
                                >
                                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                    <span>{formatTime(currentAudioTime)}</span>
                                    <span>{selectedBook.duration}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-600 h-2 rounded-full transition-all"
                                      style={{ width: `${(currentAudioTime / 900) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg">
                                  <Volume2 className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>

                              <div className="text-center">
                                <p className="text-gray-700 italic">
                                  "Artificial intelligence represents one of the most significant technological advancements of our time..."
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 border-t pt-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center">
                          <MessageCircle className="w-5 h-5 mr-2 text-indigo-600" />
                          Comments ({selectedBook.comments.length})
                        </h3>
                        <button
                          onClick={() => setShowComments(!showComments)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {showComments ? 'Hide' : 'Show'}
                        </button>
                      </div>

                      {showComments && (
                        <div>
                          <div className="mb-6">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Share your opinion on this book..."
                              className="w-full p-4 border border-gray-200 rounded-xl resize-none h-24 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                            <div className="flex justify-end mt-3">
                              <button
                                onClick={handleAddComment}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                Post
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {selectedBook.comments.map((comment) => (
                              <div key={comment.id} className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-sm mr-3">
                                      {comment.user.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-medium">{comment.user}</div>
                                      <div className="text-sm text-gray-500">{comment.date}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    {[...Array(comment.rating)].map((_, i) => (
                                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-gray-700">{comment.text}</p>
                                <div className="flex items-center mt-3 space-x-4">
                                  <button className="flex items-center text-sm text-gray-500 hover:text-indigo-600">
                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                    Helpful
                                  </button>
                                  <button className="text-sm text-gray-500 hover:text-indigo-600">
                                    Reply
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">🎓 Training Center</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Develop your skills with our specialized courses on study methods, 
                academic research, and optimal library use.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="text-4xl mb-4 text-center">{course.icon}</div>
                    <h3 className="font-bold text-xl mb-3">{course.title}</h3>
                    <p className="text-gray-600 mb-4">By {course.instructor}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{course.rating}</span>
                      </div>
                      <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                        {course.level}
                      </span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {course.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {course.lessons} lessons
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {course.students} students
                      </div>
                    </div>

                    <button className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                      Start Course
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">💡 Study Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">⏰</div>
                  <h4 className="font-semibold mb-2">Plan your sessions</h4>
                  <p className="text-sm text-gray-600">Organize your study time for maximum efficiency</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-semibold mb-2">Set goals</h4>
                  <p className="text-sm text-gray-600">Define clear goals for each reading session</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📝</div>
                  <h4 className="font-semibold mb-2">Take notes</h4>
                  <p className="text-sm text-gray-600">Synthesize important information for better retention</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🤝</div>
                  <h4 className="font-semibold mb-2">Discuss with others</h4>
                  <p className="text-sm text-gray-600">Discuss concepts with your peers to deepen your understanding</p>
                </div>
              </div>
            </div>

            {/* Learning Progress Dashboard */}
            <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                Your Progress
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Books read</h4>
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                  <div className="text-sm text-gray-600">This month</div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Listening hours</h4>
                    <Headphones className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">48h</div>
                  <div className="text-sm text-gray-600">Audio books</div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-3">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Courses completed</h4>
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                  <div className="text-sm text-gray-600">Trainings</div>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                      📖
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Finished: "Modern Artificial Intelligence"</div>
                      <div className="text-sm text-gray-600">2 hours ago</div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                      🎧
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Listened: Chapter 3 - "History of the Renaissance"</div>
                      <div className="text-sm text-gray-600">1 day ago</div>
                    </div>
                    <div className="text-sm text-gray-500">45 min</div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                      🎓
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Started: "Effective Research Methods"</div>
                      <div className="text-sm text-gray-600">3 days ago</div>
                    </div>
                    <div className="text-sm text-gray-500">Progress: 25%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Join our learning community</h3>
            <p className="text-indigo-100">Connect with thousands of passionate students</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">15K+</div>
              <div className="text-indigo-200 text-sm">Active students</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">1.2K+</div>
              <div className="text-indigo-200 text-sm">Available books</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">450+</div>
              <div className="text-indigo-200 text-sm">Audio books</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-indigo-200 text-sm">Access available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityLibrary;
