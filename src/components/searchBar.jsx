import React, { useState } from 'react';

export default function SearchBar({ events, onFilter }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    filterEvents(q, category);
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value.toLowerCase();
    setCategory(cat);
    filterEvents(query, cat);
  };

  const filterEvents = (q, cat) => {
    const filtered = events.filter(event => {
      const matchesQuery =
        event.title.toLowerCase().includes(q) ||
        (event.description && event.description.toLowerCase().includes(q));

      const matchesCategory =
        cat === '' || (event.category && event.category.toLowerCase() === cat);

      return matchesQuery && matchesCategory;
    });

    onFilter(filtered);
  };

  return (
    <form className="d-flex align-items-center" onSubmit={e => e.preventDefault()}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search by title or description"
        aria-label="Search"
        value={query}
        onChange={handleSearch}
      />
      <select className="form-select me-2" value={category} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        <option value="personal">Personal</option>
        <option value="work">Work</option>
        <option value="health">Health</option>
      </select>
    </form>
  );
}
