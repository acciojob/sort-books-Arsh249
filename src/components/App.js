import React, { useEffect, useState } from "react";
import 'regenerator-runtime/runtime';
import './../styles/App.css';

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortCriterion, setSortCriterion] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch books using native fetch API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://api.nytimes.com/svc/books/v3/lists.json?list=hardcover-fiction&api-key=aE9sYXA2Cq9bU326XOOt5RoPIymGV4lb`
        );
        const data = await response.json();
        const fetchedBooks = data.results.map((book) => ({
          title: book.book_details[0].title,
          author: book.book_details[0].author,
          publisher: book.book_details[0].publisher,
          description: book.book_details[0].description
        }));
        setBooks(fetchedBooks);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch books");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle sorting books based on criterion and order
  const handleSortChange = (criterion, order) => {
    const sortedBooks = [...books].sort((a, b) => {
      const fieldA = a[criterion].toLowerCase();
      const fieldB = b[criterion].toLowerCase();
      if (order === "asc") {
        return fieldA > fieldB ? 1 : -1;
      }
      return fieldA < fieldB ? 1 : -1;
    });
    setBooks(sortedBooks);
    setSortCriterion(criterion);
    setSortOrder(order);
  };

  // Dropdown change handlers
  const handleSortCriterionChange = (e) => {
    handleSortChange(e.target.value, sortOrder);
  };

  const handleSortOrderChange = (e) => {
    handleSortChange(sortCriterion, e.target.value);
  };

  return (
    <div>
      <h1>Books List</h1>

      {/* Display loading or error messages */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Sorting Controls */}
      {!loading && !error && (
        <>
        <div>
          
          <label htmlFor="sortOrder">Order:</label>
          <select id="sortOrder" onChange={handleSortOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
          <div>
          <label htmlFor="sortCriterion">Sort by:</label>
          <select id="sortCriterion" onChange={handleSortCriterionChange}>
            <option>select</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="publisher">Publisher</option>
          </select>

          </div>
          </>
      )}

      {/* Display list of books */}
      {books.length > 0 && (
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Publisher</th>
        <th>ISBN</th>
      </tr>
    </thead>
    <tbody>
      {books.map((book, index) => (
        <tr key={index}>
          <td>{book.title}</td>
          <td>{book.author}</td>
          <td>{book.publisher}</td>
          <td>{book.description}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
    </div>
  );
}

